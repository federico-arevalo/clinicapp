import { Injectable, NgZone } from '@angular/core';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Storage, ref, uploadBytes } from '@angular/fire/storage';
import { collection, getDocs } from 'firebase/firestore';
import { addDoc, Firestore } from '@angular/fire/firestore';
import { DatabaseService } from '../database/database.service';
import { Subscription, firstValueFrom } from 'rxjs';
import * as newAuth from 'firebase/auth';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthAdminService {
  userData: any; // Save logged in user data
  error: any;
  isError: boolean = false;
  subscriptions?: Subscription;
  userImages: string[] = [];
  currentUser: any;

  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    private storage: Storage,
    private db: DatabaseService,
    public firestore: Firestore,
    private http: HttpClient
  ) {
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    // this.afAuth.authState.subscribe((user) => {
    // if (user) {
    //   if (!user.emailVerified) {
    //     this.afAuth.signOut();
    //     return;
    //   }
    //   this.userData = user;
    //   this.SetUserData(this.userData);
    //   const userInfo = JSON.stringify(this.userData);
    //   localStorage.setItem('user', userInfo);
    //   JSON.parse(localStorage.getItem('user')!);
    //   this.router.navigate(['home']);
    //   this.subscriptions = this.db.getUsers().subscribe((users: any) => {
    //     let currentUser = users.filter(
    //       (user: any) => user.uid === JSON.parse(userInfo).uid
    //     )[0];
    //     localStorage.setItem('userInfo', JSON.stringify(currentUser));
    //     this.currentUser = currentUser;
    //   });
    //   this.userImages = this.db.getUserImages(this.userData.uid);
    // } else {
    //   localStorage.setItem('user', 'null');
    //   localStorage.setItem('userInfo', 'null');
    //   JSON.parse(localStorage.getItem('user')!);
    // }
    // });
  }

  async crearNuevoUsuario(
    email: string,
    password: string,
    userType: string,
    newUser: any,
    images: any
  ): Promise<string> {
    const key = newAuth.getAuth().app.options.apiKey;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `key=${key}`,
    };

    // const url: string = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='${key}'`;
    const url: string =
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
      newAuth.getAuth().app.options.apiKey;

    const body = {
      email: email,
      password: password,
      returnSecureToken: true,
    };

    return firstValueFrom(this.http.post(url, body, { headers }))
      .then(async (response: any) => {
        const user = {
          uid: response.localId,
          email: email,
          emailVerified: false,
        };

        this.SetUserDataType(user, userType, newUser, images);
        return user.uid;
      })
      .catch((error: any) => {
        console.log(error);
        //console.log(error.error.error.message);
        return Promise.reject(console.log(error.code));
      });
  }

  SendVerificationMail() {
    return this.afAuth.currentUser.then((u: any) => u.sendEmailVerification());
  }

  SetUserDataType(user: any, userType: string, newUserData: any, images: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );

    const userData = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
    };

    let newPaciente = {};
    let newEspecialista = {};
    let newAdmin = {};

    if (userType === 'paciente') {
      let firstProfilePicturePath = '';
      let secondProfilePicturePath = '';

      let firstProfilePictureRef = ref(
        this.storage,
        `images/${
          user.uid
        }/firstProfilePicture.${images.firstProfilePicture.name
          .split('.')
          .pop()}`
      );
      let secondProfilePictureRef = ref(
        this.storage,
        `images/${
          user.uid
        }/secondProfilePicture.${images.secondProfilePicture.name
          .split('.')
          .pop()}`
      );

      uploadBytes(firstProfilePictureRef, images.firstProfilePicture)
        .then((data) => {
          console.log(data);
          firstProfilePicturePath = data.metadata.fullPath;

          uploadBytes(secondProfilePictureRef, images.secondProfilePicture)
            .then((data) => {
              console.log(data);
              secondProfilePicturePath = data.metadata.fullPath;

              newPaciente = {
                ...userData,
                name: newUserData.name,
                lastName: newUserData.lastName,
                age: newUserData.age,
                dni: newUserData.dni,
                obraSocial: newUserData.obraSocial,
                firstProfilePicture: firstProfilePicturePath,
                secondProfilePicture: secondProfilePicturePath,
                rol: userType,
              };

              this.userData = newPaciente;

              userRef
                .set(newPaciente, {
                  merge: true,
                })
                .catch((error) => {
                  console.log(error);
                });
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (userType === 'especialista') {
      let profilePictureRef = ref(
        this.storage,
        `images/${user.uid}/profilePicture.${images.profilePicture.name
          .split('.')
          .pop()}`
      );

      uploadBytes(profilePictureRef, images.profilePicture)
        .then((data) => {
          console.log(data);

          newEspecialista = {
            ...userData,
            name: newUserData.name,
            lastName: newUserData.lastName,
            age: newUserData.age,
            dni: newUserData.dni,
            especialidad: newUserData.especialidad,
            profilePicture: data.metadata.fullPath,
            rol: userType,
            tiemposDisponibles: newUserData.especialidad.map(
              (especialidad: any) => {
                return {
                  especialidad: especialidad,
                  tiemposDisponibles: {
                    lunes: { inicio: '08:00', fin: '18:30' },
                    martes: { inicio: '08:00', fin: '18:30' },
                    miercoles: { inicio: '08:00', fin: '18:30' },
                    jueves: { inicio: '08:00', fin: '18:30' },
                    viernes: { inicio: '08:00', fin: '18:30' },
                    sabado: { inicio: '08:00', fin: '13:30' },
                  },
                };
              }
            ),
          };

          this.userData = newEspecialista;

          userRef
            .set(newEspecialista, {
              merge: true,
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (userType === 'admin') {
      let profilePictureRef = ref(
        this.storage,
        `images/${user.uid}/profilePicture.${images.profilePicture.name
          .split('.')
          .pop()}`
      );

      uploadBytes(profilePictureRef, images.profilePicture)
        .then((data) => {
          console.log(data);

          newAdmin = {
            ...userData,
            name: newUserData.name,
            lastName: newUserData.lastName,
            age: newUserData.age,
            dni: newUserData.dni,
            profilePicture: data.metadata.fullPath,
            rol: userType,
          };

          this.userData = newAdmin;

          userRef
            .set(newAdmin, {
              merge: true,
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    }

    return userRef
      .set(
        userType === 'paciente'
          ? newPaciente
          : userType === 'admin'
          ? newAdmin
          : newEspecialista,
        {
          merge: true,
        }
      )
      .catch((error) => {
        console.log(error);
      });
  }
}
