# Sistema de Chat - Documentación Completa

## 📋 Descripción General

Se ha implementado un sistema completo de chat que permite a los usuarios:
1. **Iniciar conversaciones** desde la página de detalles de un artículo
2. **Enviar un mensaje inicial** con texto predeterminado ("¿Sigue disponible?")
3. **Ver todas las conversaciones** en la pestaña de Mensajes del Dashboard
4. **Continuar chateando** dentro de la pestaña de Mensajes

## 🏗️ Arquitectura del Sistema

### Backend

#### Modelos Creados/Actualizados:
- **Message.js** - Almacena mensajes individuales
  - `conversationId` (ref a Conversation)
  - `sender` (ref a User)
  - `receiver` (ref a User)
  - `content` (string)
  - Timestamps automáticos

- **Conversation.js** - Agrupa mensajes entre dos usuarios
  - `participants` (array de refs a User)
  - Timestamps automáticos

- **User.js** - Modelo de usuario (sin cambios necesarios)

- **Article.js** - Modelo de artículo (sin cambios necesarios)

#### Controladores Creados:
- **conversationController.js**
  - `createConversation` - Crear/obtener conversación entre dos usuarios
  - `getUserConversations` - Obtener todas las conversaciones del usuario actual
  - `getConversationById` - Obtener una conversación específica
  - `getOtherParticipant` - Obtener el otro participante

- **messageController.js**
  - `createMessage` - Enviar un mensaje en una conversación
  - `getMessagesByConversation` - Obtener todos los mensajes de una conversación
  - `getLastMessage` - Obtener el último mensaje para preview

#### Rutas Creadas:
- **conversationRoutes.js**
  - `POST /api/conversations` - Crear conversación
  - `GET /api/conversations` - Obtener conversaciones del usuario
  - `GET /api/conversations/:id` - Obtener conversación específica
  - `GET /api/conversations/:id/other-participant` - Obtener otro participante

- **messageRoutes.js**
  - `POST /api/messages` - Crear mensaje
  - `GET /api/messages/conversation/:id` - Obtener mensajes de conversación
  - `GET /api/messages/last/:id` - Obtener último mensaje

### Frontend

#### Componentes Creados:

1. **ChatInitiator.jsx** (Modal para iniciar chat)
   - Se abre al hacer clic en "Contactar al Vendedor"
   - Permite escribir un mensaje con predeterminado "¿Sigue disponible?"
   - Crea la conversación y envía el primer mensaje

2. **MessageTab.jsx** (Página de conversaciones)
   - Muestra lista de conversaciones del usuario
   - Seleccionar una conversación muestra el historial de mensajes
   - Permite enviar nuevos mensajes
   - Auto-scroll al final de los mensajes

#### Rutas Actualizadas:
- `App.jsx` - Agregada ruta `/messages` que renderiza `MessageTab`

#### Componentes Existentes Actualizados:
- **ArticleDetail.jsx**
  - Agregado botón "💬 Contactar al Vendedor" (solo si NO eres el dueño)
  - Integrado componente `ChatInitiator` como modal
  - Importado `ChatInitiator` component

- **Dashboard.jsx**
  - Ya tiene el link a `/messages` en el sidebar (✉️ Mensajes)

## 🔄 Flujo de Funcionamiento

### 1. Iniciar una Conversación (desde ArticleDetail)
```
Usuario ve artículo de otro usuario
   ↓
Hace clic en "Contactar al Vendedor"
   ↓
Se abre modal ChatInitiator
   ↓
Escribe mensaje (o usa predeterminado "¿Sigue disponible?")
   ↓
Hace clic en "Enviar Mensaje"
   ↓
Backend crea Conversation (si no existe)
   ↓
Backend crea Message en esa Conversation
   ↓
Modal se cierra y muestra confirmación
```

### 2. Ver Conversaciones (desde Dashboard)
```
Usuario hace clic en "✉️ Mensajes" en el sidebar
   ↓
Se abre página MessageTab en `/messages`
   ↓
Se cargan todas las conversaciones del usuario
   ↓
Se muestran en lista con último mensaje visible
```

### 3. Continuar Conversación (desde MessageTab)
```
Usuario selecciona una conversación de la lista
   ↓
Se cargan todos los mensajes de esa conversación
   ↓
Usuario escribe nuevo mensaje
   ↓
Backend crea Message en Conversation existente
   ↓
Mensaje aparece en tiempo real en la lista
```

## 🚀 Cómo Probar el Sistema

### Requisitos Previos
1. Backend corriendo en `http://localhost:3000`
2. Frontend corriendo en `http://localhost:5173` (o el puerto que uses)
3. MongoDB conectada y funcionando

### Pasos de Prueba

**Paso 1: Crear dos usuarios de prueba**
1. Abre el frontend
2. Crea Usuario A (ej: `usuario_a`)
3. Logout
4. Crea Usuario B (ej: `usuario_b`)

**Paso 2: Usuario B publica un artículo**
1. Logueado como Usuario B
2. Haz clic en "➕ Publicar Trueque"
3. Rellena los datos del artículo
4. Publica el artículo

**Paso 3: Usuario A inicia conversación**
1. Logout como Usuario B
2. Loguea como Usuario A
3. Busca el artículo publicado por Usuario B
4. Haz clic en "💬 Contactar al Vendedor"
5. En el modal, cambia el mensaje si quieres (o mantén "¿Sigue disponible?")
6. Haz clic en "Enviar Mensaje"
7. Verás confirmación: "¡Mensaje enviado! Ve a la sección de Mensajes..."

**Paso 4: Usuario A ve la conversación en Mensajes**
1. Haz clic en "✉️ Mensajes" en el sidebar
2. Deberías ver en la lista: conversación con "usuario_b"
3. Haz clic en ella para verla
4. El mensaje inicial aparecerá

**Paso 5: Usuario B responde**
1. Logout como Usuario A
2. Loguea como Usuario B
3. Haz clic en "✉️ Mensajes"
4. Deberías ver conversación con "usuario_a"
5. Selecciónala y verás el mensaje de Usuario A
6. Escribe una respuesta
7. Haz clic en "Enviar"

**Paso 6: Verifica la conversación**
1. Vuelve a Usuario A
2. En "✉️ Mensajes", selecciona la misma conversación
3. Deberías ver tu mensaje + la respuesta de Usuario B

## 📁 Archivos Creados/Modificados

### Archivos Creados:
```
backend/
├── controllers/
│   ├── conversationController.js (NUEVO)
│   └── messageController.js (NUEVO)
├── routes/
│   ├── conversationRoutes.js (NUEVO)
│   └── messageRoutes.js (NUEVO)

frontend/
├── components/
│   ├── ChatInitiator/
│   │   ├── ChatInitiator.jsx (NUEVO)
│   │   └── ChatInitiator.css (NUEVO)
│   └── MessageTab/
│       ├── MessageTab.jsx (NUEVO)
│       └── MessageTab.css (NUEVO)
```

### Archivos Modificados:
```
backend/
└── app.js (agregadas rutas de conversaciones y mensajes)

frontend/
├── App.jsx (agregada ruta /messages)
├── components/
│   ├── ArticleDetail/
│   │   ├── ArticleDetail.jsx (agregado ChatInitiator y botón Contactar)
│   │   └── ArticleDetail.css (agregados estilos para botón Contactar)
│   └── Dashboard/
│       └── Dashboard.jsx (sin cambios, ya tenía link a /messages)
```

## 🔧 Instalación

1. **Backend**:
   - Los nuevos controllers y routes ya están en su lugar
   - Asegúrate de que `app.js` tiene las importaciones de las nuevas rutas
   - Reinicia el servidor backend

2. **Frontend**:
   - Los nuevos componentes ya están en su lugar
   - `App.jsx` ya tiene la ruta `/messages`
   - Los componentes existentes ya están actualizados

## 🐛 Posibles Problemas y Soluciones

### Problema: "Error al cargar conversaciones"
**Solución**: Verifica que el token en sessionStorage sea válido y que el backend esté corriendo

### Problema: "No puedes crear una conversación contigo mismo"
**Solución**: Asegúrate de estar logueado como un usuario diferente al dueño del artículo

### Problema: Los mensajes no aparecen
**Solución**: 
- Verifica la consola del navegador para errores
- Asegúrate de que MongoDB está corriendo
- Revisa que el `conversationId` es válido

### Problema: El botón "Contactar" no aparece
**Solución**: 
- Verifica que estés viendo un artículo de otro usuario (no del tuyo)
- Comprueba que `currentUserId` ≠ `article.owner._id`

## 📝 Próximas Mejoras (Opcionales)

1. **Socket.IO en tiempo real**: Implementar conexión WebSocket para mensajes instantáneos
2. **Notificaciones**: Sistema de notificaciones cuando recibes mensajes
3. **Búsqueda**: Buscar conversaciones por nombre de usuario
4. **Lectura de mensajes**: Marcar mensajes como leídos/no leídos
5. **Archivos/Imágenes**: Enviar archivos o imágenes en mensajes
6. **Borrado de mensajes**: Permitir borrar mensajes propios
7. **Bloqueo de usuarios**: Bloquear usuarios para no recibir mensajes

## 📞 Soporte

Para cualquier problema o pregunta, revisa:
1. Los logs del backend (terminal donde corre el servidor)
2. La consola del navegador (F12 → Console)
3. Las redes (F12 → Network) para ver las peticiones HTTP
