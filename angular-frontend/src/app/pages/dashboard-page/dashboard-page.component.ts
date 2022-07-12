import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { IUser } from 'src/app/interfaces/user';
import { faPlus, faClose, faSignOut } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css'],
})
export class DashboardPageComponent implements OnInit {
  title: string = 'Renault Sistem';
  faPlus = faPlus;
  faClose = faClose;
  faSignOut = faSignOut;
  addButton: boolean = false;

  users: IUser[] = [];
  userDetails: any = {};

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
      next: (users) => {
        this.users = users;
        console.log(users);
      },
      error: (e) => {
        this.tokenErrorHandler(e, () => this.getUsers());
      },
    });
  }

  getUserById(user_id: number): void {
    this.userService.getUserById(user_id).subscribe({
      next: (user) => (this.userDetails[user_id] = user),
      error: (e) => {
        this.tokenErrorHandler(e, () => this.getUserById(user_id));
      },
    });
  }

  addUser(userObject: IUser): void {
    this.userService.addUser(userObject).subscribe({
      next: (users) => console.log(users),
      error: (e) => {
        this.tokenErrorHandler(e, () => this.addUser(userObject));
      },
    });
  }

  updateUser(user_id: number, userObject: IUser): void {
    this.userService.updateUser(user_id, userObject).subscribe({
      next: (users) => console.log(users),
      error: (e) => {
        this.tokenErrorHandler(e, () => this.updateUser(user_id, userObject));
      },
    });
  }

  deleteUser(user_id: number): void {
    this.userService.deleteUser(user_id).subscribe({
      next: (users) => console.log(users),
      error: (e) => {
        this.tokenErrorHandler(e, () => this.deleteUser(user_id));
      },
    });
  }

  getDetail(user_id: number): IUser {
    return this.userDetails[user_id];
  }

  signOut(): void {
    this.cookieService.delete('is_user_logged_in');
    this.cookieService.delete('logged_in_user_data');
    this.router.navigate(['login']);
  }

  ngOnInit(): void {
    this.getUsers();

    this.getUserById(1);

    // this.addUser({
    //   username: 'user4',
    //   password: '1234',
    //   name: 'Test',
    //   role_id: 1,
    // });

    // this.deleteUser(5);

    // this.updateUser(2, { username: 'updateTest' });
  }
}
