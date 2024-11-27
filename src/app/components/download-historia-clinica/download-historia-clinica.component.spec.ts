import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadHistoriaClinicaComponent } from './download-historia-clinica.component';

describe('DownloadHistoriaClinicaComponent', () => {
  let component: DownloadHistoriaClinicaComponent;
  let fixture: ComponentFixture<DownloadHistoriaClinicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadHistoriaClinicaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DownloadHistoriaClinicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
