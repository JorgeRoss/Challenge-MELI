# Audit Service

Microservicio para registrar y consultar eventos de auditoría de todos los microservicios.

- POST /api/audit — Registra un evento de auditoría.
- GET /api/audit — Consulta todos los eventos registrados.

Puedes suscribir este servicio a SNS o llamarlo directamente desde los otros microservicios. 