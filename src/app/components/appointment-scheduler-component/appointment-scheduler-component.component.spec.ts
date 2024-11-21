import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentSchedulerComponentComponent } from './appointment-scheduler-component.component';

describe('AppointmentSchedulerComponentComponent', () => {
  let component: AppointmentSchedulerComponentComponent;
  let fixture: ComponentFixture<AppointmentSchedulerComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentSchedulerComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppointmentSchedulerComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
