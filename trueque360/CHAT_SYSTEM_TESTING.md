# Testing Script - Chat System API

## 1. Crear dos usuarios de prueba

### Usuario A - Registro
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "usuario_a",
    "email": "usuarioa@test.com",
    "password": "Password123"
  }'
```

### Usuario A - Login (y guardar el token)
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "usuario_a",
    "password": "Password123"
  }'
```

Respuesta esperada:
```json
{
  "success": true,
  "message": "Login exitoso",
  "token": "eyJhbGc...",
  "user": {
    "_id": "USER_A_ID",
    "username": "usuario_a",
    "email": "usuarioa@test.com"
  }
}
```

Guardar `USER_A_ID` y `TOKEN_A` para los siguientes requests.

---

### Usuario B - Registro
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "usuario_b",
    "email": "usuariob@test.com",
    "password": "Password123"
  }'
```

### Usuario B - Login (y guardar el token)
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "usuario_b",
    "password": "Password123"
  }'
```

Guardar `USER_B_ID` y `TOKEN_B`.

---

## 2. Crear una conversación

### Usuario A inicia conversación con Usuario B
```bash
curl -X POST http://localhost:3000/api/conversations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_A" \
  -d '{
    "participantId": "USER_B_ID"
  }'
```

Respuesta esperada:
```json
{
  "success": true,
  "message": "Conversación creada correctamente",
  "data": {
    "_id": "CONVERSATION_ID",
    "participants": [...],
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

Guardar `CONVERSATION_ID`.

---

## 3. Enviar un mensaje

### Usuario A envía un mensaje a Usuario B
```bash
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_A" \
  -d '{
    "conversationId": "CONVERSATION_ID",
    "receiverId": "USER_B_ID",
    "content": "¿Sigue disponible?"
  }'
```

Respuesta esperada:
```json
{
  "success": true,
  "message": "Mensaje enviado correctamente",
  "data": {
    "_id": "MESSAGE_ID",
    "conversationId": "CONVERSATION_ID",
    "sender": {
      "_id": "USER_A_ID",
      "username": "usuario_a",
      "email": "usuarioa@test.com"
    },
    "receiver": {
      "_id": "USER_B_ID",
      "username": "usuario_b",
      "email": "usuariob@test.com"
    },
    "content": "¿Sigue disponible?",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

## 4. Obtener conversaciones del usuario

### Usuario B obtiene sus conversaciones
```bash
curl -X GET http://localhost:3000/api/conversations \
  -H "Authorization: Bearer TOKEN_B"
```

Respuesta esperada:
```json
{
  "success": true,
  "data": [
    {
      "_id": "CONVERSATION_ID",
      "participants": [...],
      "lastMessage": {
        "_id": "MESSAGE_ID",
        "content": "¿Sigue disponible?",
        "sender": {...},
        "receiver": {...},
        "createdAt": "..."
      },
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

## 5. Obtener mensajes de una conversación

### Usuario B obtiene el historial de mensajes
```bash
curl -X GET http://localhost:3000/api/messages/conversation/CONVERSATION_ID \
  -H "Authorization: Bearer TOKEN_B"
```

Respuesta esperada:
```json
{
  "success": true,
  "data": [
    {
      "_id": "MESSAGE_ID",
      "conversationId": "CONVERSATION_ID",
      "sender": {
        "_id": "USER_A_ID",
        "username": "usuario_a",
        "email": "usuarioa@test.com"
      },
      "receiver": {
        "_id": "USER_B_ID",
        "username": "usuario_b",
        "email": "usuariob@test.com"
      },
      "content": "¿Sigue disponible?",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

## 6. Usuario B responde

```bash
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_B" \
  -d '{
    "conversationId": "CONVERSATION_ID",
    "receiverId": "USER_A_ID",
    "content": "Sí, aún disponible. ¿Qué ofreces a cambio?"
  }'
```

---

## 7. Usuario A obtiene los mensajes actualizados

```bash
curl -X GET http://localhost:3000/api/messages/conversation/CONVERSATION_ID \
  -H "Authorization: Bearer TOKEN_A"
```

Ahora deberías ver dos mensajes en la lista.

---

## ✅ Checklist para Verificación

- [ ] Los usuarios se registran correctamente
- [ ] Los usuarios se pueden loguear y obtienen un token
- [ ] Se puede crear una conversación entre dos usuarios
- [ ] Se puede enviar un mensaje en una conversación
- [ ] Se pueden obtener todas las conversaciones de un usuario
- [ ] Se puede obtener el historial de mensajes de una conversación
- [ ] Ambos usuarios pueden ver los mensajes del otro
- [ ] El último mensaje aparece en la preview de la conversación

## 🛠️ Usando Postman (Alternativa)

1. Abre Postman
2. Crea una nueva collection llamada "Trueque360 Chat"
3. Para cada request anterior, crea una nueva request en Postman
4. En lugar de `TOKEN_A`, `USER_B_ID`, etc., usa variables de Postman
5. Guarda los valores de respuesta como variables globales para reutilizarlas

### Variables Postman Sugeridas:
- `TOKEN_A` - Token del usuario A
- `TOKEN_B` - Token del usuario B
- `USER_A_ID` - ID del usuario A
- `USER_B_ID` - ID del usuario B
- `CONVERSATION_ID` - ID de la conversación
- `BASE_URL` - `http://localhost:3000`

Uso en requests:
```
Authorization: Bearer {{TOKEN_A}}
Body: {
  "participantId": "{{USER_B_ID}}"
}
```
