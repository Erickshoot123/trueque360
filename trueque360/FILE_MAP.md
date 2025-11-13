# 📍 Mapa de Archivos - Sistema de Chat

## 📚 Documentación (En la raíz del proyecto)

```
d:\Marisa\trueque360\trueque360\
├── QUICK_START.md                    ← ⭐ COMIENZA AQUÍ
├── README_CHAT_SYSTEM.md             ← Resumen visual del sistema
├── CHAT_SYSTEM_DOCUMENTATION.md      ← Documentación completa
├── CHAT_SYSTEM_TESTING.md            ← Guía de testing
└── IMPLEMENTATION_CHECKLIST.md       ← Checklist de implementación
```

---

## 🔙 Backend

### Controladores (Lógica de Negocio)
```
backend/controllers/
├── conversationController.js
│   ├── createConversation()           ← Crear/obtener conversación
│   ├── getUserConversations()         ← Ver todas las conversaciones del usuario
│   ├── getConversationById()          ← Obtener una específica
│   └── getOtherParticipant()          ← Obtener el otro participante
│
├── messageController.js
│   ├── createMessage()                ← Crear/enviar mensaje
│   ├── getMessagesByConversation()    ← Obtener todos los mensajes
│   └── getLastMessage()               ← Obtener el último para preview
│
├── articleController.js               (sin cambios)
└── authControllers.js                 (sin cambios)
```

**Ubicación:** `d:\Marisa\trueque360\trueque360\backend\controllers\`

---

### Rutas (Endpoints)
```
backend/routes/
├── conversationRoutes.js
│   ├── POST /api/conversations                      ← Crear conversación
│   ├── GET /api/conversations                       ← Obtener conversaciones
│   ├── GET /api/conversations/:id                   ← Obtener una específica
│   └── GET /api/conversations/:id/other-participant ← Otro participante
│
├── messageRoutes.js
│   ├── POST /api/messages                           ← Enviar mensaje
│   ├── GET /api/messages/conversation/:id           ← Obtener mensajes
│   └── GET /api/messages/last/:id                   ← Último mensaje
│
├── articleRoutes.js                   (sin cambios)
└── authRoutes.js                      (sin cambios)
```

**Ubicación:** `d:\Marisa\trueque360\trueque360\backend\routes\`

---

### Modelos (Esquemas de BD)
```
backend/models/
├── Conversation.js                   (sin cambios)
│   └── Schema: { participants: [UserId], timestamps }
│
├── Message.js                        (sin cambios)
│   └── Schema: { conversationId, sender, receiver, content, timestamps }
│
├── User.js                           (sin cambios)
├── Article.js                        (sin cambios)
└── ...
```

**Ubicación:** `d:\Marisa\trueque360\trueque360\backend\models\`

---

### Configuración
```
backend/
├── app.js                             ← ACTUALIZADO (rutas de chat)
├── server.js
├── db.js
└── package.json
```

**Cambios en app.js:**
- Línea ~4: Importar `conversationRoutes`
- Línea ~5: Importar `messageRoutes`
- Línea ~15-17: Montar nuevas rutas

**Ubicación:** `d:\Marisa\trueque360\trueque360\backend\app.js`

---

## 🎨 Frontend

### Componentes - Chat System
```
frontend/src/components/

ChatInitiator/
├── ChatInitiator.jsx                 ← Modal para iniciar conversación
└── ChatInitiator.css                 ← Estilos del modal

MessageTab/
├── MessageTab.jsx                    ← Página de conversaciones
└── MessageTab.css                    ← Estilos de página
```

**Ubicación:** 
- `d:\Marisa\trueque360\trueque360\frontend\src\components\ChatInitiator\`
- `d:\Marisa\trueque360\trueque360\frontend\src\components\MessageTab\`

---

### Componentes - Actualizados
```
frontend/src/components/

ArticleDetail/
├── ArticleDetail.jsx                 ← ACTUALIZADO (botón Contactar)
└── ArticleDetail.css                 ← ACTUALIZADO (estilos botón)

Dashboard/
└── Dashboard.jsx                      (sin cambios, ya tiene link a /messages)
```

**Cambios en ArticleDetail.jsx:**
- Línea 3: Importar `ChatInitiator`
- Línea 15: Agregar estado `showChatInitiator`
- Líneas ~140-165: Botón "Contactar" y modal

**Cambios en ArticleDetail.css:**
- Líneas ~130-145: Estilos para `.contact-button`

**Ubicación:** `d:\Marisa\trueque360\trueque360\frontend\src\components\ArticleDetail\`

---

### Rutas - App
```
frontend/src/

App.jsx                              ← ACTUALIZADO (ruta /messages)
├── Línea 11: Importar MessageTab
└── Líneas ~80-90: Agregar ruta /messages
```

**Ubicación:** `d:\Marisa\trueque360\trueque360\frontend\src\App.jsx`

---

## 📊 Dependencias

### Backend (Sin cambios - ya están)
```javascript
// package.json ya tiene:
{
  "express": "^4.x.x",
  "mongoose": "^7.x.x",
  "cors": "^2.x.x",
  "dotenv": "^16.x.x",
  "express-validator": "^7.x.x",
  "jsonwebtoken": "^9.x.x"
}
```

### Frontend (Sin cambios - ya están)
```javascript
// package.json ya tiene:
{
  "react": "^18.x.x",
  "react-dom": "^18.x.x",
  "react-router-dom": "^6.x.x"
}
```

---

## 🔗 Flujo de Archivo a Archivo

### 1. Usuario hace clic en "Contactar"
```
ArticleDetail.jsx
  ↓ (onClick handler)
setShowChatInitiator(true)
  ↓ (renderiza conditionally)
ChatInitiator.jsx
```

### 2. Usuario envía mensaje
```
ChatInitiator.jsx (handleSendMessage)
  ↓ (POST /api/conversations)
conversationController.js (createConversation)
  ↓ (guarda en MongoDB)
Conversation document creado
  ↓ (POST /api/messages)
messageController.js (createMessage)
  ↓ (guarda en MongoDB)
Message document creado
  ↓ (callback onSuccess)
ChatInitiator.jsx (cierra modal)
```

### 3. Usuario ve conversaciones
```
Dashboard.jsx (link "Mensajes")
  ↓ (navega a /messages)
App.jsx (ruta /messages)
  ↓ (renderiza PrivateRoute)
MessageTab.jsx
  ↓ (useEffect, GET /api/conversations)
conversationController.js (getUserConversations)
  ↓ (obtiene de MongoDB)
Conversaciones mostradas
```

### 4. Usuario ve mensajes específicos
```
MessageTab.jsx (selecciona conversación)
  ↓ (onClick handler)
setSelectedConversation()
  ↓ (useEffect detecta cambio)
GET /api/messages/conversation/:id
  ↓ (messageController.js)
getMessagesByConversation()
  ↓ (obtiene de MongoDB, ordenado)
Mensajes mostrados
```

### 5. Usuario envía nuevo mensaje
```
MessageTab.jsx (handleSendMessage)
  ↓ (form submission)
POST /api/messages
  ↓ (messageController.js)
createMessage()
  ↓ (guarda en MongoDB)
Message creado
  ↓ (actualiza estado local)
Nuevo mensaje aparece en pantalla
```

---

## 🔐 Flujo de Autenticación

```
Todos los endpoints requieren JWT token:

1. Login exitoso → token generado (authControllers.js)
2. Token guardado en sessionStorage (frontend)
3. Para cada request de chat:
   - Frontend: Header Authorization: Bearer <token>
   - Backend: Middleware verifyToken valida
   - Si válido: req.user.id disponible en controllers
   - Si inválido: error 401 Unauthorized
```

**Archivos relacionados:**
- Backend: `backend/middleware/authMiddleware.js`
- Frontend: `sessionStorage.getItem('token')`

---

## 📈 Flujo de Datos (Completo)

```
┌──────────────┐
│   Frontend   │
└──────┬───────┘
       │
       │ 1. POST /api/conversations { participantId }
       ↓
┌──────────────────────────────────┐
│         Express Server           │
│    (backend/app.js)              │
│                                  │
│ Rutas registradas:              │
│ - /api/conversations            │
│ - /api/messages                 │
└──────────┬───────────────────────┘
           │
           │ 2. Verifica token (authMiddleware)
           ↓
┌──────────────────────────────────┐
│      conversationController      │
│                                  │
│ - Validar datos                 │
│ - Buscar Conversation existente │
│ - Crear si no existe            │
└──────────┬───────────────────────┘
           │
           │ 3. Guardar/buscar en BD
           ↓
┌──────────────────────────────────┐
│      MongoDB Database            │
│                                  │
│ Collections:                    │
│ - conversations                 │
│ - messages                      │
│ - users                         │
│ - articles                      │
└──────────┬───────────────────────┘
           │
           │ 4. Retorna datos
           ↓
┌──────────────────────────────────┐
│      conversationController      │
│                                  │
│ - Poblar referencias (populate) │
│ - Retornar JSON                 │
└──────────┬───────────────────────┘
           │
           │ 5. Respuesta HTTP
           ↓
┌──────────────────────────────────┐
│      Express (app.js)            │
│                                  │
│ res.status(200).json({ ... })   │
└──────────┬───────────────────────┘
           │
           │ 6. Frontend recibe JSON
           ↓
┌──────────────────────────────────┐
│      MessageTab.jsx              │
│                                  │
│ - fetch response.json()         │
│ - setConversations(data)        │
│ - Re-render componente          │
└──────────────────────────────────┘
```

---

## 🎯 Puntos de Entrada

### Para Usuarios
1. **Iniciar chat**: `ArticleDetail` → botón "💬 Contactar"
2. **Ver conversaciones**: `Dashboard` → sidebar "✉️ Mensajes" → `/messages`
3. **Responder mensaje**: `MessageTab` → seleccionar conversación

### Para Desarrolladores
1. **Lógica de chat**: `backend/controllers/conversationController.js` y `messageController.js`
2. **API endpoints**: `backend/routes/conversationRoutes.js` y `messageRoutes.js`
3. **UI principal**: `frontend/components/MessageTab/MessageTab.jsx`
4. **UI modal**: `frontend/components/ChatInitiator/ChatInitiator.jsx`

---

## 🐛 Debugging - Dónde Mirar

| Problema | Archivo |
|----------|---------|
| Backend no inicia | `backend/app.js` y `backend/server.js` |
| Rutas no funcionan | `backend/routes/*.js` |
| Datos no guardan | `backend/controllers/*.js` y `backend/models/*.js` |
| Frontend no muestra | `frontend/src/components/MessageTab/MessageTab.jsx` |
| Modal no abre | `frontend/src/components/ArticleDetail/ArticleDetail.jsx` |
| Botón Contactar no aparece | `frontend/src/components/ArticleDetail/ArticleDetail.jsx` línea ~140 |
| Estilos rotos | `frontend/src/components/*/MessageTab.css` y `ChatInitiator.css` |

---

## 📞 Contacto Rápido

- **Token inválido?** → Re-loguea
- **Mensajes no envían?** → Mira consola backend (npm start terminal)
- **UI broken?** → Revisa F12 Console del navegador
- **BD no conecta?** → Verifica MongoDB en `backend/db.js`

---

## ✅ Checklist de Archivos

### Backend
- ✅ `backend/controllers/conversationController.js` (nuevo)
- ✅ `backend/controllers/messageController.js` (nuevo)
- ✅ `backend/routes/conversationRoutes.js` (nuevo)
- ✅ `backend/routes/messageRoutes.js` (nuevo)
- ✅ `backend/app.js` (actualizado)

### Frontend
- ✅ `frontend/src/components/ChatInitiator/ChatInitiator.jsx` (nuevo)
- ✅ `frontend/src/components/ChatInitiator/ChatInitiator.css` (nuevo)
- ✅ `frontend/src/components/MessageTab/MessageTab.jsx` (nuevo)
- ✅ `frontend/src/components/MessageTab/MessageTab.css` (nuevo)
- ✅ `frontend/src/components/ArticleDetail/ArticleDetail.jsx` (actualizado)
- ✅ `frontend/src/components/ArticleDetail/ArticleDetail.css` (actualizado)
- ✅ `frontend/src/App.jsx` (actualizado)

### Documentación
- ✅ `QUICK_START.md`
- ✅ `README_CHAT_SYSTEM.md`
- ✅ `CHAT_SYSTEM_DOCUMENTATION.md`
- ✅ `CHAT_SYSTEM_TESTING.md`
- ✅ `IMPLEMENTATION_CHECKLIST.md`
- ✅ `FILE_MAP.md` (este archivo)

---

¡Mapa completo del sistema de chat! 🗺️
