import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IRole } from 'src/app/interfaces/role';
import { UserService } from 'src/app/services/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-user-modal',
  templateUrl: './add-user-modal.component.html',
  styleUrls: ['./add-user-modal.component.css'],
})
export class AddUserModalComponent {
  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<AddUserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public roles: IRole[]
  ) {}

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    role_id: new FormControl(null, [Validators.required]),
  });

  addUser(): void {
    const userObject = {
      username: this.loginForm.get('username')!.value,
      password: this.loginForm.get('password')!.value,
      name: this.loginForm.get('name')!.value,
      role_id: this.loginForm.get('role_id')!.value,
    };
    this.userService.addUser(userObject).subscribe({
      next: (users) => this.dialogRef.close({ status: 201 }),
      error: (e) => {
        this.dialogRef.close({ status: e.status });
      },
    });
  }
}
