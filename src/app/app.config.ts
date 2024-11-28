import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import {
  RECAPTCHA_SETTINGS,
  RECAPTCHA_V3_SITE_KEY,
  RecaptchaModule,
  RecaptchaSettings,
  ReCaptchaV3Service,
} from 'ng-recaptcha';
import { provideHttpClient } from '@angular/common/http';

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
    provideAnimations(),
    provideHttpClient(),
    provideAnimationsAsync(),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    { provide: FIREBASE_OPTIONS, useValue: firebase },
    importProvidersFrom(RecaptchaModule),
    // {
    //   provide: RECAPTCHA_V3_SITE_KEY,
    //   useValue: '6LfU43sqAAAAAD3Xla1f3kWSqQY2WwcoP7sKgg15',
    // },
    ReCaptchaV3Service,
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: '6LfU43sqAAAAAD3Xla1f3kWSqQY2WwcoP7sKgg15',
      } as RecaptchaSettings,
    },
  ],
};
