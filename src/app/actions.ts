'use server';

import { getEventSentimentSummary } from "@/ai/flows/event-sentiment-summary";
import { processReport, ReportProcessorInput } from "@/ai/flows/report-processor";
import { Report, Alert } from "@/lib/types";
import { mockReports as initialMockReports, mockAlerts as initialMockAlerts } from "@/lib/mock-data";

// In a real app, this would come from a database.
// For this simulation, we'll use an in-memory array.
let mockReports: Report[] = [...initialMockReports];
let mockAlerts: Alert[] = [...initialMockAlerts];

export async function getSentimentSummaryAction(currentAlerts: Alert[]) {
    try {
        const alertsForSummary = currentAlerts.map(alert => ({
            ...alert,
            timestamp: alert.timestamp.toISOString(),
        }));

        const sentiment = await getEventSentimentSummary({ alerts: alertsForSummary });
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
        location: {
            latitude: newReport.location.lat,
            longitude: newReport.location.lng
        },
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
            priority: result.priority,
            status: 'NEW',
            location: result.alertLocation,
            timestamp: new Date(),
            source: 'Attendee Report',
        };
        
        mockAlerts.push(newAlert);

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
