'use server';
/**
 * @fileOverview A prescription upload and medicine detection AI agent.
 *
 * - prescriptionUploadAndMedicineDetection - A function that handles the prescription upload and medicine detection process.
 * - PrescriptionUploadAndMedicineDetectionInput - The input type for the prescriptionUploadAndMedicineDetection function.
 * - PrescriptionUploadAndMedicineDetectionOutput - The return type for the prescriptionUploadAndMedicineDetection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PrescriptionUploadAndMedicineDetectionInputSchema = z.object({
  prescriptionDataUri: z
    .string()
    .describe(
      "A prescription document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type PrescriptionUploadAndMedicineDetectionInput = z.infer<typeof PrescriptionUploadAndMedicineDetectionInputSchema>;

const PrescriptionUploadAndMedicineDetectionOutputSchema = z.object({
  medicines: z.array(z.string()).describe('A list of medicines detected in the prescription.'),
});
export type PrescriptionUploadAndMedicineDetectionOutput = z.infer<typeof PrescriptionUploadAndMedicineDetectionOutputSchema>;

export async function prescriptionUploadAndMedicineDetection(input: PrescriptionUploadAndMedicineDetectionInput): Promise<PrescriptionUploadAndMedicineDetectionOutput> {
  return prescriptionUploadAndMedicineDetectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'prescriptionUploadAndMedicineDetectionPrompt',
  input: {schema: PrescriptionUploadAndMedicineDetectionInputSchema},
  output: {schema: PrescriptionUploadAndMedicineDetectionOutputSchema},
  prompt: `You are an expert pharmacist. You will be provided with a prescription document and you will extract the medicines listed in the prescription.

  Prescription: {{media url=prescriptionDataUri}}
  
  Return the medicines in a list.
  `,
});

const prescriptionUploadAndMedicineDetectionFlow = ai.defineFlow(
  {
    name: 'prescriptionUploadAndMedicineDetectionFlow',
    inputSchema: PrescriptionUploadAndMedicineDetectionInputSchema,
    outputSchema: PrescriptionUploadAndMedicineDetectionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
