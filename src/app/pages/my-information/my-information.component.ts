import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DatabaseService } from '../../services/database/database.service';
import { DownloadHistoriaClinicaComponent } from '../../components/download-historia-clinica/download-historia-clinica.component';

@Component({
  selector: 'app-my-information',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DownloadHistoriaClinicaComponent,
  ],
  templateUrl: './my-information.component.html',
  styleUrl: './my-information.component.scss',
})
export class MyInformationComponent implements OnInit {
  showMisHorarios: boolean = false;
  defaultAvailability: any;
  isModifying: boolean = false;
  especialidades: any[] = [];
  selectedEspecialidad: string = '';

  times = [
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    'N/A',
  ];

  sabados = [
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    'N/A',
  ];
  day = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

  horariosForm = new FormGroup({
    lunesInicio: new FormControl('08:00'),
    lunesFin: new FormControl('18:30'),
    martesInicio: new FormControl('08:00'),
    martesFin: new FormControl('18:30'),
    miercolesInicio: new FormControl('08:00'),
    miercolesFin: new FormControl('18:30'),
    juevesInicio: new FormControl('08:00'),
    juevesFin: new FormControl('18:30'),
    viernesInicio: new FormControl('08:00'),
    viernesFin: new FormControl('18:30'),
    sabadoInicio: new FormControl('08:00'),
    sabadoFin: new FormControl('13:00'),
  });

  constructor(public auth: AuthService, private db: DatabaseService) {}

  ngOnInit(): void {
    if (this.auth.currentUser.rol !== 'especialista') return;
    this.db.getUsers().subscribe((respuesta: any) => {
      this.especialidades = respuesta.filter(
        (user: any) => user.uid === this.auth.currentUser.uid
      )[0].tiemposDisponibles;
      this.defaultAvailability = this.especialidades[0].tiemposDisponibles;
      this.selectedEspecialidad = this.especialidades[0].especialidad;

      this.setValues();
    });
  }

  setValues() {
    this.horariosForm.setValue({
      lunesInicio: this.defaultAvailability.lunes.inicio,
      lunesFin: this.defaultAvailability.lunes.fin,
      martesInicio: this.defaultAvailability.martes.inicio,
      martesFin: this.defaultAvailability.martes.fin,
      miercolesInicio: this.defaultAvailability.miercoles.inicio,
      miercolesFin: this.defaultAvailability.miercoles.fin,
      juevesInicio: this.defaultAvailability.jueves.inicio,
      juevesFin: this.defaultAvailability.jueves.fin,
      viernesInicio: this.defaultAvailability.viernes.inicio,
      viernesFin: this.defaultAvailability.viernes.fin,
      sabadoInicio: this.defaultAvailability.sabado.inicio,
      sabadoFin: this.defaultAvailability.sabado.fin,
    });
  }

  onChangeSelect(event: any) {
    this.selectedEspecialidad = event.target.value;
    this.defaultAvailability = this.especialidades.filter(
      (especialidad: any) => especialidad.especialidad === event.target.value
    )[0].tiemposDisponibles;
    this.setValues();
  }

  toggleMisHorarios() {
    this.showMisHorarios = !this.showMisHorarios;
    this.isModifying = false;
  }

  guardarHorarios() {
    const horarios = this.especialidades.map((especialidad: any) => {
      if (especialidad.especialidad === this.selectedEspecialidad) {
        return {
          especialidad: especialidad.especialidad,
          tiemposDisponibles: {
            lunes: {
              inicio: this.horariosForm.value.lunesInicio,
              fin: this.horariosForm.value.lunesFin,
            },
            martes: {
              inicio: this.horariosForm.value.martesInicio,
              fin: this.horariosForm.value.martesFin,
            },
            miercoles: {
              inicio: this.horariosForm.value.miercolesInicio,
              fin: this.horariosForm.value.miercolesFin,
            },
            jueves: {
              inicio: this.horariosForm.value.juevesInicio,
              fin: this.horariosForm.value.juevesFin,
            },
            viernes: {
              inicio: this.horariosForm.value.viernesInicio,
              fin: this.horariosForm.value.viernesFin,
            },
            sabado: {
              inicio: this.horariosForm.value.sabadoInicio,
              fin: this.horariosForm.value.sabadoFin,
            },
          },
        };
      } else return especialidad;
    });

    this.db.guardarHorarios(this.auth.currentUser.uid, horarios);
    this.isModifying = false;
  }

  modificarHorarios() {
    this.isModifying = true;
  }
}
