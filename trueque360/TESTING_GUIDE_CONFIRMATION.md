# 🧪 Testing Guide - Trade Confirmation Feature

## Quick Test Checklist

Use esta guía para verificar que todo funciona correctamente.

---

## ✅ Test 1: Confirmar Trueque (Received)

**Pasos**:
1. User A propone trueque a User B
2. User B abre "📥 Solicitudes de Trueque Recibidas"
3. User B ve la tarjeta con estado PENDING (amarillo)
4. User B hace clic "✅ Aceptar"
5. Tarjeta cambia a ACCEPTED (verde)
6. **NUEVO**: Aparecen botones [✅ Confirmar] [❌ Cancelar]
7. User B hace clic "✅ Confirmar Trueque"
8. ✅ ALERT: "¡Trueque confirmado! La tarjeta ha sido eliminada."
9. ✅ **LA TARJETA DESAPARECE**

**Expected Result**: ✅ PASS

---

## ✅ Test 2: Cancelar Trueque (Received)

**Pasos**:
1. User A propone trueque a User B
2. User B abre "📥 Solicitudes de Trueque Recibidas"
3. User B hace clic "✅ Aceptar"
4. Tarjeta cambia a ACCEPTED (verde)
5. **NUEVO**: Aparecen botones [✅ Confirmar] [❌ Cancelar]
6. User B hace clic "❌ Cancelar Trueque"
7. ❌ ALERT: "Trueque cancelado. La tarjeta ha sido eliminada."
8. ✅ **LA TARJETA DESAPARECE**

**Expected Result**: ✅ PASS

---

## ✅ Test 3: Confirmar Trueque (Sent)

**Pasos**:
1. User A propone trueque a User B
2. User A abre "📤 Solicitudes de Trueque Enviadas"
3. User A ve su propuesta con estado PENDING (amarillo)
4. User A ve: "Esperando respuesta de @UserB..."
5. User B acepta la propuesta
6. User A recarga la página
7. Tarjeta cambia a ACCEPTED (verde)
8. **NUEVO**: Aparecen botones [✅ Confirmar] [❌ Cancelar]
9. User A hace clic "✅ Confirmar Trueque"
10. ✅ ALERT: "¡Trueque confirmado! La tarjeta ha sido eliminada."
11. ✅ **LA TARJETA DESAPARECE**

**Expected Result**: ✅ PASS

---

## ✅ Test 4: Cancelar Trueque (Sent)

**Pasos**:
1. User A propone trueque a User B
2. User A abre "📤 Solicitudes de Trueque Enviadas"
3. User B acepta la propuesta
4. User A recarga la página
5. Tarjeta cambia a ACCEPTED (verde)
6. **NUEVO**: Aparecen botones [✅ Confirmar] [❌ Cancelar]
7. User A hace clic "❌ Cancelar Trueque"
8. ❌ ALERT: "Trueque cancelado. La tarjeta ha sido eliminada."
9. ✅ **LA TARJETA DESAPARECE**

**Expected Result**: ✅ PASS

---

## ✅ Test 5: Botones Solo en ACCEPTED

**Pasos**:
1. User A propone trueque a User B
2. User B abre "📥 Solicitudes"
3. Tarjeta está en PENDING (amarillo)
4. **VERIFICAR**: Solo ve [✅ Aceptar] [❌ Rechazar]
5. **NO DEBE VER**: [✅ Confirmar] ni [❌ Cancelar]
6. User B hace clic "✅ Aceptar"
7. **AHORA VE**: [✅ Confirmar] [❌ Cancelar]
8. [✅ Aceptar] y [❌ Rechazar] desaparecieron

**Expected Result**: ✅ PASS - Botones aparecen solo en ACCEPTED

---

## ✅ Test 6: Colores Correctos

**Pasos**:
1. Proponer trueque
2. **VERIFICAR COLORES**:
   - PENDING: 🟡 Amarillo
   - (Aceptar)
   - ACCEPTED: 🟢 Verde
   - (Confirmar)
   - COMPLETED: 🔵 Cyan (desaparece)

**Expected Result**: ✅ PASS - Todos los colores correctos

---

## ✅ Test 7: Mensajes de Usuario

**Pasos**:
1. Proponer trueque y aceptar
2. Hacer clic "Confirmar"
3. **VERIFICAR ALERT**: "¡Trueque confirmado! La tarjeta ha sido eliminada."
4. Proponer otro y aceptar
5. Hacer clic "Cancelar"
6. **VERIFICAR ALERT**: "Trueque cancelado. La tarjeta ha sido eliminada."

**Expected Result**: ✅ PASS - Mensajes claros y descriptivos

---

## ✅ Test 8: Mobile Responsiveness

**Pasos**:
1. Abrir en dispositivo móvil o DevTools (F12)
2. Hacer que es ACCEPTED
3. **VERIFICAR**: Botones se apilan verticalmente
4. **VERIFICAR**: Botones ocupan 100% del ancho
5. **VERIFICAR**: Texto es legible
6. **VERIFICAR**: Se pueden hacer clic fácilmente

**Expected Result**: ✅ PASS - Interface adaptada a móvil

---

## ✅ Test 9: Descripción vs Artículo

**Pasos**:
1. Proponer trueque usando DESCRIPCIÓN (✍️ tab)
2. Otro usuario acepta
3. Ver tarjeta - **DEBE MOSTRAR** descripción en caja punteada
4. Hacer clic "Confirmar"
5. ✅ **TARJETA DESAPARECE**

**Expected Result**: ✅ PASS - Funciona con descripciones

---

## ✅ Test 10: Ambas Secciones

**Pasos**:
1. **RECEIVED**: Proponer a ti mismo desde otra cuenta
2. Aceptar, confirmar → desaparece ✅
3. **SENT**: Proponer desde tu cuenta a otro
4. Otro acepta, confirmar → desaparece ✅

**Expected Result**: ✅ PASS - Funciona en ambas secciones

---

## ✅ Test 11: Rechazo aún funciona

**Pasos**:
1. Proponer trueque
2. Receiver hace clic "❌ Rechazar"
3. **VERIFICAR**: Tarjeta muestra estado REJECTED (rojo)
4. **VERIFICAR**: NO hay botones de confirmar/cancelar
5. **VERIFICAR**: Tarjeta desaparece después (o muestra como rechazada)

**Expected Result**: ✅ PASS - Rechazo no afectado

---

## ✅ Test 12: Aceptar aún funciona

**Pasos**:
1. Proponer trueque
2. Receiver hace clic "✅ Aceptar"
3. **VERIFICAR**: Tarjeta cambia a ACCEPTED (verde)
4. **VERIFICAR**: Mensaje: "Has aceptado..."
5. **VERIFICAR**: Aparecen nuevos botones

**Expected Result**: ✅ PASS - Aceptar funciona como antes

---

## 🔍 Edge Cases

### Edge Case 1: Doble Clic
**Test**: ¿Qué pasa si hago doble clic en "Confirmar"?
- Backend debe rechazar segundo request
- No debe enviar dos confirmaciones
- **Result**: ✅ PASS (backend valida)

### Edge Case 2: Recarga Después de Confirmar
**Test**: Recargo página después de confirmar
- **Result**: ✅ Tarjeta no reaparece (no está en BD)

### Edge Case 3: Navegación Rápida
**Test**: Confirmo y luego cambio de pestaña rápido
- **Result**: ✅ Tarjeta desaparece antes de cambiar

---

## 🖥️ Browser Compatibility

Test en:
- [ ] Chrome (Desktop)
- [ ] Firefox (Desktop)
- [ ] Safari (Desktop)
- [ ] Edge (Desktop)
- [ ] Chrome Mobile
- [ ] Safari Mobile (iOS)

---

## 📊 Performance Tests

### Test 1: Tiempo de Respuesta
- Clic en "Confirmar"
- **Expected**: Respuesta < 1 segundo
- **Actual**: _______

### Test 2: Animación
- Card removal debe ser suave
- No debe ser instant (debe verse)
- **Expected**: Smooth transition
- **Actual**: _______

### Test 3: No Lag
- Interface no debe congelarse
- Otros botones siguen respondiendo
- **Expected**: Responsive
- **Actual**: _______

---

## 🐛 Bug Hunting Checklist

- [ ] No hay errores en console (F12 → Console)
- [ ] No hay network errors
- [ ] No hay memory leaks
- [ ] No aparecen duplicados
- [ ] No desaparecen otros trades
- [ ] Los botones tienen hover effect
- [ ] Los botones tienen active state
- [ ] Los alerts aparecen correctamente
- [ ] Los mensajes de error son claros
- [ ] La UI no parpadea

---

## ✅ Final Sign-Off

| Test | Result | Notes |
|------|--------|-------|
| Test 1: Confirmar (Received) | ☐ PASS | |
| Test 2: Cancelar (Received) | ☐ PASS | |
| Test 3: Confirmar (Sent) | ☐ PASS | |
| Test 4: Cancelar (Sent) | ☐ PASS | |
| Test 5: Botones solo ACCEPTED | ☐ PASS | |
| Test 6: Colores correctos | ☐ PASS | |
| Test 7: Mensajes claros | ☐ PASS | |
| Test 8: Mobile responsive | ☐ PASS | |
| Test 9: Descripción works | ☐ PASS | |
| Test 10: Ambas secciones | ☐ PASS | |
| Test 11: Rechazo funciona | ☐ PASS | |
| Test 12: Aceptar funciona | ☐ PASS | |

**Overall**: ☐ READY FOR PRODUCTION

---

## 🚀 Deployment Checklist

- [ ] All tests passed
- [ ] No console errors
- [ ] Mobile tested
- [ ] Desktop tested
- [ ] Backend verified
- [ ] Database working
- [ ] API responding
- [ ] Documentation complete

---

**Date**: November 12, 2025  
**Version**: 1.0  
**Tester**: _________________  
**Status**: Ready for QA ✅
