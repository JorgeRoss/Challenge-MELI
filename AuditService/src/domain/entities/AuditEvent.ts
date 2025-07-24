export interface AuditEvent {
  id: string;
  service: string;
  type: string;
  payload: any;
  timestamp: Date;
} 