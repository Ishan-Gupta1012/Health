const ort = require('onnxruntime-node');
const sharp = require('sharp');
const path = require('path');

/**
 * Preprocesses an image for the ONNX model.
 * @param {string} imagePath Path to the input image.
 * @returns {Promise<ort.Tensor>} A promise that resolves to a tensor for the model.
 */
async function preprocessImage(imagePath) {
  const modelWidth = 224;
  const modelHeight = 224;

  const imageBuffer = await sharp(imagePath)
    .resize(modelWidth, modelHeight)
    .toFormat('jpeg') // Ensures 3 channels even for grayscale
    .toBuffer();

  const { data } = await sharp(imageBuffer)
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Scaling of pixel values to the [0, 1] range.
  const float32Data = new Float32Array(modelWidth * modelHeight * 3);
  for (let i = 0; i < data.length; i += 3) {
    const pixelIndex = i / 3;
    // Scale each channel (R, G, B) to be between 0 and 1.
    float32Data[pixelIndex * 3]     = data[i] / 255.0;     // R
    float32Data[pixelIndex * 3 + 1] = data[i + 1] / 255.0; // G
    float32Data[pixelIndex * 3 + 2] = data[i + 2] / 255.0; // B
  }

  const inputTensor = new ort.Tensor(
    'float32',
    float32Data,
    [1, modelHeight, modelWidth, 3]
  );
  
  return inputTensor;
}

/**
 * Analyzes a radiology image using an ONNX model.
 * @param {string} imagePath The path to the uploaded image file.
 * @returns {Promise<object>} A promise resolving to the analysis result.
 */
async function analyzeRadiologyImage(imagePath) {
  try {
    const modelPath = path.join(__dirname, '..', 'models', 'model.onnx');
    const session = await ort.InferenceSession.create(modelPath);

    const inputTensor = await preprocessImage(imagePath);

    const feeds = { [session.inputNames[0]]: inputTensor };
    const results = await session.run(feeds);
    
    const outputTensor = results[session.inputNames[0]];
    const outputData = outputTensor.data;

    // --- DIAGNOSTIC LOGGING ---
    console.log('--- ONNX Model Raw Output ---');
    console.log('Raw Output Data:', outputData);
    console.log('-----------------------------');
    
    const labels = ['Anomaly Detected', 'Normal'];
    
    const probabilities = Array.from(outputData);
    const maxConfidence = Math.max(...probabilities);
    const maxIndex = probabilities.indexOf(maxConfidence);

    const prediction = labels[maxIndex];
    const confidence = parseFloat(maxConfidence).toFixed(4);

    return {
      prediction,
      confidence: Number(confidence),
      heatmap: "Heatmap generation is a model-specific advanced feature."
    };
  } catch (error) {
    console.error("Error during ONNX inference:", error);
    throw new Error("Failed to analyze radiology image.");
  }
}

module.exports = { analyzeRadiologyImage };