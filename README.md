# Aplicación ClinicApp

Esta es una aplicación web desarrollada con Angular y Firebase/Firestore, diseñada para que una clínica gestione citas entre pacientes y especialistas. La aplicación permite a los usuarios registrarse, iniciar sesión y solicitar citas con especialistas según su disponibilidad y especialidad. También hay un rol de administrador para la gestión de usuarios.

## Tabla de Contenidos

- [Características](#características)
- [Páginas](#páginas)
  - [Página de Inicio](#página-de-inicio)
  - [Página de Inicio de Sesión](#página-de-inicio-de-sesión)
  - [Página de Registro](#página-de-registro)
  - [Página de Mis Citas](#página-de-mis-citas)
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

### Página de Inicio de Sesión

La página de inicio de sesión permite a los usuarios acceder a la aplicación ingresando sus credenciales. Solo los usuarios registrados pueden iniciar sesión, con autenticación manejada a través de Firebase.

### Página de Registro

En esta página, los nuevos usuarios pueden crear una cuenta proporcionando la información necesaria. Los usuarios pueden elegir registrarse como **paciente** o **especialista**. Los pacientes podrán solicitar citas, mientras que los especialistas podrán aceptar o rechazar estas solicitudes según su disponibilidad.

### Página de Mis Citas

Esta página muestra la información de las citas del usuario:
- **Para Pacientes:** Ver citas programadas, pendientes y pasadas con especialistas. Los pacientes también pueden solicitar nuevas citas según los horarios y especialidades disponibles.
- **Para Especialistas:** Ver y gestionar citas solicitadas por pacientes. Los especialistas pueden marcar citas como completadas o cancelarlas.

### Página de Usuarios (Solo Administrador)

Esta página es accesible solo para administradores. Aquí, los administradores pueden ver y gestionar a todos los usuarios en el sistema, incluyendo pacientes y especialistas. Los administradores pueden actualizar la información de los usuarios, restablecer contraseñas o desactivar cuentas si es necesario.

### Página de Mi Información

Esta página muestra la información personal de cada usuario.
- **Pacientes y Especialistas:** Pueden ver y editar sus propios detalles, como nombre, información de contacto, especialidad (para especialistas) y otros detalles de perfil.

## Tecnologías Utilizadas

- **Angular**: Framework frontend para construir la interfaz de usuario.
- **Firebase Authentication**: Para manejar el registro de usuarios, inicio de sesión y acceso basado en roles.
- **Firebase Firestore**: Base de datos para almacenar de manera segura información de usuarios, citas e información de administradores.
- **Angular Material**: Para componentes de interfaz de usuario y estilos.

## Instalación y Configuración

1. **Clonar el Repositorio**  
   ```bash
   git clone <repository-url>
   cd clinic-app
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

Este README proporciona una visión general del propósito de la aplicación, su estructura y las instrucciones de configuración. Para una documentación más detallada, consulta los comentarios dentro del código y los archivos de configuración.
