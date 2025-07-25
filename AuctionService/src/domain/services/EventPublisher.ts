export interface EventPublisher {
  publish(event: any): Promise<void>;
} 