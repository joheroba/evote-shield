package com.innovacion.nfc_dni

import android.Manifest
import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.util.Size
import android.view.MotionEvent
import android.view.View
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.camera.core.*
import androidx.camera.core.resolutionselector.ResolutionSelector
import androidx.camera.core.resolutionselector.ResolutionStrategy
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.google.mlkit.vision.barcode.BarcodeScannerOptions
import com.google.mlkit.vision.barcode.BarcodeScanning
import com.google.mlkit.vision.barcode.common.Barcode
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.text.TextRecognition
import com.google.mlkit.vision.text.latin.TextRecognizerOptions
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

class ScannerActivity : AppCompatActivity() {

    private lateinit var cameraExecutor: ExecutorService
    private lateinit var viewFinder: PreviewView
    private lateinit var hintText: TextView
    private var isScanned = false
    private val textRecognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_scanner)

        viewFinder = findViewById(R.id.viewFinder)
        hintText = findViewById(R.id.overlay_text) 
        
        hintText.text = "Enfoque el PDF417 o la franja MRZ (I<PER...) del DNI.\nIncline 15° para evitar reflejos."
        hintText.visibility = View.VISIBLE

        if (allPermissionsGranted()) {
            startCamera()
        } else {
            ActivityCompat.requestPermissions(this, REQUIRED_PERMISSIONS, REQUEST_CODE_PERMISSIONS)
        }

        cameraExecutor = Executors.newSingleThreadExecutor()
    }

    private fun startCamera() {
        val cameraProviderFuture = ProcessCameraProvider.getInstance(this)

        cameraProviderFuture.addListener({
            val cameraProvider: ProcessCameraProvider = cameraProviderFuture.get()

            val resolutionSelector = ResolutionSelector.Builder()
                .setResolutionStrategy(
                    ResolutionStrategy(
                        Size(1920, 1080),
                        ResolutionStrategy.FALLBACK_RULE_CLOSEST_HIGHER_THEN_LOWER
                    )
                )
                .build()

            val preview = Preview.Builder()
                .setResolutionSelector(resolutionSelector)
                .build()
                .also { it.setSurfaceProvider(viewFinder.surfaceProvider) }

            val options = BarcodeScannerOptions.Builder()
                .setBarcodeFormats(
                    Barcode.FORMAT_PDF417,
                    Barcode.FORMAT_CODE_128,
                    Barcode.FORMAT_CODE_39
                )
                .build()
            
            val scanner = BarcodeScanning.getClient(options)

            val imageAnalyzer = ImageAnalysis.Builder()
                .setResolutionSelector(resolutionSelector)
                .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                .build()
                .also {
                    it.setAnalyzer(cameraExecutor) { imageProxy ->
                        processImageProxy(scanner, imageProxy)
                    }
                }

            val cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA

            try {
                cameraProvider.unbindAll()
                val camera = cameraProvider.bindToLifecycle(this, cameraSelector, preview, imageAnalyzer)
                setupTapToFocus(camera.cameraControl)
            } catch (exc: Exception) {
                Toast.makeText(this, "Error de cámara: ${exc.message}", Toast.LENGTH_SHORT).show()
            }

        }, ContextCompat.getMainExecutor(this))
    }

    private fun setupTapToFocus(cameraControl: CameraControl) {
        viewFinder.setOnTouchListener { _, event ->
            if (event.action == MotionEvent.ACTION_UP) {
                val factory = viewFinder.meteringPointFactory
                val point = factory.createPoint(event.x, event.y)
                val action = FocusMeteringAction.Builder(point).build()
                cameraControl.startFocusAndMetering(action)
                return@setOnTouchListener true
            }
            true
        }
    }

    @androidx.annotation.OptIn(androidx.camera.core.ExperimentalGetImage::class)
    private fun processImageProxy(scanner: com.google.mlkit.vision.barcode.BarcodeScanner, imageProxy: ImageProxy) {
        val mediaImage = imageProxy.image ?: return
        val rotationDegrees = imageProxy.imageInfo.rotationDegrees
        val image = InputImage.fromMediaImage(mediaImage, rotationDegrees)

        scanner.process(image)
            .addOnSuccessListener { barcodes ->
                if (barcodes.isNotEmpty() && !isScanned) {
                    val barcode = barcodes[0]
                    val value = barcode.rawValue ?: barcode.rawBytes?.let { String(it, Charsets.ISO_8859_1) }
                    
                    if (value != null) {
                        isScanned = true
                        val intent = Intent().apply {
                            putExtra("SCAN_RESULT", value)
                            putExtra("SCAN_FORMAT", barcode.format)
                        }
                        setResult(Activity.RESULT_OK, intent)
                        finish()
                        imageProxy.close()
                        return@addOnSuccessListener
                    }
                }
                
                // Fallback: Text Recognition for MRZ
                if (!isScanned) {
                    textRecognizer.process(image)
                        .addOnSuccessListener { visionText ->
                            val cleanText = visionText.text.replace(" ", "").replace("\n", "")
                            val mrzMatch = Regex("I<PER[A-Z0-9<]+").find(cleanText)
                            if (mrzMatch != null && mrzMatch.value.length >= 10 && !isScanned) {
                                isScanned = true
                                val intent = Intent().apply {
                                    putExtra("SCAN_RESULT", mrzMatch.value)
                                    putExtra("SCAN_FORMAT", -2) // MRZ Indicator
                                }
                                setResult(Activity.RESULT_OK, intent)
                                finish()
                            }
                        }
                        .addOnCompleteListener { imageProxy.close() }
                }
            }
            .addOnFailureListener { imageProxy.close() }
    }

    private fun allPermissionsGranted() = REQUIRED_PERMISSIONS.all {
        ContextCompat.checkSelfPermission(baseContext, it) == PackageManager.PERMISSION_GRANTED
    }

    override fun onDestroy() {
        super.onDestroy()
        cameraExecutor.shutdown()
    }

    companion object {
        private const val REQUEST_CODE_PERMISSIONS = 10
        private val REQUIRED_PERMISSIONS = arrayOf(Manifest.permission.CAMERA)
    }
}
