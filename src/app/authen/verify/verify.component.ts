import { Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenService } from '../authen.service';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { avatarFileTypeValidator, avatarRequired, matchValidator } from './verify-validator';
import { Observable, ReplaySubject, Subject } from 'rxjs';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent {
  @ViewChild('imageInput') imageInput!: ElementRef;
  imgSource: string | ArrayBuffer | null = null;
  private avatarFileSubject: ReplaySubject<File | null> = new ReplaySubject(1);
  avatarFile$: Observable<File | null> = this.avatarFileSubject.asObservable();
  avatarFile: File | null = null;

  passwordControl: AbstractControl | null = null;
  confirmPassControl: AbstractControl | null = null;
  nameControl: AbstractControl | null = null;
  avatarControl: AbstractControl | null = null;

  isPasswordFocus: boolean = false;
  isConfirmPassFocus: boolean = false;
  isNameFocus: boolean = false;

  verifyForm!: FormGroup;
  step: number = 1;
  isStep1(): boolean {
    return this.step === 1;
  }

  isStep2(): boolean {
    return this.step === 2;
  }

  constructor(
    private formBuilder: FormBuilder,
    private authenService: AuthenService,
    private router: Router,
  ) {};

  ngOnInit(): void {
    this.verifyForm = this.formBuilder.group({
      password: this.formBuilder.control('Enter your password', {
        validators: [
          Validators.required,
          Validators.minLength(8),
        ],
      }),
      confirmPassword: this.formBuilder.control('Re-enter your password', {
        validators: [
          matchValidator('password'),
        ],
      }),
      name: this.formBuilder.control('Enter your fullname', {
        validators: [
          Validators.required,
          Validators.pattern(/^(?:[a-zA-Z\u00C0-\u1EF9\s])+$/),
        ],
      }),
      avatar: this.formBuilder.control('', {
        validators: [
          avatarFileTypeValidator()
        ],
        asyncValidators: [
          avatarRequired(this.avatarFile$),
        ]
      }),
    });

    this.passwordControl = this.verifyForm.get('password');
    this.confirmPassControl = this.verifyForm.get('confirmPassword');
    this.nameControl = this.verifyForm.get('name');
    this.avatarControl = this.verifyForm.get('avatar');
  }

  passwordUpdateMatch() {
    this.verifyForm.get('password')?.updateValueAndValidity();
    this.verifyForm.get('confirmPassword')?.updateValueAndValidity();
  }

  onClickPassword() {
    if (this.passwordControl?.pristine) {
      this.passwordControl?.setValue('');
    }
  }

  validatePassword() {
    return this.passwordControl?.invalid && (this.passwordControl?.dirty || this.passwordControl?.touched);
  }

  getPasswordError(): string {
    if (this.passwordControl?.hasError('unexpectedError')) {
      return 'unexpectedError';
    }
    if (this.passwordControl?.hasError('required')) {
      return 'required';
    }
    if (this.passwordControl?.hasError('minlength')) {
      return 'minlength';
    }

    return '';
  }

  onClickConfirmPass() {
    if (this.confirmPassControl?.pristine) {
      this.confirmPassControl?.setValue('');
    }
  }
  validateConfirmPass() {
    return this.confirmPassControl?.invalid && (this.confirmPassControl?.dirty || this.confirmPassControl?.touched);
  }
  getConfirmPassError(): string {
    const passwordControl = this.verifyForm.get('confirmPassword');
    if (passwordControl?.hasError('unexpectedError')) {
      return 'unexpectedError';
    }
    if (passwordControl?.hasError('notMatch')) {
      return 'notMatch';
    }
    return '';
  }

  onClickName() {
    if (this.nameControl?.pristine) {
      this.nameControl?.setValue('');
    }
  }
  validateName() {
    return this.nameControl?.invalid && (this.nameControl?.dirty || this.nameControl?.touched);
  }
  getNameError(): string {
    const nameControl = this.verifyForm.get('name');
    if (nameControl?.hasError('unexpectedError')) {
      return 'unexpectedError';
    } 
    
    if (nameControl?.hasError('required')) {
      return 'required';
    }

    if (nameControl?.hasError('pattern')) {
      return 'pattern';
    }

    return '';
  }


  async onUploadAvatar(event: Event) {
    const hasInvalidFileTypeError = this.avatarControl?.invalid && !this.avatarControl.hasError('required');
    if (!hasInvalidFileTypeError && this.avatarControl?.value) {
      const imageInput = (event.target as HTMLInputElement).files?.[0];
      const reader = new FileReader();

      this.imgSource = await this.readAsDataURLAsync(reader, imageInput!);
      this.avatarFile = imageInput!;

      this.avatarFileSubject.next(this.avatarFile);
    }
  }

  readAsDataURLAsync(reader: FileReader, file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject(reader.error);
      };
      reader.readAsDataURL(file);
    });
  }

  validateAvatar() {
    return this.avatarControl?.invalid && (this.avatarControl?.touched || this.avatarControl?.dirty);
  }
  getAvatarError() {
    const avatarControl = this.verifyForm.get('avatar');
    if (avatarControl?.hasError('invalidFileType')) {
      return 'invalidFileType'
    }
    if (avatarControl?.hasError('required')) {
      return 'required'
    }
    if (avatarControl?.hasError('unexpectedError')) {
      return 'unexpectedError'
    }

    return '';
  }
  toHomepage() {
    this.router.navigate(['/homepage']);
  }
  onNext() {
    this.confirmPassControl?.updateValueAndValidity();
    this.passwordControl?.updateValueAndValidity();
    this.nameControl?.updateValueAndValidity();
    if(
      this.confirmPassControl?.valid &&
      this.passwordControl?.valid &&
      this.nameControl?.valid 
    ) {
      this.step = 2;

      return;
    }

    this.onClickPassword();
    this.passwordControl?.markAsTouched();
    this.onClickName();
    this.nameControl?.markAsTouched();
    this.onClickConfirmPass();
    this.confirmPassControl?.markAsTouched();
  }

  onSubmit() {
    this.verifyForm.updateValueAndValidity();
    if(this.verifyForm.valid) {
      const formData = new FormData();
      formData.append('password', this.verifyForm.get('password')?.value);
      formData.append('confirmPassword', this.verifyForm.get('confirmPassword')?.value);
      formData.append('fullname', this.verifyForm.get('name')?.value);
      console.log(this.avatarFile?.type)
      console.log(this.avatarFile)
      formData.append('avatar', this.avatarFile!);
      this.authenService.verify(formData).subscribe({
        next: () => {
          console.log('hello')
        },
        error: () => {
          console.log('hi')
        }
      });
    } else {
      this.avatarFileSubject.next(this.avatarFile || null);
      this.avatarControl?.markAsTouched();
    }
  }
}
