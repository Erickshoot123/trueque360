# RENDER DEPLOY - PASOS PARA ARREGLARLO

## El problema
Render guardó la configuración anterior (busca en `/src/`). El `render.yaml` no actualiza servicios existentes.

## Solución: Eliminar y recrear

### Paso 1: En Render Dashboard
1. Ve a tu servicio `trueque360-backend`
2. **Settings** → Scroll al final → **Delete Service**
3. Confirma eliminación

### Paso 2: Crear nuevo servicio
1. **New +** → **Web Service**
2. **Build and deploy from a Git repository**
3. Conecta: `Erickshoot123/trueque360`

### Paso 3: Render debería detectar `render.yaml`
- Si lo detecta, verás un mensaje: "Using render.yaml"
- Render usará la configuración correcta automáticamente

### Paso 4: Si NO lo detecta automáticamente
Configura manualmente:

| Campo | Valor |
|-------|-------|
| **Name** | trueque360-backend |
| **Environment** | Node |
| **Region** | Frankfurt |
| **Branch** | main |
| **Build Command** | cd backend && npm install --production |
| **Start Command** | cd backend && npm start |

### Paso 5: Environment Variables
Añade en **Environment**:
```
PORT=3000
NODE_ENV=production
DATABASE_URL=mongodb+srv://eryallanospe_db_user:TEv5OkZCavlv76WS@gestion-de-proyectos.fimlllb.mongodb.net/trueque360?retryWrites=true&w=majority
JWT_SECRET=CLAVETRUEQUE360SUPERSECRETA1234567890
CLIENT_URL=http://localhost:5173
```

### Paso 6: Deploy
- Haz clic en **Create Web Service**
- Espera a que termine el build

---

## ¿Por qué pasó esto?
Render almacena configuración en su base de datos, no lee `render.yaml` si ya existe un servicio.
El `render.yaml` solo se usa para nuevos servicios creados desde cero.

Después de eliminar y recrear, Render debería leer el `render.yaml` correctamente.
