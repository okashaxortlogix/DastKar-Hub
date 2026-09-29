# DastKar Hub — Backup & Disaster Recovery Guide

## 1. Database Backup Strategy

### Automated Nightly Snapshot
A scheduled backup job executes daily at 02:00 PKT and streams encrypted snapshots to secure off-site object storage (AWS S3 / Wasabi / Cloudflare R2).

```bash
#!/bin/bash
# Backup PostgreSQL Database
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="/tmp/dastkar_db_${TIMESTAMP}.sql.gz"

pg_dump -h $DB_HOST -U $DB_USERNAME -d $DB_DATABASE | gzip > $BACKUP_FILE

# Upload to S3 private backup bucket with 30-day retention policy
aws s3 cp $BACKUP_FILE s3://dastkar-backups-secure/db/

# Clean up local temporary file
rm -f $BACKUP_FILE
```

---

## 2. Restoration Procedure

In the event of database corruption or regional failure:

```bash
# 1. Download backup archive from S3
aws s3 cp s3://dastkar-backups-secure/db/dastkar_db_YYYYMMDD_HHMMSS.sql.gz /tmp/

# 2. Decompress
gunzip /tmp/dastkar_db_YYYYMMDD_HHMMSS.sql.gz

# 3. Restore to target database
psql -h $TARGET_HOST -U $DB_USERNAME -d $DB_DATABASE < /tmp/dastkar_db_YYYYMMDD_HHMMSS.sql

# 4. Verify table integrity and run pending migrations if any
php artisan migrate --status
```

---

## 3. Storage & Verification Documents Backup
Maker CNIC documents and workshop evidence stored in private disks are versioned and replicated cross-region using bucket replication rules with server-side KMS encryption.
