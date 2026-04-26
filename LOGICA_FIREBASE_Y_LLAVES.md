# Infraestructura de Datos y Gobernanza de Llaves: E-Vote Shield

Este documento detalla la arquitectura de backend y el protocolo de seguridad para la gestión de identidades, votos y transiciones electorales.

## 1. Simulación de Nodos Descentralizados en Firebase
Para garantizar la independencia de funciones y evitar que una sola entidad controle el proceso, el sistema opera con dos nodos lógicos diferenciados en **Firebase Firestore**:

### Nodo A: Oráculo de Elegibilidad (RENIEC)
*   **Colección:** `padron_nacional`
*   **Función:** Almacena los hashes de los DNIs habilitados.
*   **Estructura:**
    - `hash_dni`: Identificador único irreversible.
    - `estado`: `ACTIVO` | `FALLECIDO` | `INHABILITADO`.
    - `ronda_actual_votó`: Booleano para control de doble voto en la sesión vigente.
*   **Seguridad:** La App consulta este nodo antes de permitir el escaneo biométrico.

### Nodo B: Libro Mayor de Sufragio (JNE/Tangle)
*   **Colección:** `tangle_votos`
*   **Función:** Registro inmutable de los votos firmados.
*   **Independencia:** Este nodo no almacena datos personales. Solo recibe el `payload` del voto cifrado y la firma digital de la autoridad emisora.
*   **Consenso:** Cada nuevo registro debe validar dos transacciones anteriores (DAG), asegurando la integridad de la red.

---

## 2. Implementación de la Criptografía de Umbral (Las 3 Llaves)
El sistema no depende de una contraseña maestra, sino de un quórum de autoridades.

### Designación de Autoridades
1.  **Autoridad 1 (JNE):** Custodia del cumplimiento normativo.
2.  **Autoridad 2 (ONPE):** Custodia de la ejecución técnica.
3.  **Autoridad 3 (Sociedad Civil):** Supervisión ciudadana.

### Protocolo de Apertura
*   **Hardcoding de Llaves Públicas:** Las llaves públicas de las 3 autoridades están incrustadas en el código de la APK (`SecurityVault.kt`).
*   **Ceremonia de Activación:** Para que la App renderice la cédula de candidatos, el archivo de configuración debe estar firmado por al menos 2 de las 3 llaves designadas. 
*   **Validación Biométrica:** El desbloqueo de las claves privadas de las autoridades requiere su **DNIe físico** y **Reconocimiento Facial** en tiempo real.

---

## 3. Transición a Segunda Vuelta (Gestión de Epochs)
E-Vote Shield rechaza la eliminación de datos. La transparencia exige que toda la historia electoral sea conservada.

### Proceso de "Corte y Nueva Época"
1.  **Cierre de Ronda 1:** Las autoridades firman un bloque de cierre en la Tangle. Los datos de la colección `tangle_votos` pasan a estado de `SÓLO LECTURA`.
2.  **Respaldo Inmutable:** Se genera un snapshot (foto fija) de la Tangle para auditoría histórica.
3.  **Apertura de Ronda 2:**
    *   Se habilita una nueva colección dinámica: `tangle_votos_ronda2`.
    *   **Reset de Elegibilidad:** Se ejecuta un proceso firmado por el quórum que reinicia el campo `ronda_actual_votó` a `false` en el Nodo A, permitiendo que el padrón sea reutilizado sin borrar identidades.
    *   **Actualización de Cédula:** Se carga la nueva lista de los dos finalistas siguiendo el mismo protocolo de firmas biométricas.

---

## 4. Auditoría Forense Permanente
Al finalizar el proceso, los investigadores pueden comparar el Nodo A con el Nodo B para verificar que:
*   Total de Votos (Nodo B) == Total de Ciudadanos que marcaron "Ya votó" (Nodo A).
*   No existen votos en el Nodo B cuya identidad no figure como `ACTIVO` en el Nodo A.
