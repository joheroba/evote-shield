package com.innovacion.nfc_dni

import kotlin.math.pow
import kotlin.math.sqrt

/**
 * Clase encargada de analizar si el movimiento del celular 
 * corresponde a un patrón humano (micro-temblores).
 */
class HumanDetector(private val windowSize: Int = 60) { // Aumentamos la ventana para mayor estabilidad

    private val samples = mutableListOf<Double>()
    
    // Umbral de varianza ajustado: 
    // - Mesa/Inerte: < 0.0001
    // - Brazo apoyado: 0.0008 - 0.002
    // - Mano alzada: > 0.005
    private val humanThreshold = 0.0008 // Más permisivo para brazos apoyados

    fun addSample(x: Float, y: Float, z: Float): Boolean {
        val magnitude = sqrt(x.toDouble().pow(2.0) + y.toDouble().pow(2.0) + z.toDouble().pow(2.0))
        
        samples.add(magnitude)
        
        if (samples.size > windowSize) {
            samples.removeAt(0)
            
            val variance = calculateVariance(samples)
            // Filtramos picos de ruido extremo y nos quedamos con el rango humano real
            return variance > humanThreshold && variance < 0.5
        }
        
        return false
    }

    private fun calculateVariance(data: List<Double>): Double {
        if (data.isEmpty()) return 0.0
        val mean = data.average()
        return data.sumOf { (it - mean).pow(2.0) } / data.size
    }
    
    fun getStatus(isHuman: Boolean): String {
        return if (isHuman) "✅ HUMANO DETECTADO (Pulso Real)" 
               else "⚠️ POSIBLE BOT / ESTÁTICO"
    }
}
