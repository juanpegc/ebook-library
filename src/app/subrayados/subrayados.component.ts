import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HighlightService } from '../services/highlight.service';
import { Highlight } from '../models/highlight';
import { CognitoService } from '../services/cognito.service';
import { User } from '../models/user';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-subrayados',
  templateUrl: './subrayados.component.html',
  styleUrls: ['./subrayados.component.scss'],
})
export class SubrayadosComponent {
  user!: User;
  subrayados: Highlight[] = [];
  loading: boolean = false;

  constructor(
    private router: Router,
    private bookService: BookService,
    private highlightService: HighlightService,
    private cognitoService: CognitoService
  ) {}

  private getUserDetails() {
    this.loading = true;
    this.cognitoService.getUser().then((user: any) => {
      if (user) {
        this.user = user.attributes;
        this.obtenerSubrayados();
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

  obtenerSubrayados() {
    this.highlightService
      .getHighlightsByUser(this.user.sub)
      .subscribe((subrayados) => {
        this.subrayados = subrayados;
      });
  }

  eliminarSubrayado(id: string) {
    this.highlightService
      .removeHighlight(id)
      .subscribe(() => location.reload());
  }

  irASubrayado(nombre: string, idBook: string, cfiRange: string) {
    this.bookService.getBookUrl(nombre).subscribe((url) => {
      this.router.navigate([`/libros`, url, idBook, cfiRange]);
    });
  }
}
