import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';
import jwtDecode from 'jwt-decode';

const API = 'http://localhost:3000/api/v1/users/signin';
const GET_USER_API = 'http://localhost:3000/api/v1/users';

interface DecodedToken {
  id: string;
  username: string;
};

@Injectable({
  providedIn: 'root'
})

export class AuthenService {
  loginStatusChanged = new Subject<boolean>();

  constructor(private http: HttpClient, private cookie: CookieService) {};

  getUser(): Observable<any> {
    const token = this.cookie.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };

    return this.http.get(GET_USER_API, options);
  }

  login(username: string, password: string): Observable<any> {
    const credentials = { username: username, password: password };
    return this.http.post(API, credentials).pipe(
      tap((response: any) => {
        const token = response.token;
        const decodeToken = jwtDecode(token) as DecodedToken;
        this.cookie.set('token', token, { secure: true, sameSite: 'Strict'});
        this.cookie.set('username', decodeToken.username, { secure: true, sameSite: "Strict"});
        this.loginStatusChanged.next(true);
      })
    )
  };

  logout(): void {
    this.cookie.delete('token');
    this.cookie.delete('username');
    this.loginStatusChanged.next(false)
  }

  isAuthenticated(): boolean {
    return !!this.cookie.get('token');
  }

  get getUsername() {
    return this.cookie.get('username');
  }
}
