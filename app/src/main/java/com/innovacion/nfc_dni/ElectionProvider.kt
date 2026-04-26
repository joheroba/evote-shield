package com.innovacion.nfc_dni

import android.content.Context

object ElectionProvider {
    
    private var electionSteps: List<ElectionCategory> = listOf()

    fun initialize(context: Context, jsonString: String? = null) {
        electionSteps = if (jsonString != null) {
            parseJson(jsonString)
        } else {
            getPeruvianElectionMockData()
        }
    }

    private fun parseJson(json: String): List<ElectionCategory> {
        return getPeruvianElectionMockData() 
    }

    fun getElectionSteps(): List<ElectionCategory> = electionSteps

    private fun getPeruvianElectionMockData(): List<ElectionCategory> {
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
            ElectionCategory(
                title = "PRESIDENTE Y VICEPRESIDENTES",
                type = VoteType.PRESIDENTIAL,
                candidates = partidosOficiales,
                instructionText = "Marque con una cruz (+) o un aspa (x) sobre el símbolo."
            ),
            ElectionCategory(
                title = "SENADORES NACIONALES",
                type = VoteType.CONGRESSIONAL,
                candidates = partidosOficiales,
                prefConfig = PreferentialConfig(count = 2, minValue = 1, maxValue = 100),
                instructionText = "Marque el símbolo y escriba hasta DOS números."
            ),
            ElectionCategory(
                title = "PARLAMENTO ANDINO",
                type = VoteType.CONGRESSIONAL,
                candidates = partidosOficiales,
                prefConfig = PreferentialConfig(count = 2, minValue = 1, maxValue = 15),
                instructionText = "Marque el símbolo y escriba hasta DOS números."
            )
        )
    }
}
