import { Component, OnInit } from '@angular/core';
import { CognitoService } from '../services/cognito.service';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  user!: any;
  loading: boolean = false;

  constructor(private router: Router, private cognitoService: CognitoService) {}

  ngOnInit(): void {
    this.getUserDetails();
  }

  private getUserDetails() {
    this.loading = true;
    this.cognitoService.getUser().then((user: any) => {
      if (user) {
        this.user = user;
        console.log(user);
        this.loading = false;
      } else {
        this.loading = false;
        this.router.navigate(['/login']);
      }
    });
  }
}
