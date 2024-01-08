import { Component, OnInit } from '@angular/core';
import { CognitoService } from '../services/cognito.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BookService } from '../services/book.service';
import { User } from '../models/user';
import { Book } from '../models/book';
import ePub from 'epubjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  user!: User;
  loading: boolean = false;
  books: Book[] = [];
  covers: Map<string, string> = new Map<string, string>();
  borrarId: string = '';
  borrarNombre: string = '';

  constructor(
    private router: Router,
    private cognitoService: CognitoService,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    this.getUserDetails();
  }

  private getUserDetails() {
    this.loading = true;
    this.cognitoService.getUser().then((user: any) => {
      if (user) {
        this.user = user.attributes;
        this.init();
      } else {
        this.loading = false;
        this.router.navigate(['/login']);
      }
    });
  }

  init() {
    this.bookService.getAllBooksByUser(this.user.sub).subscribe((books) => {
      this.books = books;
      books.forEach((libro) => {
        this.bookService.getBookUrl(libro.nombre).subscribe((url) => {
          let book = ePub(url);
          book.coverUrl().then((cover) => {
            if (cover) this.covers.set(libro.id, cover);
            this.loading = false;
          });
        });
      });
    });
  }

  descargarLibro(e: Event, nombre: string) {
    e.stopPropagation();
    this.bookService.getBookUrl(nombre).subscribe((url) => {
      window.open(url, '_blank');
    });
  }

  continuarLectura(idBook: string, nombre: string) {
    this.bookService.getBookUrl(nombre).subscribe((url) => {
      this.bookService.getCurrentPosition(idBook).subscribe((position) => {
        let posicion = position[0].position;
        if (!posicion) posicion = '';
        this.router.navigate([`/libros`, url, idBook, posicion]);
      });
    });
  }

  confirmarBorrado(idBook: string, nombre: string) {
    this.borrarId = idBook;
    this.borrarNombre = nombre;
  }

  borrarLibro(e: Event, idBook: string, nombre: string) {
    e.stopPropagation();
    this.bookService.deleteBook(idBook).subscribe(() => {
      this.bookService
        .deleteBookFromS3(nombre)
        .subscribe(() => location.reload());
    });
  }
}
