import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent implements OnInit {
  incorrectPassword: boolean = false;
  couldNotFindUser: boolean = false;

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  getUsername(): string {
    return this.loginForm.get('username')?.value as string;
  }

  getPassword(): string {
    return this.loginForm.get('password')?.value as string;
  }

  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSubmit(): void {
    this.incorrectPassword = false;
    this.couldNotFindUser = false;
    this.authService.login(this.getUsername(), this.getPassword()).subscribe({
      next: (result) => {
        console.log(result);
      },
      error: (e) => {
        if (e.status === 400) this.couldNotFindUser = true;
        else if (e.status === 401) this.incorrectPassword = true;
      },
      complete: () => {
        this.cookieService.set('is_user_logged_in', 'true', 30);
        this.router.navigate(['dashboard']);
      },
    });
  }
}
