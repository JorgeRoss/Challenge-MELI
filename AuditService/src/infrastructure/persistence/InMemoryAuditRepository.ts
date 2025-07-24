import { AuditRepository } from '../../domain/repositories/AuditRepository';
import { AuditEvent } from '../../domain/entities/AuditEvent';

export class InMemoryAuditRepository implements AuditRepository {
  private events: AuditEvent[] = [];

  async save(event: AuditEvent): Promise<void> {
    this.events.push(event);
  }

  async findAll(): Promise<AuditEvent[]> {
    return this.events;
  }
} 