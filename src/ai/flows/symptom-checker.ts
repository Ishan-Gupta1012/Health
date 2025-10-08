'use server';

/**
 * @fileOverview An AI agent that suggests possible causes for inputted symptoms.
 *
 * - symptomChecker - A function that suggests possible causes for inputted symptoms.
 * - SymptomCheckerInput - The input type for the symptomChecker function.
 * - SymptomCheckerOutput - The return type for the symptomChecker function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SymptomCheckerInputSchema = z.object({
  symptoms: z
    .string()
    .describe('The symptoms that the user is experiencing.'),
});
export type SymptomCheckerInput = z.infer<typeof SymptomCheckerInputSchema>;

const SymptomCheckerOutputSchema = z.object({
  possibleCauses: z
    .string()
    .describe('Possible causes of the inputted symptoms.'),
  disclaimer: z
    .string()
    .describe(
      'A disclaimer that the information is not a substitute for professional medical advice.'
    ),
});
export type SymptomCheckerOutput = z.infer<typeof SymptomCheckerOutputSchema>;

export async function symptomChecker(input: SymptomCheckerInput): Promise<SymptomCheckerOutput> {
  return symptomCheckerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'symptomCheckerPrompt',
  input: {schema: SymptomCheckerInputSchema},
  output: {schema: SymptomCheckerOutputSchema},
  prompt: `You are a helpful AI assistant that provides possible causes for inputted symptoms. You must also provide a disclaimer that the information is not a substitute for professional medical advice.

Symptoms: {{{symptoms}}}`,
});

const symptomCheckerFlow = ai.defineFlow(
  {
    name: 'symptomCheckerFlow',
    inputSchema: SymptomCheckerInputSchema,
    outputSchema: SymptomCheckerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      ...output,
      disclaimer: 'This information is not a substitute for professional medical advice. Always consult with a qualified healthcare provider for diagnosis and treatment.',
    };
  }
);
