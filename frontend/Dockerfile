# שלב 1: Build
FROM node:18-alpine as builder

WORKDIR /app

# העתקת package.json ו package-lock.json
COPY package*.json ./
RUN npm install

# העתקת קוד המקור
COPY . .

# בניית האפליקציה
RUN npm run build

# שלב 2: Production
FROM nginx:alpine

# העתקת הקבצים הבנויים לנינג'קס
COPY --from=builder /app/dist /usr/share/nginx/html

# העתקת הגדרות nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]