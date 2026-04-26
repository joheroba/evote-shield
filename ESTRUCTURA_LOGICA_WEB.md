# Estructura Lógica y Visual: Web E-Vote Shield

Este documento describe la implementación técnica de la presentación interactiva para su análisis en NotebookLM.

## 1. Flujo de Narrativa (Slides)
La aplicación web utiliza un sistema de 10 estaciones (slides) que guían al espectador desde el problema hasta la solución técnica:
1. **Crisis Electoral:** Diagnóstico del colapso de confianza.
2. **Puntos de Quiebre:** Fraude en mesa, custodia ciega y centralización.
3. **Solución Shield:** Presentación de NFC, DAG y Biometría.
4. **Identidad (NFC):** Uso del chip del DNIe como llave inviolable.
5. **Blindaje de Autoridades:** Protocolo de Quórum Biométrico (JNE + ONPE + Sociedad Civil). Requiere DNIe + Facial para activar la elección (Apertura de Nodo).
6. **Filtro Ciudadano (Doble Validación):** Nodo A (RENIEC) para verificar elegibilidad y estado vital / Nodo B (Tangle) para evitar doble voto.
7. **Red Tangle (DAG):** Explicación de la inmutabilidad distribuida.
8. **Centro de Monitoreo:** Visualización en tiempo real de transacciones y salud de la red (Modo Fullscreen disponible).
9. **Impacto Directo:** Escrutinio 0.0s y Segunda Vuelta el mismo día (Art. 111 Const).
10. **Cierre:** Enlace oficial de descarga de la APK Demo v1.7.

## 2. Componentes Críticos de Biometría Facial
### A. Biometría de Autoridad (Control de Acceso)
Se utiliza como factor de desbloqueo de claves criptográficas compartidas. Es una validación de identidad contra el certificado del DNIe para asegurar que solo las autoridades designadas inicien el proceso.

### B. Biometría de Ciudadano (Prueba de Vida)
Se utiliza como filtro contra el fraude. Implementa "Liveness Detection" para asegurar que el votante es una persona real y presente, eliminando la posibilidad de usar DNIs de fallecidos o suplantar identidades mediante fotos o videos.

## 3. Lógica de Auditoría y Eficiencia
El sistema permite una transparencia radical mediante el Centro de Monitoreo y una eficiencia masiva permitiendo la Segunda Vuelta Instantánea, reduciendo costos logísticos de traslado y custodia física.
