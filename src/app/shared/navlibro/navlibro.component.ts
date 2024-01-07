import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Highlight } from 'src/app/models/highlight';
import { BookService } from 'src/app/services/book.service';
import { CognitoService } from 'src/app/services/cognito.service';
import { HighlightService } from 'src/app/services/highlight.service';

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

  subrayados: Highlight[] = [];
  nombreLibro: string = '';

  loading: boolean = false;
  tema: boolean = true;

  constructor(
    private router: Router,
    private cognitoService: CognitoService,
    private bookService: BookService,
    private highlightService: HighlightService
  ) {}

  ngOnInit(): void {
    this.bookService.getBook(this.bookId).subscribe((libro) => {
      this.nombreLibro = libro[0].nombre;
    });
    this.obtenerSubrayados();
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

  public obtenerSubrayados() {
    this.highlightService
      .getHighlightsByBook(this.bookId)
      .subscribe((subrayados) => {
        this.subrayados = subrayados;
      });
  }

  eliminarSubrayado(id: string) {
    this.highlightService
      .removeHighlight(id)
      .subscribe(() => location.reload());
  }

  navegarASubrayado(subrayado: Highlight) {
    this.irASubrayado.emit(subrayado.cfiRange);
  }
}
