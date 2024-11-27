import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import { Turno } from '../../interfaces/turno/turno';

@Injectable({
  providedIn: 'root',
})
export class TurnosService {
  constructor(private firestore: Firestore) {}

  saveTurno(turno: Turno) {
    addDoc(collection(this.firestore, 'turnos'), turno);
  }

  getTurnos() {
    return collectionData(collection(this.firestore, 'turnos'), {
      idField: 'id',
    });
  }

  aceptarTurno(id: string) {
    const turnosRef = doc(this.firestore, 'turnos', id);
    updateDoc(turnosRef, {
      estado: 'Aceptado',
    });
  }

  calificarAtencion(id: string, atencion: string) {
    const turnosRef = doc(this.firestore, 'turnos', id);
    updateDoc(turnosRef, {
      atencion: atencion,
    });
  }

  finalizarTurno(id: string, estado: string, comentario: string) {
    const turnosRef = doc(this.firestore, 'turnos', id);
    updateDoc(turnosRef, {
      estado: estado,
      review: comentario,
    });
  }

  guardarHistoriaClinica(id: string, historiaClinica: any) {
    const turnosRef = doc(this.firestore, 'turnos', id);
    updateDoc(turnosRef, {
      historiaClinica: historiaClinica,
    });
  }

  modificarTurno(id: string, estado: string, comentario: string) {
    const turnosRef = doc(this.firestore, 'turnos', id);
    updateDoc(turnosRef, {
      estado: estado,
      comentario: comentario ? comentario : '',
    });
  }
}
