export interface Turno {
  id: string;
  especialista: string;
  especialidad: string;
  date: string;
  time: string;
  estado: 'Pendiente' | 'Realizado' | 'Cancelado' | 'En curso' | 'Rechazado';
  review: string;
  atencion: number;
}
