import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { AuthenService } from './authen.service';

@Injectable({
  providedIn: 'root'
})
export class CompleteRegisGuard implements CanActivate {
  constructor(private authenService: AuthenService) {};
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const completeRegisToken = route.queryParams['completeRegisToken'];
      return this.authenService.checkCompleteRegisToken(completeRegisToken).pipe(
        map(result => {
          console.log(result)
          return result;
        }),
        catchError(error => {
          return of(error);
        })
      )
    }
  
}
