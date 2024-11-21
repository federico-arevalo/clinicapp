import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-appointment-scheduler-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointment-scheduler-component.component.html',
  styleUrl: './appointment-scheduler-component.component.scss',
})
export class AppointmentSchedulerComponentComponent implements OnInit {
  availability = {
    lunes: { inicio: '08:00', fin: '18:30' },
    martes: { inicio: '08:00', fin: '18:30' },
    miercoles: { inicio: '08:00', fin: '18:30' },
    jueves: { inicio: '08:00', fin: '18:30' },
    viernes: { inicio: '08:00', fin: '18:30' },
    sabado: { inicio: '08:00', fin: '13:30' },
  };

  bookedAppointments: { date: string; time: string }[] = [
    { date: '2024-11-13', time: '10:30' }, // Example booked appointment
  ];

  intervals: { date: string; time: string; disabled: boolean }[] = [];

  selectedTurno: any;

  constructor() {}

  ngOnInit(): void {
    this.generateIntervalsForTwoWeeks();
  }

  generateIntervalsForTwoWeeks() {
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

      const availability =
        this.availability[day as keyof typeof this.availability];
      if (availability) {
        const startTime = new Date(
          date.toISOString().split('T')[0] + 'T' + availability.inicio
        );
        const endTime = new Date(
          date.toISOString().split('T')[0] + 'T' + availability.fin
        );

        while (startTime < endTime) {
          const timeString = startTime.toTimeString().slice(0, 5);
          const isBooked = this.bookedAppointments.some(
            (appt) =>
              appt.date === date.toISOString().split('T')[0] &&
              appt.time === timeString
          );

          intervals.push({
            date: date.toISOString().split('T')[0].slice(5),
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

    console.log('Appointment requested for:', interval);
    // Save the appointment request to Firestore or handle accordingly
    this.selectedTurno = interval;
    console.log(this.selectedTurno);
  }
}
