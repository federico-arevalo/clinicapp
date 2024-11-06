import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  @Input() showModal: boolean = true;
  @Input() msg: string = 'Error';

  closeModal() {
    this.showModal = false;
  }
}
