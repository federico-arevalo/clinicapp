import { Component } from '@angular/core';
import { DatabaseService } from '../../services/database/database.service';

@Component({
  selector: 'app-informes',
  standalone: true,
  imports: [],
  templateUrl: './informes.component.html',
  styleUrl: './informes.component.scss',
})
export class InformesComponent {
  logIngresos: any[] = [];

  constructor(private db: DatabaseService) {}

  ngOnInit() {
    this.fetchLogIngresos();
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
    });
  }
}
