# Deployment Guide

Production deployment instructions for LegumeSec.

## Prerequisites

- Server with Ubuntu 20.04+ or similar Linux distribution
- PostgreSQL 12+ installed
- Python 3.9+ installed
- Node.js 18+ installed
- Nginx installed
- Domain name configured (for SSL)

## Server Setup

### 1. Update System

```bash
sudo apt update
sudo apt upgrade -y
```

### 2. Install Required Software

```bash
# PostgreSQL
sudo apt install postgresql postgresql-contrib

# Python and pip
sudo apt install python3.9 python3-pip python3-venv

# Node.js (using NodeSource)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Nginx
sudo apt install nginx

# Git
sudo apt install git
```

### 3. Create Application User

```bash
sudo adduser legumsec
sudo usermod -aG sudo legumsec
su - legumsec
```

## Database Setup

### 1. Create Database

```bash
sudo -u postgres psql
```

```sql
CREATE DATABASE legumsec_db;
CREATE USER legumsec_user WITH PASSWORD 'secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE legumsec_db TO legumsec_user;
\q
```

### 2. Configure PostgreSQL

Edit `/etc/postgresql/12/main/postgresql.conf`:
```
listen_addresses = 'localhost'
```

Restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```

## Backend Deployment

### 1. Clone Repository

```bash
cd /home/legumsec
git clone https://github.com/yourusername/LegumeSec.git
cd LegumeSec/backend
```

### 2. Create Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Configure Environment

```bash
cp env.example .env
nano .env
```

Set production values:
```bash
SECRET_KEY=<generate-secure-key>
DEBUG=False
DJANGO_ENVIRONMENT=production
DB_NAME=legumsec_db
DB_USER=legumsec_user
DB_PASSWORD=<secure-password>
DB_HOST=localhost
DB_PORT=5432
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

### 4. Run Migrations

```bash
python manage.py migrate
python manage.py collectstatic --noinput
```

### 5. Create Superuser

```bash
python manage.py createsuperuser
```

### 6. Create Logs Directory

```bash
mkdir -p logs
chmod 755 logs
```

## Frontend Deployment

### 1. Build Frontend

```bash
cd /home/legumsec/LegumeSec/frontend
npm install
npm run build
```

### 2. Configure Environment

Create `.env.production`:
```bash
VITE_API_URL=https://api.yourdomain.com
```

Rebuild:
```bash
npm run build
```

## Gunicorn Setup

### 1. Install Gunicorn

```bash
cd /home/legumsec/LegumeSec/backend
source venv/bin/activate
pip install gunicorn
```

### 2. Create Gunicorn Service

Create `/etc/systemd/system/legumsec.service`:

```ini
[Unit]
Description=LegumeSec Gunicorn daemon
After=network.target

[Service]
User=legumsec
Group=www-data
WorkingDirectory=/home/legumsec/LegumeSec/backend
Environment="PATH=/home/legumsec/LegumeSec/backend/venv/bin"
ExecStart=/home/legumsec/LegumeSec/backend/venv/bin/gunicorn \
    --access-logfile - \
    --workers 3 \
    --bind unix:/home/legumsec/LegumeSec/backend/legumsec.sock \
    crud.wsgi:application

[Install]
WantedBy=multi-user.target
```

### 3. Start Service

```bash
sudo systemctl daemon-reload
sudo systemctl start legumsec
sudo systemctl enable legumsec
sudo systemctl status legumsec
```

## Nginx Configuration

### 1. Create Nginx Config

Create `/etc/nginx/sites-available/legumsec`:

```nginx
# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        include proxy_params;
        proxy_pass http://unix:/home/legumsec/LegumeSec/backend/legumsec.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static/ {
        alias /home/legumsec/LegumeSec/backend/staticfiles/;
    }

    location /media/ {
        alias /home/legumsec/LegumeSec/backend/media/;
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /home/legumsec/LegumeSec/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /static/ {
        alias /home/legumsec/LegumeSec/frontend/dist/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 2. Enable Site

```bash
sudo ln -s /etc/nginx/sites-available/legumsec /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## SSL Setup (Let's Encrypt)

### 1. Install Certbot

```bash
sudo apt install certbot python3-certbot-nginx
```

### 2. Obtain SSL Certificate

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo certbot --nginx -d api.yourdomain.com
```

### 3. Auto-Renewal

Certbot automatically sets up renewal. Test:
```bash
sudo certbot renew --dry-run
```

## Firewall Configuration

### 1. Configure UFW

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## Post-Deployment Checklist

- [ ] Database migrations applied
- [ ] Static files collected
- [ ] Environment variables set
- [ ] DEBUG=False in production
- [ ] ALLOWED_HOSTS configured
- [ ] CORS_ALLOWED_ORIGINS configured
- [ ] SSL certificates installed
- [ ] Gunicorn service running
- [ ] Nginx configured and running
- [ ] Logs directory created and writable
- [ ] Superuser created
- [ ] Frontend built and deployed
- [ ] Firewall configured

## Monitoring

### Check Services

```bash
# Gunicorn
sudo systemctl status legumsec

# Nginx
sudo systemctl status nginx

# PostgreSQL
sudo systemctl status postgresql
```

### View Logs

```bash
# Application logs
tail -f /home/legumsec/LegumeSec/backend/logs/django.log
tail -f /home/legumsec/LegumeSec/backend/logs/api.log

# Gunicorn logs
sudo journalctl -u legumsec -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Updates

### Backend Update

```bash
cd /home/legumsec/LegumeSec
git pull origin main
cd backend
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
sudo systemctl restart legumsec
```

### Frontend Update

```bash
cd /home/legumsec/LegumeSec/frontend
git pull origin main
npm install
npm run build
sudo systemctl reload nginx
```

## Backup

### Database Backup

```bash
# Create backup
pg_dump -U legumsec_user legumsec_db > backup_$(date +%Y%m%d).sql

# Restore backup
psql -U legumsec_user legumsec_db < backup_20240101.sql
```

### Automated Backup Script

Create `/home/legumsec/backup.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/home/legumsec/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
pg_dump -U legumsec_user legumsec_db > $BACKUP_DIR/db_$DATE.sql
find $BACKUP_DIR -name "db_*.sql" -mtime +7 -delete
```

Add to crontab:
```bash
crontab -e
# Daily backup at 2 AM
0 2 * * * /home/legumsec/backup.sh
```

## Troubleshooting

### Gunicorn Not Starting

```bash
# Check logs
sudo journalctl -u legumsec -n 50

# Check socket permissions
ls -la /home/legumsec/LegumeSec/backend/legumsec.sock
```

### Nginx 502 Error

- Check Gunicorn is running
- Verify socket path in Nginx config
- Check file permissions

### Database Connection Issues

- Verify PostgreSQL is running
- Check credentials in `.env`
- Test connection: `psql -U legumsec_user -d legumsec_db`

## Related Documentation

- [Environment Variables](./environment-variables.md)
- [Configuration Guide](../configuration.md)
- [Troubleshooting](../troubleshooting.md)

---

**Deployment complete?** Verify everything works and set up monitoring.









