import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService } from 'src/app/services/cognito.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  loading: boolean = false;

  constructor(private router: Router, private cognitoService: CognitoService) {}

  ngOnInit(): void {}

  signOutWithCognito() {
    this.loading = true;
    this.cognitoService.signOut().then(() => {
      this.loading = false;
      this.router.navigate(['/login']);
    });
  }
}
