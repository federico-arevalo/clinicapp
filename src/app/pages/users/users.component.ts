import { Component } from '@angular/core';
import { DatabaseService } from '../../services/database/database.service';
import { CommonModule } from '@angular/common';
import { IsVerifiedDirective } from '../../directives/is-verified.directive';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  users: any;
  allUsers: any;
  imagesUrl: string[] = [];
  fileName = 'usuarios.xlsx';

  userList = [
    {
      id: 1,

      name: 'Leanne Graham',

      username: 'Bret',

      email: 'Sincere@april.biz',
    },

    {
      id: 2,

      name: 'Ervin Howell',

      username: 'Antonette',

      email: 'Shanna@melissa.tv',
    },

    {
      id: 3,

      name: 'Clementine Bauch',

      username: 'Samantha',

      email: 'Nathan@yesenia.net',
    },

    {
      id: 4,

      name: 'Patricia Lebsack',

      username: 'Karianne',

      email: 'Julianne.OConner@kory.org',
    },

    {
      id: 5,

      name: 'Chelsey Dietrich',

      username: 'Kamren',

      email: 'Lucio_Hettinger@annie.ca',
    },
  ];

  constructor(private dbService: DatabaseService) {}

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
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, this.fileName);
  }
}
