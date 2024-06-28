import { Component, OnInit } from '@angular/core';
import { AuthenService } from '../authen.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { existingEmailValidator, existingUsernameValidator } from './signup-validator';
import { existingPhoneValidator } from './signup-validator';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {
  isUsernameClicked: boolean = false;
  isPhoneClicked: boolean = false;
  isEmailClicked: boolean = false;

  isUsernameFocus: boolean = false;
  isPhoneFocus: boolean = false;
  isEmailFocus: boolean = false;

  signUpForm!: FormGroup;
  isSubmit: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private authenService: AuthenService,
    private router: Router,
  ) {};

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      username: ['Enter your username', {
        validators: [
          Validators.required, 
          Validators.minLength(6),
          Validators.pattern(/^[a-zA-Z0-9]+$/)
        ],
        asyncValidators: [existingUsernameValidator(this.authenService.checkUsernameExist.bind(this.authenService))],
        updateOn: 'blur'
      }],
      phone: ['Enter your phone', {
        validators: [Validators.required, Validators.pattern(/^\d{10}$/)],
        asyncValidators: [existingPhoneValidator(this.authenService.checkPhoneExist.bind(this.authenService))],
        updateOn: 'blur'
      }],
      email: ['Enter your email', {
        validators: [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)],
        asyncValidators: [existingEmailValidator(this.authenService.checkEmailExist.bind(this.authenService))],
        updateOn: 'blur'
      }]
    })
  }

  validateUsername() {
    return this.signUpForm.get('username')?.invalid && (this.signUpForm.get('username')?.dirty || this.signUpForm.get('username')?.touched);
  }
  getUsernameError(): string {
    const usernameControl = this.signUpForm.get('username');
    if (usernameControl?.hasError('unexpectedError')) {
      return 'unexpectedError';
    }
    if (usernameControl?.hasError('required')) {
      return 'required';
    }
    if (usernameControl?.hasError('minlength')) {
      return 'minlength';
    }
    if (usernameControl?.hasError('pattern')) {
      return 'pattern';
    }
    if (usernameControl?.hasError('existingUsername')) {
      return 'existingUsername';
    }
    return '';
  }

  onClickUsername() {
    if (!this.isUsernameClicked) {
      this.signUpForm.get('username')?.setValue('');
      this.isUsernameClicked = true;
    }

    this.isUsernameFocus = true;
  }

  validatePhone() {
    return this.signUpForm.get('phone')?.invalid && (this.signUpForm.get('phone')?.dirty || this.signUpForm.get('phone')?.touched);
  }
  getPhoneError() {
    const phoneControl = this.signUpForm.get('phone');
    if (phoneControl?.hasError('unexpectedError')) {
      return 'unexpectedError';
    }
    if (phoneControl?.hasError('required')) {
      return 'required';
    }
    if (phoneControl?.hasError('pattern')) {
      return 'pattern';
    }
    if (phoneControl?.hasError('existingPhone')) {
      return 'existingPhone';
    }
    return '';
  }

  onClickPhone() {
    if (!this.isPhoneClicked) {
      this.signUpForm.get('phone')?.setValue('');
      this.isPhoneClicked = true;
    }

    this.isPhoneFocus = true;
  }

  validateEmail() {
    return this.signUpForm.get('email')?.invalid && (this.signUpForm.get('email')?.dirty || this.signUpForm.get('email')?.touched);
  }
  getEmailError() {
    const emailControl = this.signUpForm.get('email');
    if (emailControl?.hasError('unexpectedError')) {
      return 'unexpectedError';
    }
    if (emailControl?.hasError('required')) {
      return 'required';
    }
    if (emailControl?.hasError('pattern')) {
      return 'pattern';
    }
    if (emailControl?.hasError('existingEmail')) {
      return 'existingEmail';
    }
    return '';
  }
  onClickEmail() {
    if (!this.isEmailClicked) {
      this.signUpForm.get('email')?.setValue('');
      this.isEmailClicked = true;
    }

    this.isEmailFocus = true;
  }

  toHomepage() {
    this.router.navigate(['/homepage']);
  }

  async onSubmit() {
    this.signUpForm.updateValueAndValidity();
    if (this.signUpForm.valid) {
      const regisInfo = {
        username: this.signUpForm.get('username')?.value,
        phone: this.signUpForm.get('phone')?.value,
        email: this.signUpForm.get('email')?.value,
      }

      this.authenService.signup(regisInfo).subscribe({
        next: () => {
          this.isSubmit = true;
        },
        error: () => {}
      });
    }
  }
}