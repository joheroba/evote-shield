# Informe de Infraestructura y Costos: E-Vote Shield & S.A.P.I. 🌐💰

Para llevar estos proyectos a producción, necesitamos una infraestructura que cumpla con la **Ley de Gobierno Digital (D. Leg. 1412)** y garantice el **No Repudio**.

## 1. Características del Servidor (Recomendado)
Para manejar la Tangle (DAG) y las firmas digitales con fluidez, el servidor debe tener:
- **Procesador:** 2 vCPU (Optimizado para cómputo).
- **Memoria RAM:** 4GB (Mínimo) a 8GB (Recomendado para escalabilidad).
- **Almacenamiento:** 50GB a 80GB **NVMe SSD** (Crítico para la velocidad de la base de datos de la Tangle).
- **Red:** Transferencia de 4TB mensuales.
- **Seguridad:** Firewall de hardware y protección contra ataques DDoS.

## 2. Comparativa de Proveedores (Perú/Global)

| Proveedor | Plan Recomendado | Costo Estimado | Por qué elegirlo |
| :--- | :--- | :--- | :--- |
| **DigitalOcean** | 4GB RAM / 2 vCPU | **$24 - $48 / mes** | Simplicidad extrema y excelentes Droplets de red. |
| **Linode (Akamai)** | Standard 4GB | **$24 / mes** | Mejor soporte técnico y rendimiento estable para nodos. |
| **Hetzner** | CPX21 (4GB) | **€8 - €10 / mes** | La opción más económica si la latencia a Europa no es problema. |

## 3. Seguridad y Cumplimiento (GovTech Perú 🇵🇪)
Para que el acta policial o el voto electoral tenga validez jurídica total, el servidor debe implementar:
- **Certificación SSL/TLS 1.3:** Encriptación de tráfico de punta a punta.
- **Sistema de Stamping (Sellado de Tiempo):** Sincronización con el NTP oficial de la Marina de Guerra o similares para certificar el tiempo exacto.
- **Bóveda de Secretos:** Uso de *HashiCorp Vault* o servicios nativos para guardar las llaves maestras de la institución.

---
> [!TIP]
> **Mi Recomendación:** Empieza con un plan de **$24 USD en DigitalOcean**. Es escalable: si el próximo mes tienes 100,000 votantes, puedes duplicar la potencia con un solo clic.

---
*Análisis técnico desarrollado por Antigravity - Abril 2026*
