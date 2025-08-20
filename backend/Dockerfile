# שלב 1: Build Backend
FROM node:18-alpine AS backend-builder

WORKDIR /app/backend

# העתקת package files של backend
COPY backend/package*.json ./

# התקנת כל התלויות
RUN npm install

# העתקת קוד המקור של backend
COPY backend/ .

# בניית Backend
RUN npm run build

# שלב 2: Build Frontend  
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# העתקת package files של frontend
COPY frontend/package*.json ./
RUN npm install

# העתקת קוד המקור של frontend
COPY frontend/ .

# בניית Frontend
RUN npm run build

# שלב 3: Production - Backend עם Static Files
FROM node:18-alpine AS production

WORKDIR /app

# העתקת package.json של backend
COPY backend/package*.json ./

# התקנת production dependencies בלבד
RUN npm install --omit=dev

# העתקת הקוד הבנוי של Backend
COPY --from=backend-builder /app/backend/dist ./dist

# העתקת הקבצים הבנויים של Frontend למיקום public
COPY --from=frontend-builder /app/frontend/dist ./public

# חשיפת פורט
EXPOSE 3001

# הגדרת משתני סביבה
ENV NODE_ENV=production
ENV PORT=3001

# הפעלת השרת
CMD ["npm", "start"]