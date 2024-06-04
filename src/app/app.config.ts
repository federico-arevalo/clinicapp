import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';

const firebase = {
  projectId: 'federico-arevalo-clinica',
  appId: '1:269601454300:web:e0da7befbcb72b17c35c19',
  storageBucket: 'federico-arevalo-clinica.appspot.com',
  apiKey: 'AIzaSyBjeqlFV2nWdUtMbxmRsgJlZRyOkCI3FbY',
  authDomain: 'federico-arevalo-clinica.firebaseapp.com',
  messagingSenderId: '269601454300',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    { provide: FIREBASE_OPTIONS, useValue: firebase },
  ],
};
