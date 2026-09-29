# AI Architecture

Do not couple AI directly into the core order system.

Recommended:

Laravel
  |
  +-- AI job
       |
       +-- AI provider/model
       |
       +-- result storage
       |
       +-- moderation/validation
       |
       +-- seller approval
       |
       +-- publish

## AI generation record

Store:
- feature
- model/provider
- input reference
- output reference
- status
- cost metadata if available
- user approval
- created_at

## Cost controls

- quotas
- rate limits
- caching
- asynchronous jobs
- maximum input size
- model selection by task

## Failure behavior

If AI fails, seller must still be able to manually create the listing.
