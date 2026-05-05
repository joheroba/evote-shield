# 📊 Análisis de Requerimientos de Infraestructura y Reducción de Costos
**Proyecto:** E-Vote Shield (Elecciones Generales 2026)

Este documento detalla la infraestructura informática requerida para soportar un padrón de más de 25 millones de electores concurrentes y establece una comparativa financiera frente al modelo tradicional de votación en Perú (ONPE/JNE).

---

## 1. Requerimientos de Infraestructura (Modelo E-Vote Shield)

A diferencia del pasado, el sistema **no requiere alquilar colegios, ni ensamblar urnas físicas, ni imprimir actas**. El poder de cómputo se traslada a la Nube (Arquitectura Serverless) y al dispositivo del usuario (BYOD - Bring Your Own Device).

### A. Capa de Nube (Backend Serverless - Google Cloud / AWS)
El sistema debe soportar ráfagas de millones de transacciones por segundo (TPS) durante 12 horas.
*   **Balanceadores de Carga Globales:** Cloud Load Balancing para distribuir el tráfico a nivel nacional.
*   **Servidores de Cómputo (Auto-escalables):** Cloud Run o Kubernetes Engine (GKE) configurados para escalar de 10 a 50,000 contenedores dinámicamente según la demanda.
*   **Base de Datos en Memoria:** Redis (Cloud Memorystore) para el motor D'Hondt en tiempo real.
*   **Almacenamiento del Padrón (Lectura):** Cloud Firestore o DynamoDB, configurados para soportar 10 millones de lecturas por segundo.

### B. Capa de Seguridad Hardware (Autoridades)
*   **3 Módulos de Seguridad de Hardware (HSM):** Dispositivos físicos FIPS 140-2 Nivel 3 (ej. Thales o YubiKey HSM) para custodiar las llaves maestras del JNE, ONPE y Sociedad Civil. (Costo aprox: $5,000 USD c/u).
*   **Nodos Validadores (Tangle/DAG):** 10 Servidores Dedicados de alta disponibilidad (Tier IV) en territorio nacional para actuar como nodos validadores de la red IOTA/Tangle.

---

## 2. Comparativa de Costos (Estimación Conservadora)

Históricamente, unas Elecciones Generales en el Perú exigen un presupuesto colosal debido a la inmensa logística física en una geografía compleja (costa, sierra y selva).

### El Costo del Modelo Tradicional (ONPE / JNE)
*(Cifras referenciales basadas en procesos electorales recientes)*
*   **Impresión de Material (Cédulas, Actas, Tampone):** ~$25 Millones USD.
*   **Logística y Despliegue Físico (Fuerzas Armadas, Camiones, Helicópteros):** ~$40 Millones USD.
*   **Personal (Capacitadores, Coordinadores, Miembros de Mesa):** ~$60 Millones USD.
*   **Acondicionamiento de Locales (Colegios, toldos, luz):** ~$15 Millones USD.
*   **Sistemas de Transmisión de Resultados y Servidores Físicos:** ~$20 Millones USD.
*   **Costo Estimado Tradicional:** **$160,000,000 USD (Aprox. 600+ Millones de Soles)**.

### El Costo del Modelo E-Vote Shield (100% Digital)
*   **Infraestructura de Nube (Día de la elección + Pruebas):** El costo de usar Google Cloud masivamente durante 24 horas es transaccional. Para 25M de usuarios, el costo de red y cómputo se estima en ~$150,000 USD.
*   **Nodos y Seguridad HSM:** ~$50,000 USD.
*   **Soporte Técnico, Auditorías de Código (Pentesting) y Red Team:** ~$500,000 USD.
*   **Campaña de Educación Digital Nacional:** ~$10 Millones USD.
*   **Módulos de Asistencia (Tablets en plazas para quienes no tienen celular o DNI habilitado):** ~$5 Millones USD.
*   **Costo Estimado E-Vote Shield:** **~$15,700,000 USD**.

---

## 3. Conclusión Financiera y Operativa

La adopción de la arquitectura **E-Vote Shield** representa una **reducción de costos de más del 90%** para el Estado Peruano. 

Más allá del ahorro millonario (cerca de 145 millones de dólares), las mayores ventajas son logísticas y democráticas:
1.  **Cero Votos Nulos o Viciados por error de escritura.**
2.  **Cero Riesgo de Vidas Humanas** en el transporte de material electoral en zonas agrestes o de conflicto.
3.  **Escrutinio en 5 Minutos**, eliminando las semanas de incertidumbre política, impugnaciones de actas manchadas y conflictividad social post-electoral.
