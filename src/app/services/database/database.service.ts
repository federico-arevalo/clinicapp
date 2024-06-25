import { Injectable } from '@angular/core';
import {
  collection,
  Firestore,
  collectionData,
  doc,
  updateDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  constructor(private firestore: Firestore) {}

  saveEspecialidades(especialidades: any) {
    updateDoc(doc(this.firestore, 'utils', 'especialidades'), {
      especialidades,
    });
  }

  getEspecialidades() {
    return collectionData(collection(this.firestore, 'utils'));
  }

  getUserInfo(userId: string) {
    return collectionData(collection(this.firestore, `users/${userId}`));
  }
}
