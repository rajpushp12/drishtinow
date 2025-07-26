export type GeoPoint = {
  lat: number;
  lng: number;
};

export type Alert = {
  id: string;
  title: string;
  summary: string;
  type: "PREDICTIVE" | "MEDICAL" | "FIRE" | "PANIC" | "LOST_PERSON" | "SAFETY_CONCERN" | "OTHER";
  severity: "CRITICAL" | "WARNING" | "INFO";
  status: "NEW" | "ACKNOWLEDGED" | "DISPATCHED" | "RESOLVED";
  location: GeoPoint;
  zone?: string;
  timestamp: Date;
  source: "Vertex AI Forecast" | "Gemini Vision" | "Attendee Report";
  assignedResponder?: string | null;
};

export type Report = {
  id: string;
  attendeeId: string;
  type: "Medical" | "Lost Person" | "Safety Concern";
  location: GeoPoint;
  description?: string | null;
  photoUrl?: string | null;
  timestamp: Date;
  status: "Received" | "Processed";
};

export type Responder = {
  id: string;
  name: string;
  status: "Available" | "Dispatched" | "On-break";
  location: GeoPoint;
  assignedAlertId?: string | null;
};

export type User = {
  id: string;
  name: string;
  mobileNumber: string;
  role: 'management' | 'responder' | 'consumer';
};
