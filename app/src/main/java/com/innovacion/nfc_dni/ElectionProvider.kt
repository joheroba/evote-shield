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
            Candidate(1, "Ronald Atencio", "Alianza Venceremos"),
            Candidate(2, "Herbert Caller", "Partido Patriótico del Perú"),
            Candidate(3, "Ricardo Belmont", "Partido Cívico Obras"),
            Candidate(4, "Alex Gonzáles", "Partido Demócrata Verde"),
            Candidate(5, "Jorge Nieto", "Partido del Buen Gobierno"),
            Candidate(6, "Francisco Diez-Canseco", "Perú Acción"),
            Candidate(7, "Walter Chirinos", "Partido PRIN"),
            Candidate(8, "Paul Jaimes", "Progresemos"),
            Candidate(9, "Carlos Espá", "Sí Creo"),
            Candidate(10, "Carlos Álvarez", "País para Todos"),
            Candidate(11, "Fernando Olivera", "Frente de la Esperanza 2021"),
            Candidate(12, "Vladímir Cerrón", "Perú Libre"),
            Candidate(13, "Marisol Pérez Tello", "Primero La Gente"),
            Candidate(14, "Roberto Sánchez", "Juntos por el Perú"),
            Candidate(15, "José Luna Gálvez", "Podemos Perú"),
            Candidate(16, "Armando Massé", "Partido Democrático Federal"),
            Candidate(17, "Álvaro Paz de la Barra", "Fe en el Perú"),
            Candidate(18, "Wolfgang Grozo", "Integridad Democrática"),
            Candidate(19, "Keiko Fujimori", "Fuerza Popular"),
            Candidate(20, "César Acuña", "Alianza para el Progreso"),
            Candidate(21, "Yonhy Lescano", "Cooperación Popular"),
            Candidate(22, "Alfonso López Chau", "Ahora Nación"),
            Candidate(23, "Rafael Belaunde", "Libertad Popular"),
            Candidate(24, "Rosario Fernández", "Un Camino Diferente"),
            Candidate(25, "José Williams", "Avanza País"),
            Candidate(26, "Carlos Jaico", "Perú Moderno"),
            Candidate(27, "Mario Vizcarra", "Perú Primero"),
            Candidate(28, "Antonio Ortiz", "Salvemos al Perú"),
            Candidate(29, "George Forsyth", "Somos Perú"),
            Candidate(30, "Enrique Valderrama", "Partido Aprista Peruano"),
            Candidate(31, "Rafael López Aliaga", "Renovación Popular"),
            Candidate(32, "Charlie Carrasco", "Demócrata Unido Perú"),
            Candidate(33, "Fiorella Molinelli", "Alianza Fuerza y Libertad"),
            Candidate(34, "Roberto Chiabra", "Alianza Unidad Nacional"),
            Candidate(35, "Mesías Guevara", "Partido Morado")
        )

        return listOf(
            // 1. Referéndum de Coyuntura
            ElectionCategory(
                title = "REFERÉNDUM NACIONAL 2026",
                type = VoteType.REFERENDUM,
                referendumOptions = listOf(
                    ReferendumOption(101, "SÍ"),
                    ReferendumOption(102, "NO")
                ),
                instructionText = "¿Cree usted que deberían convocarse nuevas elecciones generales de inmediato?"
            ),
            // 2. Elección Presidencial
            ElectionCategory(
                title = "FÓRMULA PRESIDENCIAL",
                type = VoteType.PRESIDENTIAL,
                candidates = partidosOficiales,
                instructionText = "Seleccione el partido de su preferencia para la Presidencia de la República."
            ),
            // 3. Congreso de la República
            ElectionCategory(
                title = "CONGRESO DE LA REPÚBLICA",
                type = VoteType.CONGRESSIONAL,
                candidates = partidosOficiales,
                prefConfig = PreferentialConfig(count = 2, minValue = 1, maxValue = 130),
                instructionText = "Marque el símbolo y, si desea, escriba el número de sus candidatos preferidos."
            ),
            // 4. Parlamento Andino
            ElectionCategory(
                title = "PARLAMENTO ANDINO",
                type = VoteType.CONGRESSIONAL,
                candidates = partidosOficiales,
                prefConfig = PreferentialConfig(count = 2, minValue = 1, maxValue = 15),
                instructionText = "Seleccione su partido y candidatos para el Parlamento Andino."
            )
        )
    }
}
