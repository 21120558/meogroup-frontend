import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Observable, map, take } from "rxjs";

export function matchValidator(passwordControlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const parentFromGroup = control.parent;
    if (!parentFromGroup) {
      return null;
    }

    const passwordControl = parentFromGroup.get(passwordControlName);
    if (!passwordControl) {
      return null;
    }

    const password = passwordControl.value;
    const confirmPassword = control.value;

    if (password !== confirmPassword) {
      return { 'notMatch': true };
    } else {
      return null;
    }
  };
}

export function avatarFileTypeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value) {
      const filename = control.value.toLowerCase();
      const validExtensions = ['.jpeg', '.jpg', '.png'];
      const fileExtension = '.' + filename.split('.').pop();
      if (!validExtensions.includes(fileExtension)) {
        return { 'invalidFileType': true};
      }
    }

    return null;
  }
}

export function avatarRequired(avatarFile$: Observable<File | null>): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return avatarFile$.pipe(
      take(1),
      map(avatarFile => {
        if (!avatarFile) {
          return { 'required': true }
        }

        return null;
      })
    )
  }
}