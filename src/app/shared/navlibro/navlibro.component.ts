import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService } from 'src/app/services/cognito.service';

@Component({
  selector: 'app-navlibro',
  templateUrl: './navlibro.component.html',
  styleUrls: ['./navlibro.component.scss'],
})
export class NavlibroComponent implements OnInit {
  @Input() capitulos!: any[];

  @Output() tipoVista = new EventEmitter<boolean>();
  @Output() cambioCapitulo = new EventEmitter<string>();
  @Output() cambioTema = new EventEmitter<boolean>();

  loading: boolean = false;
  tema: boolean = true;

  constructor(private router: Router, private cognitoService: CognitoService) {}

  ngOnInit(): void {}

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
}
