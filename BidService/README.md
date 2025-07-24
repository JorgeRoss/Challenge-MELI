# Bid Service

Microservicio para recibir y encolar ofertas en un sistema de subastas distribuido (AWS SQS Ready).

## Instalación
```bash
npm install
```

## Ejecución
```bash
npm run build
npm start
```

## Endpoint
- `POST /api/bid`  
  ```json
  {
    "auctionId": "auction1",
    "userId": "user123",
    "amount": 101
  }
  ```

## Notas
- La integración con AWS SQS está lista para producción, solo debes reemplazar la simulación por el SDK real.
- Sigue Clean Architecture para facilitar el mantenimiento y la escalabilidad. 