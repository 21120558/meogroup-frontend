import { Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenService } from '../authen.service';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { avatarFileTypeValidator, avatarRequired, matchValidator } from './complete-regis-validator';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { first } from 'rxjs';


@Component({
  selector: 'app-complete-regis',
  templateUrl: './complete-regis.component.html',
  styleUrls: ['./complete-regis.component.css']
})

export class CompleteRegisComponent{
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

  completeRegisForm!: FormGroup;
  step: number = 1;
  isSubmit: boolean = true;
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
    private route: ActivatedRoute
  ) {};

  ngOnInit(): void {
    this.completeRegisForm = this.formBuilder.group({
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

    this.passwordControl = this.completeRegisForm.get('password');
    this.confirmPassControl = this.completeRegisForm.get('confirmPassword');
    this.nameControl = this.completeRegisForm.get('name');
    this.avatarControl = this.completeRegisForm.get('avatar');
  }

  passwordUpdateMatch() {
    this.completeRegisForm.get('password')?.updateValueAndValidity();
    this.completeRegisForm.get('confirmPassword')?.updateValueAndValidity();
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
    const passwordControl = this.completeRegisForm.get('confirmPassword');
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
    const nameControl = this.completeRegisForm.get('name');
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
    const avatarControl = this.completeRegisForm.get('avatar');
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

  onSubmit(){
    this.completeRegisForm.updateValueAndValidity();
    
    if(this.completeRegisForm.valid) {
      this.route.queryParams.pipe(first()).toPromise().then(queryParams=> {
        console.log(queryParams)
        const headers = new HttpHeaders().set('Authorization', `Bearer ${queryParams?.['completeRegisToken']}`);
        const formData = new FormData();
        formData.append('password', this.completeRegisForm.get('password')?.value);
        formData.append('confirmPassword', this.completeRegisForm.get('confirmPassword')?.value);
        formData.append('fullname', this.completeRegisForm.get('name')?.value);
        formData.append('avatar', this.avatarFile!);
        this.authenService.completeRegis(headers, formData).subscribe({
          next: () => {
            this.isSubmit = true;
          },
          error: () => {
            console.log('hi')
          }
        });
        })
    } else {
      this.avatarFileSubject.next(this.avatarFile || null);
      this.avatarControl?.markAsTouched();
    }
  }
}
