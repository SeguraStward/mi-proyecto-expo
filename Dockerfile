# Usamos Node 20 (LTS) en Debian slim para evitar problemas de DNS con Alpine
FROM node:20-slim

# Permite inyectar un DNS al momento de build si usas --build-arg DNS=... (se usa junto a build --network=host)
ARG DNS=8.8.8.8

# Actualizamos índice de paquetes e instalamos dependencias básicas del sistema
RUN apt-get update \
	&& apt-get install -y --no-install-recommends bash \
	&& rm -rf /var/lib/apt/lists/*

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos de dependencias primero (para aprovechar la caché de Docker)
COPY package.json package-lock.json* ./

# Instalamos las dependencias del proyecto (incluye expo como CLI local)
RUN npm install

# Exponemos los puertos necesarios para Expo
# 8081: Metro Bundler
# 19000-19002: Puertos clásicos de Expo (por si acaso)
EXPOSE 8081 19000 19001 19002

CMD ["bash"]
