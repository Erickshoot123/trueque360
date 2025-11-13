# Guía de Implementación: Trueques sin Artículos Publicados

## 🎯 Resumen de Cambios

Se ha modificado el sistema de trueques para permitir que los usuarios propongan intercambios sin necesidad de publicar artículos previamente. Ahora pueden:

1. **Opción 1**: Proponer un trueque usando un artículo publicado (comportamiento existente)
2. **Opción 2**: Proponer un trueque describiendo el artículo de forma libre (NUEVO)

---

## 📋 Archivos Modificados

### Backend

#### 1. `backend/models/Trade.js`
- Cambio: `proposerArticle` y `receiverArticle` ya no son requeridos
- Agregado: Campo `proposedItemDescription` (descripción de lo que ofrece el proponente)
- Agregado: Campo `requestedItemDescription` (descripción de lo que desea el receptor)

```javascript
// Los campos de descripción permiten hasta 500 caracteres
proposedItemDescription: { type: String, maxlength: 500, required: false }
requestedItemDescription: { type: String, maxlength: 500, required: false }
```

#### 2. `backend/controllers/tradeController.js` - Función `createTradeRequest()`
- **Antes**: Requería que ambos artículos fueran publicados
- **Ahora**: Acepta TANTO artículos publicados COMO descripciones libres

Validaciones nuevas:
- Al menos UNO de: `proposerArticleId` O `proposedItemDescription`
- Al menos UNO de: `receiverArticleId` O `requestedItemDescription`
- Si se proporciona un ID de artículo, valida que el usuario sea propietario
- Las descripciones deben tener al menos 10 caracteres (máximo 500)

### Frontend

#### 3. `frontend/src/components/TradeProposal/TradeProposal.jsx`
- **Nueva característica**: Pestañas para seleccionar modo de propuesta

**Modo Artículo Publicado** (📦):
- Muestra lista desplegable con artículos del usuario
- Se deshabilita si el usuario no tiene artículos publicados

**Modo Descripción** (✍️):
- Muestra área de texto para descripción libre
- Contador de caracteres (0-500)
- Validación mínima de 10 caracteres

#### 4. `frontend/src/components/TradeProposal/TradeProposal.css`
- Nuevos estilos para las pestañas
- Estilos para el área de texto de descripción
- Indicador de caracteres con estilo

#### 5. `frontend/src/components/TradesTab/TradesTab.jsx`
- **Antes**: Solo mostraba artículos con imagen y título
- **Ahora**: Muestra descripciones en una caja con borde punteado si no hay artículo

Actualizada la lógica de renderizado para AMBAS secciones:
- Trueques Recibidos (📥)
- Trueques Enviados (📤)

#### 6. `frontend/src/components/TradesTab/TradesTab.css`
- Nuevos estilos `.trade-description` con borde punteado
- Estilos para `.description-text` con ajuste de texto

---

## 🚀 Cómo Usar

### Para los Usuarios - Proponer Trueque

#### Opción 1: Con Artículo Publicado (Existing)
1. Navegar a un artículo que desea intercambiar
2. Hacer clic en "Proponer Trueque"
3. Se abre el modal con dos pestañas
4. Permanecer en pestaña "📦 Seleccionar Artículo"
5. Elegir artículo publicado del desplegable
6. Hacer clic en "Proponer Trueque"

#### Opción 2: Con Descripción Libre (NUEVO)
1. Navegar a un artículo que desea intercambiar
2. Hacer clic en "Proponer Trueque"
3. Se abre el modal con dos pestañas
4. Hacer clic en pestaña "✍️ Describir Artículo"
5. Escribir descripción del artículo a ofrecer (10-500 caracteres)
   - Ejemplo: "Una bicicleta roja en buen estado, cambios 18 velocidades"
6. Hacer clic en "Proponer Trueque"

### Para los Usuarios - Ver Trueques

En la pestaña "Mis Trueques":

- **Con Artículo**: Ve imagen del artículo y título
- **Con Descripción**: Ve texto en caja con borde punteado
- Pueden aceptar/rechazar como siempre
- Pueden ver estado (Pendiente, Aceptado, Rechazado)

---

## 🔧 Cambios Técnicos Detallados

### API Endpoint: POST /api/trades

**Estructura de Solicitud (antes)**:
```json
{
  "receiverId": "user123",
  "proposerArticleId": "article456",
  "receiverArticleId": "article789"
}
```

**Estructura de Solicitud (ahora - flexible)**:
```json
{
  "receiverId": "user123",
  
  "proposerArticleId": "article456",           // Opcional
  "proposedItemDescription": "bicicleta roja", // Opcional
  
  "receiverArticleId": "article789",           // Opcional
  "requestedItemDescription": "laptop"         // Opcional
}
```

**Validación (Backend)**:
- Requiere: `receiverId`
- Requiere: UNO de (`proposerArticleId` O `proposedItemDescription`)
- Requiere: UNO de (`receiverArticleId` O `requestedItemDescription`)

### Modelo Trade

**Nuevos campos**:
```javascript
proposedItemDescription: {
  type: String,
  maxlength: 500,
  required: false
}

requestedItemDescription: {
  type: String,
  maxlength: 500,
  required: false
}
```

**Cambios en campos existentes**:
```javascript
proposerArticle: {
  // Cambio: required: true → required: false
  required: false
}

receiverArticle: {
  // Cambio: required: true → required: false
  required: false
}
```

---

## ✅ Compatibilidad Hacia Atrás

✅ **Totalmente compatible con datos existentes**

- Los trueques existentes con artículos siguen funcionando
- Los nuevos campos son opcionales
- No se requiere migración de datos
- Las operaciones CRUD existentes continúan sin cambios

---

## 🧪 Casos de Prueba

```
✓ Usuario propone trueque con artículo publicado
✓ Usuario propone trueque con descripción (10 caracteres min)
✓ Usuario recibe error si descripción < 10 caracteres
✓ Usuario ve error si no proporciona artículo NI descripción
✓ Otros usuarios ven trueques con descripciones en TradesTab
✓ Aceptar/Rechazar funciona con trueques basados en descripción
✓ Usuario sin artículos publicados solo ve pestaña "Describir"
✓ Contador de caracteres funciona correctamente (0-500)
✓ Trueques antiguos con artículos siguen mostrándose correctamente
```

---

## 📊 Flujo de Datos

### Creación de Trueque con Descripción

```
Frontend (TradeProposal)
  ↓
  Recopila: proposedItemDescription (texto)
  ↓
Envía POST /api/trades con:
  {
    receiverId,
    proposedItemDescription,  // ← NUEVO
    receiverArticleId
  }
  ↓
Backend (tradeController)
  ↓
  Valida: al menos uno de (proposerArticleId OR proposedItemDescription)
  ↓
  Valida: al menos uno de (receiverArticleId OR requestedItemDescription)
  ↓
  Crea Trade con proposedItemDescription ← GUARDADO EN BD
  ↓
Frontend (TradesTab)
  ↓
  Si proposerArticle es nulo: muestra proposedItemDescription
  ↓
  Si proposerArticle existe: muestra imagen + título (comportamiento previo)
```

---

## 🔍 Mensajes de Error

| Error | Causa | Solución |
|-------|-------|----------|
| "Debes proponer un artículo publicado o describir el artículo que ofreces" | No seleccionó artículo ni escribió descripción | Seleccione artículo O escriba descripción |
| "Debes solicitar un artículo publicado o describir lo que deseas" | Receptor no tiene artículo ni descripción especificada | Seleccione artículo objetivo O describa lo deseado |
| "La descripción debe tener al menos 10 caracteres" | Descripción muy corta | Escriba descripción más detallada |
| "El artículo propuesto no existe" | ID de artículo inválido | Seleccione artículo válido |
| "No tienes permiso para proponer este artículo" | No es propietario del artículo | Seleccione artículo de su propiedad |

---

## 📝 Notas de Implementación

1. **Estado de Trueque**: No cambia
   - Sigue siendo: Pending, Accepted, Rejected, Completed, Cancelled

2. **Permisos**: No cambian
   - Solo el dueño del artículo puede proponer ese artículo
   - Solo el receptor puede aceptar/rechazar
   - Cualquiera puede escribir descripciones

3. **Almacenamiento**: Nueva estructura
   - Trade puede tener ARTÍCULO + DESCRIPCIÓN (ambos nulos también es posible)
   - Descripción se almacena como texto en MongoDB
   - Máximo 500 caracteres por descripción

4. **Búsqueda Futura**: Consideraciones
   - Descripciones no están indexadas para búsqueda
   - Se recomienda agregar índices si se añade búsqueda de texto completo

---

## 🎨 UI/UX Notes

### TradeProposal Modal

**Estado Normal**:
- Dos pestañas disponibles (📦 y ✍️)
- Si usuario no tiene artículos: pestaña 📦 deshabilitada

**En Pestaña Artículo**:
- Muestra: "No tienes artículos disponibles publicados"
- Sugiere: "Usa la pestaña 'Describir Artículo'"

**En Pestaña Descripción**:
- Área de texto con placeholder
- Contador: "45/500 caracteres"
- Validación en tiempo real (puede ser agregada)

### TradesTab Card

**Con Artículo**:
```
┌─────────────────────────┐
│  Ofrece:                │
│  [thumbnail image]      │
│  Título del artículo    │
└─────────────────────────┘
```

**Con Descripción**:
```
┌─────────────────────────┐
│  Ofrece:                │
│  ┌─────────────────────┐│
│  │ Una bicicleta roja  ││
│  │ en buen estado...   ││
│  └─────────────────────┘│
└─────────────────────────┘
```
(Borde punteado diferencia de artículos)

---

## 🚨 Troubleshooting

**Problema**: No veo la pestaña "Describir Artículo"
- **Solución**: Recarga la página (F5). Asegúrate que TradeProposal.jsx esté actualizado.

**Problema**: Error 400 "Debes proponer un artículo"
- **Solución**: Backend no recibió el campo. Verifica que TradeProposal.jsx envía `proposedItemDescription`.

**Problema**: Descripción no se muestra en TradesTab
- **Solución**: Verifica que TradesTab.jsx tenga la lógica condicional de renderizado.

**Problema**: Personaje contador no funciona
- **Solución**: Verifica que el estado `proposalDescription` se actualice correctamente.

---

## 📚 Referencias

- Documentación de Trade Model: `TRADE_UNPUBLISHED_ARTICLES.md`
- Documentación de Chat: `README_CHAT_SYSTEM.md`
- Documentación General: `SYSTEM_ARCHITECTURE.md`

---

**Versión**: 1.0  
**Fecha**: 2024  
**Estado**: ✅ Listo para Producción
