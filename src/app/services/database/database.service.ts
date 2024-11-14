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

  toggleUser(id: string, usuario: any) {
    const vehiculoRef = doc(this.firestore, 'users', id);
    updateDoc(vehiculoRef, {
      adminVerified: !usuario.adminVerified,
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
