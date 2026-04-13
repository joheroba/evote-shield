package com.innovacion.nfc_dni

import kotlin.math.pow
import kotlin.math.sqrt

/**
 * Clase encargada de analizar si el movimiento del celular 
 * corresponde a un patrón humano (micro-temblores).
 */
class HumanDetector(private val windowSize: Int = 30) {

    private val samples = mutableListOf<Double>()
    
    // Umbral de varianza: ajustable según pruebas en hardware real
    // Un celular sobre una mesa tiene varianza < 0.0005
    // Un celular en la mano tiene varianza > 0.005
    private val humanThreshold = 0.003

    fun addSample(x: Float, y: Float, z: Float): Boolean {
        // 1. Calcular Magnitud del Vector (Independiente de la rotación)
        val magnitude = sqrt(x.toDouble().pow(2.0) + y.toDouble().pow(2.0) + z.toDouble().pow(2.0))
        
        samples.add(magnitude)
        
        if (samples.size > windowSize) {
            samples.removeAt(0)
            
            val variance = calculateVariance(samples)
            return variance > humanThreshold
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
