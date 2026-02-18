
export enum LeadSource {
  WHATSAPP = 'WhatsApp',
  WEBSITE = 'Website',
  INDIAMART = 'IndiaMart',
  SOCIAL_MEDIA = 'Social Media',
  VOICE_CALL = 'Voice Call'
}

export enum LeadStatus {
  NEW = 'New',
  IN_PROGRESS = 'In Progress',
  FOLLOW_UP = 'Follow Up',
  CONVERTED = 'Converted',
  CLOSED = 'Closed'
}

export interface NotificationSettings {
  email: string;
  onNewLead: boolean;
  onHighPriority: boolean;
  onReminder: boolean;
  onConversion: boolean;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  isAI: boolean;
  persona?: string;
  knowledgeBase?: string;
  style?: 'Formal' | 'Casual' | 'Aggressive' | 'Helpful';
}

export interface Lead {
  id: string;
  name: string;
  contact: string;
  source: LeadSource;
  status: LeadStatus;
  lastMessage: string;
  timestamp: string;
  assignedTo?: string; // Agent ID
  tags: string[];
  reminder?: {
    dateTime: string;
    note?: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: Date;
}

export type View = 'dashboard' | 'chat' | 'leads' | 'settings';
