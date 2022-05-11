import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BriefingReportComponent } from './briefing-report.component';

describe('BriefingReportComponent', () => {
  let component: BriefingReportComponent;
  let fixture: ComponentFixture<BriefingReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BriefingReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BriefingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
