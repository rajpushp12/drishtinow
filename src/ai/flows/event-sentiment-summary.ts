'use server';

/**
 * @fileOverview An AI agent that summarizes the overall event sentiment based on active alerts.
 *
 * - getEventSentimentSummary - A function that handles the event sentiment summarization process.
 * - GetEventSentimentSummaryInput - The input type for the getEventSentimentSummary function.
 * - GetEventSentimentSummaryOutput - The return type for the getEventSentimentSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetEventSentimentSummaryInputSchema = z.object({
  alerts: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      summary: z.string(),
      type: z.string(),
      severity: z.string(),
      status: z.string(),
      timestamp: z.string(),
      source: z.string(),
    })
  ).describe('An array of active event alerts.'),
});
export type GetEventSentimentSummaryInput = z.infer<typeof GetEventSentimentSummaryInputSchema>;

const GetEventSentimentSummaryOutputSchema = z.object({
  summary: z.string().describe('A summary of the overall event sentiment.'),
});
export type GetEventSentimentSummaryOutput = z.infer<typeof GetEventSentimentSummaryOutputSchema>;

export async function getEventSentimentSummary(input: GetEventSentimentSummaryInput): Promise<GetEventSentimentSummaryOutput> {
  return eventSentimentSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'eventSentimentSummaryPrompt',
  input: {schema: GetEventSentimentSummaryInputSchema},
  output: {schema: GetEventSentimentSummaryOutputSchema},
  prompt: `You are an AI assistant that summarizes the sentiment of an event based on active alerts.

  Given the following alerts, generate a brief summary of the overall event sentiment. Focus on the general mood, the types of incidents occurring, and any areas that need attention. Do not list individual alerts, but synthesize the information into a cohesive overview.

  Active Alerts:
  {{#each alerts}}
  - Title: {{title}}, Type: {{type}}, Severity: {{severity}}, Status: {{status}}, Summary: {{summary}}
  {{/each}}
  `,
});

const eventSentimentSummaryFlow = ai.defineFlow(
  {
    name: 'eventSentimentSummaryFlow',
    inputSchema: GetEventSentimentSummaryInputSchema,
    outputSchema: GetEventSentimentSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
