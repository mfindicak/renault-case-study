import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { RoleService } from 'src/app/services/role.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { IUser } from 'src/app/interfaces/user';
import { faPlus, faClose, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { IRole } from 'src/app/interfaces/role';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  selfUserData: IUser = { user_id: -1 };
  roles: IRole[] = [];
  selfRole: IRole | null = null;
  isManager: boolean = false;

  users: IUser[] = [];
  userDetails: any = {};

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private roleService: RoleService,
    private cookieService: CookieService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  //This functions helps to renew accesToken with refreshToken and then run function again.
  tokenErrorHandler(error: any, callBackFunction: Function): void {
    if (error.status === 401) {
      this.authService.refreshToken().subscribe({
        next: () => {
          callBackFunction();
        },
        error: (e) => {
          this.signOut();
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

  updateUser(
    user_id: string,
    username?: string,
    name?: string,
    role_id?: number
  ): void {
    const userObject = {
      user_id: Number(user_id),
      username: username,
      name: name,
      role_id: role_id,
    };
    this.userService.updateUser(userObject).subscribe({
      next: () => {
        this.getUsers();
        this.openSnackBar(
          'Kullanıcı verileri başarıyla değiştirildi.',
          'Kapat'
        );
      },
      error: (e) => {
        this.tokenErrorHandler(e, () =>
          this.updateUser(user_id, username, name, role_id)
        );
      },
    });
  }

  deleteUser(user_id: string): void {
    this.userService.deleteUser(Number(user_id)).subscribe({
      next: () => {
        this.getUsers();
        this.openSnackBar('Kullanıcı başarıyla silindi.', 'Kapat');
      },
      error: (e) => {
        this.tokenErrorHandler(e, () => this.deleteUser(user_id));
      },
    });
  }

  getDetail(user_id: number): IUser {
    return this.userDetails[user_id];
  }

  getSelfUserDetails(): void {
    const selfUserId = Number(this.cookieService.get('logged_in_user_id'));
    this.userService.getUserById(selfUserId).subscribe({
      next: (user) => {
        this.selfUserData = user;
        console.log(user);
      },
      error: (e) => {
        this.tokenErrorHandler(e, () => this.getSelfUserDetails());
      },
      complete: () => this.getRoles(),
    });
  }

  getRoles(): void {
    this.roleService.getRoles().subscribe({
      next: (roles) => {
        console.log(roles);
        this.roles = roles;
        roles.forEach((element) => {
          if (element.role_id == this.selfUserData.role_id) {
            this.selfRole = element;
            this.isManager = element.role_id == 2 ? true : false;
          }
        });
      },
      error: (e) => this.tokenErrorHandler(e, () => this.getRoles()),
    });
  }

  signOut(): void {
    this.cookieService.delete('logged_in_user_id');
    this.router.navigate(['login']);
  }

  ngOnInit(): void {
    this.getSelfUserDetails();

    this.getUsers();

    // this.addUser({
    //   username: 'user4',
    //   password: '1234',
    //   name: 'Test',
    //   role_id: 1,
    // });

    // this.deleteUser(5);
  }
}
