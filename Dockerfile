# Stage 1
FROM node:14.20 as builder

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2
FROM node:14-alpine

WORKDIR /app

RUN apk add --no-cache libc6-compat gcompat

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
# ADD  /src/public ./src/public
COPY --from=builder /app/.env* ./

ENV NODE_ENV=dev

EXPOSE 2567

CMD [ "npm", "run", "start:prod" ]