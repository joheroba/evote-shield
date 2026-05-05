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
                .addOnFailureListener { e -> Log.e("DAGManager", "Fallo de Handshake: ${e.message}") }
        }
    }

    fun checkVoterRegistration(voterId: String, onResult: (Boolean) -> Unit) {
        // En una demo real, consultamos la colección 'padron_prueba'
        db.collection("padron_prueba").document(voterId).get(Source.DEFAULT)
            .addOnSuccessListener { document ->
                onResult(document.exists())
            }
            .addOnFailureListener {
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
                    val err = "Error Auth: ${e.message}"
                    Log.e("DAGManager", err)
                    onResult(false, err)
                }
        } else {
            checkConnection(onResult)
        }
    }

    private fun checkConnection(onResult: (Boolean, String?) -> Unit) {
        db.collection("tangle_votos").limit(1).get(Source.DEFAULT)
            .addOnSuccessListener { 
                Log.d("DAGManager", "Conexión establecida con Tangle")
                onResult(true, null) 
            }
            .addOnFailureListener { e ->
                val detailedError = when {
                    e.message?.contains("Permission denied") == true -> "Error: Permisos (Reglas)"
                    e.message?.contains("Unable to resolve host") == true -> "Error: Sin Internet"
                    e.message?.contains("Failed to get document from server") == true -> "Error: Servidor ocupado o lento"
                    else -> "Error: ${e.localizedMessage ?: e.message}"
                }
                Log.e("DAGManager", "Error Firestore: ${e.message}")
                onResult(false, detailedError) 
            }
    }

    fun addVote(encryptedVote: String, voterId: String, onComplete: (Boolean) -> Unit) {
        val tips = getTips()
        val newBlock = VoteBlock(encryptedVote, tips.first, tips.second)

        val voteData = hashMapOf(
            "payload" to encryptedVote,
            "timestamp" to FieldValue.serverTimestamp(),
            "hash" to newBlock.hash,
            "voterId" to voterId,
            "device" to android.os.Build.MODEL
        )

        db.collection("tangle_votos").add(voteData)
            .addOnSuccessListener {
                tangle.add(newBlock)
                onComplete(true)
            }
            .addOnFailureListener { e ->
                Log.e("DAGManager", "Error al encolar: ${e.message}")
                onComplete(false)
            }
    }

    private fun getTips(): Pair<String, String> {
        return if (tangle.size >= 2) Pair(tangle[tangle.size - 1].hash, tangle[tangle.size - 2].hash)
        else Pair(tangle.last().hash, tangle.last().hash)
    }

    fun getVoteCount(): Int = tangle.size - 1
}
