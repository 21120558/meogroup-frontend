import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninPageComponent } from './signin-page/signin-page.component';

const routes: Routes = [
    { path: '', redirectTo: '/users/signin', pathMatch: 'full' },
    { path: 'users/signin', component: SigninPageComponent },
    { path: 'users/signup', component: SigninPageComponent },
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AuthenRoutingModule {};