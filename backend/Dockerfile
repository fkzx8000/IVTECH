# משתמש ב-Node 18 Alpine לחיסכון במקום
FROM node:18-alpine

# הגדרת תיקיית העבודה
WORKDIR /app

# העתקת package.json ו package-lock.json
COPY package*.json ./

# התקנת dependencies
RUN npm install --only=production

# העתקת שאר הקוד
COPY . .

# בניית הפרויקט
RUN npm run build

# חשיפת פורט 3001
EXPOSE 3001

# הפעלת השרת
CMD ["npm", "start"]