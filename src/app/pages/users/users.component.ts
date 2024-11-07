import { Component } from '@angular/core';
import { DatabaseService } from '../../services/database/database.service';
import { CommonModule } from '@angular/common';
import { IsVerifiedDirective } from '../../directives/is-verified.directive';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, IsVerifiedDirective],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  users: any;
  imagesUrl: string[] = [];

  constructor(private dbService: DatabaseService) {}

  ngOnInit(): void {
    this.dbService.getUsers().subscribe((users: any) => {
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
}
