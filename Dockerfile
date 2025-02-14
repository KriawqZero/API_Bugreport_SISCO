# Estágio de build
FROM node:18 AS builder

WORKDIR /app

# RUN apk add --no-cache openssl
RUN apt-get install openssl

# Copia os arquivos de dependências
COPY package.json yarn.lock ./

# Instala as dependências (incluindo Prisma)
RUN yarn install --frozen-lockfile

# Copia o restante do código
COPY . .

# Gera o Prisma Client e aplica as migrations
RUN npx prisma generate
# RUN npx prisma migrate reset -f

# Compila o projeto (se necessário)
RUN yarn build

# Estágio de produção
FROM node:18

WORKDIR /app

# Copia arquivos necessários
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/.env ./.env
COPY --from=builder /app/uploads ./uploads

# Expõe a porta
EXPOSE 3000

COPY .env .env

# Comando de inicialização
CMD ["yarn", "start:prod"]
