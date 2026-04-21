package com.innovacion.nfc_dni

data class Candidate(
    val id: Int,
    val name: String,
    val partyName: String,
    val photoUrl: String? = null,
    val symbolUrl: String? = null
)

enum class VoteType {
    PRESIDENTIAL,    // Foto + Símbolo del partido
    CONGRESSIONAL,   // Símbolo del partido + Números preferenciales en recuadros
    SIMPLE,          // Solo lista (ej: elección de junta)
    REFERENDUM       // Pregunta con opciones Sí/No o Personalizadas
}

data class PreferentialConfig(
    val count: Int = 0,         // Cuántos recuadros aparecen
    val minValue: Int = 1,      // Valor mínimo aceptado (ej: 1)
    val maxValue: Int = 100,    // Valor máximo aceptado (ej: 130)
    val allowDuplicates: Boolean = false
)

data class ReferendumOption(
    val id: Int,
    val text: String,
    val imageUrl: String? = null
)

data class ElectionCategory(
    val title: String,
    val type: VoteType,
    val candidates: List<Candidate> = emptyList(),
    val referendumOptions: List<ReferendumOption> = emptyList(),
    val prefConfig: PreferentialConfig = PreferentialConfig(),
    val instructionText: String? = null
)

data class UserVote(
    val categoryTitle: String,
    val selectedOptionId: Int?, // ID del candidato o de la opción de referéndum
    val preferentialNumbers: List<Int> = emptyList()
)

data class ElectionConfig(
    val id: String,
    val electionName: String,
    val categories: List<ElectionCategory>,
    val countingRules: String,
    val version: String
)
