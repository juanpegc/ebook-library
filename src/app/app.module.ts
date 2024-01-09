import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { NavComponent } from './shared/nav/nav.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { HomeComponent } from './home/home.component';
import { InicioComponent } from './inicio/inicio.component';
import { AlertaComponent } from './shared/alerta/alerta.component';
import { LibrosComponent } from './libros/libros.component';
import { NavlibroComponent } from './shared/navlibro/navlibro.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PerfilComponent } from './user/perfil/perfil.component';
import { SubrayadosComponent } from './subrayados/subrayados.component';
import { ComentariosComponent } from './comentarios/comentarios.component';
import { CalendarioComponent } from './calendario/calendario.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    NavComponent,
    SpinnerComponent,
    HomeComponent,
    InicioComponent,
    AlertaComponent,
    LibrosComponent,
    NavlibroComponent,
    PerfilComponent,
    SubrayadosComponent,
    ComentariosComponent,
    CalendarioComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule, CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory })],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
