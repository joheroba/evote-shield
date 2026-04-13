# Manual de Operación: E-Vote Shield 🛡️🗳️

Este documento describe el funcionamiento técnico y operativo del sistema de votación móvil inmutable desarrollado.

## 🏛️ Los 3 Pilares de Seguridad

### 1. Validación de Identidad (NFC DNIe)
El sistema utiliza el sensor NFC del dispositivo para comunicarse con el chip del DNI electrónico peruano.
*   **Seguridad:** Al detectar el tag, se extrae un identificador único que genera un "Token de Sesión". Sin el DNIe físico, la app permanece bloqueada.

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
