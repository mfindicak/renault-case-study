import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Renault Sistem';
  isLoggedIn: string = '';
  constructor(private router: Router, private cookieService: CookieService) {
    this.isLoggedIn = this.cookieService.get('logged_in_user_id');
    if (this.isLoggedIn) {
      this.router.navigate(['dashboard']);
    } else {
      this.router.navigate(['login']);
    }
  }
}
