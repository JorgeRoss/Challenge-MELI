import { AuditEvent } from '../entities/AuditEvent';

export interface AuditRepository {
  save(event: AuditEvent): Promise<void>;
  findAll(): Promise<AuditEvent[]>;
} 