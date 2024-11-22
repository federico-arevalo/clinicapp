export interface Turno {
  id: string;
  especialista: { uid: string; fullName: string };
  especialidad: string;
  paciente: string;
  date: string;
  time: string;
  estado: 'Pendiente' | 'Realizado' | 'Cancelado' | 'Aceptado' | 'Rechazado';
  review: string;
  comentario: string;
  atencion: number;
}
