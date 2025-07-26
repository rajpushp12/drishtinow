'use server';

import { getEventSentimentSummary } from "@/ai/flows/event-sentiment-summary";
import { processReport, ReportProcessorInput } from "@/ai/flows/report-processor";
import { Report, Alert } from "@/lib/types";
import { mockReports as initialMockReports } from "@/lib/mock-data";

// In a real app, this would come from a database.
// For this simulation, we'll use an in-memory array.
let mockReports: Report[] = [...initialMockReports];

export async function getSentimentSummaryAction() {
    try {
        const reportsForSummary = mockReports.map(report => ({
            ...report,
            location: {
                latitude: report.location.lat,
                longitude: report.location.lng,
            },
            timestamp: report.timestamp.toISOString(),
        }));

        const sentiment = await getEventSentimentSummary({ eventReports: reportsForSummary });
        return { summary: sentiment.summary, lastUpdated: new Date() };
    } catch (error) {
        console.error("Error getting sentiment summary:", error);
        return { error: "Failed to get sentiment summary." };
    }
}

export async function processReportAction(data: Omit<Report, 'id' | 'timestamp' | 'status'>): Promise<{alert: Alert | null; error?: string}> {
    const newReport: Report = {
        ...data,
        id: `report-${Date.now()}`,
        timestamp: new Date(),
        status: 'Received',
    };
    
    mockReports.push(newReport);
    
    const processorInput: ReportProcessorInput = {
        attendeeId: newReport.attendeeId,
        type: newReport.type,
        location: newReport.location,
        description: newReport.description || null,
        photoUrl: newReport.photoUrl || null,
        timestamp: newReport.timestamp.toISOString(),
        eventId: "summer-fest-2025",
        reportId: newReport.id,
    };

    try {
        const result = await processReport(processorInput);

        if (!result) {
            return { alert: null };
        }
        
        const newAlert: Alert = {
            id: `alert-${Date.now()}`,
            title: result.alertTitle,
            summary: result.alertSummary,
            type: result.alertType as Alert['type'],
            severity: result.alertSeverity as Alert['severity'],
            status: 'NEW',
            location: result.alertLocation,
            timestamp: new Date(),
            source: 'Attendee Report',
        };

        // Find the report and update its status
        const reportIndex = mockReports.findIndex(r => r.id === newReport.id);
        if (reportIndex !== -1) {
            mockReports[reportIndex].status = 'Processed';
        }

        return { alert: newAlert };
    } catch (error) {
        console.error("Error processing report:", error);
        return { alert: null, error: "Failed to process report." };
    }
}
