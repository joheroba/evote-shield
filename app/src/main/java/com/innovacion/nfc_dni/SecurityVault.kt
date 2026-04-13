package com.innovacion.nfc_dni

import java.security.*
import java.security.spec.ECGenParameterSpec
import java.util.Base64

/**
 * La Bóveda de Seguridad: Maneja llaves asimétricas y firmas digitales
 * para asegurar la inmutabilidad de cada voto por DNIe.
 */
class SecurityVault {

    private val keyPair: KeyPair

    init {
        // Generando llaves usando Curva Elíptica (NIST P-256)
        // Muy eficiente para dispositivos móviles y extremadamente segura.
        val kpg = KeyPairGenerator.getInstance("EC")
        kpg.initialize(ECGenParameterSpec("secp256r1"))
        keyPair = kpg.generateKeyPair()
    }

    /**
     * Firma un paquete de datos (el voto) para asegurar que no ha sido alterado.
     */
    fun signVote(data: String): String {
        val signature = Signature.getInstance("SHA256withECDSA")
        signature.initSign(keyPair.private)
        signature.update(data.toByteArray())
        val signedBytes = signature.sign()
        return Base64.getEncoder().encodeToString(signedBytes)
    }

    /**
     * Verifica que un voto en la Tangle sea auténtico usando la llave pública.
     */
    fun verifyVote(data: String, signatureStr: String, publicKey: PublicKey): Boolean {
        return try {
            val signature = Signature.getInstance("SHA256withECDSA")
            signature.initVerify(publicKey)
            signature.update(data.toByteArray())
            val signatureBytes = Base64.getDecoder().decode(signatureStr)
            signature.verify(signatureBytes)
        } catch (e: Exception) {
            false
        }
    }

    fun getPublicKey(): PublicKey = keyPair.public
}
