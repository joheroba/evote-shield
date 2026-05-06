package com.innovacion.nfc_dni

import android.util.Log
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.Source
import com.google.firebase.firestore.FirebaseFirestoreSettings
import com.google.firebase.auth.FirebaseAuth

import com.google.firebase.firestore.PersistentCacheSettings

class DAGManager {

    private val tangle = mutableListOf<VoteBlock>()
    private val db = FirebaseFirestore.getInstance()
    private val auth = FirebaseAuth.getInstance()
    
    init {
        setupFirestore()
        ensureAuth()
        
        val genesis = VoteBlock("GENESIS_VOTE", "0", "0", 0, 0)
        tangle.add(genesis)
    }

    private fun setupFirestore() {
        try {
            val settings = FirebaseFirestoreSettings.Builder()
                .setLocalCacheSettings(PersistentCacheSettings.newBuilder()
                    .setSizeBytes(FirebaseFirestoreSettings.CACHE_SIZE_UNLIMITED)
                    .build())
                .build()
            db.firestoreSettings = settings
        } catch (e: Exception) {
            Log.e("DAGManager", "Error en settings: ${e.message}")
        }
    }

    private fun ensureAuth() {
        if (auth.currentUser == null) {
            auth.signInAnonymously()
                .addOnSuccessListener { Log.d("DAGManager", "Handshake con Nodo Exitoso") }
                .addOnFailureListener { e -> 
                    Log.e("DAGManager", "Fallo de Handshake Auth: ${e.message}")
                    // No bloqueamos, permitimos que Firestore intente conectar solo
                }
        }
    }

    fun checkVoterRegistration(voterId: String, onResult: (Boolean) -> Unit) {
        // Forzamos servidor si es posible para asegurar que no sea un falso positivo de caché
        db.collection("padron_prueba").document(voterId).get(Source.SERVER)
            .addOnSuccessListener { document ->
                onResult(document.exists())
            }
            .addOnFailureListener { e ->
                Log.e("DAGManager", "Error Padrón: ${e.message}")
                // Si falla la red, permitimos pasar solo si ya estaba registrado localmente
                onResult(false) 
            }
    }

    fun testFirebaseConnection(onResult: (Boolean, String?) -> Unit) {
        if (auth.currentUser == null) {
            auth.signInAnonymously()
                .addOnSuccessListener { 
                    Log.d("DAGManager", "Auth Anónimo Exitoso para Test")
                    checkConnection(onResult)
                }
                .addOnFailureListener { e -> 
                    val err = "Error Auth: ${e.message}. Verifique si Auth Anónimo está activo en Consola."
                    Log.e("DAGManager", err)
                    // Intentamos conexión aun sin auth por si las reglas son públicas
                    checkConnection { success, _ ->
                        if (success) onResult(true, null)
                        else onResult(false, err)
                    }
                }
        } else {
            checkConnection(onResult)
        }
    }

    private fun checkConnection(onResult: (Boolean, String?) -> Unit) {
        // Intentamos una escritura pequeña para validar permisos reales de escritura
        val testRef = db.collection("network_tests").document("ping")
        testRef.set(mapOf("last_ping" to FieldValue.serverTimestamp()))
            .addOnSuccessListener { 
                Log.d("DAGManager", "Conexión TOTAL (R/W) establecida")
                onResult(true, null) 
            }
            .addOnFailureListener { e ->
                val detailedError = when {
                    e.message?.contains("Permission denied") == true -> "Error 403: Permisos de Nodo denegados. Revise reglas de Firestore."
                    e.message?.contains("Unable to resolve host") == true -> "Error: Sin Internet o DNS bloqueado."
                    else -> "Error de Nodo: ${e.localizedMessage ?: e.message}"
                }
                Log.e("DAGManager", "Error Firestore: ${e.message}")
                onResult(false, detailedError) 
            }
    }

    fun addVote(encryptedVote: String, voterId: String, onComplete: (Boolean, String?) -> Unit) {
        // --- BLINDAJE CONTRA EL DOBLE VOTO ---
        db.collection("tangle_votos").document(voterId).get()
            .addOnSuccessListener { document ->
                if (document.exists()) {
                    Log.w("DAGManager", "Intento de doble voto detectado para ID: $voterId")
                    onComplete(false, "ALERTA: Este DNI ya emitió un voto anteriormente.")
                } else {
                    val tips = getTips()
                    val newBlock = VoteBlock(encryptedVote, tips.first, tips.second)

                    val voteData = hashMapOf(
                        "payload" to encryptedVote,
                        "timestamp" to FieldValue.serverTimestamp(),
                        "hash" to newBlock.hash,
                        "voterId" to voterId,
                        "device" to android.os.Build.MODEL
                    )

                    db.collection("tangle_votos").document(voterId).set(voteData)
                        .addOnSuccessListener {
                            tangle.add(newBlock)
                            onComplete(true, null)
                        }
                        .addOnFailureListener { e ->
                            onComplete(false, "Error de red: ${e.message}")
                        }
                }
            }
            .addOnFailureListener { e ->
                onComplete(false, "Error de conexión con el nodo: ${e.message}")
            }
    }

    private fun getTips(): Pair<String, String> {
        return if (tangle.size >= 2) Pair(tangle[tangle.size - 1].hash, tangle[tangle.size - 2].hash)
        else Pair(tangle.last().hash, tangle.last().hash)
    }

    fun getVoteCount(): Int = tangle.size - 1
}
