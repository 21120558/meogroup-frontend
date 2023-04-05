import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenPageComponent } from './authen.component';

describe('SigninPageComponent', () => {
  let component: AuthenPageComponent;
  let fixture: ComponentFixture<AuthenPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthenPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthenPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
