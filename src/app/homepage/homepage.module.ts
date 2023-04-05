import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomepageComponent } from './homepage.component';
import { HomepageRoutingModule } from './homepage-routing.module';
import { HeaderComponent } from '../header/header.component';
import { HeroSectionComponent } from './hero-section/hero-section.component';

import { AuthenModule } from '../authen/authen.module';

@NgModule({
  declarations: [
    HomepageComponent,
    HeaderComponent,
    HeroSectionComponent,
  ],
  imports: [
    CommonModule,
    HomepageRoutingModule,
    AuthenModule,
  ]
})

export class HomepageModule {}
