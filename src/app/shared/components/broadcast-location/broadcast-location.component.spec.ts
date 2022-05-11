import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BroadCastLocationComponent } from './broadcast-location.component';

describe('BroadCastLocationComponent', () => {
  let component: BroadCastLocationComponent;
  let fixture: ComponentFixture<BroadCastLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BroadCastLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BroadCastLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
