import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Turno } from '../../interfaces/turno/turno';
import { ShortDatePipe } from '../../pipes/short-date.pipe';
import { TurnosService } from '../../services/turnos/turnos.service';

@Component({
  selector: 'app-appointment-scheduler-component',
  standalone: true,
  imports: [CommonModule, ShortDatePipe],
  templateUrl: './appointment-scheduler-component.component.html',
  styleUrl: './appointment-scheduler-component.component.scss',
})
export class AppointmentSchedulerComponentComponent
  implements OnInit, OnChanges
{
  // availability = {
  //   lunes: { inicio: '08:00', fin: '18:30' },
  //   martes: { inicio: '08:00', fin: '18:30' },
  //   miercoles: { inicio: '08:00', fin: '18:30' },
  //   jueves: { inicio: '08:00', fin: '18:30' },
  //   viernes: { inicio: '08:00', fin: '18:30' },
  //   sabado: { inicio: '08:00', fin: '13:30' },
  // };

  @Input() especialidad!: any;
  @Input() especialista!: any;
  @Input() paciente!: any;

  @Output() turnoCreated = new EventEmitter<Turno>();

  bookedAppointments: { date: string; time: string }[] = [
    { date: '2024-11-13', time: '10:30' }, // Example booked appointment
  ];

  turnos!: Turno[];

  intervals: { date: string; time: string; disabled: boolean }[] = [];

  selectedTurno: any;

  constructor(private turnosService: TurnosService) {}

  ngOnInit(): void {
    this.generateIntervalsForTwoWeeks();
    this.turnosService.getTurnos().subscribe((turnos: any) => {
      console.log(turnos);
      this.turnos = turnos.map((turno: any) => {
        return {
          id: turno.id,
          date: turno.date,
          time: turno.time,
          review: turno.review,
          atencion: turno.atencion,
          estado: turno.estado,
          especialista: {
            uid: turno.especialista.uid,
            fullName: turno.especialista.fullName,
          },
          especialidad: turno.especialidad,
          comentario: turno.comentario,
        };
      });
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['especialidad'] || changes['especialista'])
      this.generateIntervalsForTwoWeeks();
  }

  generateIntervalsForTwoWeeks() {
    if (!this.especialista) return;

    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 2); // 2 weeks from today

    const intervals = [];

    for (
      let date = new Date(today);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      const day = date
        .toLocaleDateString('es-ES', { weekday: 'long' })
        .toLowerCase();
      if (day === 'domingo') continue; // Skip Sundays

      const availability = this.especialista.tiemposDisponibles[day];
      if (availability) {
        const startTime = new Date(
          date.toISOString().split('T')[0] + 'T' + availability.inicio
        );
        const endTime = new Date(
          date.toISOString().split('T')[0] + 'T' + availability.fin
        );

        while (startTime < endTime) {
          const timeString = startTime.toTimeString().slice(0, 5);
          const isBooked = this.turnos.some(
            (appt) =>
              appt.date === date.toISOString().split('T')[0] &&
              appt.time === timeString
          );

          intervals.push({
            // date: date.toISOString().split('T')[0].slice(5),
            date: date.toISOString().split('T')[0],
            time: timeString,
            disabled: isBooked,
          });

          startTime.setMinutes(startTime.getMinutes() + 30);
        }
      }
    }

    this.intervals = intervals;
  }

  requestAppointment(interval: {
    date: string;
    time: string;
    disabled: boolean;
  }) {
    if (interval.disabled) {
      alert('This slot is already taken!');
      return;
    }
    // Save the appointment request to Firestore or handle accordingly
    this.selectedTurno = interval;

    const turno: Turno = {
      id: '',
      date: interval.date,
      time: interval.time,
      review: '',
      atencion: 0,
      estado: 'Pendiente',
      especialista: {
        uid: this.especialista.uid,
        fullName: `${this.especialista.name} ${this.especialista.lastName}`,
      },
      especialidad: this.especialidad,
      comentario: '',
      paciente: this.paciente,
    };

    this.turnoCreated.emit(turno);
  }
}
