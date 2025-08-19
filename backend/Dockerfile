# שלב 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# העתקת package files
COPY package*.json ./

# התקנת כל התלויות (כולל dev)
RUN npm install

# העתקת קוד מקור
COPY . .

# בניית הפרויקט
RUN npm run build

# שלב 2: Production
FROM node:18-alpine AS production

WORKDIR /app

# העתקת package files
COPY package*.json ./

# התקנת production dependencies בלבד
RUN npm install --omit=dev

# העתקת הקוד הבנוי משלב הבניה
COPY --from=builder /app/dist ./dist

# חשיפת פורט
EXPOSE $PORT

# הפעלת השרת
CMD ["npm", "start"]