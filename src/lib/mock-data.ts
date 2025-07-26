import type { Alert, Responder, Report, User, HeatmapPoint } from '@/lib/types';

export const mockUsers: User[] = [
  { 
    id: 'user-1', 
    name: 'Chris Green', 
    mobileNumber: '9876543210', 
    role: 'management',
    age: 42,
    medicalInfo: {
      bloodGroup: 'O+',
      conditions: [],
      medications: [],
      allergies: ['Pollen']
    },
    emergencyContact: { name: 'Jane Green', phone: '1234567890' },
    address: '123 Command Center, Event City'
  },
  { 
    id: 'user-2', 
    name: 'Alex Ray', 
    mobileNumber: '7654321098', 
    role: 'consumer',
    age: 28,
    medicalInfo: {
      bloodGroup: 'A-',
      conditions: ['Asthma'],
      medications: ['Inhaler'],
      allergies: []
    },
    emergencyContact: { name: 'Sam Ray', phone: '2345678901' },
    address: '456 Attendee Ave, Event Suburb'
  },
  { 
    id: 'user-3', 
    name: 'Bob Williams', 
    mobileNumber: '8765432109', 
    role: 'responder',
    age: 35,
    medicalInfo: {
      bloodGroup: 'B+',
      conditions: [],
      medications: [],
      allergies: ['Peanuts']
    },
    emergencyContact: { name: 'Sarah Williams', phone: '3456789012' },
    address: '789 Responder Rd, Medic Town'
  },
  { 
    id: 'user-4', 
    name: 'Alice Johnson', 
    mobileNumber: '6543210987', 
    role: 'responder',
    age: 32,
    medicalInfo: {
      bloodGroup: 'AB+',
      conditions: [],
      medications: [],
      allergies: []
    },
    emergencyContact: { name: 'Mark Johnson', phone: '4567890123' },
    address: '101 Response Unit, Medic Town'
  },
];

export const mockResponders: Responder[] = [
  { id: 'resp-1', name: 'Alice Johnson', status: 'Available', location: { lat: 34.0522, lng: -118.2437 } },
  { id: 'resp-2', name: 'Bob Williams', status: 'Dispatched', location: { lat: 34.055, lng: -118.245 }, assignedAlertId: 'alert-2' },
  { id: 'resp-3', name: 'Charlie Brown', status: 'Available', location: { lat: 34.05, lng: -118.24 } },
  { id: 'resp-4', name: 'Diana Prince', status: 'On-break', location: { lat: 34.048, lng: -118.25 } },
];

export const mockAlerts: Alert[] = [
  {
    id: 'alert-1',
    title: 'Predicted Bottleneck: Gate 3',
    summary: 'High crowd density predicted in 12 min near the main stage.',
    type: 'PREDICTIVE',
    severity: 'WARNING',
    status: 'NEW',
    location: { lat: 34.054, lng: -118.246 },
    zone: 'B',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    source: 'Vertex AI Forecast',
  },
  {
    id: 'alert-2',
    title: 'Medical Assistance Required',
    summary: 'Attendee reported feeling faint near the food court.',
    type: 'MEDICAL',
    severity: 'CRITICAL',
    status: 'DISPATCHED',
    location: { lat: 34.055, lng: -118.245 },
    zone: 'C',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    source: 'Attendee Report',
    assignedResponder: 'resp-2',
  },
  {
    id: 'alert-3',
    title: 'Lost Child Reported',
    summary: 'A 7-year-old child in a red shirt was last seen near the ferris wheel.',
    type: 'LOST_PERSON',
    severity: 'CRITICAL',
    status: 'ACKNOWLEDGED',
    location: { lat: 34.051, lng: -118.242 },
    zone: 'A',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    source: 'Attendee Report',
  },
  {
    id: 'alert-4',
    title: 'Minor Fire Detected',
    summary: 'Smoke detected from a food vendor stall in Zone C.',
    type: 'FIRE',
    severity: 'WARNING',
    status: 'RESOLVED',
    location: { lat: 34.056, lng: -118.248 },
    zone: 'C',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    source: 'Gemini Vision',
  },
    {
    id: 'alert-5',
    title: 'Panic Detected',
    summary: 'A small crowd surge detected near the sound booth.',
    type: 'PANIC',
    severity: 'INFO',
    status: 'NEW',
    location: { lat: 34.053, lng: -118.241 },
    zone: 'B',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    source: 'Gemini Vision',
  },
];

export const mockReports: Report[] = [
    {
        id: 'report-1',
        attendeeId: 'attendee-123',
        type: 'Medical',
        location: { lat: 34.055, lng: -118.245 },
        description: 'Someone fainted near the food court. They seem to be dehydrated.',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        status: 'Processed'
    },
    {
        id: 'report-2',
        attendeeId: 'attendee-456',
        type: 'Lost Person',
        location: { lat: 34.051, lng: -118.242 },
        description: 'I can\'t find my son. He is 7 years old and is wearing a red t-shirt and blue jeans. His name is Leo.',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        status: 'Processed'
    },
    {
        id: 'report-3',
        attendeeId: 'attendee-789',
        type: 'Safety Concern',
        location: { lat: 34.052, lng: -118.248 },
        description: 'A group of people are getting very aggressive near the restrooms in Zone B. It might be a good idea to send someone to check it out.',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        status: 'Received'
    }
];

export const mockHeatmapData: HeatmapPoint[] = [
  { lat: 34.054, lng: -118.246, weight: 0.8 },
  { lat: 34.0542, lng: -118.2461, weight: 0.9 },
  { lat: 34.0538, lng: -118.2459, weight: 0.7 },
  { lat: 34.055, lng: -118.245, weight: 0.5 },
  { lat: 34.0551, lng: -118.2452, weight: 0.6 },
  { lat: 34.051, lng: -118.242, weight: 0.4 },
  { lat: 34.0512, lng: -118.2422, weight: 0.3 },
  { lat: 34.053, lng: -118.241, weight: 0.6 },
  { lat: 34.058, lng: -118.250, weight: 0.2 },
  { lat: 34.0522, lng: -118.2437, weight: 0.4 },
  { lat: 34.05, lng: -118.24, weight: 0.3 },
  { lat: 34.048, lng: -118.25, weight: 0.2 },
  { lat: 34.056, lng: -118.248, weight: 0.5 },
];