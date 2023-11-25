import { Component, HostListener, Output } from '@angular/core';
import ePub, { Book } from 'epubjs';
import { Rendition } from 'epubjs';

@Component({
  selector: 'app-libros',
  templateUrl: './libros.component.html',
  styleUrls: ['./libros.component.scss'],
})
export class LibrosComponent {
  rendition!: Rendition;
  @Output() book: Book;
  array: string[];
  vista: boolean = true; // true=libro / false=seguido
  tema: boolean = true; // true=claro / false=oscuro
  ref: string = '';

  location: any;

  constructor() {
    this.book = ePub('https://s3.amazonaws.com/epubjs/books/alice.epub');

    this.renderizar();

    let array: any[] = [];
    this.book.loaded.navigation.then((toc) => {
      toc.forEach((chapter) => array.push(chapter));
    });
    this.array = array;
  }

  renderizar() {
    if (document.getElementById('area')) {
      document.getElementById('area')!.innerHTML = '';
    }

    if (this.vista) {
      // Vista de libro

      this.rendition = this.book.renderTo('area', {
        width: 800,
        height: 650,
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

  @HostListener('document:keydown', ['$event'])
  onKeyDown(ev: any) {
    if (ev.keyCode == 37) this.previous();
    else if (ev.keyCode == 39) this.next();
  }
}
