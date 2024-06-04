interface User {
  name: string;
  lastname: string;
  age: string;
  dni: string;
  email: string;
  rol: string;
}

export interface Paciente extends User {
  obraSocial: string;
  firstProfilePicture: string;
  secondProfilePicture: string;
}

export interface Especialista extends User {
  especialidad: string[];
  profilePicture: string;
}

export interface Admin extends User {}
