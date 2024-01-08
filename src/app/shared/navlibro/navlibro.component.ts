import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Highlight } from 'src/app/models/highlight';
import { Comment } from 'src/app/models/comment';
import { BookService } from 'src/app/services/book.service';
import { CognitoService } from 'src/app/services/cognito.service';
import { CommentService } from 'src/app/services/comment.service';
import { HighlightService } from 'src/app/services/highlight.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-navlibro',
  templateUrl: './navlibro.component.html',
  styleUrls: ['./navlibro.component.scss'],
})
export class NavlibroComponent implements OnInit {
  @Input() capitulos!: any[];
  @Input() bookId!: string;

  @Output() tipoVista = new EventEmitter<boolean>();
  @Output() cambioCapitulo = new EventEmitter<string>();
  @Output() cambioTema = new EventEmitter<boolean>();
  @Output() irASubrayado = new EventEmitter<string>();

  @ViewChild('modalComentarios') modalComentarios: any;
  @ViewChild('modalSubrayados') modalSubrayados: any;

  user!: User;
  subrayados: Highlight[] = [];
  comentarios: Comment[] = [];
  nombreLibro: string = '';
  editando: Map<string, boolean> = new Map<string, boolean>();

  loading: boolean = false;
  error: boolean = false;
  tema: boolean = true;

  constructor(
    private router: Router,
    private cognitoService: CognitoService,
    private bookService: BookService,
    private commentService: CommentService,
    private highlightService: HighlightService
  ) {}

  ngOnInit(): void {
    this.bookService.getBook(this.bookId).subscribe((libro) => {
      this.nombreLibro = libro[0].nombre;
    });
    this.getUserDetails();
    this.obtenerSubrayados();
    this.obtenerComentarios();
  }

  private getUserDetails() {
    this.loading = true;
    this.cognitoService.getUser().then((user: any) => {
      if (user) {
        this.user = user.attributes;
      } else {
        this.loading = false;
        this.router.navigate(['/login']);
      }
    });
  }

  signOutWithCognito() {
    this.loading = true;
    this.cognitoService.signOut().then(() => {
      this.loading = false;
      this.router.navigate(['/login']);
    });
  }

  cambiarVista(vista: boolean) {
    this.tipoVista.emit(vista);
  }

  rutaCapitulo(capitulo: string) {
    this.cambioCapitulo.emit(capitulo);
  }

  colorTema(tema: boolean) {
    this.tema = !tema;
    this.cambioTema.emit(!tema);
  }

  mostrarFecha(fechayhora: string): Object {
    let fecha: string;

    let fechaArray = fechayhora.split('T')[0].split('-');

    fecha = fechaArray[2] + '-' + fechaArray[1] + '-' + fechaArray[0];
    return fecha;
  }

  mostrarHora(fechayhora: string): Object {
    return fechayhora.split('T')[1].split('.')[0];
  }

  obtenerSubrayados() {
    this.highlightService
      .getHighlightsByBook(this.bookId)
      .subscribe((subrayados) => {
        this.subrayados = subrayados;
      });
  }

  eliminarSubrayado(id: string) {
    this.highlightService
      .removeHighlight(id)
      .subscribe(() => this.modalSubrayados.nativeElement.click());
  }

  navegarASubrayado(subrayado: Highlight) {
    this.irASubrayado.emit(subrayado.cfiRange);
  }

  obtenerComentarios() {
    this.commentService
      .getCommentsByBook(this.bookId)
      .subscribe((comentarios) => {
        this.comentarios = comentarios;
        this.comentarios.forEach((comentario) => {
          this.editando.set(comentario.id, false);
        });
        this.loading = false;
      });
  }

  nuevoComentario(e: Event) {
    let input = (<HTMLInputElement>e.target).value.trim();
    if (input == undefined || input == '') this.error = true;
    else {
      let comment: Comment = {
        id: '',
        texto: input,
        fecha: new Date(),
        idUser: this.user.sub,
        idLibro: this.bookId,
        nombreLibro: this.nombreLibro,
      };
      this.commentService.addComment(comment).subscribe((comentario) => {
        this.modalComentarios.nativeElement.click();
        (<HTMLInputElement>e.target).value = '';
      });
    }
  }

  eliminarComentario(comentario: Comment) {
    this.commentService.removeComment(comentario.id).subscribe(() => {
      this.modalComentarios.nativeElement.click();
    });
  }

  editarComentario(id: string) {
    if (this.editando.get(id)) {
      this.loading = true;
      let input = (<HTMLInputElement>document.getElementById('textoNuevo'))
        .value;
      this.commentService.modifyComment(id, input).subscribe(() => {
        this.editando.set(id, false);
        this.loading = false;
        this.comentarios[
          this.comentarios.findIndex((elem) => elem.id == id)
        ].texto = input;
      });
      this.editando.set(id, false);
    } else {
      this.editando.set(id, true);
    }
  }
}
