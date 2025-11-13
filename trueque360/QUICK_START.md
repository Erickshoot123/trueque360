# 🚀 Quick Start - Sistema de Chat

## En 5 minutos

### 1️⃣ Inicia el Backend
```bash
cd backend
npm start
```
Deberías ver: `Server running on port 3000`

### 2️⃣ Inicia el Frontend
```bash
cd frontend
npm run dev
```
Deberías ver: `http://localhost:5173`

### 3️⃣ Crea dos usuarios
- Usuario 1: `marisa`, `marisa@test.com`, `Marisa123`
- Usuario 2: `juan`, `juan@test.com`, `Juan123`

### 4️⃣ Usuario 2 publica un artículo
1. Loguea como `juan`
2. Haz clic en "➕ Publicar Trueque"
3. Rellena: Título, Descripción, Categoría, Imagen, Items buscados
4. Publica

### 5️⃣ Usuario 1 contacta a Usuario 2
1. Logout
2. Loguea como `marisa`
3. Busca el artículo de `juan`
4. Haz clic en "💬 Contactar al Vendedor"
5. Cambia el mensaje o mantén "¿Sigue disponible?"
6. Haz clic en "Enviar Mensaje"

### 6️⃣ Ver mensaje en la bandeja
1. Haz clic en "✉️ Mensajes" en el sidebar
2. Verás la conversación con `juan`
3. Haz clic para ver el mensaje

### 7️⃣ Usuario 2 responde
1. Logout
2. Loguea como `juan`
3. Haz clic en "✉️ Mensajes"
4. Verás la conversación con `marisa`
5. Haz clic en ella
6. Escribe una respuesta: "Hola Marisa! Sigue disponible. ¿Qué ofreces?"
7. Haz clic en "Enviar"

### 8️⃣ Usuario 1 ve la respuesta
1. Logout
2. Loguea como `marisa`
3. Haz clic en "✉️ Mensajes"
4. Selecciona la conversación con `juan`
5. ¡Verás su respuesta!

---

## ✨ ¡Listo! Así funciona el chat.

---

## 🎯 Resumen Visual

```
┌─────────────────────────────────────────┐
│  PÁGINA DE ARTÍCULO                     │
│  (ArticleDetail)                        │
│                                         │
│  [Imagen del artículo]                 │
│  Titulo: "Bicicleta roja"              │
│  Dueño: juan                           │
│  ...                                    │
│                                         │
│  [💬 Contactar al Vendedor]  ← CLIC    │
└─────────────────────────────────────────┘
              │
              │
              ▼
┌──────────────────────────────────────────┐
│  MODAL: CHATINIT IATOR                   │
│                                          │
│  Contactar a juan                    [✕] │
│  ─────────────────────────────────────── │
│                                          │
│  Tu mensaje inicial:                    │
│  ┌────────────────────────────────┐    │
│  │ ¿Sigue disponible?             │    │
│  └────────────────────────────────┘    │
│                                          │
│  Sugerencia predeterminada             │
│                                          │
│       [Cancelar]    [Enviar Mensaje]   │
│                                          │
└──────────────────────────────────────────┘
              │
              │ (Enviar)
              ▼
        Backend crea:
        ✅ Conversation { participants: [marisa, juan] }
        ✅ Message { content: "¿Sigue disponible?", sender: marisa, receiver: juan }
              │
              ▼
┌────────────────────────────────────────────┐
│  CONFIRMACIÓN                              │
│                                            │
│  "¡Mensaje enviado! Ve a la sección      │
│   de Mensajes para continuar..."          │
│                                            │
└────────────────────────────────────────────┘
              │
              │
              ▼
┌────────────────────────┬──────────────────────┐
│  LISTA CONVERSACIONES  │  VISTA DEL CHAT      │
│  (MessageTab)          │  (MessageTab)        │
│                        │                      │
│  ✉️ Mensajes          │  juan                │
│  ─────────────────────│  ─────────────────   │
│                        │                      │
│  👤 juan              │  📍 ¿Sigue          │
│  Ult. msg: "¿Sigue    │     disponible?      │
│  disponible?"          │     09:15            │
│                        │                      │
│  👤 maria  (otro chat) │  ┌─────────────────┐ │
│  Ult. msg: "Hola..."   │  │ Tu respuesta...│ │
│                        │  └─────────────────┘ │
│                        │  [Enviar]           │
│                        │                      │
└────────────────────────┴──────────────────────┘
```

---

## 🔑 Puntos Clave

### 1. Botón de Contacto
- **Ubicación:** Página de detalles del artículo (ArticleDetail)
- **Visible:** Solo si NO eres el dueño del artículo
- **Acción:** Abre modal ChatInitiator

### 2. Modal de Chat
- **Nombre:** ChatInitiator
- **Función:** Permitir escribir el primer mensaje
- **Mensaje Default:** "¿Sigue disponible?"
- **Acción:** Crear conversación + enviar primer mensaje

### 3. Bandeja de Mensajes
- **Ubicación:** `/messages` (accesible desde sidebar)
- **Componente:** MessageTab
- **Muestra:** Lista de conversaciones del usuario
- **Funcionalidad:** Ver histórico de mensajes y enviar nuevos

---

## 🐛 Si Algo No Funciona

### El botón "Contactar" no aparece
```
✅ Verifica que NO eres el dueño del artículo
✅ Si eres el dueño, verás "Borrar Publicación"
```

### El modal no se abre
```
✅ Verifica la consola del navegador (F12 → Console)
✅ Asegúrate de que el botón tiene class "contact-button"
```

### No se envía el mensaje
```
✅ Verifica que el backend está corriendo (npm start en backend/)
✅ Abre F12 → Network y mira si el POST /api/conversations falla
✅ Mira la consola del backend para errores
```

### Los mensajes no cargan en /messages
```
✅ Verifica que hayas enviado al menos un mensaje
✅ Recarga la página (F5)
✅ Cierra sesión y vuelve a loguear
```

---

## 📁 Archivos Principales

| Archivo | Función |
|---------|---------|
| `backend/controllers/conversationController.js` | Lógica de conversaciones |
| `backend/controllers/messageController.js` | Lógica de mensajes |
| `frontend/components/ChatInitiator/ChatInitiator.jsx` | Modal para contactar |
| `frontend/components/MessageTab/MessageTab.jsx` | Bandeja de mensajes |
| `frontend/components/ArticleDetail/ArticleDetail.jsx` | Botón de contacto |
| `frontend/src/App.jsx` | Rutas (incluyendo /messages) |

---

## 🔍 Verificación Rápida

Ejecuta este checklist:

- [ ] Backend está corriendo en puerto 3000
- [ ] Frontend está corriendo en puerto 5173
- [ ] Puedes loguear con dos usuarios diferentes
- [ ] Usuario 2 puede publicar un artículo
- [ ] Usuario 1 puede ver el botón "💬 Contactar"
- [ ] El botón abre un modal
- [ ] El modal tiene un textarea con "¿Sigue disponible?"
- [ ] Al hacer clic en "Enviar", el modal desaparece
- [ ] Aparece mensaje: "¡Mensaje enviado!..."
- [ ] Usuario 1 puede ir a "✉️ Mensajes"
- [ ] Aparece la conversación con Usuario 2
- [ ] Al seleccionar, se ven los mensajes
- [ ] Usuario 2 puede loguearse y ver la conversación
- [ ] Usuario 2 puede responder el mensaje
- [ ] Usuario 1 ve la respuesta después de recargar

✅ Si todo funciona, ¡el chat está listo!

---

## 💡 Próximos Pasos (Opcionales)

1. **Notificaciones en tiempo real** - Usar Socket.IO
2. **Búsqueda de conversaciones** - Buscar por nombre de usuario
3. **Eliminar conversaciones** - Agregar botón de borrar
4. **Enviar imágenes** - Compartir archivos en chat
5. **Bloquear usuarios** - No recibir mensajes de alguien
6. **Marcar como leído** - Indicador de mensajes leídos

---

## 📞 Debugging

### Ver todos los errores del backend
Mira la terminal donde corre el backend. Todos los errores aparecen ahí.

### Ver todos los errores del frontend
Abre F12 en el navegador → Console → Mira los errores rojos

### Ver las peticiones HTTP
F12 → Network → Recarga la página → Mira las peticiones

---

## 🎓 Tecnologías Usadas

- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Frontend:** React, React Router, CSS3
- **Autenticación:** JWT (JSON Web Tokens)
- **API:** REST (HTTP)

---

## ✨ ¡Disfruta del chat!

Sistema completamente funcional y listo para usar.

Para más detalles, lee:
- `CHAT_SYSTEM_DOCUMENTATION.md`
- `README_CHAT_SYSTEM.md`
- `IMPLEMENTATION_CHECKLIST.md`
