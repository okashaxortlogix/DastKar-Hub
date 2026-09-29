# Deployment

## CI pipeline

1. install dependencies
2. lint
3. type-check
4. backend static analysis
5. unit tests
6. feature tests
7. build frontend
8. security checks
9. build Docker image
10. deploy staging
11. smoke tests
12. production approval

## Laravel production

- cache config/routes where appropriate
- queue workers
- scheduler
- database migrations
- Horizon if selected
- log aggregation

## Frontend

- optimized production build
- CDN
- compression
- cache headers
- source maps kept private/controlled where appropriate

## Rollback

Every deployment must have a rollback plan.
