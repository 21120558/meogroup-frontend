import { Component } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('rotate', [
      transition(':enter', [
        style({ transform: 'rotate(0deg)' }),
        animate('2s', style({ transform: 'rotate(360deg)'}))
      ])
    ])
  ]
})

export class AppComponent{
  title = 'simple-app';
}
