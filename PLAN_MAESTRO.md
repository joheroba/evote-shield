# Plan de Implementación: App NFC DNIe & Sensores (Innovación)

Este proyecto busca crear una solución móvil capaz de interactuar con el chip NFC de los documentos de identidad electrónicos y aprovechar los sensores de hardware del dispositivo.

## Fase 1: Cimentación (Investigación y Setup)
- [ ] Definición del Stack Tecnológico (A espera de respuesta del usuario).
- [ ] Configuración del entorno de desarrollo en `c:\NFC_DNIe_Innovacion`.
- [ ] Estructura base del proyecto (Android Manifest y dependencias NFC).

## Fase 2: Módulo NFC (El Corazón)
- **Protocolo BAC/PACE:** Implementación de la captura de datos (Número DNI, Fecha Nacimiento, Fecha Expiración) para desbloquear el chip.
- **Lectura de Data Groups (DG):**
    - `DG1`: Datos personales (Nombres, Apellidos).
    - `DG2`: Fotografía biométrica (si los permisos lo permiten).

## Fase 3: Módulo de Sensores
- **Acelerómetro/Giroscopio:** Implementación de gestos o detección de movimiento para interactuar con la app.
- **Biometría:** Si el celular tiene lector de huella, integrar validación adicional.

---

## Plan de Verificación

### Pruebas de Software
- Emulación de etiquetas NFC para pruebas iniciales de detección.
- Unit tests para la lógica de derivación de claves (KDF).

### Pruebas de Hardware
- El usuario deberá compilar y correr el APK en un dispositivo físico con NFC activo.
- Verificación de la lectura del DNIe real (Proceso manual guiado).
