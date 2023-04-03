import { Component, OnDestroy } from '@angular/core';
import { AuthenService } from '../authen.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signin-page',
  templateUrl: './signin-page.component.html',
  styleUrls: ['./signin-page.component.css']
})

export class SigninPageComponent {
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
}

