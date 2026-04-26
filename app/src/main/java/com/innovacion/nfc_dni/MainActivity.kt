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
import android.os.Handler
import android.os.Looper
import android.text.InputFilter
import android.text.InputType
import android.view.Gravity
import android.view.View
import android.widget.*
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat

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

    private var electionSteps: List<ElectionCategory> = listOf()
    private var currentStepIndex = 0
    private val userVotes = mutableListOf<UserVote>()
    private val prefEditTexts = mutableListOf<EditText>()

    private val MONITOR_URL = "https://evote-shield.vercel.app/?mode=monitor"
    private val mainHandler = Handler(Looper.getMainLooper())
    
    private val ID_VOTO_BLANCO = View.generateViewId()

    private val scannerLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            val barcodeData = result.data?.getStringExtra("SCAN_RESULT")
            barcodeData?.let { validateVoterId("QR-" + it.take(10)) }
        }
    }

    private fun validateVoterId(voterId: String) {
        statusText.text = "🔍 Verificando DNI en la red..."
        dagManager.checkGlobalVoterStatus(voterId) { isDoubleVote ->
            runOnUiThread {
                if (isDoubleVote) {
                    handleDoubleVoteError()
                } else {
                    currentVoterId = voterId
                    statusText.text = "✅ Identidad Validada"
                    statusText.setTextColor(ContextCompat.getColor(this, android.R.color.holo_green_dark))
                    checkVoteEligibility()
                }
            }
        }
    }

    private fun handleDoubleVoteError() {
        currentVoterId = null
        statusText.text = "❌ ERROR: DNI ya ha votado"
        statusText.setTextColor(ContextCompat.getColor(this, android.R.color.holo_red_dark))
        AlertDialog.Builder(this)
            .setTitle("Intento de Doble Voto")
            .setMessage("Este DNI ya registró un voto. El sistema E-Vote Shield impide la duplicidad global en tiempo real.")
            .setPositiveButton("Cerrar", null)
            .show()
        checkVoteEligibility()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

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
        preferentialInputs = findViewById(R.id.preferential_inputs)
        
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
        statusText.text = "🌐 Verificando red E-Vote Shield..."
        dagManager.testFirebaseConnection { isConnected ->
            runOnUiThread {
                if (isConnected) {
                    statusText.text = "📡 Sistema Online - Listo para DNI"
                    statusText.setTextColor(ContextCompat.getColor(this, android.R.color.holo_blue_dark))
                } else {
                    statusText.text = "⚠️ Modo Offline - Verifique conexión"
                    statusText.setTextColor(ContextCompat.getColor(this, android.R.color.holo_orange_dark))
                    Toast.makeText(this, "Error de enlace con el Nodo Central", Toast.LENGTH_LONG).show()
                }
            }
        }
    }

    private fun loadCurrentStep() {
        if (electionSteps.isEmpty()) return
        val currentStep = electionSteps[currentStepIndex]
        
        categoryTitle.text = currentStep.title
        instructionText.text = currentStep.instructionText ?: "Seleccione una opción"
        
        partySelector.removeAllViews()
        currentStep.candidates.forEach { candidate ->
            val rb = RadioButton(this)
            rb.id = candidate.id
            rb.text = "${candidate.partyName}\n(${candidate.name})"
            rb.setPadding(16, 24, 16, 24)
            partySelector.addView(rb)
        }
        
        val rbBlanco = RadioButton(this)
        rbBlanco.id = ID_VOTO_BLANCO
        rbBlanco.text = "VOTO EN BLANCO"
        rbBlanco.setPadding(16, 24, 16, 24)
        partySelector.addView(rbBlanco)

        prefEditTexts.clear()
        preferentialInputs.removeAllViews()
        val config = currentStep.prefConfig
        if (config.count > 0) {
            preferentialContainer.visibility = View.VISIBLE
            for (i in 1..config.count) {
                val et = EditText(this)
                val params = LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f)
                params.setMargins(10, 0, 10, 0)
                et.layoutParams = params
                et.hint = "#$i"
                et.gravity = Gravity.CENTER
                et.inputType = InputType.TYPE_CLASS_NUMBER
                et.filters = arrayOf(InputFilter.LengthFilter(config.maxValue.toString().length))
                preferentialInputs.addView(et)
                prefEditTexts.add(et)
            }
        } else {
            preferentialContainer.visibility = View.GONE
        }

        btnVote.text = if (currentStepIndex == electionSteps.size - 1) "ENVIAR VOTO A LA RED 🗳️" else "SIGUIENTE PASO ➡️"
        candidatesScroll.post { candidatesScroll.scrollTo(0, 0) }
    }

    private fun processNextStep() {
        val selectedId = partySelector.checkedRadioButtonId
        if (selectedId == -1) {
            Toast.makeText(this, "Seleccione una opción", Toast.LENGTH_SHORT).show()
            return
        }

        val currentStep = electionSteps[currentStepIndex]
        val prefNumbers = mutableListOf<Int>()
        for (et in prefEditTexts) {
            val numStr = et.text.toString()
            if (numStr.isNotEmpty()) {
                val num = numStr.toInt()
                if (num < currentStep.prefConfig.minValue || num > currentStep.prefConfig.maxValue) {
                    et.error = "Rango: ${currentStep.prefConfig.minValue}-${currentStep.prefConfig.maxValue}"
                    return
                }
                prefNumbers.add(num)
            }
        }
        
        userVotes.add(UserVote(currentStep.title, if (selectedId == ID_VOTO_BLANCO) null else selectedId, prefNumbers))

        if (currentStepIndex < electionSteps.size - 1) {
            currentStepIndex++
            loadCurrentStep()
            partySelector.clearCheck()
        } else {
            emitirVotoFinalBlindado()
        }
    }

    private fun emitirVotoFinalBlindado() {
        val voterId = currentVoterId ?: return
        
        btnVote.isEnabled = false
        btnVote.text = "⌛ REGISTRANDO..."
        btnVote.backgroundTintList = ContextCompat.getColorStateList(this, android.R.color.darker_gray)

        val timeoutRunnable = Runnable {
            if (btnVote.text == "⌛ REGISTRANDO...") {
                btnVote.isEnabled = true
                btnVote.text = "REINTENTAR (ERROR DE RED)"
                btnVote.backgroundTintList = ContextCompat.getColorStateList(this, android.R.color.holo_red_dark)
                Toast.makeText(this, "La red está tardando demasiado. Verifique su conexión.", Toast.LENGTH_LONG).show()
            }
        }
        mainHandler.postDelayed(timeoutRunnable, 15000)

        val voteSummary = userVotes.joinToString(";") { "${it.categoryTitle}:${it.selectedOptionId}[${it.preferentialNumbers.joinToString(",")}]" }
        val signature = securityVault.signVote(voteSummary)
        
        dagManager.addVote("VOTE:$voteSummary|ID:$voterId|SIG:$signature", voterId) { success ->
            runOnUiThread {
                mainHandler.removeCallbacks(timeoutRunnable)
                if (success) {
                    mostrarExitoFinal()
                } else {
                    btnVote.isEnabled = true
                    btnVote.text = "REINTENTAR ENVÍO"
                    btnVote.backgroundTintList = ContextCompat.getColorStateList(this, android.R.color.holo_green_dark)
                    Toast.makeText(this, "Error al registrar el voto. Reintente.", Toast.LENGTH_LONG).show()
                }
            }
        }
    }

    private fun mostrarExitoFinal() {
        val hashTicket = securityVault.generateHash("TICKET-${System.currentTimeMillis()}").take(8).uppercase()
        AlertDialog.Builder(this)
            .setTitle("🏆 ¡Votación Completada!")
            .setMessage("Su voto ha sido inyectado en la Tangle con éxito.\n\nCódigo de Auditoría:\n#$hashTicket\n\n¿Desea ver el monitoreo global en tiempo real?")
            .setCancelable(false)
            .setPositiveButton("VER MONITOR 📊") { _, _ ->
                startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(MONITOR_URL)))
                resetApp()
            }
            .setNegativeButton("CERRAR") { _, _ -> resetApp() }
            .show()
    }

    private fun resetApp() {
        currentVoterId = null
        currentStepIndex = 0
        userVotes.clear()
        loadCurrentStep()
        statusText.text = "📡 Esperando Identificación..."
        statusText.setTextColor(ContextCompat.getColor(this, android.R.color.darker_gray))
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

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}

    override fun onTagDiscovered(tag: Tag?) {
        runOnUiThread {
            tag?.id?.joinToString("") { "%02X".format(it) }?.let { validateVoterId(it) }
        }
    }
}
