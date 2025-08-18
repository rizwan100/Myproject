# Aasan Rishte - Matrimonial Web Application

A complete full-stack matrimonial web application built for Muslims in Hyderabad, featuring modern technologies and mobile-first design.

## 🚀 Quick Start

### Admin Access
- **Admin Email**: `aasanrishtecontact@gmail.com`
- **Admin Password**: See admin creation scripts or contact system administrator
- **Admin Panel**: Login and navigate to "Admin Panel" to manage users

### Contact Information
- **Support Email**: `aasanrishtecontact@gmail.com`
- **Phone**: `+917569319126`
- **WhatsApp**: [wa.me/+917569319126](https://wa.me/+917569319126)

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Admin Functionality](#admin-functionality)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Development Guidelines](#development-guidelines)

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod validation
- **Authentication**: JWT tokens

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT with PyJWT
- **Email**: SMTP integration
- **File Storage**: Local storage (S3-ready)

### Development Tools
- **Package Manager**: Poetry (Backend), pnpm (Frontend)
- **Database Client**: Prisma Studio
- **API Testing**: FastAPI automatic docs

## ✨ Features

### Core Functionality
- ✅ User registration with email verification
- ✅ JWT-based authentication system
- ✅ Profile creation and management
- ✅ Photo and document upload
- ✅ Gender-based visibility (girls see boys, boys see girls)
- ✅ Advanced search with multiple filters
- ✅ Interest system and proposals
- ✅ Real-time chat functionality
- ✅ Mobile-responsive design

### Admin Features
- ✅ Admin panel with user management
- ✅ User search and filtering
- ✅ User account deletion
- ✅ Admin user creation
- ✅ Role-based access control

### User Features
- ✅ Account settings page
- ✅ Self-account deletion
- ✅ Profile completion tracking
- ✅ WhatsApp integration for support

## 📁 Project Structure

```
matrimonial-app/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py         # FastAPI app entry point
│   │   ├── auth.py         # Authentication endpoints
│   │   ├── auth_utils.py   # Auth middleware & utilities
│   │   ├── admin.py        # Admin management endpoints
│   │   ├── profiles.py     # Profile management
│   │   ├── interests.py    # Interest/proposal system
│   │   ├── chat.py         # Chat functionality
│   │   ├── uploads.py      # File upload handling
│   │   ├── database.py     # Database connection
│   │   ├── email_service.py # Email verification
│   │   └── utils.py        # Utility functions
│   ├── schema.prisma       # Database schema
│   ├── pyproject.toml      # Python dependencies
│   └── .env               # Environment variables
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # App router pages
│   │   │   ├── page.tsx   # Homepage
│   │   │   ├── login/     # Login page
│   │   │   ├── register/  # Registration page
│   │   │   ├── dashboard/ # User dashboard
│   │   │   ├── admin/     # Admin panel
│   │   │   ├── settings/  # User settings
│   │   │   └── verify-email/ # Email verification
│   │   └── components/    # Reusable components
│   ├── package.json       # Node.js dependencies
│   └── tailwind.config.js # Tailwind configuration
├── create_admin.py        # Admin user creation script
├── update_admin_email.py  # Admin email update script
└── README.md             # This file
```

## 🔧 Setup Instructions

### Prerequisites

#### For Linux/macOS
- Python 3.12+
- Node.js 20+
- PostgreSQL 14+
- Poetry (Python package manager)
- pnpm (Node.js package manager)

#### For Windows
- Python 3.12+ (from [python.org](https://www.python.org/downloads/))
- Node.js 20+ (from [nodejs.org](https://nodejs.org/))
- PostgreSQL 14+ (from [postgresql.org](https://www.postgresql.org/download/windows/))
- Poetry (Python package manager)
- pnpm (Node.js package manager)
- Git for Windows (from [git-scm.com](https://git-scm.com/download/win))

### 1. Clone Repository

#### Linux/macOS
```bash
git clone https://github.com/rizwan100/Myproject.git
cd Myproject
```

#### Windows (Command Prompt/PowerShell)
```cmd
git clone https://github.com/rizwan100/Myproject.git
cd Myproject
```

### 2. Backend Setup

#### Linux/macOS
```bash
cd backend

# Install dependencies
poetry install

# Activate virtual environment
poetry shell

# Set up environment variables (see Environment Variables section)
cp .env.example .env
# Edit .env with your configuration

# Generate Prisma client
poetry run prisma generate

# Run database migrations
poetry run prisma db push

# Start backend server
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Windows (Command Prompt)
```cmd
cd backend

REM Install Poetry if not installed
pip install poetry

REM Install dependencies
poetry install

REM Activate virtual environment
poetry shell

REM Set up environment variables (see Environment Variables section)
copy .env.example .env
REM Edit .env with your configuration using notepad or your preferred editor

REM Generate Prisma client
poetry run prisma generate

REM Run database migrations
poetry run prisma db push

REM Start backend server
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Windows (PowerShell)
```powershell
cd backend

# Install Poetry if not installed
pip install poetry

# Install dependencies
poetry install

# Activate virtual environment
poetry shell

# Set up environment variables (see Environment Variables section)
Copy-Item .env.example .env
# Edit .env with your configuration using notepad or your preferred editor

# Generate Prisma client
poetry run prisma generate

# Run database migrations
poetry run prisma db push

# Start backend server
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup

#### Linux/macOS
```bash
cd frontend

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

#### Windows (Command Prompt/PowerShell)
```cmd
cd frontend

REM Install pnpm if not installed
npm install -g pnpm

REM Install dependencies
pnpm install

REM Start development server
pnpm dev
```

### 4. Create Admin User

#### Linux/macOS
```bash
# From root directory
python create_admin.py
```

#### Windows
```cmd
REM From root directory
python create_admin.py
```

## 🔐 Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/matrimonial_db"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_ALGORITHM="HS256"
JWT_EXPIRATION_HOURS=24

# Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USERNAME="aasanrishtecontact@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM_EMAIL="aasanrishtecontact@gmail.com"

# Application
APP_NAME="Aasan Rishte"
APP_URL="http://localhost:3000"
API_URL="http://localhost:8000"

# File Upload
UPLOAD_DIR="uploads"
MAX_FILE_SIZE=5242880  # 5MB
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME="Aasan Rishte"
```

## 🗄 Database Setup

### PostgreSQL Setup

#### Linux/macOS
```bash
# Create database
createdb matrimonial_db

# Or using psql
psql -U postgres
CREATE DATABASE matrimonial_db;
```

#### Windows
```cmd
REM Create database using psql (after installing PostgreSQL)
psql -U postgres
CREATE DATABASE matrimonial_db;
\q

REM Or using createdb command
createdb -U postgres matrimonial_db
```

**Windows PostgreSQL Installation Notes:**
1. Download PostgreSQL from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run the installer and follow the setup wizard
3. Remember the password you set for the `postgres` user
4. Add PostgreSQL bin directory to your PATH environment variable
5. Default installation path: `C:\Program Files\PostgreSQL\15\bin`

### Prisma Commands

#### Linux/macOS
```bash
# Generate Prisma client
poetry run prisma generate

# Push schema to database
poetry run prisma db push

# Open Prisma Studio
poetry run prisma studio

# Reset database (development only)
poetry run prisma db reset
```

#### Windows
```cmd
REM Generate Prisma client
poetry run prisma generate

REM Push schema to database
poetry run prisma db push

REM Open Prisma Studio
poetry run prisma studio

REM Reset database (development only)
poetry run prisma db reset
```

## 🚀 Running the Application

### Development Mode

#### Linux/macOS
```bash
# Terminal 1: Backend
cd backend
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2: Frontend
cd frontend
pnpm dev
```

#### Windows
```cmd
REM Terminal 1: Backend
cd backend
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

REM Terminal 2: Frontend (open new command prompt)
cd frontend
pnpm dev
```

### Production Mode

#### Linux/macOS
```bash
# Backend
cd backend
poetry run uvicorn app.main:app --host 0.0.0.0 --port 8000

# Frontend
cd frontend
pnpm build
pnpm start
```

#### Windows
```cmd
REM Backend
cd backend
poetry run uvicorn app.main:app --host 0.0.0.0 --port 8000

REM Frontend
cd frontend
pnpm build
pnpm start
```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Prisma Studio**: http://localhost:5555

## 👨‍💼 Admin Functionality

### Admin Credentials
- **Email**: `aasanrishtecontact@gmail.com`
- **Password**: Configured in admin creation scripts (see `create_admin.py` and `update_admin_email.py`)

### Admin Capabilities
1. **User Management**
   - View all registered users
   - Search users by email or name
   - Delete user accounts (except own admin account)
   - View user verification status

2. **Admin Management**
   - Create new admin users
   - Cannot delete own admin account (security feature)

### Admin API Endpoints
```
GET    /admin/users              # List all users with pagination
DELETE /admin/users/{user_id}    # Delete specific user
POST   /admin/users/admin        # Create new admin user
```

### Creating Additional Admins

#### Linux/macOS
```bash
# Method 1: Use the admin panel (recommended)
# Login as admin → Admin Panel → Create Admin

# Method 2: Use the script
python create_admin.py

# Method 3: Direct API call
curl -X POST "http://localhost:8000/admin/users/admin" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email": "new-admin@example.com", "password": "secure-password"}'
```

#### Windows
```cmd
REM Method 1: Use the admin panel (recommended)
REM Login as admin → Admin Panel → Create Admin

REM Method 2: Use the script
python create_admin.py

REM Method 3: Direct API call (using curl for Windows or PowerShell)
curl -X POST "http://localhost:8000/admin/users/admin" ^
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\": \"new-admin@example.com\", \"password\": \"secure-password\"}"
```

## 📚 API Documentation

### Authentication Endpoints
```
POST /auth/register           # User registration
POST /auth/verify-email       # Email verification
POST /auth/login             # User login
POST /auth/logout            # User logout
DELETE /auth/account         # Delete own account
```

### Profile Endpoints
```
GET    /profiles             # Search profiles
GET    /profiles/{id}        # Get specific profile
POST   /profiles             # Create/update profile
DELETE /profiles/{id}        # Delete profile
```

### Admin Endpoints
```
GET    /admin/users          # List users (admin only)
DELETE /admin/users/{id}     # Delete user (admin only)
POST   /admin/users/admin    # Create admin (admin only)
```

### File Upload Endpoints
```
POST /uploads/presign        # Get presigned upload URL
POST /uploads/photos         # Upload profile photos
POST /uploads/documents      # Upload documents
```

## 🚀 Deployment

### AWS EC2 Deployment Guide

This comprehensive guide covers deploying the Aasan Rishte matrimonial web application on an AWS EC2 instance.

#### Prerequisites
- AWS Account with EC2 access
- Domain name (optional but recommended)
- Basic knowledge of Linux commands

#### Step 1: Launch EC2 Instance

1. **Launch Instance**
   ```bash
   # Recommended instance type: t3.medium or larger
   # Operating System: Ubuntu 22.04 LTS
   # Storage: 20GB+ SSD
   # Security Group: Allow HTTP (80), HTTPS (443), SSH (22), Custom (3000, 8000)
   ```

2. **Connect to Instance**
   ```bash
   # Replace with your key file and instance IP
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

#### Step 2: Server Setup

1. **Update System**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Install Required Software**
   ```bash
   # Install Node.js 20
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install Python 3.12
   sudo apt install -y python3.12 python3.12-venv python3-pip
   
   # Install PostgreSQL
   sudo apt install -y postgresql postgresql-contrib
   
   # Install Nginx (reverse proxy)
   sudo apt install -y nginx
   
   # Install PM2 (process manager)
   sudo npm install -g pm2 pnpm
   
   # Install Poetry
   curl -sSL https://install.python-poetry.org | python3 -
   echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
   source ~/.bashrc
   ```

3. **Configure PostgreSQL**
   ```bash
   # Start PostgreSQL
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   
   # Create database and user
   sudo -u postgres psql
   CREATE DATABASE matrimonial_db;
   CREATE USER matrimonial_user WITH PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE matrimonial_db TO matrimonial_user;
   \q
   ```

#### Step 3: Deploy Application

1. **Clone Repository**
   ```bash
   cd /home/ubuntu
   git clone https://github.com/rizwan100/Myproject.git
   cd Myproject
   ```

2. **Setup Backend**
   ```bash
   cd backend
   
   # Install dependencies
   poetry install --only=main
   
   # Create production environment file
   cat > .env << EOF
   DATABASE_URL="postgresql://matrimonial_user:your_secure_password@localhost:5432/matrimonial_db"
   JWT_SECRET="$(openssl rand -hex 32)"
   JWT_ALGORITHM="HS256"
   JWT_EXPIRATION_HOURS=24
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT=587
   SMTP_USERNAME="aasanrishtecontact@gmail.com"
   SMTP_PASSWORD="your_gmail_app_password"
   SMTP_FROM_EMAIL="aasanrishtecontact@gmail.com"
   APP_NAME="Aasan Rishte"
   APP_URL="https://yourdomain.com"
   API_URL="https://yourdomain.com/api"
   UPLOAD_DIR="uploads"
   MAX_FILE_SIZE=5242880
   EOF
   
   # Setup database
   poetry run prisma generate
   poetry run prisma db push
   
   # Create admin user
   cd ..
   python3 create_admin.py
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   
   # Install dependencies
   pnpm install
   
   # Create production environment file
   cat > .env.local << EOF
   NEXT_PUBLIC_API_URL=https://yourdomain.com/api
   NEXT_PUBLIC_APP_NAME="Aasan Rishte"
   EOF
   
   # Build for production
   pnpm build
   ```

#### Step 4: Configure Process Management

1. **Create PM2 Ecosystem File**
   ```bash
   cd /home/ubuntu/Myproject
   cat > ecosystem.config.js << EOF
   module.exports = {
     apps: [
       {
         name: 'aasan-rishte-backend',
         cwd: './backend',
         script: 'poetry',
         args: 'run uvicorn app.main:app --host 0.0.0.0 --port 8000',
         env: {
           NODE_ENV: 'production'
         },
         error_file: './logs/backend-error.log',
         out_file: './logs/backend-out.log',
         log_file: './logs/backend-combined.log',
         time: true
       },
       {
         name: 'aasan-rishte-frontend',
         cwd: './frontend',
         script: 'pnpm',
         args: 'start',
         env: {
           NODE_ENV: 'production',
           PORT: 3000
         },
         error_file: './logs/frontend-error.log',
         out_file: './logs/frontend-out.log',
         log_file: './logs/frontend-combined.log',
         time: true
       }
     ]
   };
   EOF
   
   # Create logs directory
   mkdir -p logs
   ```

2. **Start Applications with PM2**
   ```bash
   # Start applications
   pm2 start ecosystem.config.js
   
   # Save PM2 configuration
   pm2 save
   
   # Setup PM2 to start on boot
   pm2 startup
   # Follow the instructions provided by the command above
   ```

#### Step 5: Configure Nginx Reverse Proxy

1. **Create Nginx Configuration**
   ```bash
   sudo tee /etc/nginx/sites-available/aasan-rishte << EOF
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;
   
       # Redirect HTTP to HTTPS
       return 301 https://\$server_name\$request_uri;
   }
   
   server {
       listen 443 ssl http2;
       server_name yourdomain.com www.yourdomain.com;
   
       # SSL Configuration (add your SSL certificates)
       ssl_certificate /etc/ssl/certs/your-cert.pem;
       ssl_certificate_key /etc/ssl/private/your-key.pem;
       ssl_protocols TLSv1.2 TLSv1.3;
       ssl_ciphers HIGH:!aNULL:!MD5;
   
       # Frontend (Next.js)
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade \$http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host \$host;
           proxy_set_header X-Real-IP \$remote_addr;
           proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto \$scheme;
           proxy_cache_bypass \$http_upgrade;
       }
   
       # Backend API (FastAPI)
       location /api/ {
           proxy_pass http://localhost:8000/;
           proxy_http_version 1.1;
           proxy_set_header Upgrade \$http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host \$host;
           proxy_set_header X-Real-IP \$remote_addr;
           proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto \$scheme;
           proxy_cache_bypass \$http_upgrade;
       }
   
       # File uploads
       client_max_body_size 10M;
   
       # Security headers
       add_header X-Frame-Options "SAMEORIGIN" always;
       add_header X-XSS-Protection "1; mode=block" always;
       add_header X-Content-Type-Options "nosniff" always;
       add_header Referrer-Policy "no-referrer-when-downgrade" always;
       add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
   }
   EOF
   
   # Enable the site
   sudo ln -s /etc/nginx/sites-available/aasan-rishte /etc/nginx/sites-enabled/
   
   # Remove default site
   sudo rm -f /etc/nginx/sites-enabled/default
   
   # Test configuration
   sudo nginx -t
   
   # Restart Nginx
   sudo systemctl restart nginx
   sudo systemctl enable nginx
   ```

#### Step 6: SSL Certificate Setup

1. **Using Let's Encrypt (Free SSL)**
   ```bash
   # Install Certbot
   sudo apt install -y certbot python3-certbot-nginx
   
   # Get SSL certificate
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   
   # Auto-renewal setup
   sudo crontab -e
   # Add this line:
   # 0 12 * * * /usr/bin/certbot renew --quiet
   ```

2. **Using Custom SSL Certificate**
   ```bash
   # Upload your certificate files to:
   # /etc/ssl/certs/your-cert.pem
   # /etc/ssl/private/your-key.pem
   
   # Set proper permissions
   sudo chmod 644 /etc/ssl/certs/your-cert.pem
   sudo chmod 600 /etc/ssl/private/your-key.pem
   ```

#### Step 7: Configure Firewall

```bash
# Enable UFW firewall
sudo ufw enable

# Allow necessary ports
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'

# Check status
sudo ufw status
```

#### Step 8: Database Backup Setup

```bash
# Create backup script
sudo tee /usr/local/bin/backup-db.sh << EOF
#!/bin/bash
BACKUP_DIR="/home/ubuntu/backups"
DATE=\$(date +%Y%m%d_%H%M%S)
mkdir -p \$BACKUP_DIR

# Backup database
pg_dump -h localhost -U matrimonial_user -d matrimonial_db > \$BACKUP_DIR/matrimonial_db_\$DATE.sql

# Keep only last 7 days of backups
find \$BACKUP_DIR -name "matrimonial_db_*.sql" -mtime +7 -delete
EOF

# Make executable
sudo chmod +x /usr/local/bin/backup-db.sh

# Setup daily backup cron job
sudo crontab -e
# Add this line:
# 0 2 * * * /usr/local/bin/backup-db.sh
```

#### Step 9: Monitoring and Logs

1. **PM2 Monitoring**
   ```bash
   # View application status
   pm2 status
   
   # View logs
   pm2 logs
   
   # Monitor in real-time
   pm2 monit
   ```

2. **System Monitoring**
   ```bash
   # Install htop for system monitoring
   sudo apt install -y htop
   
   # Check disk usage
   df -h
   
   # Check memory usage
   free -h
   ```

3. **Log Management**
   ```bash
   # Setup log rotation
   sudo tee /etc/logrotate.d/aasan-rishte << EOF
   /home/ubuntu/Myproject/logs/*.log {
       daily
       missingok
       rotate 14
       compress
       delaycompress
       notifempty
       create 644 ubuntu ubuntu
       postrotate
           pm2 reloadLogs
       endscript
   }
   EOF
   ```

#### Step 10: Deployment Commands

1. **Initial Deployment**
   ```bash
   # Complete setup script
   cd /home/ubuntu/Myproject
   chmod +x deploy.sh
   ./deploy.sh
   ```

2. **Update Deployment**
   ```bash
   # Pull latest changes
   git pull origin main
   
   # Update backend
   cd backend
   poetry install --only=main
   poetry run prisma generate
   poetry run prisma db push
   
   # Update frontend
   cd ../frontend
   pnpm install
   pnpm build
   
   # Restart applications
   cd ..
   pm2 restart all
   ```

#### Step 11: Domain Configuration

1. **DNS Setup**
   - Point your domain's A record to your EC2 instance's public IP
   - Add CNAME record for www subdomain
   - Wait for DNS propagation (up to 24 hours)

2. **Update Environment Variables**
   ```bash
   # Update backend .env
   sed -i 's|APP_URL=.*|APP_URL="https://yourdomain.com"|' backend/.env
   sed -i 's|API_URL=.*|API_URL="https://yourdomain.com/api"|' backend/.env
   
   # Update frontend .env.local
   sed -i 's|NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=https://yourdomain.com/api|' frontend/.env.local
   
   # Rebuild and restart
   cd frontend && pnpm build && cd ..
   pm2 restart all
   ```

#### Troubleshooting

1. **Application Not Starting**
   ```bash
   # Check PM2 logs
   pm2 logs
   
   # Check individual app logs
   pm2 logs aasan-rishte-backend
   pm2 logs aasan-rishte-frontend
   ```

2. **Database Connection Issues**
   ```bash
   # Check PostgreSQL status
   sudo systemctl status postgresql
   
   # Test database connection
   psql -h localhost -U matrimonial_user -d matrimonial_db
   ```

3. **Nginx Issues**
   ```bash
   # Check Nginx status
   sudo systemctl status nginx
   
   # Check Nginx logs
   sudo tail -f /var/log/nginx/error.log
   ```

4. **SSL Certificate Issues**
   ```bash
   # Check certificate status
   sudo certbot certificates
   
   # Renew certificate manually
   sudo certbot renew
   ```

#### Security Best Practices

1. **Server Security**
   ```bash
   # Disable root login
   sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
   
   # Change SSH port (optional)
   sudo sed -i 's/#Port 22/Port 2222/' /etc/ssh/sshd_config
   
   # Restart SSH
   sudo systemctl restart ssh
   ```

2. **Application Security**
   - Use strong passwords for database and admin accounts
   - Regularly update dependencies
   - Monitor application logs for suspicious activity
   - Implement rate limiting in Nginx if needed

3. **Backup Strategy**
   - Regular database backups
   - Application code backups
   - SSL certificate backups
   - Environment configuration backups

### Backend Deployment (Railway/Render/Fly.io)
```bash
# Build command
poetry install --only=main

# Start command
poetry run uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Frontend Deployment (Vercel)
```bash
# Build command
pnpm build

# Output directory
.next
```

### Environment Variables for Production
- Set all environment variables in your deployment platform
- Update `DATABASE_URL` to production database
- Update `APP_URL` and `API_URL` to production URLs
- Use secure `JWT_SECRET` (generate with `openssl rand -hex 32`)

## 🔧 Development Guidelines

### Code Style
- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for Next.js and React
- **Prettier**: Code formatting
- **Tailwind**: Utility-first CSS

### Git Workflow

#### Linux/macOS
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add your feature description"

# Push and create PR
git push origin feature/your-feature-name
```

#### Windows
```cmd
REM Create feature branch
git checkout -b feature/your-feature-name

REM Make changes and commit
git add .
git commit -m "feat: add your feature description"

REM Push and create PR
git push origin feature/your-feature-name
```

### Testing

#### Linux/macOS
```bash
# Frontend tests
cd frontend
pnpm test

# Backend tests
cd backend
poetry run pytest
```

#### Windows
```cmd
REM Frontend tests
cd frontend
pnpm test

REM Backend tests
cd backend
poetry run pytest
```

### Database Migrations

#### Linux/macOS
```bash
# After schema changes
poetry run prisma db push

# For production
poetry run prisma migrate dev --name your-migration-name
```

#### Windows
```cmd
REM After schema changes
poetry run prisma db push

REM For production
poetry run prisma migrate dev --name your-migration-name
```

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Error**
   
   **Linux/macOS:**
   ```bash
   # Check PostgreSQL is running
   sudo systemctl status postgresql
   
   # Check connection string in .env
   DATABASE_URL="postgresql://username:password@localhost:5432/matrimonial_db"
   ```
   
   **Windows:**
   ```cmd
   REM Check PostgreSQL service is running
   sc query postgresql-x64-15
   
   REM Or check in Services (services.msc)
   REM Look for "postgresql-x64-15" service
   
   REM Check connection string in .env
   DATABASE_URL="postgresql://username:password@localhost:5432/matrimonial_db"
   ```

2. **Email Verification Not Working**
   ```bash
   # Check SMTP configuration in .env
   # For Gmail, use app-specific password
   # Enable 2FA and generate app password
   ```

3. **Admin Login Issues**
   
   **Linux/macOS:**
   ```bash
   # Reset admin password
   python update_admin_email.py
   
   # Or create new admin
   python create_admin.py
   ```
   
   **Windows:**
   ```cmd
   REM Reset admin password
   python update_admin_email.py
   
   REM Or create new admin
   python create_admin.py
   ```

4. **Frontend Build Errors**
   
   **Linux/macOS:**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   pnpm build
   ```
   
   **Windows:**
   ```cmd
   REM Clear Next.js cache
   rmdir /s .next
   pnpm build
   ```

5. **Windows-Specific Issues**
   
   **Path Issues:**
   ```cmd
   REM Add Python to PATH
   REM Add Node.js to PATH
   REM Add PostgreSQL bin to PATH
   REM Example: C:\Program Files\PostgreSQL\15\bin
   ```
   
   **Permission Issues:**
   ```cmd
   REM Run Command Prompt as Administrator if needed
   REM Or use PowerShell with elevated privileges
   ```
   
   **Line Ending Issues:**
   ```cmd
   REM Configure git to handle line endings
   git config --global core.autocrlf true
   ```

### Logs and Debugging

#### Linux/macOS
```bash
# Backend logs
poetry run uvicorn app.main:app --reload --log-level debug

# Frontend logs
pnpm dev

# Database logs
poetry run prisma studio
```

#### Windows
```cmd
REM Backend logs
poetry run uvicorn app.main:app --reload --log-level debug

REM Frontend logs
pnpm dev

REM Database logs
poetry run prisma studio
```

## 🪟 Windows-Specific Setup Guide

### Step-by-Step Windows Installation

#### 1. Install Python 3.12+
1. Download from [python.org](https://www.python.org/downloads/)
2. **Important**: Check "Add Python to PATH" during installation
3. Verify installation: `python --version`

#### 2. Install Node.js 20+
1. Download from [nodejs.org](https://nodejs.org/)
2. Install with default settings
3. Verify installation: `node --version` and `npm --version`

#### 3. Install Git for Windows
1. Download from [git-scm.com](https://git-scm.com/download/win)
2. Install with default settings
3. Verify installation: `git --version`

#### 4. Install PostgreSQL
1. Download from [postgresql.org](https://www.postgresql.org/download/windows/)
2. During installation:
   - Remember the password for `postgres` user
   - Default port: 5432
   - Install pgAdmin 4 (recommended)
3. Add PostgreSQL bin to PATH:
   - Open System Properties → Environment Variables
   - Add `C:\Program Files\PostgreSQL\15\bin` to PATH
4. Verify installation: `psql --version`

#### 5. Install Poetry
```cmd
pip install poetry
poetry --version
```

#### 6. Install pnpm
```cmd
npm install -g pnpm
pnpm --version
```

### Windows Environment Setup

#### Setting Environment Variables
1. Open System Properties (Win + R → `sysdm.cpl`)
2. Click "Environment Variables"
3. Add to User or System variables:
   - `PYTHON_PATH`: Python installation directory
   - `NODE_PATH`: Node.js installation directory
   - `POSTGRES_PATH`: PostgreSQL bin directory

#### Using Windows Terminal (Recommended)
1. Install Windows Terminal from Microsoft Store
2. Set PowerShell or Command Prompt as default
3. Configure Git Bash integration

#### PowerShell Execution Policy
If you encounter execution policy errors:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Windows Development Tips

#### 1. Use Windows Subsystem for Linux (WSL) - Optional
For a Linux-like experience:
```cmd
wsl --install
```

#### 2. Recommended Code Editors
- **Visual Studio Code** (with Python and Node.js extensions)
- **PyCharm** (for Python development)
- **WebStorm** (for Node.js/React development)

#### 3. Database Management
- **pgAdmin 4** (installed with PostgreSQL)
- **DBeaver** (universal database tool)

#### 4. Terminal Alternatives
- **Windows Terminal** (recommended)
- **Git Bash** (comes with Git for Windows)
- **PowerShell** (built-in)
- **Command Prompt** (built-in)

### Windows Troubleshooting

#### Common Windows Issues

1. **"python" not recognized**
   ```cmd
   REM Add Python to PATH or use full path
   C:\Users\YourName\AppData\Local\Programs\Python\Python312\python.exe
   ```

2. **"poetry" not recognized**
   ```cmd
   REM Reinstall poetry or add to PATH
   pip install --user poetry
   ```

3. **PostgreSQL connection issues**
   ```cmd
   REM Check if service is running
   net start postgresql-x64-15
   
   REM Or use Services manager (services.msc)
   ```

4. **Port already in use**
   ```cmd
   REM Find process using port
   netstat -ano | findstr :8000
   
   REM Kill process by PID
   taskkill /PID <PID> /F
   ```

5. **Permission denied errors**
   ```cmd
   REM Run as Administrator
   REM Right-click Command Prompt → "Run as administrator"
   ```

## 📞 Support

For technical support or questions:
- **Email**: aasanrishtecontact@gmail.com
- **Phone**: +917569319126
- **WhatsApp**: [wa.me/+917569319126](https://wa.me/+917569319126)

## 📄 License

This project is proprietary software. All rights reserved.

---

**Note**: This application is designed specifically for the Muslim community in Hyderabad. The gender visibility rules (girls see boys, boys see girls) are implemented at both API and database levels for security and cultural appropriateness.
