import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-turnos-paciente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './turnos-paciente.component.html',
  styleUrl: './turnos-paciente.component.scss',
})
export class TurnosPacienteComponent {
  showForm: boolean = false;

  openDropdownIndex: number | null = null;

  openForm() {
    this.showForm = true;
  }

  cancelarTurno(id: string) {
    console.log(id);
    this.openDropdownIndex = null;
  }

  toggleDropdown(index: number) {
    this.openDropdownIndex = this.openDropdownIndex === index ? null : index;
  }
}
