# Usar imagem oficial do Node.js
FROM node:18

# Diretório de trabalho dentro do container
WORKDIR /app

# Copiar package.json e package-lock.json (se existir)
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar todo o restante do código para dentro do container
COPY . .

# Expõe a porta padrão do Next.js (3000)
EXPOSE 3000

# Comando para rodar o Next.js no modo dev
CMD ["npm", "run", "dev"]
