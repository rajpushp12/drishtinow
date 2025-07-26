'use server';

/**
 * @fileOverview Processes attendee reports using the Gemini API to analyze content and severity, creating alerts for critical issues.
 *
 * - processReport - Processes a report and creates an alert if necessary.
 * - ReportProcessorInput - The input type for the processReport function.
 * - ReportProcessorOutput - The return type for the processReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReportProcessorInputSchema = z.object({
  attendeeId: z.string().describe('The ID of the attendee submitting the report.'),
  type: z.string().describe('The type of report (e.g., Medical, Lost Person, Safety Concern).'),
  location: z.object({
    lat: z.number().describe('The latitude of the report.'),
    lng: z.number().describe('The longitude of the report.'),
  }).describe('The location of the report.'),
  description: z.string().nullable().describe('A description of the report.'),
  photoUrl: z.string().nullable().describe('A URL to a photo related to the report, if any.'),
  timestamp: z.string().describe('The timestamp of the report.'),
  eventId: z.string().describe('The ID of the event the report belongs to.'),
  reportId: z.string().describe('The ID of the report itself.'),
});
export type ReportProcessorInput = z.infer<typeof ReportProcessorInputSchema>;

const ReportProcessorOutputSchema = z.object({
  alertTitle: z.string().describe('The title of the alert.'),
  alertSummary: z.string().describe('A summary of the alert.'),
  alertType: z.string().describe('The type of alert (e.g., PREDICTIVE, MEDICAL, FIRE, PANIC, LOST_PERSON).'),
  alertSeverity: z.string().describe('The severity of the alert (e.g., CRITICAL, WARNING, INFO).'),
  alertLocation: z.object({
    lat: z.number().describe('The latitude of the alert.'),
    lng: z.number().describe('The longitude of the alert.'),
  }).describe('The location of the alert.'),
  source: z.string().describe('The source of the alert (e.g., Vertex AI Forecast, Gemini Vision, Attendee Report).'),
});
export type ReportProcessorOutput = z.infer<typeof ReportProcessorOutputSchema>;

export async function processReport(input: ReportProcessorInput): Promise<ReportProcessorOutput | null> {
  return reportProcessorFlow(input);
}

const reportAnalysisPrompt = ai.definePrompt({
  name: 'reportAnalysisPrompt',
  input: {schema: ReportProcessorInputSchema},
  output: {schema: ReportProcessorOutputSchema},
  prompt: `You are an AI assistant designed to analyze attendee reports from a live event and determine if they warrant creating an alert for the event commanders.

  Here is the report data:
  - Attendee ID: {{{attendeeId}}}
  - Report Type: {{{type}}}
  - Location (Lat/Lng): {{{location.lat}}}, {{{location.lng}}}
  - Description: {{{description}}}
  - Photo URL: {{{photoUrl}}}
  - Timestamp: {{{timestamp}}}

  Based on the report, determine:
  1.  Whether an alert should be created.
  2.  If so, create a title and summary for the alert.
  3.  Determine the alert type (MEDICAL, LOST_PERSON, SAFETY_CONCERN, or OTHER) and severity (CRITICAL, WARNING, INFO).
  4. Ensure the location is the same as the report.

  If the report does not warrant an alert, return null. Otherwise, return the alert details.

  Ensure the output is valid JSON.
`,
});

const reportProcessorFlow = ai.defineFlow(
  {
    name: 'reportProcessorFlow',
    inputSchema: ReportProcessorInputSchema,
    outputSchema: z.nullable(ReportProcessorOutputSchema),
  },
  async input => {
    const {output} = await reportAnalysisPrompt(input);

    if (!output) {
      return null;
    }

    return output;
  }
);
