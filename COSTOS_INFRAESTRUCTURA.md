# 🏛️ Informe Técnico: Infraestructura y Costos para Despliegue Nacional (E-Vote Shield)

Este documento detalla la arquitectura, requerimientos de hardware y estimación de costos para soportar un proceso electoral de **27 millones de votantes** (Escala Nacional Perú).

---

## 1. Arquitectura de Despliegue: "Hybrid Edge-Cloud"

Para garantizar resiliencia (incluso sin internet) y escalabilidad masiva, se propone una arquitectura en tres capas:

1.  **Capa de Usuario (Edge):** Apps móviles en dispositivos de los votantes o tablets de mesa (Clientes Ligeros).
2.  **Capa de Agregación (Local de Votación):** Nodos de Mesa que actúan como gateways y validadores locales.
3.  **Capa de Persistencia (Cloud):** Clúster de nodos Tangle (IOTA) y servicios de validación de identidad (RENIEC/ONPE).

---

## 2. Equipamiento en Centros de Votación (Hardware)

Se estima la necesidad de equipar aproximadamente **80,000 mesas de sufragio**.

| Equipo | Características Sugeridas | Cantidad Est. | Costo Unitario (USD) | Costo Total (Millones USD) |
| :--- | :--- | :--- | :--- | :--- |
| **Tablet de Votación** | Pantalla 10", NFC Integrado, Android 11+, Batería 7000mAh | 85,000 | $150.00 | $12.75 |
| **Nodo de Mesa (Laptop/NUC)** | Procesador i5 (11va Gen), 16GB RAM, SSD 512GB, Ubuntu Server | 10,000* | $600.00 | $6.00 |
| **Router de Alta Densidad** | Soporte para 100+ conexiones simultáneas (Wi-Fi 6) | 10,000 | $120.00 | $1.20 |

*\*Un nodo de mesa puede gestionar hasta 8-10 mesas de votación en un mismo local.*

---

## 3. Infraestructura de Nube (Backend & Tangle)

Se requiere un despliegue en la nube (AWS, Azure o GCP) bajo un modelo de **Escalabilidad Elástica**.

### Características del Clúster Cloud:
*   **Balanceadores de Carga (ALB/Nginx):** Para gestionar 27M de peticiones en un rango de 12 horas.
*   **API Cluster (Kubernetes):** 200+ pods de microservicios para validación de certificados de DNIe.
*   **Base de Datos (Redis + Cassandra):** Almacenamiento distribuido para evitar el doble voto en < 50ms.
*   **Tangle Private Mainnet:** 50 nodos de alta capacidad (IOTA Hornet) para confirmación de bloques.

### Estimación de Costos Cloud (Periodo Electoral - 1 mes):
| Servicio | Descripción | Costo Est. (USD) |
| :--- | :--- | :--- |
| **Cómputo (EC2/EKS)** | Nodos para APIs y Tangle (Instancias tipo c6g.4xlarge) | $85,000 |
| **Bases de Datos** | Instancias Managed (Aurora/DynamoDB) | $25,000 |
| **Tráfico de Red** | Transferencia de datos y protección WAF/DDoS | $45,000 |
| **Validación Identidad** | Consultas externas y Oráculos de Revocación | $20,000 |
| **TOTAL ESTIMADO NUBE** | | **$175,000 / evento** |

---

## 4. Estrategia contra el "DNI de Fallecidos"

La App implementa un sistema de **"Voto Vivo"**:
1.  **Lectura NFC:** Extrae la llave pública del chip del DNIe.
2.  **Desafío-Respuesta:** El servidor envía un reto aleatorio que solo el chip físico del DNIe puede firmar (evita clones).
3.  **Consulta de Revocación (CRL/OCSP):** El sistema consulta en milisegundos si el certificado de ese DNI ha sido revocado por fallecimiento o pérdida de derechos civiles.
4.  **Si el ciudadano está fallecido:** La RENIEC revoca el certificado en su CA; la App detecta la revocación y **anula la sesión de votación automáticamente**.

---

## 5. Resumen Ejecutivo para Decisores

*   **Inversión Inicial en Hardware:** ~$20M USD (Equipos reutilizables para múltiples elecciones).
*   **Costo por Votante (Nube):** ~$0.006 USD (Menos de un centavo de dólar por voto procesado).
*   **Ahorro Proyectado:** Reducción del 90% en costos de impresión de actas, logística de transporte físico y personal de escrutinio manual.

---

**Nota:** Estos costos son aproximaciones de mercado. Para un proyecto real, se requiere una licitación con proveedores de servicios de nube gubernamental que ofrecen tarifas preferenciales por volumen y soberanía de datos.
