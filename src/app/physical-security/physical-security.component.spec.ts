import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalSecurityComponent } from './physical-security.component';

describe('PhysicalSecurityComponent', () => {
  let component: PhysicalSecurityComponent;
  let fixture: ComponentFixture<PhysicalSecurityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicalSecurityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
