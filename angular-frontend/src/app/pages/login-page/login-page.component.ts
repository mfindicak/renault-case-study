import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent implements OnInit {
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

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  onSubmit(): void {
    this.authService.login(this.getUsername(), this.getPassword()).subscribe({
      next: (result) => {
        console.log(result);
      },
      error: (e) => console.error(e),
      complete: () => {},
    });
  }
}
