import { Component } from '@angular/core';
import { User } from '../models/user';
import { Comment } from '../models/comment';
import { Router } from '@angular/router';
import { BookService } from '../services/book.service';
import { CommentService } from '../services/comment.service';
import { CognitoService } from '../services/cognito.service';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.scss'],
})
export class ComentariosComponent {
  user!: User;
  comentarios: Comment[] = [];
  loading: boolean = false;
  editando: Map<string, boolean> = new Map<string, boolean>();

  constructor(
    private router: Router,
    private commentService: CommentService,
    private cognitoService: CognitoService
  ) {}

  private getUserDetails() {
    this.loading = true;
    this.cognitoService.getUser().then((user: any) => {
      if (user) {
        this.user = user.attributes;
        this.obtenerComentarios(this.user.sub);
        this.loading = false;
      } else {
        this.loading = false;
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnInit() {
    this.getUserDetails();
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

  obtenerComentarios(idUser: string) {
    this.commentService.getCommentsByUser(idUser).subscribe((comentarios) => {
      this.comentarios = comentarios;
      this.comentarios.forEach((comentario) => {
        this.editando.set(comentario.id, false);
      });
      this.loading = false;
    });
  }

  eliminarComentario(comentario: Comment) {
    this.commentService.removeComment(comentario.id).subscribe(() => {
      location.reload();
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
