# Arquitectura General de la Solución de Subastas en Tiempo Real

## Descripción General

Esta solución implementa un sistema de subastas de alta demanda, escalable y resiliente, basado en microservicios desplegados en Kubernetes (EKS). Utiliza servicios gestionados de AWS como SQS, SNS, ElastiCache (Redis) y DynamoDB/Aurora para desacoplar, escalar y asegurar la persistencia y la experiencia en tiempo real.

## Componentes Principales

- **Cognito**: Los usuarios se autentican mediante Amazon Cognito, asegurando el acceso mediante tokens validados en API Gateway.
- **API Gateway**: Entrada HTTP/WS para exponer los endpoints a usuarios y sistemas externos.
- **BidService**: Microservicio que recibe ofertas, las valida y las encola en SQS.
- **SQS (BidQueue)**: Cola de mensajes para desacoplar la recepción y el procesamiento de ofertas.
- **SQS (DQL)**: Cola de mensajes para que en caso de error, donde los mensajes fallidos van a una Dead Letter Queue (DLQ) para su posterior reintento o inspección.
- **AuctionService**: Microservicio que consume ofertas de SQS, procesa la lógica de subasta, actualiza el cache y persiste en la base de datos, y publica eventos en SNS.
- **ElastiCache/Redis**: Cache distribuido para lecturas rápidas y estado en tiempo real de las subastas.
- **DynamoDB/Aurora**: Base de datos para persistencia durable de subastas, ofertas y auditoría.
- **SNS (AuctionEventsTopic)**: Sistema de publicación/suscripción para eventos de subasta.
- **NotificationService**: Microservicio que recibe eventos de SNS y notifica a los usuarios (ejemplo: email, push, SMS).
- **CloudWatch**: Monitoreo, logs y métricas.
- **AuditService**: Microservicio para trazabilidad.

## Flujo de Comunicación entre Servicios

1. **El usuario realiza una oferta** a través de la app web/mobile, que llega al **API Gateway**.
2. **API Gateway** enruta la petición al **BidService**.
3. **BidService** valida la oferta y la publica en la cola **SQS: BidQueue**.
4. **AuctionService** (uno o varios pods) consume ofertas de **SQS**:
    - Valida reglas de negocio (incremento mínimo, estado de la subasta, etc).
    - Actualiza el **cache (Redis/ElastiCache)** con la nueva oferta más alta y el estado de la subasta para lecturas rápidas.
    - Persiste la oferta y el estado de la subasta en la **base de datos (DynamoDB/Aurora)** para durabilidad y auditoría.
    - Publica un evento en **SNS: AuctionEventsTopic** (ejemplo: nueva oferta más alta, subasta finalizada).
5. **NotificationService** está suscrito a **SNS** y recibe los eventos relevantes:
    - Envía notificaciones a los usuarios (push, email, SMS, etc).
6. **Todos los servicios** generan logs y métricas que son recolectados por **CloudWatch** para monitoreo y alertas.

## Patrón de Cache y Persistencia

- **Lecturas**: Siempre desde el cache (Redis) para máxima velocidad y escalabilidad.
- **Escrituras**: Se actualiza primero el cache para reflejar el estado en tiempo real, y luego se persiste en la base de datos. Si la persistencia falla, se debe reintentar o reconciliar.

## Escalabilidad y Resiliencia

- Todos los microservicios corren como pods independientes en EKS y pueden escalar horizontalmente.
- SQS desacopla la recepción y el procesamiento de ofertas, permitiendo absorber picos de tráfico, controlando reintentos y errores.
- Redis permite lecturas concurrentes de millones de usuarios sin sobrecargar la base de datos.
- SNS desacopla la lógica de negocio de las notificaciones y permite agregar nuevos consumidores fácilmente.
- CloudWatch permiten monitoreo centralizado y alertas proactivas.

## Infraestructura como Código

- Toda la infraestructura (colas, topics, cache, base de datos) se puede desplegar y versionar usando CloudFormation o Terraform.

## Diagrama de Alto Nivel

```
[Usuarios] --> [Cognito] -->[API Gateway] --> [BidService] --> [SQS: BidQueue] --> [AuctionService]
[AuctionService] <--> [ElastiCache/Redis]
[AuctionService] <--> [DynamoDB/Aurora]
[AuctionService] --> [SNS: AuctionEventsTopic] --> [NotificationService]
```

## Notas Finales

- La solución es agnóstica respecto a la plataforma de ejecución: puedes correr los servicios como pods en EKS, tareas en ECS, o funciones Lambda si lo prefieres.
- El diseño desacopla cada responsabilidad, permitiendo escalar, mantener y evolucionar cada componente de forma independiente.
- El cache y la base de datos trabajan juntos para ofrecer una experiencia en tiempo real sin sacrificar durabilidad ni trazabilidad. 