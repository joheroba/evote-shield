import hashlib
import time
import json

class SapiCentralServer:
    """Simulador de Servidor Central de Evidencias"""
    
    def __init__(self):
        self.central_ledger = []
        print("🏛️  SERVIDOR CENTRAL S.A.P.I. ONLINE")
        print("------------------------------------")

    fun generate_hash(self, data):
        return hashlib.sha256(data.encode()).hexdigest()

    def receive_report(self, encrypted_payload, mobile_hash):
        print(f"\n📡 Recibiendo Acta del Dispositivo Móvil...")
        time.sleep(1)
        
        # Simulación de verificación de integridad
        computed_hash = self.generate_hash(encrypted_payload)
        
        if computed_hash == mobile_hash:
            print(f"✅ VERIFICACIÓN DE INTEGRIDAD: EXITOSA")
            print(f"🔗 Enlazando a la Tangle Central...")
            
            entry = {
                "payload": encrypted_payload,
                "hash": computed_hash,
                "server_timestamp": time.ctime(),
                "node_status": "COMMITTED"
            }
            self.central_ledger.append(entry)
            print(f"📊 Estado del Ledger: {len(self.central_ledger)} Acta(s) Inmutables.")
        else:
            print(f"❌ ERROR: INTEGRIDAD COMPROMETIDA. EL HASH NO COINCIDE.")

# --- SIMULACIÓN DE PRUEBA ---
if __name__ == "__main__":
    server = SapiCentralServer()
    
    # Datos que vendrían de la App Android
    report_data = "OFFICER: RAMIREZ | LOC: -12.0464,-77.0428 | STATUS: EMERGENCY"
    mobile_hash = hashlib.sha256(report_data.encode()).hexdigest()
    
    # 1. Simulación de sincronización exitosa
    server.receive_report(report_data, mobile_hash)
    
    # 2. Simulación de intento de alteración (Hackeo)
    print("\n--- SIMULANDO ATAQUE EN LA RED ---")
    hacked_data = "OFFICER: RAMIREZ | LOC: 00.0000,00.0000 | STATUS: MODIFIED"
    server.receive_report(hacked_data, mobile_hash)
