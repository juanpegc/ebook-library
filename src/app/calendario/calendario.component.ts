import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth } from 'date-fns';
import { Subject } from 'rxjs';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarView,
} from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { Book } from '../models/book';
import { BookService } from '../services/book.service';
import { CognitoService } from '../services/cognito.service';
import { User } from '../models/user';
import { Router } from '@angular/router';

const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarioComponent implements OnInit {
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();

  loading: boolean = false;
  primeraCarga: boolean = true;

  fechasDeLectura: Map<string, CalendarEvent> = new Map<
    string,
    CalendarEvent
  >();

  refresh = new Subject<void>();

  events: CalendarEvent[] = [];

  libros: any[] = [];
  user!: User;

  constructor(
    private router: Router,
    private bookService: BookService,
    private cognitoService: CognitoService
  ) {
    registerLocaleData(localeEs);
  }

  ngOnInit(): void {
    this.loading = true;
    this.cognitoService.getUser().then((user: any) => {
      if (user) {
        this.user = user.attributes;
        this.obtenerLibros(true);
        this.loading = false;
        this.primeraCarga = false;
      } else {
        this.loading = false;
        this.router.navigate(['/login']);
      }
    });
  }

  obtenerLibros(primeraCarga: boolean) {
    this.bookService.getAllBooksByUser(this.user.sub).subscribe((libros) => {
      this.libros = libros;
      this.libros.forEach((libro) => {
        if (libro.date) {
          let fecha: Date = new Date(libro.date.split('T')[0]);
          let fechaBuena = new Date(fecha.getTime() + 24 * 60 * 60 * 1000);

          let evento = {
            start: fechaBuena,
            title: libro.nombreReal,
            color: { ...colors['yellow'] },
          };

          this.fechasDeLectura.set(libro.id, evento);
          if (primeraCarga) this.events.push(evento);
        }
      });

      this.setView(this.view);
      this.viewDate = this.viewDate;
      document.getElementById('button')?.click();
    });
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  mostrarFecha(fecha: Date) {
    let res = null;
    if (fecha) {
      let fechaArray = fecha.toString().split('T')[0].split('-');
      let diamas = Number(fechaArray[2]) + 1;
      res = diamas + '-' + fechaArray[1] + '-' + fechaArray[0];
    }
    return res;
  }

  cambiarFecha(idBook: string, nombre: string, index: number) {
    let input = (<HTMLInputElement>(
      document.getElementById('fechaNueva' + index)
    )).value;

    let newEvento: CalendarEvent = {
      start: new Date(input),
      title: nombre,
      color: { ...colors['yellow'] },
    };

    this.fechasDeLectura.set(idBook, newEvento);
    this.bookService.addDate(idBook, input).subscribe(() => {
      this.events.push(newEvento);
      this.obtenerLibros(false);
    });
  }

  quitarFecha(idBook: string) {
    let evento = this.fechasDeLectura.get(idBook);
    if (evento) {
      let newEvento: CalendarEvent = {
        start: new Date('1900-01-01'),
        title: evento.title,
        color: { ...colors['yellow'] },
      };
      this.fechasDeLectura.set(idBook, newEvento);
      this.events.splice(
        this.events.findIndex((elem) => elem.title == newEvento.title),
        1
      );
    }
    this.bookService.removeDate(idBook).subscribe(() => {
      this.obtenerLibros(false);
    });
  }
}
