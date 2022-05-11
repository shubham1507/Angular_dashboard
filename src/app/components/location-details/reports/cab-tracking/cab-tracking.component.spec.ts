import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CabTrackingComponent } from './cab-tracking.component';

describe('CabTrackingComponent', () => {
  let component: CabTrackingComponent;
  let fixture: ComponentFixture<CabTrackingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CabTrackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CabTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
