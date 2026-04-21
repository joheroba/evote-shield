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

### D. Padrón Electoral Descentralizado (Doble Nodo de Validación)
*   **Arquitectura de Verificación:** El sistema separa la identidad de la acción de voto mediante dos nodos independientes:
    1.  **Nodo de Elegibilidad (Oráculo):** Verifica que el DNI se encuentre en el Padrón Electoral oficial. Para proteger la privacidad, se utilizan **Hashes Criptográficos**; el sistema no conoce el DNI, solo valida su "huella digital" autorizada.
    2.  **Nodo de Sufragio (Tangle):** Verifica en tiempo real que dicha "huella digital" no haya emitido un voto previo, eliminando el riesgo de doble votación a nivel global.
*   **Integridad Ciudadana:** Esta separación garantiza que el ente que cuenta los votos (JNE/Tangle) no sea el mismo que valida la identidad (RENIEC), creando un sistema de pesos y contrapesos digital.

### E. Interoperabilidad y Blindaje de Configuración (Cédula Digital Inmutable)
*   **Mecanismo de Confianza:** Para eliminar el "punto ciego" de la carga dinámica y evitar el envenenamiento de configuración, el sistema implementa un protocolo de **Cédula Blindada**:
    1.  **Firma Multilateral Biométrica:** El JSON de candidatos debe ser firmado por un quórum de autoridades (DNIe + Reconocimiento Facial).
    2.  **Validación en APK:** La aplicación bloquea el proceso si la firma de la cédula no coincide con el quórum autorizado.
    3.  **Hash Génesis en el DAG:** La lista de candidatos queda anclada como el primer bloque de la red Tangle.

### F. Escrutinio y Segunda Vuelta Instantánea
*   **Viabilidad Técnica:** Conteo en tiempo real que permite identificar finalistas e iniciar el balotaje el mismo día.

### G. Centro de Monitoreo Ciudadano (Dashboard)
*   **Concepto:** Interfaz pública de visualización de datos en tiempo real para auditoría forense inmediata.

## 2. Marco Legal Peruano
*   **Constitución Política del Perú (1993):** Artículos 31, 111 (Segunda Vuelta) y 176 (Autenticidad del voto).
*   **Ley N° 27269 (Ley de Firmas y Certificados Digitales):** Validez jurídica del voto digital.

## 3. Fuentes Técnicas Internacionales de Referencia
*   **The Tangle Whitepaper (IOTA Foundation)**, **ICAO Doc 9303** y **E-Estonia Case Study**.

## 4. Problemática a Resolver (Contexto de Investigación)
*   **Vulnerabilidades de la ONPE:** Falta de trazabilidad, riesgo de alteración de actas y centralización excesiva de la confianza.
*   **Solución E-Vote Shield:** Traslada la confianza hacia un algoritmo matemático auditable.
