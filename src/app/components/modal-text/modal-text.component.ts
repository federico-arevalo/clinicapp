import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-text',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-text.component.html',
  styleUrl: './modal-text.component.scss',
})
export class ModalTextComponent {
  @Input() showModal: boolean = false;
  @Input() accion: string = '';
  @Input() turnoId: string = '';
  @Input() msg: string = '';

  @Output() turnoDispatched = new EventEmitter<{
    texto: string | null;
    accion: string;
    id: string;
  }>();
  textArea: string = '';
  isMandatory: boolean = false;

  closeModal() {
    this.showModal = false;
  }

  cancelarTurno() {
    if (this.textArea === '') {
      this.isMandatory = true;
      return;
    }
    this.turnoDispatched.emit({
      texto: this.textArea,
      accion: this.accion,
      id: this.turnoId,
    });

    this.showModal = false;
  }
}
