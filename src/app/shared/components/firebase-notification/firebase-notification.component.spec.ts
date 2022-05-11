import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FireBaseNotificationComponent } from './firebase-notification.component';

describe('FireBaseNotificationComponent', () => {
  let component: FireBaseNotificationComponent;
  let fixture: ComponentFixture<FireBaseNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FireBaseNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FireBaseNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
