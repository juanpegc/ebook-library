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
  editando: boolean = false;

  actions: CalendarEventAction[] = [
    {
      label: '<i class="bi bi-pen-fill"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        console.log('Click on edit');
      },
    },
    {
      label: '<i class="bi bi-trash-fill"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        console.log('Click on delete');
      },
    },
  ];

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
    // TODO SERÍA INTERESANTE AÑADIR VALORACIÓN A LIBROS
  }

  ngOnInit(): void {
    this.loading = true;
    this.cognitoService.getUser().then((user: any) => {
      if (user) {
        this.user = user.attributes;
        this.obtenerLibros();
        this.loading = false;
      } else {
        this.loading = false;
        this.router.navigate(['/login']);
      }
    });
  }

  obtenerLibros() {
    this.bookService.getAllBooksByUser(this.user.sub).subscribe((libros) => {
      this.libros = libros;
      this.libros.forEach((libro) => {
        let fecha = '1900-01-01';
        if (libro.date) {
          fecha = libro.date.split('T')[0];
        }

        this.fechasDeLectura.set(libro.id, {
          start: endOfDay(new Date(fecha)),
          title: libro.nombre.split('.epub')[0],
          color: { ...colors['yellow'] },
          actions: this.actions,
        });
      });
      this.fechasDeLectura.forEach((value, key) => {
        this.events.push(value);
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

  cambiarFecha(idBook: string, nombre: string) {
    let input = (<HTMLInputElement>document.getElementById('fechaNueva')).value;
    this.fechasDeLectura.set(idBook, {
      start: endOfDay(new Date(input)),
      title: nombre.split('.epub')[0],
      color: { ...colors['yellow'] },
      actions: this.actions,
    });
    this.bookService.addDate(idBook, input).subscribe();
    this.fechasDeLectura.forEach((value, key) => {
      this.events.push(value);
    });
    this.obtenerLibros();
  }

  quitarFecha(idBook: string) {
    let evento = this.fechasDeLectura.get(idBook);
    if (evento) {
      let newEvento: CalendarEvent = {
        start: endOfDay(new Date('1900-01-01')),
        title: evento.title,
        color: { ...colors['yellow'] },
        actions: this.actions,
      };
      this.fechasDeLectura.set(idBook, newEvento);
    }
    this.bookService.removeDate(idBook).subscribe();
    this.fechasDeLectura.forEach((value, key) => {
      this.events.push(value);
    });
    this.obtenerLibros();
  }
}
