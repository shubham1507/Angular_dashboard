import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvenTimeLineComponent } from './event-timeline.component';

describe('EvenTimeLineComponent', () => {
  let component: EvenTimeLineComponent;
  let fixture: ComponentFixture<EvenTimeLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvenTimeLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvenTimeLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
