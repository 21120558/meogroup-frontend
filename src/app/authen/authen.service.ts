import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators'
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';
import jwtDecode from 'jwt-decode';
import { throwError } from 'rxjs';

const SIGNIN_API = 'http://localhost:3000/api/v1/users/signin';
const SIGNUP_API= 'http://localhost:3000/api/v1/users/signup';
const COMPLETE_REGIS_API = 'http://localhost:3000/api/v1/users/complete-regis';
const CHECK_COMPLETE_REGIS_TOKEN_API = 'http://localhost:3000/api/v1/users/check-complete-regis-token';
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

interface CheckResponse{
  message: string
}

@Injectable({
  providedIn: 'root'
})

export class AuthenService {
  loginStatusChanged = new Subject<boolean>();

  constructor(private http: HttpClient, private cookie: CookieService) {};

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

  signup(regisInfo: RegisInfo): Observable<HttpResponse<any>> {
    return this.http.post(SIGNUP_API, regisInfo, { responseType: 'json', observe: 'response' }).pipe(
      map((res : HttpResponse<any>) => {
        console.log(res);

        return res;
      }),
      catchError((error: any) => {
        console.log(error);
        return throwError(error);
      })
    )
  }
  
  logout(): void {
    this.cookie.delete('token');
    this.cookie.delete('username');
    this.loginStatusChanged.next(false)
  }

  completeRegis(headers: HttpHeaders, formData: FormData): Observable<HttpResponse<any>> {
      return this.http.post(COMPLETE_REGIS_API, formData, { headers: headers, responseType: 'text'} ).pipe(
        map((res : any) => {
          return res;
        }),
        catchError((error: any) => {
          return throwError(error);
        })
      )
  }

  isAuthenticated(): boolean {
    return !!this.cookie.get('token');
  }

  checkCompleteRegisToken( completeRegisToken: string ): Observable<boolean> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${completeRegisToken}`);

    return this.http.get<CheckResponse>(CHECK_COMPLETE_REGIS_TOKEN_API, { headers: headers, responseType: 'json'}).pipe(
      map(response => {
        console.log(response)
        if (response.message === 'found') {
          return true;
        } else {
          return true;
        }
      }),
      catchError(error => {
        console.log(error)
        
        return of(true);
      })
    );
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
