import { Component } from '@angular/core';
import jsPDF from 'jspdf';
import { TurnosService } from '../../services/turnos/turnos.service';
import { AuthService } from '../../services/auth/auth.service';
// import html2canvas from 'html2canvas';

@Component({
  selector: 'app-download-historia-clinica',
  standalone: true,
  imports: [],
  templateUrl: './download-historia-clinica.component.html',
  styleUrl: './download-historia-clinica.component.scss',
})
export class DownloadHistoriaClinicaComponent {
  // FUNCTION APPROACH
  // paciente = {
  //   fullName: 'John Doe',
  //   historiaClinica: {
  //     altura: 170,
  //     peso: 70,
  //     temperatura: 36.5,
  //     presion: '120/80',
  //     camposDinamicos: [{ key: 'allergy', value: 'None' }],
  //     camposEspeciales: [
  //       { key: 'volume', value: 75, type: 'range' },
  //       { key: 'age', value: 42, type: 'number' },
  //       { key: 'isActive', value: true, type: 'switch' },
  //     ],
  //   },
  // };
  // // Download PDF function
  // async downloadPDF() {
  //   const doc = new jsPDF();
  //   const currentDate = new Date();
  //   const dateStr = currentDate.toLocaleDateString();
  //   const timeStr = currentDate.toLocaleTimeString();
  //   // Add the SVG logo
  //   const logoUrl =
  //     'https://www.svgrepo.com/show/206513/hospital-first-aid.svg';
  //   const logoImage = await this.getSVGAsImage(logoUrl);
  //   doc.addImage(logoImage, 'PNG', 10, 10, 30, 30); // Position (10,10), Width 30, Height 30
  //   doc.setFontSize(18);
  //   doc.text('ClinicApp', 50, 20); // Title
  //   doc.setFontSize(12);
  //   doc.text(`Date: ${dateStr}`, 50, 30);
  //   doc.text(`Time: ${timeStr}`, 50, 40);
  //   // Add patient and historiaClinica details
  //   let yPosition = 50;
  //   doc.setFontSize(14);
  //   doc.text(`Patient: ${this.paciente.fullName}`, 10, yPosition);
  //   yPosition += 10;
  //   doc.setFontSize(12);
  //   const historia = this.paciente.historiaClinica;
  //   // Add basic details
  //   doc.text(`Altura: ${historia.altura}`, 10, (yPosition += 10));
  //   doc.text(`Peso: ${historia.peso}`, 10, (yPosition += 10));
  //   doc.text(`Temperatura: ${historia.temperatura}`, 10, (yPosition += 10));
  //   doc.text(`Presión: ${historia.presion}`, 10, (yPosition += 10));
  //   // Add dynamic fields
  //   if (historia.camposDinamicos.length > 0) {
  //     doc.text('Campos Dinámicos:', 10, (yPosition += 10));
  //     historia.camposDinamicos.forEach((campo) => {
  //       doc.text(`- ${campo.key}: ${campo.value}`, 15, (yPosition += 10));
  //     });
  //   }
  //   // Add special fields
  //   if (historia.camposEspeciales.length > 0) {
  //     doc.text('Campos Especiales:', 10, (yPosition += 10));
  //     historia.camposEspeciales.forEach((campo) => {
  //       const value =
  //         campo.type === 'switch' ? (campo.value ? 'Yes' : 'No') : campo.value;
  //       doc.text(
  //         `- ${campo.key}: ${value} (${campo.type})`,
  //         15,
  //         (yPosition += 10)
  //       );
  //     });
  //   }
  //   // Save the PDF
  //   doc.save(`HistoriaClinica_${this.paciente.fullName}.pdf`);
  // }
  // // Utility to convert SVG to image for jsPDF
  // private async getSVGAsImage(svgUrl: string): Promise<string> {
  //   const response = await fetch(svgUrl);
  //   const svgText = await response.text();
  //   const svgBlob = new Blob([svgText], {
  //     type: 'image/svg+xml;charset=utf-8',
  //   });
  //   const svgUrlBlob = URL.createObjectURL(svgBlob);
  //   const img = new Image();
  //   img.src = svgUrlBlob;
  //   await new Promise((resolve) => (img.onload = resolve));
  //   const canvas = document.createElement('canvas');
  //   canvas.width = img.width;
  //   canvas.height = img.height;
  //   const ctx = canvas.getContext('2d');
  //   ctx?.drawImage(img, 0, 0);
  //   return canvas.toDataURL('image/png');
  // }
  // SECOND APPROACH
  // historiaClinica: any = {
  //   altura: 170,
  //   peso: 70,
  //   temperatura: 36.5,
  //   presion: '120/80',
  //   camposDinamicos: [{ key: 'allergy', value: 'none' }],
  //   camposEspeciales: [{ key: 'volume', value: 75, type: 'range' }],
  // };
  // async downloadPDF() {
  //   const pdf = new jsPDF();
  //   const logoUrl =
  //     'https://www.svgrepo.com/show/206513/hospital-first-aid.svg';
  //   const currentDate = new Date();
  //   // Add the logo
  //   const logoImage = await this.loadSvgAsBase64(logoUrl);
  //   if (logoImage) {
  //     pdf.addImage(logoImage, 'SVG', 10, 10, 30, 30); // X, Y, Width, Height
  //   }
  //   // Add title and date
  //   pdf.setFontSize(16);
  //   pdf.text('ClinicApp', 50, 20);
  //   pdf.setFontSize(12);
  //   pdf.text(`Date: ${currentDate.toLocaleDateString()}`, 50, 30);
  //   pdf.text(`Time: ${currentDate.toLocaleTimeString()}`, 50, 40);
  //   // Add historiaClinica content
  //   let yOffset = 50; // Start position for historiaClinica content
  //   pdf.setFontSize(14);
  //   pdf.text('Historia Clínica:', 10, yOffset);
  //   pdf.setFontSize(12);
  //   yOffset += 10;
  //   // Add each field from historiaClinica
  //   for (const [key, value] of Object.entries(this.historiaClinica)) {
  //     if (Array.isArray(value)) {
  //       // For arrays (e.g., camposDinamicos or camposEspeciales)
  //       pdf.text(`${key}:`, 10, yOffset);
  //       yOffset += 10;
  //       value.forEach((item: any) => {
  //         pdf.text(
  //           `  - ${item.key || ''}: ${item.value} ${
  //             item.type ? `(${item.type})` : ''
  //           }`,
  //           15,
  //           yOffset
  //         );
  //         yOffset += 10;
  //       });
  //     } else {
  //       // For simple fields
  //       pdf.text(`${key}: ${value}`, 10, yOffset);
  //       yOffset += 10;
  //     }
  //   }
  //   // Save the PDF
  //   pdf.save(`historia_clinica_${currentDate.toISOString().slice(0, 10)}.pdf`);
  // }
  // async loadSvgAsBase64(url: string): Promise<string | null> {
  //   try {
  //     const response = await fetch(url);
  //     const svgText = await response.text();
  //     return `data:image/svg+xml;base64,${btoa(svgText)}`;
  //   } catch (error) {
  //     console.error('Failed to load SVG:', error);
  //     return null;
  //   }
  // }
  turnos: any;

  constructor(
    private turnosService: TurnosService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.turnosService.getTurnos().subscribe((turnos: any) => {
      this.turnos = turnos
        .filter(
          (turno: any) =>
            turno.paciente.uid === this.authService.currentUser.uid
        )
        .map((turno: any) => {
          return {
            date: turno.date,
            time: turno.time,
            especialista: turno.especialista.fullName,
            especialidad: turno.especialidad,
            historiaClinica: turno.historiaClinica,
          };
        });
    });
  }

  downloadPDF() {
    const pdf = new jsPDF();
    const logoPath = '../../../assets/images/logoClinicapp.png'; // Path to the saved PNG
    const currentDate = new Date();

    let yOffset = 50; // Initial vertical offset
    const lineHeight = 10; // Spacing between lines
    const pageHeight = pdf.internal.pageSize.height; // Height of a single page

    let hasHistoriaClinica = false;

    // Add the logo
    pdf.addImage(logoPath, 'SVG', 10, 10, 30, 30);
    pdf.setFontSize(16);
    pdf.text('ClinicApp', 50, 20);
    pdf.setFontSize(12);
    pdf.text(`Fecha: ${currentDate.toLocaleDateString()}`, 50, 30);
    pdf.text(`Hora: ${currentDate.toLocaleTimeString()}`, 50, 40);
    yOffset += 40;

    pdf.setFontSize(14);
    pdf.text('Historias Clínicas:', 10, yOffset);
    yOffset += lineHeight;

    // Iterate through turnos
    this.turnos.forEach((turno: any, index: number) => {
      // Check if we need a new page
      if (yOffset + lineHeight > pageHeight - 10) {
        pdf.addPage();
        yOffset = 20; // Reset offset for the new page
      }

      if (Object.keys(turno.historiaClinica).length > 0) {
        hasHistoriaClinica = true;
        pdf.setFontSize(12);
        pdf.text(`Turno ${index + 1}:`, 10, yOffset);
        pdf.text(`Fecha: ${turno.date}`, 20, yOffset + 10);
        pdf.text(`Hora: ${turno.time}`, 20, yOffset + 20);
        pdf.text(`Especialista: ${turno.especialista}`, 20, yOffset + 30);
        pdf.text(`Especialidad: ${turno.especialidad}`, 20, yOffset + 40);
        yOffset += 50;

        for (const [key, value] of Object.entries(turno.historiaClinica)) {
          // Check if we need a new page
          if (yOffset + lineHeight > pageHeight - 10) {
            pdf.addPage();
            yOffset = 20;
          }

          if (Array.isArray(value)) {
            pdf.text(`${key}:`, 20, yOffset);
            yOffset += lineHeight;
            value.forEach((item: any) => {
              if (yOffset + lineHeight > pageHeight - 10) {
                pdf.addPage();
                yOffset = 20;
              }
              pdf.text(
                `  - ${item.key || ''}: ${item.value} ${
                  item.type ? `(${item.type})` : ''
                }`,
                25,
                yOffset
              );
              yOffset += lineHeight;
            });
          } else {
            pdf.text(`${key}: ${value}`, 20, yOffset);
            yOffset += lineHeight;
          }
        }
      } else {
        pdf.setFontSize(12);
        pdf.text(
          `Turno ${index + 1} - Fecha: ${turno.date} Hora: ${turno.time}`,
          10,
          yOffset
        );
        pdf.text('El turno no tiene historia clínica.', 20, yOffset + 10);
        yOffset += 20;
      }
    });

    if (!hasHistoriaClinica) {
      // If no historiaClinica exists for any turno
      pdf.setFontSize(12);
      pdf.text('No tiene ninguna historia clínica.', 10, yOffset);
    }

    pdf.save(
      `historias_clinicas_${currentDate.toISOString().slice(0, 10)}.pdf`
    );
  }
}
