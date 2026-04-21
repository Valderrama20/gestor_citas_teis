# Usamos la imagen oficial de MariaDB como base
FROM mariadb:latest

# Metadatos (Opcional)
LABEL maintainer="IES TEIS Project"
LABEL description="Imagen personalizada para el Gestor de Citas del IES TEIS"

# Copiamos los archivos SQL a la carpeta especial de MariaDB.
# Los archivos en esta carpeta se ejecutan automáticamente 
# la primera vez que se levanta el contenedor.
COPY ./init/ /docker-entrypoint-initdb.d/

# Exponemos el puerto estándar
EXPOSE 3306