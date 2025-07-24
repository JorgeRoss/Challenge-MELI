# Auction Service

Microservicio para procesar ofertas desde SQS y publicar eventos en SNS (AWS Ready).

## Instalación
```bash
npm install
```

## Ejecución
```bash
npm run build
npm start
```

## ¿Cómo funciona?
- Simula el consumo de mensajes de SQS (ofertas) y procesa la lógica de subasta.
- Publica eventos en SNS (simulado por consola, fácil de migrar a AWS SDK).

## Notas
- La integración con AWS SQS/SNS está lista para producción, solo debes reemplazar la simulación por el SDK real.
- Sigue Clean Architecture para facilitar el mantenimiento y la escalabilidad. 