import { Injectable } from '@angular/core';
import {
  collection,
  Firestore,
  collectionData,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import { collection as col } from 'firebase/firestore';
import { Storage, ref, listAll, getDownloadURL } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  constructor(private firestore: Firestore, private storage: Storage) {}

  saveEspecialidades(especialidades: any) {
    updateDoc(doc(this.firestore, 'utils', 'especialidades'), {
      especialidades,
    });
  }

  getEspecialidades() {
    return collectionData(collection(this.firestore, 'utils'));
  }

  getEspecialistas() {
    return collectionData(collection(this.firestore, 'users'));
  }

  getPacientes() {
    return collectionData(collection(this.firestore, 'users'));
  }

  getUsers() {
    return collectionData(collection(this.firestore, `users`));
  }

  getLoginLogs() {
    const logins = collection(this.firestore, 'logins');
    return collectionData(logins, { idField: 'id' });
  }

  toggleUser(id: string, usuario: any) {
    const vehiculoRef = doc(this.firestore, 'users', id);
    updateDoc(vehiculoRef, {
      adminVerified: !usuario.adminVerified,
    });
  }

  guardarHorarios(id: string, horarios: any) {
    const usersRef = doc(this.firestore, 'users', id);
    updateDoc(usersRef, {
      tiemposDisponibles: horarios,
    });
  }

  getUserImages(userId: string) {
    const imagesRef = ref(this.storage, `images/${userId}`);
    const imagesUrl: string[] = [];

    listAll(imagesRef)
      .then(async (images) => {
        for (let image of images.items) {
          const url = await getDownloadURL(image);
          imagesUrl.push(url);
        }
      })
      .catch((err) => console.log(err));
    return imagesUrl;
  }

  async getUserImageById(userId: string): Promise<string[]> {
    const imageFolderPath = `images/${userId}`;
    const folderRef = ref(this.storage, imageFolderPath);
    let listResult = await listAll(folderRef);
    const imageUrlPromises = listResult.items.map((item) =>
      getDownloadURL(item)
    );
    const productImageUrls = await Promise.all(imageUrlPromises);

    return productImageUrls;
  }
}
