import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { CognitoService } from 'src/app/services/cognito.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  user!: User;
  isConfirm: boolean = false;
  alertMessage: string = '';
  showAlert: boolean = false;
  loading: boolean = false;

  forgotPassword: boolean = false;
  newPassword: string = '';

  hidden: boolean = true;

  constructor(private router: Router, private cognitoService: CognitoService) {}

  ngOnInit(): void {
    this.user = {} as User;
    this.hidden = true;
  }

  public signInWithCognito() {
    this.loading = true;
    if (this.user && this.user.email && this.user.password) {
      this.cognitoService
        .signIn(this.user)
        .then(() => {
          this.loading = false;
          this.router.navigate(['/home']);
        })
        .catch((error: any) => {
          this.loading = false;
          this.displayAlert(error.message);
        });
    } else {
      this.loading = false;
      this.displayAlert('Rellena los campos');
    }
  }

  public forgotPasswordFunction() {
    if (this.user && this.user.email) {
      this.cognitoService
        .forgotPassword(this.user)
        .then(() => {
          this.forgotPassword = true;
        })
        .catch((error: any) => {
          this.displayAlert(error.message);
        });
    } else {
      this.displayAlert('Introduce un email');
    }
  }

  newPasswordSubmit() {
    if (this.user && this.user.code && this.newPassword.trim().length !== 0) {
      this.cognitoService
        .forgotPasswordSubmit(this.user, this.newPassword.trim())
        .then(() => {
          this.displayAlert('Contraseña cambiada');
          this.forgotPassword = false;
        })
        .catch((error: any) => {
          this.displayAlert(error.message);
        });
    } else {
      this.displayAlert('Rellena los campos');
    }
  }

  private displayAlert(message: string) {
    this.alertMessage = message;
    this.showAlert = true;
  }

  showPassword(): void {
    let passwordInput = <HTMLInputElement>document.getElementById('password');
    if (this.hidden) {
      passwordInput.type = 'text';
      this.hidden = false;
    } else {
      passwordInput.type = 'password';
      this.hidden = true;
    }
  }
}
