export class SnsPublisher {
  async publish(event: any): Promise<void> {
    // Aquí iría la lógica real con AWS SDK:
    // await sns.publish({ TopicArn, Message: JSON.stringify(event) }).promise();
    console.log('[SNS] Event published:', JSON.stringify(event));
  }
} 