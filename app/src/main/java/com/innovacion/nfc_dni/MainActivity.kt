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
import android.nfc.tech.IsoDep
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
import java.io.InputStream

class MainActivity : AppCompatActivity(), NfcAdapter.ReaderCallback, SensorEventListener {

    private var nfcAdapter: NfcAdapter? = null
    private lateinit var statusText: TextView
    private lateinit var humanStatusText: TextView
    private lateinit var voteCountText: TextView
    private lateinit var btnVote: Button
    private lateinit var btnScanQr: Button
    private lateinit var partySelector: RadioGroup
    private lateinit var candidatesScroll: androidx.core.widget.NestedScrollView
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
    private var dniHint: String? = null
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

    // --- LÓGICA DE LECTURA DE CHIP REAL (JMRTD) ---
    private fun realizarLecturaChipReal(tag: Tag, mrz: String) {
        // Ejemplo de estructura: I<PER09675365<77112270M3601165...
        // Formato BACKeySpec(dni, fechaNacimiento_YYMMDD, fechaCaducidad_YYMMDD)
        // Se requiere extraer de la MRZ
        try {
            // TODO: Debes extraer estos datos de la MRZ real para el DNIe
            // Por ahora, dejamos la estructura lista
            val dni = "09675365"
            val dob = "711227"
            val doe = "360116"
            
            JmrtdHelper.doBAC(tag, dni, dob, doe)

            // Si llega aquí, está autenticado. 
            // Aquí leerías EF.DG1 con la información del ciudadano.
            runOnUiThread {
                Toast.makeText(this, "Chip verificado exitosamente", Toast.LENGTH_SHORT).show()
                currentVoterId = dni
                checkVoteEligibility()
            }
        } catch (e: Exception) {
            Log.e("CHIP_ERROR", "Error: ${e.message}")
            runOnUiThread { Toast.makeText(this, "Fallo al leer chip: ${e.message}", Toast.LENGTH_LONG).show() }
        }
    }

    private fun processScannerData(rawData: String, format: Int) {
        Log.d("SCANNER_RAW", "Raw: $rawData")
        val cleanData = rawData.trim().filter { it.isLetterOrDigit() || it == '<' }
        Log.d("SCANNER_LOG", "Formato: $format | Contenido: $cleanData")
        
        val isLinear = format == Barcode.FORMAT_CODE_128 || format == Barcode.FORMAT_CODE_39 || cleanData.length < 15
        
        if (isLinear) {
            val digits = cleanData.filter { it.isDigit() }
            if (digits.length >= 8) {
                dniHint = digits.take(8)
                statusText.text = "🆔 ANCLAJE ACTIVO: $dniHint"
                statusText.setTextColor(ContextCompat.getColor(this, android.R.color.holo_blue_dark))
                Toast.makeText(this, "Anclaje capturado. Ahora enfoque el bloque PDF417.", Toast.LENGTH_LONG).show()
                
                val intent = Intent(this, ScannerActivity::class.java).apply {
                    putExtra("ONLY_FULL_DATA", true)
                }
                btnScanQr.postDelayed({ scannerLauncher.launch(intent) }, 1200)
                return
            }
        }

        val matches = Regex("""\d{8}""").findAll(cleanData).map { it.value }.toList()
        var confirmedDni: String? = null
        if (dniHint != null) {
            if (cleanData.contains(dniHint!!)) confirmedDni = dniHint
        }
        
        if (confirmedDni == null) confirmedDni = matches.find { !it.startsWith("19") && !it.startsWith("20") } ?: matches.firstOrNull()

        if (confirmedDni != null) {
            val builder = AlertDialog.Builder(this)
            builder.setTitle("🔍 Identidad Detectada")
            builder.setMessage("DNI: $confirmedDni\n¿Vincular identidad?")
            builder.setPositiveButton("VINCULAR") { _, _ -> applyDniFromScanner(confirmedDni!!, "V", cleanData) }
            builder.show()
        }
    }

    private fun applyDniFromScanner(dni: String, verifier: String, rawData: String) {
        val fullIdentity = if (verifier != "?") "$dni-$verifier" else dni
        currentVoterId = dni
        currentVoterMeta = "VERIFIER=$verifier;METHOD=ANCHOR_PARSER;OFFSET=${rawData.indexOf(dni)}"
        
        runOnUiThread {
            statusText.text = "🆔 Identidad Verificada: $fullIdentity"
            statusText.setTextColor(ContextCompat.getColor(this, android.R.color.holo_blue_dark))
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

        nfcAdapter = NfcAdapter.getDefaultAdapter(this)
        sensorManager = getSystemService(Context.SENSOR_SERVICE) as SensorManager
        accelerometer = sensorManager?.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)

        btnVote.setOnClickListener { processNextStep() }
        btnScanQr.setOnClickListener { scannerLauncher.launch(Intent(this, ScannerActivity::class.java)) }

        loadCurrentStep()
        updateUI()
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
        val voterId = rawVoterId.filter { it.isLetterOrDigit() }
        
        btnVote.isEnabled = false
        btnVote.text = "⌛ REGISTRANDO EN TANGLE..."
        val summary = userVotes.joinToString(";") { "${it.categoryTitle}:${it.selectedOptionId}" }
        val signature = securityVault.signVote(summary)
        
        val payload = "VOTE:$summary|ID:$voterId|SIG:$signature|META=$currentVoterMeta"
        
        dagManager.addVote(payload, voterId) { success ->
            runOnUiThread { 
                mostrarExitoFinal(offline = !success) 
            }
        }
    }

    private fun mostrarExitoFinal(offline: Boolean) {
        val builder = AlertDialog.Builder(this)
        builder.setTitle(if (offline) "📦 Voto Almacenado Localmente" else "🏆 ¡Votación Exitosa!")
        builder.setPositiveButton("CERRAR") { _, _ -> resetApp() }
        builder.show()
    }

    private fun resetApp() {
        currentVoterId = null
        currentStepIndex = 0
        userVotes.clear()
        loadCurrentStep()
        statusText.text = "📡 Esperando Identificación..."
        updateUI()
        checkVoteEligibility()
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
        nfcAdapter?.enableReaderMode(this, this, NfcAdapter.FLAG_READER_NFC_A or NfcAdapter.FLAG_READER_NFC_B or NfcAdapter.FLAG_READER_SKIP_NDEF_CHECK, null)
    }

    override fun onPause() {
        super.onPause()
        nfcAdapter?.disableReaderMode(this)
    }

    override fun onSensorChanged(event: SensorEvent?) {
        if (event?.sensor?.type == Sensor.TYPE_ACCELEROMETER) {
            isHumanVerified = humanDetector.addSample(event.values[0], event.values[1], event.values[2])
            checkVoteEligibility()
        }
    }

    override fun onAccuracyChanged(s: Sensor?, a: Int) {}

    override fun onTagDiscovered(tag: Tag?) {
        // Esta es la parte crítica para tu DNIe real
        runOnUiThread {
            // El DNIe usa tecnología ISO-DEP
            val techList = tag?.techList
            if (techList?.contains("android.nfc.tech.IsoDep") == true) {
                // Aquí deberías pasar la MRZ extraída del reverso del DNI
                // Como ejemplo hardcodeado del tuyo
                val mrz = "I<PER09675365<77112270M3601165"
                Thread {
                    realizarLecturaChipReal(tag, mrz)
                }.start()
            } else {
                Toast.makeText(this, "Chip no compatible con DNIe", Toast.LENGTH_SHORT).show()
            }
        }
    }
}
