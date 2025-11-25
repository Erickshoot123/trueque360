# TRUEQUE360 - Guía de Deploy en Render

## Backend Deploy (Node.js + Express + MongoDB)

### Requisitos previos
- Cuenta en [Render.com](https://render.com)
- MongoDB Atlas configurado (la BD ya existe)
- Frontend deployado (o URL planificada)

### Pasos para deployar el Backend

#### 1. Preparar el repositorio
- Asegúrate de que `backend/package.json` existe con el script `"start": "node server.js"`
- Verifica que `.env.example` esté en `backend/` (documento de variables requeridas)
- Los cambios ya están en `main` branch (commit hecho)

#### 2. Conectar con Render
1. Accede a [https://dashboard.render.com](https://dashboard.render.com)
2. Haz clic en **"New +"** → **"Web Service"**
3. Selecciona **"Deploy an existing project from a Git repository"**
4. Conecta tu repositorio GitHub (Erickshoot123/trueque360)
5. Selecciona **"trueque360"** como repositorio

#### 3. Configurar el servicio
- **Name**: `trueque360-backend` (o el nombre que prefieras)
- **Region**: Selecciona la más cercana (ej: Frankfurt, N. Virginia)
- **Branch**: `main`
- **Runtime**: `Node`
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`
- **Plan**: Selecciona según necesidad (free o pagado)

#### 4. Configurar Variables de Entorno
En Render, ve a **"Environment"** y añade:

```
PORT = 3000
NODE_ENV = production
DATABASE_URL = mongodb+srv://eryallanospe_db_user:TEv5OkZCavlv76WS@gestion-de-proyectos.fimlllb.mongodb.net/trueque360?retryWrites=true&w=majority
JWT_SECRET = CLAVETRUEQUE360SUPERSECRETA1234567890
CLIENT_URL = https://tu-frontend-url.onrender.com  (o Vercel/Netlify)
```

⚠️ **IMPORTANTE**: Cambiar `JWT_SECRET` a una clave más segura en producción.

#### 5. Deploy
- Haz clic en **"Create Web Service"**
- Render comenzará el build automáticamente
- Una vez completado, recibirás una URL: `https://trueque360-backend.onrender.com`

#### 6. Verificar que funciona
```bash
curl https://trueque360-backend.onrender.com/api/auth/health
# Debería responder 200 OK o indicar que falta ruta /health
```

---

## Frontend Deploy (React + Vite)

### Recomendaciones
- **Vercel** (recomendado para Next.js, pero también funciona con Vite)
- **Netlify** (excelente para aplicaciones estáticas/SPA)
- **Render** (para todo en un mismo lugar)

### Paso rápido para Vercel
1. Accede a [vercel.com](https://vercel.com)
2. Conecta tu repositorio
3. Configura:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Añade variable de entorno (si es necesaria en cliente)
5. Deploy

---

## Checklist Pre-Deploy

- [ ] `.env.example` existe en `backend/`
- [ ] `package.json` tiene `"start": "node server.js"`
- [ ] `app.js` tiene CORS configurado correctamente
- [ ] `db.js` usa `process.env.DATABASE_URL`
- [ ] Todos los cambios están en `main` branch y pusheados
- [ ] MongoDB Atlas está accesible (sin restricciones de IP)
- [ ] JWT_SECRET está configurado en Render

---

## Solución de Problemas

### Build falla: "Cannot find module"
- Verifica que `npm install` se ejecute en el directorio correcto
- En Render, usa: `cd backend && npm install`

### Error de conexión a MongoDB
- Verifica que `DATABASE_URL` es correcta
- Whitelist la IP de Render en MongoDB Atlas: `0.0.0.0/0` (no recomendado en producción)

### CORS error desde frontend
- Asegúrate de que `CLIENT_URL` coincide con la URL del frontend deployado
- Verifica que los headers `Authorization` están permitidos

### Puerto 3000 no disponible
- En Render, este puerto se asigna automáticamente; no necesitas cambiar nada
- Express escuchará en `process.env.PORT || 3000`

---

## Variables de Entorno Seguras

Para producción, generar una clave JWT segura:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Resultado: usar este valor en `JWT_SECRET` en Render.

---

**Después del deploy**: Actualiza `CLIENT_URL` en el backend si cambias la URL del frontend.
