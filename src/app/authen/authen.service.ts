import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators'
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';
import jwtDecode from 'jwt-decode';
import { throwError } from 'rxjs';

const SIGNIN_API = 'http://localhost:3000/api/v1/users/signin';
const SIGNUP_API= 'http://localhost:3000/api/v1/users/signup';
const GET_USER_API = 'http://localhost:3000/api/v1/users';
const CHECK_USERNAME_API = 'http://localhost:3000/api/v1/users/check-username';
const CHECK_PHONE_API = 'http://localhost:3000/api/v1/users/check-phone';
const CHECK_EMAIL_API = 'http://localhost:3000/api/v1/users/check-email';

interface DecodedToken {
  id: string;
  username: string;
};

interface RegisInfo {
    username: string,
    phone: string,
    email: string
}

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
    return this.http.post(SIGNIN_API, credentials).pipe(
      tap((response: any) => {
        const token = response.token;
        const decodeToken = jwtDecode(token) as DecodedToken;
        this.cookie.set('token', token, { secure: true, sameSite: 'Strict'});
        this.cookie.set('username', decodeToken.username, { secure: true, sameSite: "Strict"});
        this.loginStatusChanged.next(true);
      })
    )
  };

  signup(regisInfo: RegisInfo): Observable<any> {
    return this.http.post(SIGNUP_API, regisInfo, { responseType: 'text' }).pipe(
      map((res : any) => {
        return res;
      }),
      catchError((error: any) => {
        return throwError(error);
      })
    )
  }

  logout(): void {
    this.cookie.delete('token');
    this.cookie.delete('username');
    this.loginStatusChanged.next(false)
  }

  isAuthenticated(): boolean {
    return !!this.cookie.get('token');
  }

  checkUsernameExist( username: string ): Observable<HttpResponse<any>> {
    const params = {username: username}
    return this.http.get(CHECK_USERNAME_API, { observe: 'response', responseType: 'json', params: params})
  }

  checkPhoneExist( phone: string ): Observable<HttpResponse<any>> {
    const params = { phone: phone }
    return this.http.get(CHECK_PHONE_API, { observe: 'response', responseType: 'json', params: params})
  }

  checkEmailExist(email: string): Observable<HttpResponse<any>> {
    const params = { email: email}
    return this.http.get(CHECK_EMAIL_API, { observe: 'response', responseType: 'json', params: params})
  }

  get getUsername() {
    return this.cookie.get('username');
  }

}
