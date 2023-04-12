import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenRoutingModule } from './authen-routing.module';
import { AuthenPageComponent } from './authen.component';
import { AuthenService } from './authen.service';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { VerifyComponent } from './verify/verify.component';

@NgModule({
  declarations: [
    AuthenPageComponent,
    SigninComponent,
    SignupComponent,
    VerifyComponent,
  ],
  imports: [
    CommonModule,
    AuthenRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    AuthenService,
  ]
})

export class AuthenModule {};
