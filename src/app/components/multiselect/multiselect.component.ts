import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DatabaseService } from '../../services/database/database.service';
import { Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-multiselect',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './multiselect.component.html',
  styleUrl: './multiselect.component.scss',
})
export class MultiselectComponent implements OnInit, OnDestroy {
  allEspecialidades: string[] = [];
  selectedEspecialidades: string[] = [];
  subscriptions?: Subscription;
  isHidden: boolean = true;

  @Output() newEspecialidadEvent = new EventEmitter<string[]>();

  constructor(private db: DatabaseService) {}

  removeEspecialidad(especialidad: string) {
    this.selectedEspecialidades;

    const index = this.selectedEspecialidades.indexOf(especialidad);
    if (index !== -1) this.selectedEspecialidades.splice(index, 1);

    this.newEspecialidadEvent.emit(this.selectedEspecialidades);
  }

  addEspecialidad($event: any) {
    let newEspecialidad = $event.target.value;

    if (!this.selectedEspecialidades.includes(newEspecialidad)) {
      this.selectedEspecialidades.push(newEspecialidad);
      console.log(this.selectedEspecialidades);

      if (!this.allEspecialidades.includes(newEspecialidad))
        this.db.saveEspecialidades([
          ...this.allEspecialidades,
          newEspecialidad,
        ]);
    }

    $event.target.value = '';
  }

  addSelectedEspecialidad(newEspecialidad: string) {
    if (!this.selectedEspecialidades.includes(newEspecialidad)) {
      this.selectedEspecialidades.push(newEspecialidad);
    }

    this.newEspecialidadEvent.emit(this.selectedEspecialidades);
  }

  ngOnInit() {
    this.subscriptions = this.db
      .getEspecialidades()
      .subscribe((respuesta: any) => {
        this.allEspecialidades = respuesta[0].especialidades;
      });
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }

  toggleHide() {
    this.isHidden = !this.isHidden;
  }
}
