import { Component, OnInit } from '@angular/core';
import { AuthenService } from '../authen.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { existingEmailValidator, existingUsernameValidator } from './signup-validator';
import { existingPhoneValidator } from './signup-validator';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  phone: string = '';
  email: string = '';
  fullname: string = '';

  isUsernameClicked: boolean = false;
  isPhoneClicked: boolean = false;

  signUpForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private authenService: AuthenService) {};

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      username: ['Enter your username', {
        validators: [
          Validators.required, 
          Validators.minLength(8),
          Validators.pattern(/.*[a-zA-Z].*/)
        ],
        asyncValidators: [existingUsernameValidator(this.authenService.checkUsernameExist.bind(this.authenService))],
        updateOn: 'blur'
      }],
      phone: ['Enter your phone', {
        validators: [Validators.required, Validators.pattern(/^\d{10}$/)],
        asyncValidators: [existingPhoneValidator(this.authenService.checkPhoneExist.bind(this.authenService))],
        updateOn: 'blur'
      }],
      email: ['', {
        validators: [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)],
        asyncValidators: [existingEmailValidator(this.authenService.checkEmailExist.bind(this.authenService))],
        updateOn: 'blur'
      }]
    })
  }

  validateUsername() {
    return this.signUpForm.get('username')?.invalid && (this.signUpForm.get('username')?.dirty || this.signUpForm.get('username')?.touched);
  }
  onFirstClickUsername() {
    if (!this.isUsernameClicked) {
      this.signUpForm.get('username')?.setValue('');
      this.isUsernameClicked = true;
    }
  }

  validatePhone() {
    return this.signUpForm.get('phone')?.invalid && (this.signUpForm.get('phone')?.dirty || this.signUpForm.get('phone')?.touched);
  }
  onFirstClickPhone() {
    if (!this.isPhoneClicked) {
      this.signUpForm.get('phone')?.setValue('');
      this.isPhoneClicked = true;
    }
  }

  validateEmail() {
    return this.signUpForm.get('email')?.invalid && (this.signUpForm.get('email')?.dirty || this.signUpForm.get('email')?.touched);
  }

  onSignup(): any {
    this.authenService.signup({
      username: this.username,
      phone: this.phone,
      email: this.email,
    }).subscribe({
      next: res => {
        console.log("hlo")
        console.log(res);
      },
      error: error => {
        console.log("hello")
        console.log(error);
      }
    })
  };

}
