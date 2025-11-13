# 💬 Sistema de Chat - Resumen Visual

## 🎯 Objetivo Completado

✅ Crear un sistema de chat entre usuarios donde:
- ✅ Hay una caja de texto para escribir un primer mensaje
- ✅ Hay un mensaje predeterminado: "¿Sigue disponible?"
- ✅ Después de enviar, la conversación aparece en "Mensajes" del Dashboard
- ✅ Se pueden seguir enviando mensajes desde la pestaña de Mensajes

---

## 📊 Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────────┐
│                    VISTA DE ARTÍCULO                         │
│  (ArticleDetail.jsx)                                        │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ Usuario hace clic en:
                        │ "💬 Contactar al Vendedor"
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              MODAL: CHATINIT IATOR                           │
│  (ChatInitiator.jsx)                                        │
│                                                              │
│  - Título: "Contactar a [Usuario]"                         │
│  - TextArea con mensaje predeterminado:                    │
│    "¿Sigue disponible?"                                    │
│  - Botones: [Cancelar] [Enviar Mensaje]                   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ Usuario hace clic en "Enviar Mensaje"
                        ▼
        ┌───────────────────────────────┐
        │   BACKEND: createConversation  │
        │   (conversationController.js)  │
        │                               │
        │ - Verifica si ya existe      │
        │   conversación               │
        │ - Si no, crea nueva          │
        └───────────┬───────────────────┘
                    │
                    ▼
        ┌───────────────────────────────┐
        │   BACKEND: createMessage      │
        │   (messageController.js)      │
        │                               │
        │ - Crea el primer mensaje     │
        │ - Guarda con sender/receiver │
        └───────────┬───────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│            ALMACENAMIENTO EN DB                             │
│  - Conversation creada con ambos participantes             │
│  - Message guardado en esa Conversation                    │
└─────────────────────────────────────────────────────────────┘
                    │
        ┌───────────┴────────────┐
        │                        │
        ▼ (Usuario A)            ▼ (Usuario B)
┌──────────────────┐     ┌──────────────────┐
│  Dashboard       │     │  Dashboard       │
│  ✉️ Mensajes     │     │  ✉️ Mensajes     │
│                  │     │                  │
│  Conversación    │     │  Conversación    │
│  con Usuario B   │     │  con Usuario A   │
└────────┬─────────┘     └────────┬─────────┘
         │                        │
         │ Hace clic en           │ Hace clic en
         │ conversación           │ conversación
         ▼                        ▼
┌──────────────────────────┐ ┌──────────────────────────┐
│  MESSAGETAB              │ │  MESSAGETAB              │
│  (MessageTab.jsx)        │ │  (MessageTab.jsx)        │
│                          │ │                          │
│  Mensaje de A:           │ │  Mensaje de A:           │
│  "¿Sigue disponible?"    │ │  "¿Sigue disponible?"    │
│                          │ │                          │
│  [TextArea] [Enviar]     │ │  Respuesta de B:         │
│                          │ │  "Sí, aún disponible"    │
│                          │ │                          │
│                          │ │  [TextArea] [Enviar]     │
└──────────────────────────┘ └──────────────────────────┘
```

---

## 📁 Archivos del Sistema

### Backend
```
backend/
├── controllers/
│   ├── conversationController.js     ← Lógica de conversaciones
│   ├── messageController.js          ← Lógica de mensajes
│   ├── articleController.js          (sin cambios)
│   └── authControllers.js            (sin cambios)
│
├── routes/
│   ├── conversationRoutes.js         ← Endpoints de conversaciones
│   ├── messageRoutes.js              ← Endpoints de mensajes
│   ├── articleRoutes.js              (sin cambios)
│   └── authRoutes.js                 (sin cambios)
│
├── models/
│   ├── Conversation.js               (sin cambios)
│   ├── Message.js                    (sin cambios)
│   ├── User.js                       (sin cambios)
│   ├── Article.js                    (sin cambios)
│   └── ...
│
└── app.js                            ← Actualizado con nuevas rutas
```

### Frontend
```
frontend/
├── src/
│   ├── components/
│   │   ├── ChatInitiator/
│   │   │   ├── ChatInitiator.jsx     ← Modal para iniciar chat
│   │   │   └── ChatInitiator.css
│   │   │
│   │   ├── MessageTab/
│   │   │   ├── MessageTab.jsx        ← Página principal de mensajes
│   │   │   └── MessageTab.css
│   │   │
│   │   ├── ArticleDetail/
│   │   │   ├── ArticleDetail.jsx     ← Actualizado con botón Contactar
│   │   │   └── ArticleDetail.css     ← Actualizado con estilos
│   │   │
│   │   ├── Dashboard/
│   │   │   └── Dashboard.jsx         (sin cambios, ya tiene link a /messages)
│   │   │
│   │   └── ...
│   │
│   └── App.jsx                       ← Actualizado con ruta /messages
```

---

## 🔌 API Endpoints

### Conversaciones
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/conversations` | Crear/obtener conversación | ✅ |
| GET | `/api/conversations` | Obtener conversaciones del usuario | ✅ |
| GET | `/api/conversations/:id` | Obtener conversación específica | ✅ |
| GET | `/api/conversations/:id/other-participant` | Obtener otro participante | ✅ |

### Mensajes
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/messages` | Crear mensaje | ✅ |
| GET | `/api/messages/conversation/:id` | Obtener mensajes de conversación | ✅ |
| GET | `/api/messages/last/:id` | Obtener último mensaje | ✅ |

---

## 🔄 Flujo de Datos

### 1. Iniciar Conversación
```
Frontend: ChatInitiator.jsx
   │
   ├── POST /api/conversations { participantId }
   │       ↓
   │   Backend: conversationController.createConversation()
   │       ↓
   │   Verificar si existe (MongoDB)
   │       ↓
   │   Crear o retornar existente
   │
   ├── POST /api/messages { conversationId, receiverId, content }
   │       ↓
   │   Backend: messageController.createMessage()
   │       ↓
   │   Guardar en MongoDB
   │
   └── Actualizar estado y mostrar confirmación
```

### 2. Ver Conversaciones
```
Frontend: MessageTab.jsx (página /messages)
   │
   ├── GET /api/conversations
   │       ↓
   │   Backend: conversationController.getUserConversations()
   │       ↓
   │   Obtener conversaciones del usuario (MongoDB)
   │       ↓
   │   Para cada conversación, obtener último mensaje
   │
   └── Renderizar lista de conversaciones
```

### 3. Ver Mensajes de Conversación
```
Frontend: MessageTab.jsx (al seleccionar conversación)
   │
   ├── GET /api/messages/conversation/:id
   │       ↓
   │   Backend: messageController.getMessagesByConversation()
   │       ↓
   │   Obtener todos los mensajes (MongoDB, ordenado por fecha)
   │
   └── Renderizar lista de mensajes ordenados por tiempo
```

### 4. Enviar Nuevo Mensaje
```
Frontend: MessageTab.jsx (formulario de entrada)
   │
   ├── POST /api/messages { conversationId, receiverId, content }
   │       ↓
   │   Backend: messageController.createMessage()
   │       ↓
   │   Guardar en MongoDB
   │
   └── Agregar mensaje a la lista local
```

---

## 🎨 Componentes y Props

### ChatInitiator.jsx
```jsx
<ChatInitiator
  articleOwner={{_id, username, ...}}  // Datos del dueño del artículo
  onClose={() => {}}                    // Función para cerrar modal
  onSuccess={() => {}}                  // Función al enviar exitosamente
/>
```

**Estados internos:**
- `message` - Contenido del mensaje
- `loading` - Indica si se está enviando
- `error` - Errores de envío

---

### MessageTab.jsx
```jsx
// Componente funcional, se renderiza en ruta /messages
// No necesita props
```

**Estados:**
- `conversations` - Lista de conversaciones del usuario
- `selectedConversation` - Conversación actualmente seleccionada
- `messages` - Mensajes de la conversación seleccionada
- `newMessage` - Contenido del nuevo mensaje
- `loading` - Cargando conversaciones
- `error` - Errores generales

---

## 🔐 Autenticación

Todos los endpoints requieren token JWT:
```
Authorization: Bearer <TOKEN>
```

El token se extrae de:
- Backend: Middleware `verifyToken` en `authMiddleware.js`
- Frontend: `sessionStorage.getItem('token')`

---

## 💾 Estructura de Base de Datos

### Conversation
```javascript
{
  _id: ObjectId,
  participants: [UserId, UserId],
  createdAt: Date,
  updatedAt: Date
}
```

### Message
```javascript
{
  _id: ObjectId,
  conversationId: ConversationId,
  sender: UserId,
  receiver: UserId,
  content: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## ✨ Características Implementadas

- ✅ Crear conversaciones entre dos usuarios
- ✅ Verificar si conversación ya existe (evita duplicados)
- ✅ Enviar mensajes con sender/receiver
- ✅ Obtener historial de conversaciones
- ✅ Obtener historial de mensajes ordenados
- ✅ Mensaje predeterminado "¿Sigue disponible?"
- ✅ Modal editable para personalizar mensaje
- ✅ Ui responsive para móvil
- ✅ Auto-scroll a último mensaje
- ✅ Protección de rutas privadas
- ✅ Validaciones en frontend y backend

---

## 🚀 Cómo Iniciar

### Backend
```bash
cd backend
npm install
npm start
# Servidor en http://localhost:3000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Servidor en http://localhost:5173
```

---

## 📝 Próximos Pasos (Opcionales)

1. **WebSocket (Socket.IO)**: Mensajes en tiempo real
2. **Notificaciones**: Sistema de notificaciones en tiempo real
3. **Typings**: Ver cuando el otro usuario está escribiendo
4. **Lectura**: Marcar mensajes como leídos
5. **Archivos**: Compartir imágenes/documentos
6. **Búsqueda**: Buscar en conversaciones
7. **Borrar**: Opción para borrar conversaciones/mensajes

---

## 🧪 Testing

Ver archivo: `CHAT_SYSTEM_TESTING.md`

Incluye:
- Curl commands para probar APIs
- Instrucciones para Postman
- Checklist de verificación

---

¡Sistema listo para usar! 🎉
