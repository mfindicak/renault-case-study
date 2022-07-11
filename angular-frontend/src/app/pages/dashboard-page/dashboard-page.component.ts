import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css'],
})
export class DashboardPageComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private cookieService: CookieService,
    private router: Router
  ) {}

  //This functions helps to renew accesToken with refreshToken and then run function again.
  tokenErrorHandler(error: any, callBackFunction: Function): void {
    if (error.status === 401) {
      this.authService.refreshToken().subscribe({
        next: () => {
          callBackFunction();
        },
        error: (e) => {
          this.cookieService.delete('is_user_logged_in');
          this.router.navigate(['login']);
        },
      });
    }
  }

  getUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => console.log(users),
      error: (e) => {
        this.tokenErrorHandler(e, () => this.getUsers());
      },
    });
  }

  ngOnInit(): void {
    this.getUsers();
  }
}
