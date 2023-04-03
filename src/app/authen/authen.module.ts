import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenRoutingModule } from './authen-routing.module';
import { SigninPageComponent } from './signin-page/signin-page.component';
import { AuthenService } from './authen.service';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    SigninPageComponent,
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
