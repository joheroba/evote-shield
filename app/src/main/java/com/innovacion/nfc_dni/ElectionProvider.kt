package com.innovacion.nfc_dni

import android.content.Context

object ElectionProvider {
    
    private var electionSteps: List<ElectionCategory> = listOf()

    fun initialize(context: Context, jsonString: String? = null) {
        electionSteps = if (jsonString != null) {
            parseJson(jsonString)
        } else {
            getGlobalTestBallot()
        }
    }

    private fun parseJson(json: String): List<ElectionCategory> {
        return getGlobalTestBallot() 
    }

    fun getElectionSteps(): List<ElectionCategory> = electionSteps

    private fun getGlobalTestBallot(): List<ElectionCategory> {
        val partidosOficiales = listOf(
            Candidate(1, "Victor Garcia", "ALIANZA VENCEREMOS ✌️"),
            Candidate(2, "Elena Rojas", "PARTIDO PATRIÓTICO 🇵🇪"),
            Candidate(3, "Ricardo Belmonte", "CÍVICO OBRAS 🏗️"),
            Candidate(4, "Ezequiel Ataucusi", "FREPAP 🐟"),
            Candidate(5, "Jose Luna", "PODEMOS PERÚ 🅿️"),
            Candidate(6, "Keiko Sofia", "FUERZA POPULAR 🧡"),
            Candidate(7, "Rafael Lopez", "RENOVACIÓN POPULAR 🌊"),
            Candidate(8, "Candidato 8", "PARTIDO DEL PUEBLO"),
            Candidate(9, "Candidato 9", "UNIÓN NACIONAL"),
            Candidate(10, "Candidato 10", "FRENTE AMPLIO"),
            Candidate(11, "Candidato 11", "DEMOCRACIA DIRECTA"),
            Candidate(12, "Candidato 12", "PERÚ SEGURO")
        )

        return listOf(
            // 1. Pregunta Referéndum
            ElectionCategory(
                title = "¿NUEVO PROCESO DE VOTACIÓN?",
                type = VoteType.REFERENDUM,
                referendumOptions = listOf(
                    ReferendumOption(101, "SÍ"),
                    ReferendumOption(102, "NO")
                ),
                instructionText = "Marque con una cruz (+) o un aspa (x) sobre su opción."
            ),
            // 2. Pregunta Presidencial
            ElectionCategory(
                title = "ELECCIÓN PRESIDENCIAL",
                type = VoteType.PRESIDENTIAL,
                candidates = partidosOficiales,
                instructionText = "¿Cuál es el candidato presidencial que a su criterio debería ganar?"
            ),
            // 3. Pregunta Senado
            ElectionCategory(
                title = "MAYORÍA EN EL SENADO",
                type = VoteType.CONGRESSIONAL,
                candidates = partidosOficiales,
                prefConfig = PreferentialConfig(count = 2, minValue = 1, maxValue = 100),
                instructionText = "¿Qué partido político debería tener mayoría en el senado? (Escriba números si desea voto preferencial)"
            ),
            // 4. Pregunta Diputados
            ElectionCategory(
                title = "MAYORÍA EN DIPUTADOS",
                type = VoteType.CONGRESSIONAL,
                candidates = partidosOficiales,
                prefConfig = PreferentialConfig(count = 2, minValue = 1, maxValue = 100),
                instructionText = "¿Qué partido político debería tener mayoría en diputados?"
            )
        )
    }
}
