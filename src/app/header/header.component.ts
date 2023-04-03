import { Component, HostListener } from '@angular/core';
import { AuthenService } from '../authen/authen.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent {
  isAuthenticated = false;

  constructor(private authenService: AuthenService, private cookie: CookieService) {};

  ngOnInit() {
    this.isAuthenticated = this.authenService.isAuthenticated();
    this.authenService.loginStatusChanged.subscribe(isLoggedIn => {
      this.isAuthenticated = isLoggedIn;
    });
  }

  onLogout() {
    this.authenService.logout();
  }
  
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: any) {
    let navbar = document.getElementById('navbar');
    let scrollTop = window.pageXOffset || document.documentElement.scrollTop;

    if (scrollTop == 0) {
      navbar?.classList.remove('bg-scroll-navbar');
    } else {
      navbar?.classList.add('bg-scroll-navbar');
    }
  }

  getUsername() {
    return this.cookie.get('username');
  }
}
