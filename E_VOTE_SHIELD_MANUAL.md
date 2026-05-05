# Manual de Operación: E-Vote Shield 🛡️🗳️

Este documento describe el funcionamiento técnico y operativo del sistema de votación móvil inmutable desarrollado.

## 🏛️ Los 3 Pilares de Seguridad

### 1. Validación Criptográfica y Cross-Validation (NFC DNIe / PDF417 / MRZ OCR)
El sistema utiliza múltiples capas de validación física para garantizar la autenticidad innegable del documento:
*   **DNI Electrónico (DNIe):** La cámara extrae la franja MRZ (Machine Readable Zone) mediante Redes Neuronales de Reconocimiento de Texto (OCR). Estos datos generan matemáticamente la llave **BAC (Basic Access Control)**, permitiendo desbloquear el chip NFC de forma segura y blindada.
*   **DNI Azul (Dual Validation):** Implementación de escaneo para PDF417 y código de barras lineal. Como mecanismo de contingencia y prevención de fraude por fotocopias, el sistema incorpora ML Kit OCR para leer la franja MRZ (`I<PER...`) del documento, realizando una comprobación cruzada de los dígitos de control.

### 2. Prueba de Vida Mecánica (Acelerómetro)
Utilizamos el sensor de movimiento para detectar el **Pulso Humano**.
*   **Funcionamiento:** El sistema analiza la varianza del movimiento 50 veces por segundo. 
*   **Anti-Bots:** Si el celular se coloca en un rack estático (granja de bots), el sistema detecta la falta de micro-temblores fisiológicos y desactiva el botón de votación.

### 3. La Tangle Electoral (Ledger Inmutable)
Inspirado en **IOTA**, los votos no se guardan en una lista simple, sino en un **DAG (Grafo Acíclico Dirigido)**.
*   **Inmutabilidad:** Cada nuevo voto debe confirmar a dos votos anteriores. 
*   **Integridad:** Alterar un solo voto del pasado requeriría recalcular los hashes de toda la red, lo cual es detectable instantáneamente por cualquier auditor.

---

## 🚀 Guía de Uso Rápido

1.  **Sostener el equipo:** Asegúrate de que el indicador diga "✅ HUMANO DETECTADO".
2.  **Validar DNIe:** Acerca tu documento a la parte trasera. El estado cambiará a azul: "Identidad Validada".
3.  **Votar:** Presiona el botón verde "EMITIR VOTO".
4.  **Verificar:** El contador de la Tangle aumentará, confirmando que el bloque ha sido encadenado.

---

## 🔍 Guía de Auditoría Técnica

Para verificar que el sistema es honesto, puedes revisar los **Logs de Android Studio**:
- Verás el **Hash SHA-256** de cada voto.
- Verás las referencias `parent1` y `parent2`, demostrando que la estructura de Grafo se está construyendo correctamente.

---
*Documento preparado por Antigravity para Jorge - Innovación 2026*
