import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
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
    return collectionData(collection(this.firestore, 'turnos'));
  }
}
