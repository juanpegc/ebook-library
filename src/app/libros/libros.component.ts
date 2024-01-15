import { Component, HostListener, Output } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import ePub, { Book, EpubCFI } from 'epubjs';
import { Rendition } from 'epubjs';
import Annotations, { Annotation } from 'epubjs/types/annotations';
import { Highlight } from '../models/highlight';
import { HighlightService } from '../services/highlight.service';
import { CognitoService } from '../services/cognito.service';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-libros',
  templateUrl: './libros.component.html',
  styleUrls: ['./libros.component.scss'],
})
export class LibrosComponent {
  rendition!: Rendition;
  @Output() book: Book;
  array: string[] = [];
  vista: boolean = true; // true=libro / false=seguido
  tema: boolean = true; // true=claro / false=oscuro
  ref: string = '';

  loading: boolean = false;

  url!: string;
  userId: string;
  bookId: string;
  nombreLibro: string = '';
  cfiRange: string = '';

  location: any;

  constructor(
    private route: ActivatedRoute,
    private cognitoService: CognitoService,
    private highlightService: HighlightService,
    private bookService: BookService
  ) {
    this.book = ePub(this.url);
    this.userId = '';
    this.bookId = '';
    this.loading = true;
    cognitoService.getUser().then((userInformation) => {
      this.userId = userInformation.attributes.sub;
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.url = params['url'];
      this.bookId = params['id'];
      this.cfiRange = params['cfiRange'];
      if (this.cfiRange != '') this.location = this.cfiRange;
    });

    this.book = ePub(this.url);
    this.renderizar();

    let array: any[] = [];
    this.book.loaded.navigation.then((toc) => {
      toc.forEach((chapter) => array.push(chapter));
    });
    this.array = array;

    window.onbeforeunload = () => {
      this.guardarPosicion();
    };
  }

  guardarPosicion() {
    let location: any = this.rendition.currentLocation();
    this.bookService
      .addCurrentPosition(location.start.cfi, this.bookId)
      .subscribe();
  }

  renderizar() {
    if (document.getElementById('area')) {
      document.getElementById('area')!.innerHTML = '';
    }

    if (this.vista) {
      // Vista de libro

      this.rendition = this.book.renderTo('area', {
        width: 800,
        height: 850,
        spread: 'always',
      });

      document.getElementById('vista')?.classList.remove('flex-column');
      document.getElementById('vista')?.classList.add('flex-row');
    } else {
      // Vista de seguido

      this.rendition = this.book.renderTo('area', {
        flow: 'scrolled-doc',
        width: '60%',
        overflow: 'hidden',
      });

      document.getElementById('vista')?.classList.remove('flex-row');
      document.getElementById('vista')?.classList.add('flex-column');
    }

    if (this.tema) this.rendition.themes.override('color', 'black');
    else this.rendition.themes.override('color', 'white');

    if (this.ref !== '') this.rendition.display(this.ref);
    else if (this.location) this.rendition.display(this.location);
    else this.rendition.display();

    this.highlightService
      .getHighlightsByBook(this.bookId)
      .subscribe((highlights) => {
        highlights.forEach((highlight) =>
          this.rendition.annotations.highlight(highlight.cfiRange)
        );
      });

    this.loading = false;
    this.rendition.on('selected', (cfiRange: string, contents: any) => {
      this.nuevoSubrayado(cfiRange, contents);
    });
  }

  next() {
    this.rendition.next();
  }

  previous() {
    this.rendition.prev();
  }

  cambioVista(vista: boolean) {
    this.vista = vista;
    this.location = this.rendition.location.start.cfi;
    this.renderizar();
  }

  cambioCapitulo(ref: string) {
    this.ref = ref;
    this.renderizar();
  }

  cambioTema(tema: boolean) {
    this.tema = tema;

    if (this.tema) {
      this.rendition.themes.override('color', 'black');
      (
        document.querySelectorAll('#cambioTema') as any as Array<HTMLElement>
      ).forEach((e) => {
        e.classList.remove('claro');
        e.classList.add('oscuro');
      });
      document.getElementById('area')?.classList.remove('claro');
      document.getElementById('area')?.classList.add('oscuro');
    } else {
      this.rendition.themes.override('color', 'white');
      (
        document.querySelectorAll('#cambioTema') as any as Array<HTMLElement>
      ).forEach((e) => {
        e.classList.add('claro');
        e.classList.remove('oscuro');
      });
      document.getElementById('area')?.classList.add('claro');
      document.getElementById('area')?.classList.remove('oscuro');
    }
  }

  nuevoSubrayado(cfiRange: string, contents: any) {
    this.rendition.annotations.highlight(cfiRange);
    let text: string = '';
    this.book.getRange(cfiRange).then((range) => {
      text = range.toString();
      this.bookService.getBook(this.bookId).subscribe((libro) => {
        this.nombreLibro = libro[0].nombreReal;

        let subrayado: Highlight = {
          id: '',
          texto: text,
          cfiRange: cfiRange,
          idLibro: this.bookId,
          fecha: new Date(),
          idUser: this.userId,
          nombreLibro: libro[0].nombre,
        };

        this.highlightService.addHighlight(this.userId, subrayado).subscribe();
      });
    });

    if (contents) contents.window.getSelection().removeAllRanges();
  }

  irASubrayado(range: string) {
    this.location = range;
    this.renderizar();
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(ev: any) {
    if (ev.keyCode == 37) this.previous();
    else if (ev.keyCode == 39) this.next();
  }
}
