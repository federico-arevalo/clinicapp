export interface Turno {
  id: string;
  especialista: { uid: string; fullName: string };
  especialidad: string;
  paciente: { uid: string; fullName: string };
  date: string;
  time: string;
  estado: 'Pendiente' | 'Realizado' | 'Cancelado' | 'Aceptado' | 'Rechazado';
  review: string;
  comentario: string;
  atencion: string;
  historiaClinica:
    | {
        altura: number;
        peso: number;
        temperatura: number;
        presion: number;
        camposDinamicos: any;
        camposEspeciales: any;
      }
    | {};
}
