import { AuthenService } from './authen.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';

@Component({
  selector: 'app-authen-page',
  templateUrl: './authen.component.html',
  styleUrls: ['./authen.component.css']
})

export class AuthenPageComponent {
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

