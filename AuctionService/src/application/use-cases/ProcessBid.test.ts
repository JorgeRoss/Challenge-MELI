import { ProcessBid } from './ProcessBid';

describe('ProcessBid', () => {
  it('should reject bid if auction not found', async () => {
    const repo = { findById: async () => null, save: jest.fn() };
    const sns = { publish: jest.fn() };
    const useCase = new ProcessBid(repo as any, sns as any);
    const result = await useCase.execute({ auctionId: 'notfound', userId: 'user', amount: 100, timestamp: new Date().toISOString() });
    expect(result.success).toBe(false);
  });
}); 