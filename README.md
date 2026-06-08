# Fotaza 
¡Bienvenidos a **Fotaza**! Una aplicacion web desarrolada como un proyecto integrador para la materia Programación Web 2

## Instalación y configuración
Segui estos pasos para clonar y ejecutar el proyecto localmente:

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
Para testaer las funcionalidades de autenticación podes iniciar sesión con los siguientes usuarios genrados por el script de inicialización
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
