# Propuesta Técnica: Sistema de Votación Descentralizado "E-Vote Shield"

## 1. Fundamento Legal
Basado en el **Capítulo III de la Constitución Política del Perú**, que garantiza el derecho de los ciudadanos a participar en los asuntos públicos y el deber del Estado de resguardar la voluntad popular.

## 2. Pilares Tecnológicos contra el Fraude

### A. Validación de Identidad Soberana (NFC + DNIe)
A diferencia de los sistemas tradicionales que dependen de una base de datos central manipulable, nuestra solución utiliza el chip del **DNI electrónico**:
*   **Autenticación Criptográfica:** El voto solo se desbloquea tras la validación física del chip NFC.
*   **Imposibilidad de Suplantación:** Elimina el uso de identidades falsas o fallecidas en el padrón.

### B. Detección de Humanidad (Anti-Bot)
Implementamos un algoritmo de **Análisis de Micro-vibraciones** (Acelerómetro) que detecta el pulso humano real. Esto evita:
*   Votaciones masivas automatizadas mediante emuladores o "granjas de celulares".
*   Garantiza que hay un ser humano físicamente presente sosteniendo el dispositivo.

### C. Arquitectura DAG (Directed Acyclic Graph)
En lugar de una base de datos lineal centralizada (fácil de alterar), los votos se registran en una estructura tipo **Tangle**:
*   **Inmutabilidad:** Cada nuevo voto valida dos votos anteriores, creando una red de confianza donde alterar un registro requeriría alterar toda la estructura.
*   **Descentralización:** El registro puede ser auditado por múltiples asociaciones civiles en tiempo real, actuando como nodos de validación independientes de la ONPE.

### D. Firma Digital de Extremo a Extremo
Cada voto sale del celular ya cifrado y firmado digitalmente. Nadie, ni siquiera el administrador del sistema, puede ver por quién votó el ciudadano, pero todos pueden verificar que el voto es legítimo.

---
## 3. Hoja de Ruta para la Independencia Electoral
1.  **Nodos de Observación:** Integrar a universidades y colegios profesionales como validadores del DAG.
2.  **Auditoría Ciudadana:** App pública para que cada ciudadano verifique su "Hash de Voto" sin revelar su elección.
3.  **Cifrado Homomórfico:** Permitir el conteo total de votos sin necesidad de desencriptar las cédulas individuales.
