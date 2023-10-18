import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-alerta',
  templateUrl: './alerta.component.html',
  styleUrls: ['./alerta.component.scss'],
})
export class AlertaComponent implements OnInit {
  @Input() mensaje: string = '';
  @Output() cerrar = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {}

  cerrarVentana() {
    this.cerrar.emit(true);
  }
}
