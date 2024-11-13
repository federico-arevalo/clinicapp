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
import { Firestore } from '@angular/fire/firestore';
import { DatabaseService } from '../database/database.service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
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
    public firestore: Firestore
  ) {
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        if (!user.emailVerified) {
          this.afAuth.signOut();
          return;
        }

        this.userData = user;
        this.SetUserData(this.userData);
        const userInfo = JSON.stringify(this.userData);
        localStorage.setItem('user', userInfo);
        JSON.parse(localStorage.getItem('user')!);
        this.router.navigate(['home']);

        this.subscriptions = this.db.getUsers().subscribe((users: any) => {
          let currentUser = users.filter(
            (user: any) => user.uid === JSON.parse(userInfo).uid
          )[0];
          localStorage.setItem('userInfo', JSON.stringify(currentUser));

          this.currentUser = currentUser;
        });

        this.userImages = this.db.getUserImages(this.userData.uid);
      } else {
        localStorage.setItem('user', 'null');
        localStorage.setItem('userInfo', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }
  // Sign in with email/password

  verifyIsAdminVerified(email: string) {
    let isAdminVerified = true;

    return getDocs(collection(this.firestore, 'users')).then((docs: any) => {
      docs.forEach((doc: any) => {
        const docData = doc.data();

        if (docData.email === email) {
          if (!docData.adminVerified && docData.rol === 'especialista')
            isAdminVerified = false;
        }
      });

      return isAdminVerified;
    });
  }

  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result: any) => {
        // this.ngZone.run(() => {
        //   this.router.navigate(['home']);
        // });
        // this.SetUserData(result.user);
        // this.router.navigate(['home']);
        if (!result.user.emailVerified) {
          return false;
        }
        console.log('pase igual');
        getDocs(collection(this.firestore, 'users')).then((docs: any) =>
          docs.forEach((doc: any) => {
            if (doc.data().uid === result.user.uid)
              // this.SetUserData({ ...doc.data() });
              localStorage.setItem('userInfo', JSON.stringify(doc.data()));
          })
        );
        this.router.navigateByUrl('/home');
        console.log(result);
        return true;
      });
  }
  // Sign up with email/password
  SignUp(
    email: string,
    password: string,
    userType: string,
    newUser: any,
    images: any
  ) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign
        up and returns promise */
        this.SendVerificationMail();
        console.log(result);
        this.SetUserDataType(result.user, userType, newUser, images);

        this.SignOut();
      });
  }
  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.currentUser.then((u: any) => u.sendEmailVerification());
  }
  // Reset Forggot password
  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        window.alert(error);
      });
  }
  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    // return user !== null && user.emailVerified !== false ? true : false;
    return user !== null;
  }
  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider()).then((res: any) => {
      if (res) {
        this.router.navigate(['dashboard']);
      }
    });
  }
  // Auth logic to run auth providers
  AuthLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['home']);
        });
        this.SetUserData(result.user);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true,
    });
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
            tiemposDisponibles: {
              lunes: { inicio: '08:00', fin: '19:00' },
              martes: { inicio: '08:00', fin: '19:00' },
              miercoles: { inicio: '08:00', fin: '19:00' },
              jueves: { inicio: '08:00', fin: '19:00' },
              viernes: { inicio: '08:00', fin: '19:00' },
              sabado: { inicio: '08:00', fin: '14:00' },
            },
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
    }

    return userRef
      .set(userType === 'paciente' ? newPaciente : newEspecialista, {
        merge: true,
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      localStorage.removeItem('userInfo');
      this.router.navigate(['login']);
    });
  }
}
