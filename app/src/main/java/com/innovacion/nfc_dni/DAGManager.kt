package com.innovacion.nfc_dni

import android.util.Log
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.Source

class DAGManager {

    private val tangle = mutableListOf<VoteBlock>()
    private val db = FirebaseFirestore.getInstance()
    
    init {
        val genesis = VoteBlock("GENESIS_VOTE", "0", "0", 0, 0)
        tangle.add(genesis)
    }

    /**
     * Prueba técnica de latencia y conexión con Firebase para diagnóstico inicial
     */
    fun testFirebaseConnection(callback: (Boolean) -> Unit) {
        db.collection("padron_nacional").limit(1).get(Source.SERVER)
            .addOnSuccessListener { callback(true) }
            .addOnFailureListener { e ->
                Log.e("DAGManager", "Fallo de conexión inicial a Firebase", e)
                callback(false) 
            }
    }

    /**
     * Verifica elegibilidad en Nodo A (RENIEC)
     */
    fun checkGlobalVoterStatus(voterId: String, callback: (Boolean) -> Unit) {
        // Consultamos la colección 'padron_nacional' (Nodo A)
        db.collection("padron_nacional").document(voterId).get()
            .addOnSuccessListener { document ->
                // Si el documento existe y el campo 'ha_votado' es true, es un doble voto
                val hasVoted = document.getBoolean("ha_votado") ?: false
                callback(hasVoted)
            }
            .addOnFailureListener {
                Log.e("DAGManager", "Error al consultar padrón", it)
                callback(false) 
            }
    }

    /**
     * Registro en Nodo A (RENIEC) y Nodo B (TANGLE)
     */
    fun addVote(encryptedVote: String, voterId: String, onComplete: (Boolean) -> Unit) {
        val tips = getTips()
        val newBlock = VoteBlock(
            votePayload = encryptedVote,
            parent1 = tips.first,
            parent2 = tips.second
        )

        // 1. Actualizamos Nodo A (Marcar como 'ya votó')
        db.collection("padron_nacional").document(voterId)
            .update("ha_votado", true)
            .addOnSuccessListener {
                // 2. Si el Nodo A autoriza, registramos en Nodo B (Tangle)
                val voteData = mapOf(
                    "payload" to encryptedVote,
                    "timestamp" to FieldValue.serverTimestamp(),
                    "hash" to newBlock.hash
                )

                db.collection("tangle_votos").add(voteData)
                    .addOnSuccessListener {
                        tangle.add(newBlock)
                        onComplete(true)
                    }
                    .addOnFailureListener {
                        onComplete(false)
                    }
            }
            .addOnFailureListener { e ->
                // Si falla el update, es probable que el DNI no exista en el padrón 
                // o no haya internet. Para la DEMO, si no existe el doc, lo creamos:
                registrarNuevoVotanteDemo(voterId, encryptedVote, newBlock, onComplete)
            }
    }

    private fun registrarNuevoVotanteDemo(voterId: String, payload: String, block: VoteBlock, onComplete: (Boolean) -> Unit) {
        val nuevoVotante = mapOf("ha_votado" to true, "estado" to "ACTIVO")
        db.collection("padron_nacional").document(voterId).set(nuevoVotante)
            .addOnSuccessListener {
                db.collection("tangle_votos").add(mapOf("payload" to payload, "hash" to block.hash))
                    .addOnSuccessListener { 
                        tangle.add(block)
                        onComplete(true) 
                    }
            }
            .addOnFailureListener { onComplete(false) }
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
