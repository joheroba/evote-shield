package com.innovacion.nfc_dni

import android.util.Log
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.FieldValue

class DAGManager {

    private val tangle = mutableListOf<VoteBlock>()
    private val db = FirebaseFirestore.getInstance()
    
    init {
        val genesis = VoteBlock("GENESIS_VOTE", "0", "0", 0, 0)
        tangle.add(genesis)
    }

    /**
     * Verifica si el DNI ya votó consultando la base de datos GLOBAL en Firebase.
     */
    fun checkGlobalVoterStatus(voterId: String, callback: (Boolean) -> Unit) {
        db.collection("padron_electoral").document(voterId).get()
            .addOnSuccessListener { document ->
                callback(document.exists())
            }
            .addOnFailureListener {
                Log.e("DAGManager", "Error al consultar Firebase", it)
                callback(false) // En caso de error, por seguridad de demo permitimos, pero en producción se bloquearía
            }
    }

    /**
     * Registra el voto en la Tangle local y en la base de datos GLOBAL de Firebase.
     */
    fun addVote(encryptedVote: String, voterId: String, onComplete: (Boolean) -> Unit) {
        val tips = getTips()
        val newBlock = VoteBlock(
            votePayload = encryptedVote,
            parent1 = tips.first,
            parent2 = tips.second
        )

        // Registro en Firebase para evitar doble voto global
        val voterRecord = mapOf(
            "timestamp" to FieldValue.serverTimestamp(),
            "voteHash" to newBlock.hash
        )

        db.collection("padron_electoral").document(voterId)
            .set(voterRecord)
            .addOnSuccessListener {
                tangle.add(newBlock)
                Log.d("DAGManager", "Voto registrado globalmente: ${newBlock.hash}")
                onComplete(true)
            }
            .addOnFailureListener { e ->
                Log.e("DAGManager", "Fallo al registrar voto global", e)
                onComplete(false)
            }
    }

    private fun getTips(): Pair<String, String> {
        return if (tangle.size >= 2) {
            Pair(tangle[tangle.size - 1].hash, tangle[tangle.size - 2].hash)
        } else {
            Pair(tangle.last().hash, tangle.last().hash)
        }
    }

    fun getVoteCount(): Int = tangle.size - 1
}
