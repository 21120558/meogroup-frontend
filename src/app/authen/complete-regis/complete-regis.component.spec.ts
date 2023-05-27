import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteRegisComponent } from './complete-regis.component';

describe('CompleteRegisComponent', () => {
  let component: CompleteRegisComponent;
  let fixture: ComponentFixture<CompleteRegisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompleteRegisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompleteRegisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
