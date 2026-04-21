package com.innovacion.nfc_dni

import java.security.*
import java.security.spec.ECGenParameterSpec
import java.util.Base64

/**
 * La Bóveda de Seguridad: Maneja llaves asimétricas y firmas digitales
 */
class SecurityVault {

    private val keyPair: KeyPair

    init {
        val kpg = KeyPairGenerator.getInstance("EC")
        kpg.initialize(ECGenParameterSpec("secp256r1"))
        keyPair = kpg.generateKeyPair()
    }

    fun signVote(data: String): String {
        val signature = Signature.getInstance("SHA256withECDSA")
        signature.initSign(keyPair.private)
        signature.update(data.toByteArray())
        val signedBytes = signature.sign()
        return Base64.getEncoder().encodeToString(signedBytes)
    }

    fun generateHash(data: String): String {
        val digest = MessageDigest.getInstance("SHA-256")
        val hashBytes = digest.digest(data.toByteArray())
        return hashBytes.joinToString("") { "%02x".format(it) }
    }

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
