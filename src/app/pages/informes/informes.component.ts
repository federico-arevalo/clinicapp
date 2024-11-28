import { Component } from '@angular/core';
import { DatabaseService } from '../../services/database/database.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-informes',
  standalone: true,
  imports: [],
  templateUrl: './informes.component.html',
  styleUrl: './informes.component.scss',
})
export class InformesComponent {
  logIngresos: any[] = [];
  logIngresosChart: any;

  ctx = document.getElementById('logIngresosChart') as HTMLCanvasElement;

  constructor(private db: DatabaseService) {}

  ngOnInit() {
    this.fetchLogIngresos();
  }

  loadLogIngresos() {
    this.logIngresosChart = new Chart(this.ctx, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Log de ingresos',
            data: this.logIngresos.map((log: any) => ({
              x: new Date(log.fechaHora).getTime(),
              y: log.name, // Use numeric user ID
            })),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: 'time',
            title: {
              display: true,
              text: 'Fecha y Hora',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Usuarios',
            },
          },
        },
      },
    });
  }

  fetchLogIngresos() {
    this.db.getLoginLogs().subscribe((logins: any) => {
      const logIngresos = logins.map((login: any) => {
        return {
          name: login.name,
          fechaHora: login.fecha,
        };
      });
      this.logIngresos = logIngresos;
      this.loadLogIngresos();
    });
  }
}
