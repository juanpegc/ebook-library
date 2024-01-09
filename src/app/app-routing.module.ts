import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './user/register/register.component';
import { InicioComponent } from './inicio/inicio.component';
import { LibrosComponent } from './libros/libros.component';
import { PerfilComponent } from './user/perfil/perfil.component';
import { SubrayadosComponent } from './subrayados/subrayados.component';
import { ComentariosComponent } from './comentarios/comentarios.component';
import { CalendarioComponent } from './calendario/calendario.component';

const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'libros/:url/:id/:cfiRange', component: LibrosComponent },
  { path: 'subrayados', component: SubrayadosComponent },
  { path: 'comentarios', component: ComentariosComponent },
  { path: 'calendario', component: CalendarioComponent },
  { path: 'perfil', component: PerfilComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
