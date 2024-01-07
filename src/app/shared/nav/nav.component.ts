import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Book } from 'src/app/models/book';
import { User } from 'src/app/models/user';
import { BookService } from 'src/app/services/book.service';
import { CognitoService } from 'src/app/services/cognito.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  loading: boolean = false;
  error: boolean = false;
  user!: User;

  libro: File | null | undefined = null;

  constructor(
    private router: Router,
    private bookService: BookService,
    private cognitoService: CognitoService
  ) {}

  ngOnInit(): void {
    this.cognitoService.getUser().then((user: any) => {
      if (user) {
        this.user = user.attributes;
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
  comprobarArchivo(e: any) {
    let files = (e.target as HTMLInputElement).files;
    let extension = files?.item(0)?.name.split('.');
    if (extension && extension[extension.length - 1] != 'epub') {
      this.error = true;
      this.libro = null;
    } else {
      this.error = false;
      this.libro = files?.item(0);
    }
  }

  subirLibro() {
    this.bookService.uploadBook(this.libro).subscribe();
    let libro: Book;
    if (this.libro) {
      libro = {
        id: '',
        url: '',
        nombre: this.libro?.name,
        userID: this.user.sub,
      };
      this.bookService.addBook(libro).subscribe(() => {
        location.reload();
      });
    }
  }
}
