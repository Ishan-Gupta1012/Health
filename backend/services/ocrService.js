const Tesseract = require('tesseract.js');

/**
 * Extracts text from an image buffer using the Tesseract.js OCR engine.
 * @param {Buffer} imageBuffer - The image data as a buffer, typically from a file upload (req.file.buffer).
 * @returns {Promise<string>} A promise that resolves with the extracted text.
 */
async function extractTextFromImage(imageBuffer) {
  // Defensive check to ensure we received a Buffer.
  if (!Buffer.isBuffer(imageBuffer)) {
    console.error('Error: extractTextFromImage did not receive a Buffer. It received:', typeof imageBuffer);
    throw new Error('Invalid data type provided for image processing.');
  }

  try {
    console.log(`Starting OCR process for an in-memory image buffer...`);

    const { data: { text } } = await Tesseract.recognize(
      imageBuffer,
      'eng',
      { logger: m => console.log(m) } // Optional: Shows real-time progress.
    );

    console.log('OCR process completed successfully.');
    
    if (!text || text.trim() === '') {
      console.warn(`Tesseract finished but found no text in the provided image buffer.`);
      throw new Error("OCR process completed, but no text could be extracted from the image.");
    }
    
    return text;

  } catch (error) {
    console.error('An error occurred during Tesseract OCR processing:', error);
    // Re-throw a consistent error message for the controller to handle.
    throw new Error('Failed to read text from the report image.');
  }
}

module.exports = {
  extractTextFromImage,
};