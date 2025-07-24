import request from 'supertest';
import app from '../../app';

describe('POST /api/bid', () => {
  it('should accept a valid bid', async () => {
    const res = await request(app)
      .post('/api/bid')
      .send({ auctionId: 'auction1', userId: 'user1', amount: 100 });
    expect(res.status).toBe(200);
  });
}); 