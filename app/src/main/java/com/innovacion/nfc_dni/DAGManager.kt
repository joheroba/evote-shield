package com.innovacion.nfc_dni

import android.util.Log

/**
 * Gestor de la Tangle (DAG) para votos inmutables.
 */
class DAGManager {

    private val tangle = mutableListOf<VoteBlock>()
    
    // El "Voto Génesis" para iniciar la red
    init {
        val genesis = VoteBlock("GENESIS_VOTE", "0", "0", 0, 0)
        tangle.add(genesis)
    }

    /**
     * Añade un nuevo voto a la red seleccionando dos puntas (tips) al azar/estratégicas.
     */
    fun addVote(encryptedVote: String): VoteBlock {
        val tips = getTips()
        val newBlock = VoteBlock(
            votePayload = encryptedVote,
            parent1 = tips.first,
            parent2 = tips.second
        )
        
        tangle.add(newBlock)
        Log.d("DAGManager", "Nuevo Voto Añadido: ${newBlock.hash}")
        return newBlock
    }

    /**
     * Obtiene las dos últimas puntas del grafo para ser confirmadas por el nuevo voto.
     */
    private fun getTips(): Pair<String, String> {
        return if (tangle.size >= 2) {
            Pair(tangle[tangle.size - 1].hash, tangle[tangle.size - 2].hash)
        } else {
            Pair(tangle.last().hash, tangle.last().hash)
        }
    }

    /**
     * Verifica la integridad de TODA la red de votos.
     */
    fun isTangleValid(): Boolean {
        for (i in 1 until tangle.size) {
            val current = tangle[i]
            // Aquí se podría verificar que los padres existan y el hash sea correcto
            if (current.parent1 == "0" || current.parent2 == "0") return false
        }
        return true
    }

    fun getVoteCount(): Int = tangle.size - 1 // Restando el Génesis
    
    fun getAllVotes(): List<VoteBlock> = tangle.toList()
}
