# Fotaza 
¡Bienvenidos a **Fotaza**! Una aplicacion web desarrollada como un proyecto integrador para la materia Programación Web 2

## Instalación y configuración
Seguí estos pasos para clonar y ejecutar el proyecto localmente:

### 1.Clonar el repositorio
git@github.com:alcarazfatima/proyectoIntegrador.git

### 2.Instalar las dependencias
Instala todos los paquetes necesarios declarados en el package.json
- **npm install**

### 3.Configurar las variables de entorno
Crea un archivo llamado .env en la raiz del proyecto basandote en el archivo .env.example. Completa las credenciales con los datos de tu base de datos de PostgreSQL:
- PORT=3000
- DB_NAME=tu_nombre_de_base_de_datos
- DB_USER=tu_usuario
- DB_PASSWORD=tu_contraseña
- DB_HOST=localhost
- DB_PORT=5432

## Inicialización de Base de Datos 
El proyecto cuanta con un script automatizado que sincroniza los modelos de Sequelize, genera la estructura de las tablas con sus correspondientres restricciones de integridad e inserta datos iniciales de prueba (usuarios, publicaciones, imagenes y comentarios).
Para inicializar o resetear la base de datos a su estado inicial, ejecutar el comando:
- **npm run db:init**

## Ejecución del proyecto
Una vez configurada la base de datos podes levantar el servidor con el comando 
- **npm start**

## Credenciales de prueba
Para testaer las funcionalidades de autenticación podes iniciar sesión con los siguientes usuarios generados por el script de inicialización
- Usuario 1
  - email: fatima@fotaza.com
  - contraseña: fatima
- Usuario 2 
  - email: martin@fotaza.com
  - contraseña: martin

## Tecnologias utilizadas
- Backend: Node.js, Express,js, Express-session
- Base de Datos  y ORM: PostgreSQL, Sequelize
- Frontend: Pug, Bootstrap
- Seguridad: Bcrypt
- Gestion de archivos: Multer

## 🚀 Desafíos Técnicos y Soluciones (Deployment)

El despliegue de **Fotaza** presentó varios retos técnicos que sirvieron como un gran proceso de aprendizaje en la gestión de entornos productivos, control de versiones y administración de recursos en la nube:

### 1. Configuración de Entornos y Git Tracking (Vercel)
* **Dificultad:** Inicialmente, durante el despliegue en Vercel, surgieron complicaciones al mapear correctamente las variables de entorno de la base de datos de Neon. Además, el backend experimentaba un conflicto de tracking en el control de versiones, donde el servidor escuchaba y compilaba los cambios en simultáneo tanto de la rama `master` como de la rama de producción.
* **Solución:** Se aislaron las ramas de forma estricta y, para evitar que la plataforma siguiera compilando de forma automática los commits de desarrollo, se modificó el archivo de configuración deshabilitando explícitamente el despliegue en la rama de desarrollo:
  ```json
  "git": {
      "deploymentEnabled": {
          "master": false
      }
  }

### 2. Gestión de Sesiones y Migración a Render
* **Dificultad:** Una vez resuelto el despliegue en Vercel, se detectó un comportamiento inestable en la persistencia de las sesiones: el usuario se deslogueaba automáticamente de forma intermitente al navegar entre las distintas vistas dinámicas de Pug.
* **Solución:** Tras diagnosticar que el problema persistía por la arquitectura de contenedores de la plataforma inicial, se tomó la decisión estratégica de migrar el servidor web a **Render**. Esta migración solucionó por completo el manejo de sesiones de Express, garantizando una navegación fluida y segura.

### 3. Optimización de Almacenamiento en la Base de Datos (Neon)
* **Dificultad:** Al cumplir con el requerimiento de la cátedra de almacenar las imágenes como archivos binarios mediante datos de tipo `BYTEA`, la tasa de transferencia de datos de la base de datos gratuita en Neon llegó rápidamente a su límite crítico de cuota durante las pruebas de carga intensivas, interrumpiendo el servicio.
* **Solución:** Se generó una nueva instancia limpia de la base de datos en Neon PostgreSQL.

## URL servidor 
https://proyectointegrador-7xsy.onrender.com
