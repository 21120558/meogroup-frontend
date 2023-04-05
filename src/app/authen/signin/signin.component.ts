import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenService } from '../authen.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  username: string = '';
  password: string = '';

  constructor(private authenService: AuthenService, private router: Router) {};
  
  onSubmit() {
    this.authenService.login(this.username, this.password).subscribe({
      next: response => {
        this.router.navigate(['/homepage']);
      },
      error: error => {
        console.log(error);
      }
    })
  }

  toSignUp() {
    this.router.navigate(['/user/signup']);
  }

  toForgot() {
    this.router.navigate(['/homepage']);
  }
}
