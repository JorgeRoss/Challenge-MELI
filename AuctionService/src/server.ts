import { consumeBidMessage } from './interfaces/sqs/BidConsumer';

// Simulación: consumir mensajes de SQS cada 5 segundos
type DemoBid = {
  auctionId: string;
  userId: string;
  amount: number;
  timestamp: string;
};

const demoBids: DemoBid[] = [
  { auctionId: 'auction1', userId: 'userA', amount: 101, timestamp: new Date().toISOString() },
  { auctionId: 'auction1', userId: 'userB', amount: 105, timestamp: new Date().toISOString() },
  { auctionId: 'auction1', userId: 'userC', amount: 110, timestamp: new Date().toISOString() },
];

let idx = 0;
setInterval(() => {
  if (idx < demoBids.length) {
    consumeBidMessage(demoBids[idx]);
    idx++;
  }
}, 5000);

console.log('Auction Service running. Simulando consumo de SQS...'); 