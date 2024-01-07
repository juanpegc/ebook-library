import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { CognitoService } from 'src/app/services/cognito.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  user!: User;
  isConfirm: boolean = false;
  alertMessage: string = '';
  showAlert: boolean = false;
  loading: boolean = false;

  hidden: boolean = true;

  constructor(
    private router: Router,
    private cognitoService: CognitoService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.user = {} as User;
    this.isConfirm = false;
    this.hidden = true;
  }

  public signUpWithCognito() {
    this.loading = true;
    if (this.user && this.user.email && this.user.password) {
      this.cognitoService
        .signUp(this.user)
        .then(() => {
          this.loading = false;
          this.isConfirm = true;
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

  public confirmSignUp() {
    this.loading = true;
    if (this.user) {
      this.cognitoService
        .confirmSignUp(this.user)
        .then(() => {
          this.loading = false;

          this.userService.addUser(this.user);

          this.router.navigate(['/login']);
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
