import { SubmitBid } from './SubmitBid';

describe('SubmitBid', () => {
  it('should reject invalid bid', async () => {
    const repo = { enqueue: jest.fn() };
    const useCase = new SubmitBid(repo as any);
    const result = await useCase.execute({ auctionId: '', userId: '', amount: 0 });
    expect(result.success).toBe(false);
  });
}); 