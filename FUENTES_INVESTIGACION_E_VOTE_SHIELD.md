# Compendio de Fuentes y Referencias: E-Vote Shield

Este documento consolida el sustento técnico, legal y científico del proyecto para su procesamiento en herramientas de inteligencia artificial (NotebookLM).

## 1. Implementación Técnica Actual (Código Fuente)

### A. Validación Biométrica de Comportamiento (Liveness Detection)
*   **Componente:** `HumanDetector.kt` / `MainActivity.kt`
*   **Mecanismo:** Captura de datos del acelerómetro a 60Hz.
*   **Teoría:** Análisis de varianza para detectar el temblor fisiológico humano (rango 8-12 Hz).
*   **Propósito:** Evitar ataques por inyección de software o dispositivos estáticos (bots).

### B. Seguridad Criptográfica y Smart Cards
*   **Librerías:** `JMRTD`, `BouncyCastle`, `SCUBA`.
*   **Estándares:** ISO/IEC 7816 (Smart Cards) e ISO/IEC 14443 (NFC).
*   **Función:** Comunicación con el chip del DNI electrónico para firma digital en el dispositivo (Match-on-Card).

### C. Registro Descentralizado (Tangle/DAG)
*   **Componente:** `DAGManager.kt`
*   **Estructura:** Gráfico Acíclico Dirigido (DAG) donde cada voto valida dos anteriores.
*   **Ventaja:** Escalabilidad superior a Blockchain tradicional y resistencia a la manipulación por un único administrador de base de datos.

## 2. Marco Legal Peruano
*   **Constitución Política del Perú (1993):**
    *   *Artículo 31:* Derecho a la participación ciudadana en asuntos públicos.
    *   *Artículo 176:* El sistema electoral debe asegurar que las votaciones traduzcan la expresión auténtica, libre y espontánea de los ciudadanos.
*   **Ley N° 27269 (Ley de Firmas y Certificados Digitales):** Proporciona la misma validez jurídica a una firma digital que a una firma manuscrita, base legal para el voto digital con DNIe.

## 3. Fuentes Técnicas Internacionales de Referencia
*   **The Tangle Whitepaper (IOTA Foundation):** Fundamento sobre cómo las redes sin mineros pueden mantener la integridad de los datos de forma gratuita y rápida.
*   **ICAO Doc 9303 (Machine Readable Travel Documents):** Especificaciones sobre seguridad en chips de identidad que utiliza el DNIe peruano.
*   **E-Estonia: Voting Case Study:** Análisis del sistema estonio que permite el voto digital desde 2005 con niveles de fraude cercanos a cero.

## 4. Problemática a Resolver (Contexto de Investigación)
*   **Vulnerabilidades de la ONPE (Hipótesis de Trabajo):**
    *   Riesgo de alteración de actas físicas durante el traslado.
    *   Falta de trazabilidad pública del voto una vez ingresado al sistema central.
    *   Dificultad de auditoría independiente por parte de la sociedad civil en tiempo real.
*   **Solución E-Vote Shield:** Traslada la "confianza" desde una institución central hacia un algoritmo matemático auditable por cualquier ciudadano.

## 5. Glosario para Análisis IA
*   **NFC (Near Field Communication):** Tecnología de comunicación de corto alcance para leer el DNIe.
*   **Hash de Auditoría:** Identificador único e irreversible de un voto que permite al votante verificar su registro sin revelar su elección.
*   **Double-Spending (Doble Voto):** Problema que soluciona el DAG al validar en milisegundos si una identidad ya emitió un sufragio en la red global.
