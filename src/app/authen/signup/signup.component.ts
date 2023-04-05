import { Component } from '@angular/core';
import { AuthenService } from '../authen.service';



@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  phone: string = '';
  email: string = '';
  fullname: string = '';

  constructor(private authenService: AuthenService) {};

  onSubmit(): any {
    this.authenService.signup({
      username: this.username,
      password: this.password,
      confirmPassword: this.confirmPassword,
      phone: this.phone,
      email: this.email,
      fullname: this.fullname,
    }).subscribe({
      next: res => {
        console.log("hlo")
        console.log(res);
      },
      error: error => {
        console.log("hello")
        console.log(error);
      }
    })
  };
}
