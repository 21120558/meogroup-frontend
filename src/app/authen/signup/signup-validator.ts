import { HttpResponse, HttpSentEvent } from "@angular/common/http";
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { Observable, catchError, map, of } from "rxjs";

export function existingUsernameValidator(checkUsernameExist: (username: string) => Observable<HttpResponse<any>>): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        return checkUsernameExist(control.value).pipe(
            map((response) => response.status === 200 ? { 'existingUsername': true } : null),
            catchError(() => of(null))
        )
    };
}

export function existingPhoneValidator(checkPhoneExist: (phone: string) => Observable<HttpResponse<any>>): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        return checkPhoneExist(control.value).pipe(
            map((response) => response.status === 200 ? { 'existingPhone': true } : null),
            catchError(() => of(null))
    )};
}

export function existingEmailValidator(checkEmailExist: (email: string) => Observable<HttpResponse<any>>): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        return checkEmailExist(control.value).pipe(
            map((response) => response.status === 200 ? { 'existingEmail': true } : null),
            catchError(() => of(null))
        )
    };
}