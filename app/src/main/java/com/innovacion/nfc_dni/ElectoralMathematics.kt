package com.innovacion.nfc_dni

/**
 * Motor de Cálculo Electoral: Implementa el sistema D'Hondt y Mayoría Simple
 * según la normativa electoral peruana.
 */
object ElectoralMathematics {

    /**
     * Aplica el Método D'Hondt para distribuir escaños.
     * @param partyVotes Mapa de ID de Partido -> Total de Votos Válidos
     * @param totalSeats Número de escaños a repartir (ej: 130 para el Congreso)
     * @return Mapa de ID de Partido -> Número de Escaños asignados
     */
    fun applyDHondt(partyVotes: Map<Int, Int>, totalSeats: Int): Map<Int, Int> {
        if (partyVotes.isEmpty() || totalSeats <= 0) return emptyMap()

        val results = mutableMapOf<Int, Int>()
        val quotients = mutableListOf<QuotientEntry>()

        // 1. Generar cocientes (Votos / n)
        partyVotes.forEach { (partyId, votes) ->
            results[partyId] = 0 // Inicializar
            for (i in 1..totalSeats) {
                quotients.add(QuotientEntry(partyId, votes.toDouble() / i))
            }
        }

        // 2. Ordenar cocientes de mayor a menor
        quotients.sortByDescending { it.value }

        // 3. Asignar escaños a los 'n' cocientes más altos
        for (i in 0 until totalSeats) {
            if (i < quotients.size) {
                val partyId = quotients[i].partyId
                results[partyId] = results.getOrDefault(partyId, 0) + 1
            }
        }

        return results
    }

    /**
     * Aplica el Sistema Mayoritario (First-Past-The-Post).
     * Usado para Senadores Regionales en departamentos con 1 solo escaño.
     */
    fun applyMajorityWinner(partyVotes: Map<Int, Int>): Int? {
        return partyVotes.maxByOrNull { it.value }?.key
    }

    private data class QuotientEntry(val partyId: Int, val value: Double)
}
