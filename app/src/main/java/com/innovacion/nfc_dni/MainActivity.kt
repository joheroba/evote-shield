package com.innovacion.nfc_dni

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.nfc.NfcAdapter
import android.nfc.Tag
import android.os.Bundle
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
    private lateinit var categoryTitle: TextView
    private lateinit var instructionText: TextView
    private lateinit var preferentialContainer: LinearLayout
    private lateinit var preferentialInputs: LinearLayout
    
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

    private val scannerLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            val barcodeData = result.data?.getStringExtra("SCAN_RESULT")
            if (barcodeData != null) {
                val voterId = "QR-" + barcodeData.take(10)
                checkGlobalVoterStatus(voterId) { isDoubleVote ->
                    if (isDoubleVote) {
                        handleDoubleVoteError()
                    } else {
                        currentVoterId = voterId
                        statusText.text = "🟡 Identidad Validada por Escáner QR"
                        statusText.setTextColor(ContextCompat.getColor(this, android.R.color.holo_orange_dark))
                        checkVoteEligibility()
                        Toast.makeText(this, "DNI Escaneado con Éxito", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        }
    }

    private fun checkGlobalVoterStatus(voterId: String, callback: (Boolean) -> Unit) {
        statusText.text = "🔍 Verificando DNI en la red..."
        dagManager.checkGlobalVoterStatus(voterId, callback)
    }

    private fun handleDoubleVoteError() {
        currentVoterId = null
        statusText.text = "❌ ERROR: DNI ya ha votado"
        statusText.setTextColor(ContextCompat.getColor(this, android.R.color.holo_red_dark))
        AlertDialog.Builder(this)
            .setTitle("Intento de Doble Voto Global")
            .setMessage("Este documento ya tiene un voto registrado en la base de datos nacional. El sistema E-Vote Shield impide la duplicidad en tiempo real.")
            .setPositiveButton("Entendido", null)
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
        categoryTitle = findViewById(R.id.category_title)
        instructionText = findViewById(R.id.instruction_text) ?: TextView(this)
        preferentialContainer = findViewById(R.id.preferential_container)
        preferentialInputs = findViewById(R.id.preferential_inputs)
        
        nfcAdapter = NfcAdapter.getDefaultAdapter(this)
        sensorManager = getSystemService(Context.SENSOR_SERVICE) as SensorManager
        accelerometer = sensorManager?.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)

        btnVote.setOnClickListener {
            processNextStep()
        }

        btnScanQr.setOnClickListener {
            val intent = Intent(this, ScannerActivity::class.java)
            scannerLauncher.launch(intent)
        }
        
        loadCurrentStep()
        updateUI()
    }

    private fun loadCurrentStep() {
        if (electionSteps.isEmpty()) return

        val currentStep = electionSteps[currentStepIndex]
        categoryTitle.text = currentStep.title
        instructionText.text = currentStep.instructionText ?: "Seleccione su opción"
        
        partySelector.removeAllViews()
        
        if (currentStep.type == VoteType.REFERENDUM) {
            currentStep.referendumOptions.forEach { option ->
                val rb = RadioButton(this)
                rb.id = option.id
                rb.text = option.text
                rb.textSize = 24f
                rb.setPadding(32, 40, 32, 40)
                partySelector.addView(rb)
            }
        } else {
            currentStep.candidates.forEach { candidate ->
                val rb = RadioButton(this)
                rb.id = candidate.id
                rb.text = "${candidate.partyName}\n(${candidate.name})"
                rb.setPadding(16, 24, 16, 24)
                partySelector.addView(rb)
            }
            
            val rbBlanco = RadioButton(this)
            rbBlanco.id = 999
            rbBlanco.text = "VOTO EN BLANCO"
            rbBlanco.setPadding(16, 24, 16, 24)
            partySelector.addView(rbBlanco)
        }

        prefEditTexts.clear()
        preferentialInputs.removeAllViews()
        
        val config = currentStep.prefConfig
        if (currentStep.type == VoteType.CONGRESSIONAL && config.count > 0) {
            preferentialContainer.visibility = View.VISIBLE
            for (i in 1..config.count) {
                val et = EditText(this)
                val params = LinearLayout.LayoutParams(150, LinearLayout.LayoutParams.WRAP_CONTENT)
                params.setMargins(16, 0, 16, 0)
                et.layoutParams = params
                et.hint = "00"
                et.gravity = Gravity.CENTER
                et.inputType = InputType.TYPE_CLASS_NUMBER
                et.filters = arrayOf(InputFilter.LengthFilter(config.maxValue.toString().length))
                preferentialInputs.addView(et)
                prefEditTexts.add(et)
            }
        } else {
            preferentialContainer.visibility = View.GONE
        }

        btnVote.text = if (currentStepIndex == electionSteps.size - 1) "FINALIZAR VOTACIÓN 🗳️" else "SIGUIENTE PASO ➡️"
    }

    private fun processNextStep() {
        val selectedId = partySelector.checkedRadioButtonId
        if (selectedId == -1) {
            Toast.makeText(this, "Por favor, seleccione una opción", Toast.LENGTH_SHORT).show()
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
        
        userVotes.add(UserVote(
            categoryTitle = currentStep.title, 
            selectedOptionId = if (selectedId == 999) null else selectedId,
            preferentialNumbers = prefNumbers
        ))

        if (currentStepIndex < electionSteps.size - 1) {
            currentStepIndex++
            loadCurrentStep()
            partySelector.clearCheck()
        } else {
            emitirVotoFinalBlindado()
        }
    }

    private fun emitirVotoFinalBlindado() {
        val voterId = currentVoterId
        if (isHumanVerified && voterId != null) {
            val voteSummary = userVotes.joinToString(";") { vote ->
                val prefs = if (vote.preferentialNumbers.isNotEmpty()) " (Prefs: ${vote.preferentialNumbers.joinToString(",")})" else ""
                "${vote.categoryTitle}:${vote.selectedOptionId}$prefs"
            }
            val signature = securityVault.signVote(voteSummary)
            
            dagManager.addVote("VOTOS:$voteSummary|VOTANTE:$voterId|SIG:$signature", voterId) { success ->
                if (success) {
                    mostrarTicketVotacion(voteSummary)
                } else {
                    Toast.makeText(this, "Error crítico: El voto ya fue registrado globalmente.", Toast.LENGTH_LONG).show()
                }
                
                updateUI()
                currentVoterId = null
                currentStepIndex = 0
                userVotes.clear()
                loadCurrentStep()
                statusText.text = getString(R.string.status_waiting)
                statusText.setTextColor(ContextCompat.getColor(this, android.R.color.darker_gray))
                checkVoteEligibility()
            }
        }
    }

    private fun mostrarTicketVotacion(summary: String) {
        val hashTicket = securityVault.generateHash("TICKET-${System.currentTimeMillis()}")
        AlertDialog.Builder(this)
            .setTitle("¡Votación Exitosa!")
            .setMessage("Sus votos han sido registrados en la Nube y la Tangle.\n\nHash de Auditoría:\n$hashTicket")
            .setPositiveButton("Cerrar", null)
            .show()
    }

    private fun updateUI() {
        // En un demo a gran escala, el contador podría ser global
        voteCountText.text = getString(R.string.vote_count_template, dagManager.getVoteCount())
    }

    private fun checkVoteEligibility() {
        btnVote.isEnabled = (isHumanVerified && currentVoterId != null)
        val color = if (btnVote.isEnabled) android.R.color.holo_green_dark else android.R.color.darker_gray
        btnVote.backgroundTintList = ContextCompat.getColorStateList(this, color)
    }

    override fun onResume() {
        super.onResume()
        nfcAdapter?.enableReaderMode(this, this, 
            NfcAdapter.FLAG_READER_NFC_A or NfcAdapter.FLAG_READER_NFC_B or 
            NfcAdapter.FLAG_READER_NFC_F or NfcAdapter.FLAG_READER_SKIP_NDEF_CHECK, 
            null)
        accelerometer?.let {
            sensorManager?.registerListener(this, it, SensorManager.SENSOR_DELAY_UI)
        }
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
            val voterId = tag?.id?.joinToString("") { "%02X".format(it) }
            if (voterId != null) {
                checkGlobalVoterStatus(voterId) { isDoubleVote ->
                    if (isDoubleVote) {
                        handleDoubleVoteError()
                    } else {
                        currentVoterId = voterId
                        statusText.text = getString(R.string.status_validated)
                        statusText.setTextColor(ContextCompat.getColor(this, R.color.primary))
                        checkVoteEligibility()
                    }
                }
            }
        }
    }
}
