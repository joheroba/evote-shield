import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.nfc.NfcAdapter
import android.nfc.Tag
import android.os.Bundle
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

import android.util.Log
import android.widget.Button

class MainActivity : AppCompatActivity(), NfcAdapter.ReaderCallback, SensorEventListener {

    private var nfcAdapter: NfcAdapter? = null
    private lateinit var statusText: TextView
    private lateinit var humanStatusText: TextView
    private lateinit var voteCountText: TextView
    private lateinit var btnVote: Button
    
    // Módulos de Innovación
    private var sensorManager: SensorManager? = null
    private var accelerometer: Sensor? = null
    private val humanDetector = HumanDetector(windowSize = 40)
    private val dagManager = DAGManager()
    private val securityVault = SecurityVault()

    // Estados de Seguridad
    private var isHumanVerified = false
    private var currentDniId: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        statusText = findViewById(R.id.status_text)
        humanStatusText = findViewById(R.id.status_human)
        voteCountText = findViewById(R.id.vote_count)
        btnVote = findViewById(R.id.btn_vote)
        
        // 1. Configurar NFC
        nfcAdapter = NfcAdapter.getDefaultAdapter(this)

        if (nfcAdapter == null) {
            statusText.text = "❌ Error: Este equipo no tiene NFC"
            Toast.makeText(this, "NFC no disponible", Toast.LENGTH_LONG).show()
        }

        // 2. Configurar Sensores para E-Vote Shield
        sensorManager = getSystemService(Context.SENSOR_SERVICE) as SensorManager
        accelerometer = sensorManager?.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)

        // 3. Lógica del Botón de Voto
        btnVote.setOnClickListener {
            emitirVotoBlindado()
        }
    }

    private fun emitirVotoBlindado() {
        if (isHumanVerified && currentDniId != null) {
            // Emulando una selección (En el futuro esto vendría de un RadioButton)
            val vOption = "OPCIÓN_A" 
            
            // Generar Firma con la Bóveda
            val signature = securityVault.signVote(vOption)
            
            // Añadir a la Tangle (Bóveda Criptográfica)
            val block = dagManager.addVote("VOTE:$vOption|SIG:$signature")
            
            Toast.makeText(this, "✅ Voto Registrado en Tangle", Toast.LENGTH_LONG).show()
            updateUI()
            
            // Resetear para seguridad
            currentDniId = null
            statusText.text = "📡 Esperando nuevo DNIe..."
            statusText.setTextColor(0xFF9E9E9E.toInt())
            checkVoteEligibility()
        }
    }

    private fun updateUI() {
        voteCountText.text = "Votos en Tangle: ${dagManager.getVoteCount()}"
    }

    private fun checkVoteEligibility() {
        if (isHumanVerified && currentDniId != null) {
            btnVote.isEnabled = true
            btnVote.backgroundTintList = getColorStateList(android.R.color.holo_green_dark)
        } else {
            btnVote.isEnabled = false
            btnVote.backgroundTintList = getColorStateList(android.R.color.darker_gray)
        }
    }

    override fun onResume() {
        super.onResume()
        nfcAdapter?.enableReaderMode(this, this, 
            NfcAdapter.FLAG_READER_NFC_B or NfcAdapter.FLAG_READER_SKIP_NDEF_CHECK, 
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
            
            if (isHumanVerified) humanStatusText.setTextColor(0xFF4CAF50.toInt()) 
            else humanStatusText.setTextColor(0xFFFF9800.toInt())
            
            checkVoteEligibility()
        }
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}

    override fun onTagDiscovered(tag: Tag?) {
        runOnUiThread {
            currentDniId = tag?.id?.joinToString("") { "%02X".format(it) }
            statusText.text = "🔵 Identidad Validada por DNIe"
            statusText.setTextColor(0xFF2196F3.toInt())
            
            Toast.makeText(this, "📡 Credencial NFC Recibida", Toast.LENGTH_SHORT).show()
            checkVoteEligibility()
        }
    }
}
