# Protocolo Cero: Ingestión del Padrón Electoral RENIEC y Reseteo de Red (Génesis)

Este documento establece el protocolo técnico estricto para transicionar de un entorno de pruebas (Local/Global) al **Entorno de Producción Oficial** para las Elecciones 2026.

---

## FASE 1: Aislamiento y Destrucción de Datos de Prueba
Antes de recibir el Padrón Oficial, el entorno de Producción debe estar criptográficamente "limpio".
1. **Separación de Entornos:** Se crean proyectos en Google Cloud / Firebase totalmente nuevos y aislados (`evote-shield-prod`), sin conexión con el entorno de pruebas (`evote-shield-test`).
2. **Hard-Reset (Wipe):** Se destruyen todas las colecciones de la base de datos de pruebas si se reutiliza infraestructura.
3. **Generación de Llaves Maestras:** Las 3 autoridades (JNE, ONPE, Sociedad Civil) generan sus llaves privadas (RSA-4096) en hardware seguro (HSM). Nadie tiene acceso a la llave completa.

---

## FASE 2: Protocolo de Transferencia RENIEC (Zero-Knowledge)
El mayor riesgo de seguridad es filtrar la base de datos de RENIEC o permitir votantes falsos. Por ende, **E-Vote Shield NO almacena datos legibles de los ciudadanos**.

1. **Canal Seguro:** La transferencia desde RENIEC se realiza por un túnel VPN IPSec dedicado de uso gubernamental.
2. **Hasheo Unidireccional (Hashing):** 
   * RENIEC no enviará la tabla de DNI en texto plano. 
   * Durante la ingestión, un script automatizado (en Python/Node) convierte cada DNI en un Hash criptográfico usando un "Sal" (Salt) secreto del Estado. 
   * *Ejemplo:* El DNI `12345678` se guarda como `a7f9x...2b1`. Si la base de datos es robada, nadie puede saber a quién pertenecen los hashes.
3. **Bandera de Estado:** Cada ciudadano ingresa con una bandera lógica: `has_voted = false`.

---

## FASE 3: Congelamiento y Sello Criptográfico (Merkle Tree)
Una vez que se han importado los más de 25 millones de ciudadanos al padrón de E-Vote Shield:

1. **Raíz del Padrón (Padron Root Hash):** Se calcula un Hash único y gigante que representa la exactitud milimétrica de toda la base de datos importada.
2. **Publicación del Hash:** Este Hash maestro se publica en diarios nacionales y redes sociales.
3. **Bloqueo (Freeze):** La base de datos del padrón se configura con Reglas de Seguridad (ej. `firestore.rules`) como **Solo Lectura**. Ni siquiera los administradores de Google Cloud pueden agregar o borrar un ciudadano nuevo.
4. **Ceremonia de Génesis:** Las autoridades insertan el primer bloque vacío en la red Tangle (Bloque Génesis) firmado por sus 3 llaves. La elección ha comenzado legalmente.

---

## FASE 4: Ejecución del Sufragio
Durante la elección, cuando un ciudadano escanea su DNIe/Azul:
1. El celular calcula el Hash de su DNI.
2. Consulta el Padrón de Solo Lectura. Si existe y `has_voted = false`, le permite generar el paquete criptográfico de votación.
3. Al emitir el voto en la Tangle, un contrato inteligente secundario cambia irrevocablemente el estado del ciudadano a `has_voted = true`.
