# Observability

## Logs

Track:
- request errors
- payment events
- queue failures
- webhook failures
- critical admin actions

Never log:
- passwords
- payment secrets
- full sensitive identity documents
- unnecessary personal information

## Metrics

- API latency
- error rate
- queue depth
- failed jobs
- DB connections
- checkout failures
- payment failures
- RTO
- refund rate

## Alerts

Alert on:
- payment webhook failure spike
- API 5xx spike
- database saturation
- queue backlog
- storage failures
- suspicious authentication activity
