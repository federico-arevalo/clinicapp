import { Component, ElementRef } from '@angular/core';
import { DatabaseService } from '../../services/database/database.service';
import * as XLSX from 'xlsx';
import { TurnosService } from '../../services/turnos/turnos.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-informes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './informes.component.html',
  styleUrl: './informes.component.scss',
})
export class InformesComponent {
  logIngresos: any[] = [];
  turnos: any[] = [];
  especialistas: any[] = [];
  especialidades: any[] = [];

  constructor(
    private db: DatabaseService,
    private turnosService: TurnosService,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.fetchLogIngresos();
    this.fetchTurnos();
    this.fetchEspecialistas();
    this.fetchEspecialidades();
  }

  fetchLogIngresos() {
    this.db.getLoginLogs().subscribe((logins: any) => {
      const logIngresos = logins.map((login: any) => {
        return {
          name: login.name,
          fechaHora: new Date(login.fecha * 1000).toLocaleString(),
        };
      });
      this.logIngresos = logIngresos;
    });
  }

  fetchTurnos() {
    this.turnosService.getTurnos().subscribe((turnos: any) => {
      this.turnos = turnos;
    });
  }

  fetchEspecialistas() {
    this.db.getUsers().subscribe((respuesta: any) => {
      this.especialistas = respuesta.filter(
        (user: any) => user.rol === 'especialista'
      );
    });
  }

  fetchEspecialidades() {
    this.db.getEspecialidades().subscribe((respuesta: any) => {
      console.log(respuesta);
      this.especialidades = respuesta[0].especialidades;
    });
  }

  descargarIngresosExcel(): void {
    // const logs = this.logIngresos.map((log: any) => {
    //   return {
    //     nombre: log.name,
    //     fechaHora: log.fechaHora,
    //   };
    // });

    // const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(logs);

    // const wb: XLSX.WorkBook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, 'Ingresos');

    // XLSX.writeFile(wb, 'ingresos.xlsx');

    console.log(this.logIngresos);
    console.log(this.turnos);
    console.log(this.especialistas);
    console.log(this.especialidades);
  }

  getCantidadTurnos(especialidad: string) {
    return this.turnos.filter(
      (turno: any) => turno.especialidad === especialidad
    ).length;
  }
}
