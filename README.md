# Aplicación ClinicApp

Esta es una aplicación web desarrollada con Angular y Firebase/Firestore, diseñada para que una clínica gestione citas entre pacientes y especialistas. La aplicación permite a los usuarios registrarse, iniciar sesión y solicitar citas con especialistas según su disponibilidad y especialidad. También hay un rol de administrador para la gestión de usuarios.

## Tabla de Contenidos

- [Características](#características)
- [Páginas](#páginas)
  - [Página de Inicio](#página-de-inicio)
  - [Página de Inicio de Sesión](#página-de-inicio-de-sesión)
  - [Página de Registro](#página-de-registro)
  - [Página de Mis Turnos](#página-de-mis-turnos)
  - [Página de Usuarios (Solo Administrador)](#página-de-usuarios-solo-administrador)
  - [Página de Mi Información](#página-de-mi-información)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Instalación y Configuración](#instalación-y-configuración)

## Características

- Registro y autenticación de usuarios para pacientes y especialistas.
- Los pacientes pueden solicitar citas con especialistas disponibles.
- Los especialistas pueden gestionar y completar citas.
- Acceso de administrador para gestionar cuentas de usuarios.
- Base de datos segura con Firebase Firestore para almacenamiento de datos.

## Páginas

### Página de Inicio

Esta es la página inicial que introduce a los usuarios a la aplicación de la clínica. Aquí, los usuarios pueden navegar hacia el inicio de sesión o el registro, y conocer los servicios y el propósito de la clínica.

![image](https://github.com/user-attachments/assets/0fe5ae27-f1a8-47a5-9e6c-7b9da9d865a3)

### Página de Inicio de Sesión

La página de inicio de sesión permite a los usuarios acceder a la aplicación ingresando sus credenciales. Solo los usuarios registrados pueden iniciar sesión, con autenticación manejada a través de Firebase.

![image](https://github.com/user-attachments/assets/7dfc27fe-18ed-4f01-bb62-4ecea577ecc3)

### Página de Registro

En esta página, los nuevos usuarios pueden crear una cuenta proporcionando la información necesaria. Los usuarios pueden elegir registrarse como **paciente** o **especialista**. Los pacientes podrán solicitar citas, mientras que los especialistas podrán aceptar o rechazar estas solicitudes según su disponibilidad.

#### Formulario para especialistas

![image](https://github.com/user-attachments/assets/637196ac-5dc2-47f6-a277-b4d79f222dcd)

#### Formulario para pacientes

![image](https://github.com/user-attachments/assets/9575b2ef-aa8a-4ca0-8d2b-dfb0f00375f9)

### Página de Mis Turnos

Esta página muestra la información de los turnos del usuario:
- **Para Pacientes:** Ver citas programadas, pendientes y pasadas con especialistas. Los pacientes también pueden solicitar nuevas citas según los horarios y especialidades disponibles.

![image](https://github.com/user-attachments/assets/fa54ff1f-84e2-46cc-af70-fc629f65f559)

- **Para Especialistas:** Ver y gestionar citas solicitadas por pacientes. Los especialistas pueden marcar citas como completadas o cancelarlas.

falta imagen****

### Página de Usuarios (Solo Administrador)

Esta página es accesible solo para administradores. Aquí, los administradores pueden ver y gestionar a todos los usuarios en el sistema, incluyendo pacientes y especialistas. Los administradores pueden actualizar la información de los usuarios, restablecer contraseñas o desactivar cuentas si es necesario.

![image](https://github.com/user-attachments/assets/3677c84f-a8c6-4fe3-8da1-2d70cf52fa13)

### Página de Mi Información

Esta página muestra la información personal de cada usuario.
- **Pacientes y Especialistas:** Pueden ver sus propios detalles, como nombre, información de contacto, especialidad (para especialistas) y otros detalles de perfil.
- **Solo especialistas:** Pueden cambiar los horarios donde se encuentran disponibles.

![image](https://github.com/user-attachments/assets/814293e8-7057-4248-87d5-0ccd4268113e)

#### Mis horarios (solo para especialistas)

![image](https://github.com/user-attachments/assets/d933e507-5095-4c6c-9015-60a6c3a44fa8)

## Tecnologías Utilizadas

- **Angular**: Framework frontend para construir la interfaz de usuario.
- **Firebase Authentication**: Para manejar el registro de usuarios, inicio de sesión y acceso basado en roles.
- **Firebase Firestore**: Base de datos para almacenar de manera segura información de usuarios, citas e información de administradores.
- **Angular Material**: Para componentes de interfaz de usuario y estilos.

## Instalación y Configuración

1. **Clonar el Repositorio**  
   ```bash
   git clone https://github.com/federico-arevalo/clinicapp/
   cd clinicapp
   ```

2. **Instalar Dependencias**  
   ```bash
   npm install
   ```

3. **Configuración de Firebase**  
   - Configura un proyecto de Firebase en la Consola de Firebase.
   - Habilita Authentication y Firestore Database en tu proyecto de Firebase.
   - Copia tu configuración de Firebase en el archivo `environment.ts`.

4. **Ejecutar la Aplicación**  
   ```bash
   ng serve
   ```

5. **Acceder a la Aplicación**  
   Abre un navegador y ve a `http://localhost:4200`.

---
