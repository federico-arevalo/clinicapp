import { Component } from '@angular/core';
import { DatabaseService } from '../../services/database/database.service';
import { CommonModule } from '@angular/common';
import { IsVerifiedDirective } from '../../directives/isVerified/is-verified.directive';
import * as XLSX from 'xlsx';
import { TurnosService } from '../../services/turnos/turnos.service';
import { CreateNewUsersComponent } from '../../components/create-new-users/create-new-users.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, IsVerifiedDirective, CreateNewUsersComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  users: any;
  allUsers: any;
  imagesUrl: string[] = [];
  turnos: any;

  userList = 'users';

  constructor(
    private dbService: DatabaseService,
    private turnosService: TurnosService
  ) {}

  ngOnInit(): void {
    this.dbService.getUsers().subscribe((users: any) => {
      this.allUsers = users;
      this.users = users.filter((user: any) => user.rol === 'especialista');
      this.users.map((user: any) => {
        this.dbService.getUserImageById(user.uid).then((imagesUrl) => {
          user.profilePicture = imagesUrl;
        });
      });
    });

    this.turnosService.getTurnos().subscribe((turnos: any) => {
      this.turnos = turnos;
    });
  }

  toggleAdmin(user: any) {
    this.dbService.toggleUser(user.uid, user);
  }

  descargarExcel(): void {
    const filteredUsers = this.allUsers.map((user: any) => {
      return {
        edad: user.age,
        nombre: user.name,
        apellido: user.lastName,
        dni: user.dni,
        email: user.email,
        rol: user.rol,
        obraSocial: user.obraSocial ? user.obraSocial : 'N/A',
        especialidad: user.especialidad ? user.especialidad.join('; ') : 'N/A',
        hablitado: user.adminVerified ? 'Habilitado' : 'Deshabilitado',
      };
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredUsers);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Usuarios');

    XLSX.writeFile(wb, 'usuarios.xlsx');
  }

  descargarInfoTurnos(user: any) {
    const filteredTurnos = this.turnos
      .filter((turno: any) => turno.especialista.uid === user.uid)
      .map((turno: any) => {
        return {
          fecha: turno.date,
          hora: turno.time,
          paciente: turno.paciente.fullName,
          especialidad: turno.especialidad,
          comentario: turno.comentario,
          reseña: turno.review,
          estado: turno.estado,
        };
      });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredTurnos);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Turnos');

    XLSX.writeFile(wb, 'infoTurnos.xlsx');
  }

  changeUserList(type: string) {
    this.userList = type;
  }
}
