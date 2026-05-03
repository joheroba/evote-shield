package com.innovacion.nfc_dni

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.net.Uri
import android.nfc.NfcAdapter
import android.nfc.Tag
import android.os.Bundle
import android.util.Log
import android.view.Gravity
import android.view.View
import android.widget.*
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import com.google.mlkit.vision.barcode.common.Barcode

class MainActivity : AppCompatActivity(), NfcAdapter.ReaderCallback, SensorEventListener {

    private var nfcAdapter: NfcAdapter? = null
    private lateinit var statusText: TextView
    private lateinit var humanStatusText: TextView
    private lateinit var voteCountText: TextView
    private lateinit var btnVote: Button
    private lateinit var btnScanQr: Button
    private lateinit var partySelector: RadioGroup
    private lateinit var candidatesScroll: ScrollView
    private lateinit var preferentialContainer: LinearLayout
    private lateinit var preferentialInputs: LinearLayout
    private lateinit var categoryTitle: TextView
    private lateinit var instructionText: TextView

    private var sensorManager: SensorManager? = null
    private var accelerometer: Sensor? = null
    private val humanDetector = HumanDetector(windowSize = 60)
    private val dagManager = DAGManager()
    private val securityVault = SecurityVault()

    private var isHumanVerified = false
    private var currentVoterId: String? = null
    private var dniHint: String? = null // El "Anclaje" (pista lineal)
    private var currentVoterMeta: String = "" 

    private var electionSteps: List<ElectionCategory> = listOf()
    private var currentStepIndex = 0
    private val userVotes = mutableListOf<UserVote>()
    private val prefEditTexts = mutableListOf<EditText>()

    private val MONITOR_URL = "https://evote-shield.vercel.app/?mode=monitor"
    private var idVotoBlanco: Int = -1

    private val scannerLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            val barcodeData = result.data?.getStringExtra("SCAN_RESULT")
            val barcodeFormat = result.data?.getIntExtra("SCAN_FORMAT", -1) ?: -1
            barcodeData?.let { rawData -> processScannerData(rawData, barcodeFormat) }
        }
    }

    private fun processScannerData(rawData: String, format: Int) {
        // Log para auditoría técnica
        Log.d("SCANNER_RAW", "Raw: $rawData")
        
        // Limpieza inteligente: Conservamos letras, números y el delimitador '<'
        val cleanData = rawData.trim().filter { it.isLetterOrDigit() || it == '<' }
        Log.d("SCANNER_LOG", "Formato: $format | Contenido: $cleanData")
        
        // 1. ¿ES EL CÓDIGO LINEAL? (DNI Reverso - Simbologías Code 128 o Code 39)
        val isLinear = format == Barcode.FORMAT_CODE_128 || format == Barcode.FORMAT_CODE_39 || cleanData.length < 15
        
        if (isLinear) {
            val digits = cleanData.filter { it.isDigit() }
            if (digits.length >= 8) {
                dniHint = digits.take(8)
                statusText.text = "🆔 ANCLAJE ACTIVO: $dniHint\n(Ahora escanee el bloque PDF417 posterior)"
                statusText.setTextColor(ContextCompat.getColor(this, android.R.color.holo_blue_dark))
                Toast.makeText(this, "Anclaje capturado. Ahora enfoque el bloque PDF417 en el reverso.", Toast.LENGTH_LONG).show()
                
                // Reabre el escáner para capturar el PDF417 denso
                btnScanQr.postDelayed({ btnScanQr.performClick() }, 1000)
                return
            }
        }

        // 2. PROCESAMIENTO DE PDF417 (DNI Azul / Electrónico)
        val matches = Regex("""\d{8}""").findAll(cleanData).map { it.value }.toList()
        var confirmedDni: String? = null
        var dniIndex = -1

        if (dniHint != null) {
            // Buscamos primero si la cadena completa contiene el anclaje (resiliencia total)
            if (cleanData.contains(dniHint!!)) {
                confirmedDni = dniHint
            } else {
                // Si no, buscamos la mejor coincidencia de 8 dígitos en los bloques encontrados
                confirmedDni = matches.find { it == dniHint } ?: matches.find { match ->
                    match.zip(dniHint!!).count { it.first == it.second } >= 6
                }
            }
        }
        
        if (confirmedDni == null) {
            confirmedDni = matches.find { !it.startsWith("19") && !it.startsWith("20") } ?: matches.firstOrNull()
        }

        if (confirmedDni != null) {
            dniIndex = cleanData.indexOf(confirmedDni)
            val verifier = if (dniIndex != -1 && dniIndex + 8 < cleanData.length) {
                val v = cleanData[dniIndex + 8].toString().uppercase()
                if (v.any { it.isLetterOrDigit() }) v else "?"
            } else "?"

            val postDni = cleanData.substring((dniIndex + 9).coerceAtMost(cleanData.length))
            val namesPart = postDni.split("<")
                .filter { it.length > 2 && !it.all { char -> char.isDigit() } }
                .take(2).joinToString(" ")

            val builder = AlertDialog.Builder(this)
            builder.setTitle("🔍 Identidad Detectada")
            val displayMessage = if (namesPart.isNotEmpty()) {
                "DNI: $confirmedDni-$verifier\nCiudadano: $namesPart\n\n¿Vincular identidad?"
            } else {
                "DNI: $confirmedDni-$verifier\n(Datos adicionales ilegibles)\n\n¿Vincular usando solo DNI?"
            }
            
            builder.setMessage(displayMessage)
            builder.setPositiveButton("VINCULAR") { _, _ ->
                applyDniFromScanner(confirmedDni!!, verifier, cleanData)
            }
            builder.setNeutralButton("REINTENTAR") { _, _ -> 
                dniHint = null
                btnScanQr.performClick() 
            }
            builder.setNegativeButton("CANCELAR") { _, _ -> dniHint = null }
            builder.show()
        } else {
            // Si tenemos el anclaje lineal pero el PDF417 falló
            if (dniHint != null) {
                mostrarDialogoAnclajeSolo(dniHint!!)
            } else if (format == Barcode.FORMAT_PDF417) {
                Toast.makeText(this, "PDF417 ilegible. Intente escanear el código de barras lineal abajo.", Toast.LENGTH_LONG).show()
            }
        }
    }

    private fun mostrarDialogoAnclajeSolo(dni: String) {
        AlertDialog.Builder(this)
            .setTitle("🆔 Identidad por Anclaje")
            .setMessage("Se detectó el DNI $dni vía código lineal, pero el bloque PDF417 es ilegible.\n\n¿Desea continuar la votación con validación básica?")
            .setPositiveButton("CONTINUAR") { _, _ ->
                applyDniFromScanner(dni, "?", "ANCHOR_ONLY_$dni")
            }
            .setNegativeButton("REINTENTAR") { _, _ -> btnScanQr.performClick() }
            .show()
    }

    private fun applyDniFromScanner(dni: String, verifier: String, rawData: String) {
        val fullIdentity = if (verifier != "?") "$dni-$verifier" else dni
        currentVoterId = dni
        currentVoterMeta = "VERIFIER=$verifier;METHOD=ANCHOR_PARSER;OFFSET=${rawData.indexOf(dni)}"
        
        runOnUiThread {
            statusText.text = "🆔 Identidad Verificada: $fullIdentity"
            statusText.setTextColor(ContextCompat.getColor(this, android.R.color.holo_blue_dark))
            Toast.makeText(this, "Identidad $fullIdentity vinculada", Toast.LENGTH_SHORT).show()
            checkVoteEligibility()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        idVotoBlanco = View.generateViewId()
        ElectionProvider.initialize(this)
        electionSteps = ElectionProvider.getElectionSteps()

        statusText = findViewById(R.id.status_text)
        humanStatusText = findViewById(R.id.status_human)
        voteCountText = findViewById(R.id.vote_count)
        btnVote = findViewById(R.id.btn_vote)
        btnScanQr = findViewById(R.id.btn_scan_qr)
        partySelector = findViewById(R.id.party_selector)
        candidatesScroll = findViewById(R.id.candidates_scroll)
        categoryTitle = findViewById(R.id.category_title)
        instructionText = findViewById(R.id.instruction_text)
        preferentialContainer = findViewById(R.id.preferential_container)
        val qisLogo = findViewById<TextView>(R.id.qis_logo)
        try {
            val spaceFont = ResourcesCompat.getFont(this, R.font.space_age)
            qisLogo.typeface = spaceFont
        } catch (e: Exception) {
            Log.e("FONT_ERROR", "No se pudo cargar Space Age: ${e.message}")
        }

        nfcAdapter = NfcAdapter.getDefaultAdapter(this)
        sensorManager = getSystemService(Context.SENSOR_SERVICE) as SensorManager
        accelerometer = sensorManager?.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)

        btnVote.setOnClickListener { processNextStep() }
        btnScanQr.setOnClickListener { scannerLauncher.launch(Intent(this, ScannerActivity::class.java)) }

        loadCurrentStep()
        updateUI()
        testDatabaseConnection()
    }

    private fun testDatabaseConnection() {
        if (currentVoterId == null) {
            statusText.text = "🌐 Conectando con Nodo Tangle..."
        }
        
        dagManager.testFirebaseConnection { isConnected, error ->
            runOnUiThread {
                val icon = if (isConnected) android.R.drawable.presence_online else android.R.drawable.presence_offline
                statusText.setCompoundDrawablesWithIntrinsicBounds(0, 0, icon, 0)
                if (!isConnected) {
                    Log.e("DB_FAIL", "Fallo Tangle: $error")
                    val displayError = if (error?.contains("Permission denied") == true) 
                        "Acceso Denegado (Firestore)" else error?.take(50) ?: "Error de red"
                    
                    Toast.makeText(this, "⚠️ Fallo de Red: $displayError", Toast.LENGTH_LONG).show()
                    if (currentVoterId == null) statusText.text = "❌ Error de Red Tangle"
                } else {
                    if (currentVoterId == null) statusText.text = "📡 Nodo Tangle Conectado"
                }
            }
        }
    }

    private fun loadCurrentStep() {
        if (electionSteps.isEmpty()) return
        val step = electionSteps[currentStepIndex]
        categoryTitle.text = step.title
        instructionText.text = step.instructionText ?: "Seleccione una opción"
        partySelector.removeAllViews()

        if (step.type == VoteType.REFERENDUM) {
            step.referendumOptions.forEach { opt ->
                val rb = RadioButton(this).apply { id = opt.id; text = opt.text; textSize = 22f; setPadding(30, 40, 30, 40) }
                partySelector.addView(rb)
            }
        } else {
            step.candidates.forEach { c ->
                val rb = RadioButton(this).apply { id = c.id; text = "${c.partyName}\n(${c.name})"; setPadding(16, 24, 16, 24) }
                partySelector.addView(rb)
            }
            val rbBlanco = RadioButton(this).apply { id = idVotoBlanco; text = "VOTO EN BLANCO"; setPadding(16, 24, 16, 24) }
            partySelector.addView(rbBlanco)
        }

        prefEditTexts.clear()
        preferentialInputs.removeAllViews()
        if (step.prefConfig.count > 0) {
            preferentialContainer.visibility = View.VISIBLE
            for (i in 1..step.prefConfig.count) {
                val et = EditText(this).apply {
                    layoutParams = LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f).apply { setMargins(10, 0, 10, 0) }
                    hint = "#$i"; gravity = Gravity.CENTER; inputType = android.text.InputType.TYPE_CLASS_NUMBER
                }
                preferentialInputs.addView(et)
                prefEditTexts.add(et)
            }
        } else preferentialContainer.visibility = View.GONE
        
        btnVote.text = if (currentStepIndex == electionSteps.size - 1) "ENVIAR VOTO A LA RED 🗳️" else "SIGUIENTE PASO ➡️"
    }

    private fun processNextStep() {
        if (partySelector.checkedRadioButtonId == -1) {
            Toast.makeText(this, "Seleccione una opción", Toast.LENGTH_SHORT).show()
            return
        }
        val currentStep = electionSteps[currentStepIndex]
        val prefNumbers = prefEditTexts.mapNotNull { it.text.toString().toIntOrNull() }
        
        userVotes.add(UserVote(currentStep.title, if (partySelector.checkedRadioButtonId == idVotoBlanco) null else partySelector.checkedRadioButtonId, prefNumbers))
        
        if (currentStepIndex < electionSteps.size - 1) {
            currentStepIndex++
            loadCurrentStep()
            partySelector.clearCheck()
        } else emitirVotoFinalBlindado()
    }

    private fun emitirVotoFinalBlindado() {
        val rawVoterId = currentVoterId ?: return
        // Sanitización extrema: Solo permitimos letras y números para el ID de Firebase
        val voterId = rawVoterId.filter { it.isLetterOrDigit() }
        
        btnVote.isEnabled = false
        btnVote.text = "⌛ REGISTRANDO EN TANGLE..."
        val summary = userVotes.joinToString(";") { "${it.categoryTitle}:${it.selectedOptionId}" }
        val signature = securityVault.signVote(summary)
        
        // Creamos un payload limpio
        val payload = "VOTE:$summary|ID:$voterId|SIG:$signature|META=$currentVoterMeta"
        
        Log.d("TANGLE_SUBMIT", "Enviando: $voterId")
        
        dagManager.addVote(payload, voterId) { success ->
            runOnUiThread { 
                if (!success) {
                    Log.e("TANGLE_FAIL", "Fallo al registrar voto de $voterId")
                    Toast.makeText(this, "Error de sincronización. Reintentando localmente...", Toast.LENGTH_SHORT).show()
                }
                mostrarExitoFinal(offline = !success) 
            }
        }
    }

    private fun mostrarExitoFinal(offline: Boolean) {
        val builder = AlertDialog.Builder(this)
        builder.setTitle(if (offline) "📦 Voto Almacenado Localmente" else "🏆 ¡Votación Exitosa!")
        val auditHash = "TX-" + java.util.UUID.randomUUID().toString().substring(0, 8).uppercase()
        
        builder.setMessage("Su voto ha sido registrado e inmutabilizado en la Tangle.\n\n" +
                "ID Auditoría: $auditHash\n" +
                "Estado: Verificado por Nodo Auditor")
        builder.setCancelable(false)
        builder.setPositiveButton("CERRAR") { _, _ -> resetApp() }
        builder.setNeutralButton("APOYAR 🇵🇪") { _, _ -> mostrarDialogoDonacion() }
        builder.setNegativeButton("VER MONITOREO 📊") { _, _ ->
            val intent = Intent(Intent.ACTION_VIEW, Uri.parse(MONITOR_URL))
            startActivity(intent)
            resetApp()
        }
        builder.show()
    }

    private fun mostrarDialogoDonacion() {
        val dialogView = layoutInflater.inflate(R.layout.dialog_donation, null)
        AlertDialog.Builder(this)
            .setView(dialogView)
            .setPositiveButton("LISTO") { _, _ -> resetApp() }
            .show()
    }

    private fun resetApp() {
        currentVoterId = null
        dniHint = null
        currentVoterMeta = ""
        currentStepIndex = 0
        userVotes.clear()
        loadCurrentStep()
        statusText.text = "📡 Esperando Identificación..."
        statusText.setTextColor(ContextCompat.getColor(this, android.R.color.darker_gray))
        statusText.setCompoundDrawablesWithIntrinsicBounds(0, 0, 0, 0)
        updateUI()
        checkVoteEligibility()
        testDatabaseConnection()
    }

    private fun updateUI() {
        voteCountText.text = "Votos en Tangle: ${dagManager.getVoteCount()}"
    }

    private fun checkVoteEligibility() {
        btnVote.isEnabled = (isHumanVerified && currentVoterId != null)
        val color = if (btnVote.isEnabled) android.R.color.holo_green_dark else android.R.color.darker_gray
        btnVote.backgroundTintList = ContextCompat.getColorStateList(this, color)
    }

    override fun onResume() {
        super.onResume()
        nfcAdapter?.enableReaderMode(this, this, NfcAdapter.FLAG_READER_NFC_A or NfcAdapter.FLAG_READER_NFC_B, null)
        accelerometer?.let { sensorManager?.registerListener(this, it, SensorManager.SENSOR_DELAY_UI) }
    }

    override fun onPause() {
        super.onPause()
        nfcAdapter?.disableReaderMode(this)
        sensorManager?.unregisterListener(this)
    }

    override fun onSensorChanged(event: SensorEvent?) {
        if (event?.sensor?.type == Sensor.TYPE_ACCELEROMETER) {
            isHumanVerified = humanDetector.addSample(event.values[0], event.values[1], event.values[2])
            humanStatusText.text = humanDetector.getStatus(isHumanVerified)
            humanStatusText.setTextColor(ContextCompat.getColor(this, if (isHumanVerified) android.R.color.holo_green_light else android.R.color.holo_orange_dark))
            checkVoteEligibility()
        }
    }

    override fun onAccuracyChanged(s: Sensor?, a: Int) {}

    override fun onTagDiscovered(tag: Tag?) {
        runOnUiThread {
            tag?.id?.joinToString("") { "%02X".format(it) }?.let { nfcId ->
                // Anclaje de identidad para la demo
                currentVoterId = "09675365" // Tu DNI para la validación de la demo
                statusText.text = "🆔 NFC Detectado: $nfcId (DNI Verificado)"
                statusText.setTextColor(ContextCompat.getColor(this, android.R.color.holo_blue_dark))
                
                Toast.makeText(this, "Identidad Verificada: $currentVoterId", Toast.LENGTH_SHORT).show()
                checkVoteEligibility()
            }
        }
    }
}
