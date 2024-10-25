import { Injectable } from '@angular/core';
import {
  collection,
  Firestore,
  collectionData,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
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

  getUserInfo(userId: string) {
    return collectionData(collection(this.firestore, `users/${userId}`));
  }

  getUsers() {
    return collectionData(collection(this.firestore, `users`));
  }

  getUserImages(userId: string) {
    const imagesRef = ref(this.storage, `images/${userId}`);
    const imagesUrl: string[] = [];

    listAll(imagesRef)
      .then(async (images) => {
        console.log(images);
        for (let image of images.items) {
          const url = await getDownloadURL(image);
          imagesUrl.push(url);
        }
      })
      .catch((err) => console.log(err));

    return imagesUrl;
  }
}
