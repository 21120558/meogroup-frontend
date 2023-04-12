import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenPageComponent } from './authen.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { VerifyComponent } from './verify/verify.component';
import { VerifyGuard } from './verify.guard';

const routes: Routes = [
    { path: '', component: AuthenPageComponent, children: [
            { path: '', redirectTo: 'signin', pathMatch: 'full' },
            { path: 'signin', component: SigninComponent},
            { path: 'signup', component: SignupComponent},
            { 
                path: 'verify', 
                component: VerifyComponent,
                canActivate: [VerifyGuard],
                data: {
                    protected: true
                }
            },
        ]
    },
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AuthenRoutingModule {};