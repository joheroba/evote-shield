# 🗺️ Hoja de Ruta Técnica para Observadores y Auditores (E-Vote Shield)

Este documento detalla los puntos de control críticos que los observadores técnicos deben validar durante la Prueba Global.

---

## 🕒 Fase 1: Configuración y Despliegue (0-30 min)
*   **Carga del Reglamento (Excel to JSON):** Verificación de que el archivo de configuración generado desde Excel coincide con la lógica de la cédula múltiple peruana.
*   **Inicialización de la Tangle:** Confirmación del "Voto Génesis" en el explorador de bloques (Private Tangle).
*   **Sincronización Cloud:** Verificación de conexión activa con Google Firebase Firestore (Región: São Paulo).

## 🪪 Fase 2: Identidad y Seguridad (Validación)
*   **Prueba de DNIe (NFC):** Demostración de lectura de chip y validación de certificado digital.
*   **Prueba de DNI Azul (QR):** Validación de escaneo PDF417 en condiciones de baja luz.
*   **Prueba de Humanidad:** Demostración del sensor de acelerómetro bloqueando el voto si el dispositivo no está en manos humanas.
*   **Prueba de Revocación:** Simulación de un DNI "fallecido" siendo rechazado por el sistema.

## 🗳️ Fase 3: Proceso de Votación Múltiple
*   **Paso 1:** Elección Presidencial (Foto + Símbolo).
*   **Paso 2:** Senadores Nacionales (Voto preferencial: 2 recuadros, rango 1-100).
*   **Paso 3:** Senadores Regionales (Voto preferencial: 2 recuadros, rango 1-50).
*   **Paso 4:** Diputados (Voto preferencial: 1 recuadro, rango 1-30).
*   **Paso 5:** Parlamento Andino (Voto preferencial: 2 recuadros, rango 1-15).

## 🛡️ Fase 4: Integridad y Anti-Fraude (Cierre)
*   **Detección de Doble Voto Global:** Intento de votar con un mismo DNI en dos dispositivos diferentes simultáneamente.
*   **Verificación de Hash:** Comparación del Ticket de Votación impreso/digital con el bloque registrado en Firestore.
*   **Persistencia Offline:** Demostración de cómo un voto se guarda localmente si se corta el internet y se sincroniza al recuperar la conexión.

---
**E-Vote Shield: Garantía de Transparencia Tecnológica.**
