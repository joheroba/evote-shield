# Dossier de Presentación: Aplicación E-Vote Shield

## 1. Visión General
**E-Vote Shield** es una prueba de concepto tecnológica que demuestra cómo el voto electrónico puede ser 100% seguro, auditable y resistente a la manipulación centralizada, utilizando hardware que ya poseen los ciudadanos (smartphones y DNIe).

## 2. Flujo de Experiencia del Usuario (Demo)

### Fase 1: Verificación de Humanidad
*   **Tecnología:** Uso de acelerómetro para detectar micro-temblores involuntarios.
*   **Propósito:** Asegurar que un "bot" o un script automatizado no está emitiendo votos. El sistema se bloquea si el celular está sobre una mesa o un soporte inanimado.

### Fase 2: Identificación Inviolable
*   **Método A (NFC):** Lectura del chip del DNI electrónico. Extrae el identificador único de hardware del chip.
*   **Método B (QR/PDF417):** Escaneo del código de barras del DNI para dispositivos sin NFC.
*   **Validación Global:** El sistema consulta en milisegundos una base de datos distribuida (Firebase) para asegurar que ese DNI no ha votado antes en ningún otro lugar del país.

### Fase 3: Proceso de Votación Multicapa
*   **Interfaz Dinámica:** La app guía al usuario por todas las categorías (Presidencial, Congresal, Referéndum).
*   **Voto Preferencial:** Sistema inteligente que valida rangos de números en tiempo real para evitar votos nulos por error humano.

### Fase 4: Blindaje y Registro (The Tangle)
*   **Firma Digital:** Al presionar "Finalizar", el dispositivo genera una firma digital única usando una clave privada segura.
*   **Registro Inmutable:** El voto se envía a una estructura de datos DAG (Tangle).
*   **Ticket de Auditoría:** El usuario recibe un Hash (código alfanumérico) único. Con este código, podrá verificar en el futuro que su voto existe en la red sin revelar el contenido del mismo.

## 3. Por qué es mejor que el sistema actual
1.  **Elimina el "Voto Golondrino":** El registro es instantáneo y global.
2.  **Transparencia Radical:** Cualquier organización puede tener una copia del registro de votos (DAG) y hacer su propio conteo en tiempo real.
3.  **Reducción de Costos:** No requiere impresión de cédulas ni despliegue logístico masivo de material físico susceptible de ser robado o alterado.
