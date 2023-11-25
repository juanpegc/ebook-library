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
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
