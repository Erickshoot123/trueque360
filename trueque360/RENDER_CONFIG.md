# RENDER DEPLOYMENT - CONFIGURACIÓN MANUAL

## El problema
Render no detectó correctamente la estructura del proyecto. Mostró error:
```
Could not read package.json: Error: ENOENT: no such file or directory, open '/opt/render/project/src/package.json'
```

Esto significa que Render está buscando en `/src/` cuando el backend está en `/backend/`.

## Solución: Configurar manualmente en Render Dashboard

### Opción A: Crear nuevo Web Service (Recomendado)

1. **Ve al Dashboard** → [https://dashboard.render.com](https://dashboard.render.com)

2. **Elimina el servicio anterior** (si quieres limpiar):
   - Settings → Delete Service

3. **Crea uno nuevo**:
   - Haz clic en **"New +"** → **"Web Service"**
   - Selecciona **"Build and deploy from a Git repository"**
   - Busca y conecta **`Erickshoot123/trueque360`**

4. **Configuración correcta**:

   | Campo | Valor |
   |-------|-------|
   | **Name** | `trueque360-backend` |
   | **Environment** | `Node` |
   | **Region** | Frankfurt, Europe (más cercana) |
   | **Branch** | `main` |
   | **Build Command** | `cd backend && npm install --production` |
   | **Start Command** | `cd backend && npm start` |
   | **Plan** | Free (o el que prefieras) |

5. **Scroll down → Environment**:
   - Añade estas variables:
   ```
   PORT = 3000
   NODE_ENV = production
   DATABASE_URL = mongodb+srv://eryallanospe_db_user:TEv5OkZCavlv76WS@gestion-de-proyectos.fimlllb.mongodb.net/trueque360?retryWrites=true&w=majority
   JWT_SECRET = CLAVETRUEQUE360SUPERSECRETA1234567890
   CLIENT_URL = http://localhost:5173
   ```

6. **Deploy**:
   - Haz clic en **"Create Web Service"**
   - Render comenzará el deploy

---

### Opción B: Si ya tienes un servicio creado (Editar existente)

1. **Ve al servicio** → `trueque360-backend`
2. **Settings** → Scroll down a **Build & Deploy**
3. **Edita estos campos**:
   - **Build Command**: `cd backend && npm install --production`
   - **Start Command**: `cd backend && npm start`
4. **Guardar**
5. **Redeploy**: Dashboard → Haz clic en **"Deploy"** → **"Redeploy latest commit"**

---

### Opción C: Usar archivo render.yaml (Automático)

Si quieres que Render use el archivo `render.yaml` automáticamente:

1. El archivo ya está en el repo (`render.yaml`)
2. Render lo debe detectar en el siguiente deploy
3. Si no lo detecta, puedes especificar en Settings:
   - **Render YAML Path**: `render.yaml`

---

## Verificación Post-Deploy

Una vez deployado, verifica que funciona:

```bash
# Reemplaza con tu URL de Render
curl https://trueque360-backend.onrender.com/api/auth/me
# Debería responder 401 (no hay token) o similar (no 502/503)

# O directamente desde el navegador
# https://trueque360-backend.onrender.com/
```

---

## Troubleshooting

### Error: "Could not read package.json"
- Verifica que **Build Command** incluye `cd backend`
- Verifica que **Start Command** también incluye `cd backend` o usa `rootDir: backend`

### Error: "Port already in use"
- Render asigna automáticamente un puerto via la variable `PORT` en la URL
- Express ya lee `process.env.PORT`, así que no hay problema

### Logs vacíos o sin conexión a BD
- Ve a **Logs** en Render Dashboard
- Verifica que `DATABASE_URL` está correcto
- Verifica que MongoDB Atlas permite IP `0.0.0.0/0` (en Database Access)

### CORS errors desde frontend
- Asegúrate de que `CLIENT_URL` en las variables de entorno coincide con tu frontend
- Actualiza `CLIENT_URL` cuando despliegues el frontend

---

## Próximo Paso

Una vez que el backend esté corriendo en Render:
1. Copia la URL del deployment (ej: `https://trueque360-backend.onrender.com`)
2. Actualiza `CLIENT_URL` en Render a esa URL
3. Despliega el frontend (Vercel, Netlify, etc.) con esta URL de API
