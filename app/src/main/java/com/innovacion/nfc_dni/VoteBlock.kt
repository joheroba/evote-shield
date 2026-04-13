package com.innovacion.nfc_dni

import java.security.MessageDigest

/**
 * Representa un voto individual en la "Tangle" electoral.
 * Cada voto confirma dos votos anteriores.
 */
data class VoteBlock(
    val votePayload: String,      // Voto encriptado (ej: Option A)
    val parent1: String,          // Hash del voto anterior 1
    val parent2: String,          // Hash del voto anterior 2
    val timestamp: Long = System.currentTimeMillis(),
    val nonce: Int = 0             // Para una pequeña prueba de trabajo (Anti-Spam)
) {
    val hash: String by lazy { calculateHash() }

    private fun calculateHash(): String {
        val input = "$votePayload$parent1$parent2$timestamp$nonce"
        return MessageDigest.getInstance("SHA-256")
            .digest(input.toByteArray())
            .joinToString("") { "%02x".format(it) }
    }
}
