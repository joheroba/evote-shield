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
            Candidate(7, "Rafael Lopez", "RENOVACIÓN POPULAR 🌊")
        )

        return listOf(
            // 1. PRESIDENTE (Foto + Símbolo)
            ElectionCategory(
                title = "PRESIDENTE Y VICEPRESIDENTES",
                type = VoteType.PRESIDENTIAL,
                candidates = partidosOficiales,
                instructionText = "Marque con una cruz (+) o un aspa (x) dentro del recuadro del símbolo y/o fotografía de su preferencia."
            ),

            // 2. SENADORES NACIONALES (Distrito Único - 2 números)
            ElectionCategory(
                title = "SENADORES (A NIVEL NACIONAL)",
                type = VoteType.CONGRESSIONAL,
                candidates = partidosOficiales,
                prefConfig = PreferentialConfig(count = 2, minValue = 1, maxValue = 100),
                instructionText = "Marque el símbolo y, si desea, escriba hasta DOS números de su preferencia."
            ),

            // 3. SENADORES REGIONALES (Ej: Lima - 2 números)
            ElectionCategory(
                title = "SENADORES (A NIVEL REGIONAL)",
                type = VoteType.CONGRESSIONAL,
                candidates = partidosOficiales,
                prefConfig = PreferentialConfig(count = 2, minValue = 1, maxValue = 50),
                instructionText = "Elección regional: Marque el símbolo y escriba hasta DOS números."
            ),

            // 4. DIPUTADOS (1 número - según su requerimiento)
            ElectionCategory(
                title = "DIPUTADOS (A NIVEL REGIONAL)",
                type = VoteType.CONGRESSIONAL,
                candidates = partidosOficiales,
                prefConfig = PreferentialConfig(count = 1, minValue = 1, maxValue = 30),
                instructionText = "Marque el símbolo y escriba UN número de su preferencia."
            ),

            // 5. PARLAMENTO ANDINO
            ElectionCategory(
                title = "PARLAMENTO ANDINO",
                type = VoteType.CONGRESSIONAL,
                candidates = partidosOficiales,
                prefConfig = PreferentialConfig(count = 2, minValue = 1, maxValue = 15),
                instructionText = "Marque el símbolo y escriba hasta DOS números para el Parlamento Andino."
            )
        )
    }
}
