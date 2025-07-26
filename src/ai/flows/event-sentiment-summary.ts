'use server';

/**
 * @fileOverview An AI agent that summarizes the overall event sentiment.
 *
 * - getEventSentimentSummary - A function that handles the event sentiment summarization process.
 * - GetEventSentimentSummaryInput - The input type for the getEventSentimentSummary function.
 * - GetEventSentimentSummaryOutput - The return type for the getEventSentimentSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetEventSentimentSummaryInputSchema = z.object({
  eventReports: z.array(
    z.object({
      attendeeId: z.string(),
      type: z.string(),
      location: z.object({
        latitude: z.number(),
        longitude: z.number(),
      }),
      description: z.string().nullable(),
      photoUrl: z.string().nullable(),
      timestamp: z.string(),
      status: z.string(),
    })
  ).describe('An array of event reports.'),
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
  prompt: `You are an AI assistant that summarizes the sentiment of an event based on attendee reports.

  Given the following event reports, generate a brief summary of the overall event sentiment. Focus on the general mood and any areas that need attention. Do not include data about individual reports, only summarize the entire event's mood and areas of concern.

  Event Reports:
  {{#each eventReports}}
  - Attendee ID: {{attendeeId}}, Type: {{type}}, Description: {{description}}, Status: {{status}}
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
