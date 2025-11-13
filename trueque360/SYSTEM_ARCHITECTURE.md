# 🏗️ Arquitectura del Sistema de Chat

## Diagrama General del Sistema

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            🌐 FRONTEND (React)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────┐         ┌────────────────────────────────────┐  │
│  │  ArticleDetail       │         │       Dashboard                    │  │
│  │  - Ver artículo      │         │  - Sidebar con navegación          │  │
│  │  - Info del dueño    │         │  - Link a "✉️ Mensajes"            │  │
│  │  - [💬 Contactar]◄──────────────→  - Ir a /messages                 │  │
│  └──────────┬───────────┘         └────────────┬─────────────────────┘  │
│             │                                    │                       │
│             │ onclick()                          │ navigate()            │
│             ▼                                    ▼                       │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  ChatInitiator (Modal)                                          │   │
│  │                                                                  │   │
│  │  ┌─────────────────────────────────────────────────────────┐  │   │
│  │  │ Contactar a [usuario]                           [✕]     │  │   │
│  │  ├─────────────────────────────────────────────────────────┤  │   │
│  │  │                                                         │  │   │
│  │  │  Tu mensaje inicial:                                  │  │   │
│  │  │  ┌─────────────────────────────────────────────────┐  │  │   │
│  │  │  │ ¿Sigue disponible?                              │  │  │   │
│  │  │  └─────────────────────────────────────────────────┘  │  │   │
│  │  │                                                         │  │   │
│  │  │  [Cancelar]                        [Enviar Mensaje]   │  │   │
│  │  │                                                         │  │   │
│  │  └─────────────────────────────────────────────────────────┘  │   │
│  └──────┬───────────────────────────────────────────────────────┘   │
│         │ onSubmit()                                                 │
│         ▼                                                            │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  fetch POST /api/conversations                               │  │
│  │  fetch POST /api/messages                                    │  │
│  └────────────────┬─────────────────────────────────────────────┘  │
│                   │                                                  │
│                   │ HTTP Requests (JSON)                             │
│                   ▼                                                  │
│
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  MessageTab (Página /messages)                               │  │
│  │                                                                │  │
│  │  ┌──────────────────┬──────────────────────────────────────┐ │  │
│  │  │ Conversaciones   │  Chat Area                          │ │  │
│  │  ├──────────────────┼──────────────────────────────────────┤ │  │
│  │  │                  │                                      │ │  │
│  │  │ 👤 Juan          │  Juan                               │ │  │
│  │  │ "¿Sigue..."      │  ──────────────────                 │ │  │
│  │  │                  │                                      │ │  │
│  │  │ 👤 Maria         │  📍 "¿Sigue disponible?"            │ │  │
│  │  │ "Hola Marisa..."│  📍 "Sí, ¿qué ofreces?"             │ │  │
│  │  │                  │                                      │ │  │
│  │  │ 👤 Pedro         │  ┌──────────────────────────────┐  │ │  │
│  │  │ "¿Aún tienes?"   │  │ Escribe un mensaje...    │  │ │  │
│  │  │                  │  └──────────────────────────────┘  │ │  │
│  │  │                  │  [Enviar]                         │ │  │
│  │  │                  │                                      │ │  │
│  │  └──────────────────┴──────────────────────────────────────┘ │  │
│  │                                                                │  │
│  │  fetch GET /api/conversations                               │  │
│  │  fetch GET /api/messages/conversation/:id                   │  │
│  │  fetch POST /api/messages                                   │  │
│  └────────────┬───────────────────────────────────────────────┘  │
│               │                                                   │
└───────────────┼───────────────────────────────────────────────────┘
                │ HTTP/REST
                │
┌───────────────┼───────────────────────────────────────────────────┐
│               ▼                                                   │
│     🔙 BACKEND (Node.js + Express)                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ app.js (Express Server)                                  ││
│  │                                                            ││
│  │ - Middleware: cors, express.json, authMiddleware        ││
│  │ - Rutas montadas:                                        ││
│  │   • /api/auth (login, register)                         ││
│  │   • /api/articles                                        ││
│  │   • /api/conversations  ◄──── NUEVA                     ││
│  │   • /api/messages  ◄──────── NUEVA                      ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌──────────────────────┐     ┌──────────────────────────────┐│
│  │ conversationRoutes   │     │ messageRoutes              ││
│  ├──────────────────────┤     ├──────────────────────────────┤│
│  │                      │     │                              ││
│  │ POST /                │     │ POST /                       ││
│  │ GET /                 │     │ GET /conversation/:id        ││
│  │ GET /:id              │     │ GET /last/:id                ││
│  │ GET /:id/other-part.. │     │                              ││
│  │                      │     │                              ││
│  └────────┬─────────────┘     └──────┬───────────────────────┘│
│           │                         │                        │
│           ▼                         ▼                        │
│  ┌───────────────────────────────────────────────────────────┐│
│  │ Controllers                                             ││
│  ├───────────────────────────────────────────────────────────┤│
│  │                                                            ││
│  │ conversationController.js  messageController.js          ││
│  │ ├─ createConversation()   ├─ createMessage()           ││
│  │ ├─ getUserConversations() ├─ getMessagesByConv()       ││
│  │ ├─ getConversationById()  ├─ getLastMessage()          ││
│  │ └─ getOtherParticipant()  └─                            ││
│  │                                                            ││
│  │ [Validaciones]  [Autenticación JWT]  [Errores]          ││
│  │                                                            ││
│  └────────────────┬─────────────────────────────────────────┘│
│                   │ Mongoose ODM                             │
│                   ▼                                          │
│  ┌───────────────────────────────────────────────────────────┐│
│  │ Models (Schemas)                                        ││
│  ├───────────────────────────────────────────────────────────┤│
│  │                                                            ││
│  │ Conversation.js      Message.js                          ││
│  │ ├─ _id              ├─ _id                              ││
│  │ ├─ participants:[]  ├─ conversationId (ref)             ││
│  │ ├─ createdAt        ├─ sender (ref)                     ││
│  │ └─ updatedAt        ├─ receiver (ref)                   ││
│  │                      ├─ content                          ││
│  │                      ├─ createdAt                        ││
│  │ User.js              └─ updatedAt                        ││
│  │ ├─ _id                                                   ││
│  │ ├─ username          Article.js                          ││
│  │ ├─ email             ├─ _id                             ││
│  │ ├─ password          ├─ owner (ref)                     ││
│  │ └─ role              ├─ title                           ││
│  │                      ├─ description                      ││
│  │                      ├─ category                         ││
│  │                      ├─ images                           ││
│  │                      └─ preferredItems                   ││
│  │                                                            ││
│  └────────────────┬─────────────────────────────────────────┘│
│                   │                                          │
│                   │ Driver Mongoose                          │
│                   ▼                                          │
└───────────────────┼──────────────────────────────────────────┘
                    │
                    │
┌───────────────────┼──────────────────────────────────────────┐
│                   ▼                                          │
│         💾 DATABASE (MongoDB)                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │ Database: "trueque360"                             │   │
│  ├────────────────────────────────────────────────────┤   │
│  │                                                     │   │
│  │ Collections:                                       │   │
│  │ • users                  (ya existía)             │   │
│  │ • articles               (ya existía)             │   │
│  │ • conversations  ◄────── (nuevo)                  │   │
│  │ • messages       ◄────── (nuevo)                  │   │
│  │                                                     │   │
│  └────────────────────────────────────────────────────┘   │
│                                                             │
│  Relaciones:                                              │
│  - Conversation → participants: [User._id]                │
│  - Message → conversationId: Conversation._id             │
│  - Message → sender: User._id                             │
│  - Message → receiver: User._id                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Flujo de Datos - Caso de Uso: Usuario A contacta Usuario B

```
PASO 1: Usuario A ve artículo y hace clic en "Contactar"
┌──────────────────────────────────────────┐
│ ArticleDetail.jsx                        │
│ onClick={() => setShowChatInitiator(true)}
│ render: <ChatInitiator ... />            │
└──────────────┬───────────────────────────┘

PASO 2: Modal se abre con mensaje predeterminado
┌──────────────────────────────────────────┐
│ ChatInitiator.jsx                        │
│ ┌────────────────────────────────────┐  │
│ │ Contactar a Usuario B          [✕] │  │
│ │                                     │  │
│ │ Tu mensaje:                        │  │
│ │ ┌──────────────────────────────┐   │  │
│ │ │ ¿Sigue disponible?           │   │  │
│ │ └──────────────────────────────┘   │  │
│ │                                     │  │
│ │ [Cancelar]   [Enviar Mensaje]      │  │
│ └────────────────────────────────────┘  │
└──────────────┬───────────────────────────┘

PASO 3: Usuario A envía mensaje
┌──────────────────────────────────────────┐
│ handleSendMessage()                      │
│                                          │
│ 1. POST /api/conversations               │
│    { participantId: UserId_B }           │
│                                          │
│    Backend: Verifica si existe           │
│    Si no existe → Crea nueva             │
│    Retorna: { _id: conversationId }      │
│                                          │
│ 2. POST /api/messages                    │
│    {                                     │
│      conversationId,                     │
│      receiverId: UserId_B,               │
│      content: "¿Sigue disponible?"       │
│    }                                     │
│                                          │
│    Backend: Crea mensaje en BD           │
│    Retorna: { _id, sender, receiver... } │
└──────────────┬───────────────────────────┘

PASO 4: Datos se guardan en MongoDB
┌──────────────────────────────────────────┐
│ MongoDB Collections                      │
│                                          │
│ conversations:                           │
│ {                                        │
│   _id: "conv123",                        │
│   participants: [UserId_A, UserId_B],    │
│   createdAt: ...,                        │
│   updatedAt: ...                         │
│ }                                        │
│                                          │
│ messages:                                │
│ {                                        │
│   _id: "msg456",                         │
│   conversationId: "conv123",             │
│   sender: UserId_A,                      │
│   receiver: UserId_B,                    │
│   content: "¿Sigue disponible?",         │
│   createdAt: ...,                        │
│   updatedAt: ...                         │
│ }                                        │
└──────────────┬───────────────────────────┘

PASO 5: Modal se cierra y muestra confirmación
┌──────────────────────────────────────────┐
│ Alert: "¡Mensaje enviado!                │
│  Ve a la sección de Mensajes para        │
│  continuar la conversación."             │
└──────────────┬───────────────────────────┘

PASO 6: Usuario A navega a /messages
┌──────────────────────────────────────────┐
│ Dashboard.jsx → Link to="/messages"      │
│ App.jsx → <Route path="/messages">       │
│ MessageTab.jsx se renderiza              │
└──────────────┬───────────────────────────┘

PASO 7: MessageTab carga conversaciones
┌──────────────────────────────────────────┐
│ useEffect → GET /api/conversations       │
│                                          │
│ Backend:                                 │
│ 1. Verifica token JWT                    │
│ 2. Obtiene conversations donde           │
│    participants include currentUserId    │
│ 3. Para cada conversation:               │
│    - Obtiene último mensaje              │
│    - Pobla (populate) referencias        │
│ 4. Retorna array de conversations        │
│                                          │
│ Frontend:                                │
│ setConversations(data) → re-render       │
│                                          │
│ Resultado: Lista muestra conversación    │
│ con "Usuario B" y último mensaje         │
└──────────────┬───────────────────────────┘

PASO 8: Usuario A selecciona conversación
┌──────────────────────────────────────────┐
│ onClick(conversation)                    │
│ setSelectedConversation(conversation)    │
│                                          │
│ useEffect detecta cambio → carga mensajes│
│                                          │
│ GET /api/messages/conversation/:id       │
│                                          │
│ Backend:                                 │
│ 1. Verifica conversationId               │
│ 2. Obtiene todos los messages donde      │
│    conversationId = id                   │
│ 3. Ordena por createdAt (ascendente)    │
│ 4. Pobla sender y receiver               │
│ 5. Retorna array de messages             │
│                                          │
│ Frontend:                                │
│ setMessages(data) → renderiza timeline   │
└──────────────┬───────────────────────────┘

PASO 9: Se muestra historial de mensajes
┌──────────────────────────────────────────┐
│ MessageTab - Vista Chat                  │
│                                          │
│ 📍 "¿Sigue disponible?"    (de Usuario A)│
│    09:15                                 │
│                                          │
│ (Vacío - Usuario B aún no responde)     │
│                                          │
│ [TextArea] [Enviar]                      │
└──────────────┬───────────────────────────┘

PASO 10: Usuario B responde (mismo flujo)
┌──────────────────────────────────────────┐
│ Usuario B:                               │
│ 1. Ve conversación en /messages          │
│ 2. Selecciona conversación con Usuario A │
│ 3. Ve mensaje: "¿Sigue disponible?"     │
│ 4. Escribe respuesta: "Sí, ¿qué ofreces?"
│ 5. Hace clic en [Enviar]                 │
│                                          │
│ Backend: POST /api/messages              │
│ Database: Crea nuevo Message             │
│                                          │
│ Usuario A después de recargar:           │
│ Ve: "Sí, ¿qué ofreces?" (de Usuario B)  │
└──────────────────────────────────────────┘
```

---

## Componentes y Sus Responsabilidades

### 1. ArticleDetail.jsx
```
- Muestra detalles del artículo
- Verifica si usuario es dueño
- SI es dueño → Botón "Borrar Publicación"
- SI NO es dueño → Botón "💬 Contactar al Vendedor"
- Al hacer clic → renderiza <ChatInitiator />
```

### 2. ChatInitiator.jsx
```
- Modal para iniciar conversación
- TextArea con mensaje predeterminado
- Funciones:
  ✓ Crear conversación
  ✓ Enviar primer mensaje
  ✓ Manejo de errores
  ✓ Estados: loading, error
- Props: articleOwner, onClose, onSuccess
```

### 3. MessageTab.jsx
```
- Página principal de conversaciones
- Dos secciones:
  ✓ Sidebar: Lista de conversaciones
  ✓ Chat Area: Historial de mensajes
- Funciones:
  ✓ Cargar todas las conversaciones
  ✓ Cargar mensajes de una conversación
  ✓ Enviar nuevo mensaje
  ✓ Auto-scroll al final
  ✓ Mostrar preview de últimos mensajes
```

---

## Estados y Props del Sistema

### ArticleDetail - States
```javascript
{
  article: Object,           // Datos del artículo
  loading: Boolean,          // Cargando artículo
  error: String,             // Error al cargar
  showChatInitiator: Boolean // Mostrar modal
}
```

### ChatInitiator - States
```javascript
{
  message: String,           // Contenido del mensaje
  loading: Boolean,          // Enviando
  error: String              // Error de envío
}

Props:
- articleOwner: { _id, username, email }
- onClose: Function
- onSuccess: Function
```

### MessageTab - States
```javascript
{
  conversations: Array,      // Todas las conversaciones
  selectedConversation: Object,
  messages: Array,           // Mensajes de conversación
  newMessage: String,        // Texto del nuevo mensaje
  loading: Boolean,          // Cargando
  error: String              // Error general
}
```

---

## Flujo de Autenticación

```
1. Login exitoso → JWT token generado
   
2. Token guardado en sessionStorage
   Key: "token"
   
3. Para cada request al backend:
   Header: Authorization: Bearer <TOKEN>
   
4. Backend - Middleware verifyToken:
   ✓ Valida token
   ✓ Extrae userId del token
   ✓ Asigna a req.user.id
   
5. Si token inválido → 401 Unauthorized
   
6. Si token válido → Procede al controller
```

---

¡Arquitectura completa y funcional! 🏗️
