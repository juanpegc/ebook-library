import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { BookService } from 'src/app/services/book.service';
import { CognitoService } from 'src/app/services/cognito.service';
import { CommentService } from 'src/app/services/comment.service';
import { HighlightService } from 'src/app/services/highlight.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent {
  user!: User;
  error: boolean = false;
  hecho: boolean = false;
  mensajeConfirmacion: string = 'Eliminar permanentemente mi cuenta';
  confirmacion: string = '';

  disabled: boolean = true;

  constructor(
    private router: Router,
    private userService: UserService,
    private bookService: BookService,
    private highlightService: HighlightService,
    private commentService: CommentService,
    private cognitoService: CognitoService
  ) {
    this.cargarUsuario();
  }

  cargarUsuario() {
    this.cognitoService.getUser().then((user: any) => {
      if (user) {
        this.user = user.attributes;
        this.userService.getNickname(this.user.sub).subscribe((res) => {
          this.user.nickname = res[0].nickname;
        });
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  eliminarPerfil() {
    this.cognitoService.deleteUser(this.user);

    this.userService.deleteUser(this.user.sub).subscribe();

    this.bookService.getAllBooksByUser(this.user.sub).subscribe((libros) => {
      libros.forEach((libro) => this.bookService.deleteBook(libro.id));
    });

    this.highlightService
      .getHighlightsByUser(this.user.sub)
      .subscribe((subrayados) => {
        subrayados.forEach((subrayado) =>
          this.highlightService.removeHighlight(subrayado.id)
        );
      });

    this.commentService
      .getCommentsByUser(this.user.sub)
      .subscribe((comentarios) => {
        comentarios.forEach((comentario) =>
          this.commentService.removeComment(comentario.id)
        );
      });
    this.router.navigate(['/']);
  }

  editarNombre(e: Event) {
    let input = (<HTMLInputElement>e.target).value.trim();
    if (input == undefined || input == '' || input == this.user.nickname)
      this.error = true;
    else {
      this.userService.updateUser(this.user.sub, input).subscribe((res) => {
        if (res.changedRows > 0) {
          this.error = false;
          this.hecho = true;
          this.user.nickname = input;
        } else this.error = true;
      });
    }
  }
}
