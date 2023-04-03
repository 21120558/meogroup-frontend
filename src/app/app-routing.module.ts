import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomepageModule } from './homepage/homepage.module';
import { AuthenModule } from './authen/authen.module';

const routes: Routes = [
  { path: 'homepage', loadChildren: () => HomepageModule},
  { path: '', redirectTo: 'homepage', pathMatch: 'full'},
  { 
    path: 'users', 
    children: [
      { path: '', loadChildren: () => AuthenModule },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
