# 帮助文档管理系统部署文档

## 1. 系统概述

帮助文档管理系统是一个基于Vue 3 + TypeScript的前端应用，用于管理和发布帮助文档。本部署文档将详细说明如何在不同环境中部署该系统。

## 2. 环境要求

### 2.1 开发环境
- Node.js 16.x 或更高版本
- npm 或 yarn 包管理器
- Git 版本控制工具

### 2.2 生产环境
- Nginx 或 Apache 服务器
- Node.js 16.x 或更高版本（可选，用于运行后端服务）
- MySQL 或 PostgreSQL 数据库（可选，用于存储数据）

## 3. 开发环境部署

### 3.1 克隆代码
```bash
git clone https://github.com/your-repo/help-doc-management.git
cd help-doc-management
```

### 3.2 安装依赖
```bash
# 使用 npm
npm install

# 使用 yarn
yarn install
```

### 3.3 配置环境变量
复制 `.env.example` 文件为 `.env.development`，并根据实际情况修改配置：
```bash
cp .env.example .env.development
```

修改 `.env.development` 文件中的配置：
```env
# API接口基础URL
VITE_API_BASE_URL=http://localhost:3000/api

# 是否启用Mock数据
VITE_MOCK_ENABLED=true

# 应用标题
VITE_APP_TITLE=帮助文档管理系统
```

### 3.4 启动开发服务器
```bash
# 使用 npm
npm run dev

# 使用 yarn
yarn dev
```

开发服务器将在 `http://localhost:5173` 启动。

## 4. 生产环境部署

### 4.1 构建生产版本
```bash
# 使用 npm
npm run build

# 使用 yarn
yarn build
```

构建完成后，生成的静态文件将位于 `dist` 目录中。

### 4.2 配置Nginx

#### 4.2.1 安装Nginx
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install nginx

# CentOS/RHEL
sudo yum install nginx
```

#### 4.2.2 配置Nginx虚拟主机
创建Nginx配置文件：
```bash
sudo nano /etc/nginx/sites-available/help-doc
```

添加以下配置：
```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/help-doc/dist;
    index index.html;

    # Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # 静态文件缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 主应用路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API接口代理
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 错误页面
    error_page 404 /index.html;
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```

#### 4.2.3 启用虚拟主机
```bash
sudo ln -s /etc/nginx/sites-available/help-doc /etc/nginx/sites-enabled/
```

#### 4.2.4 测试Nginx配置
```bash
sudo nginx -t
```

#### 4.2.5 重启Nginx
```bash
sudo systemctl restart nginx
```

### 4.3 配置HTTPS（可选）

#### 4.3.1 安装Certbot
```bash
# Ubuntu/Debian
sudo apt-get install certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install certbot python3-certbot-nginx
```

#### 4.3.2 获取SSL证书
```bash
sudo certbot --nginx -d your-domain.com
```

#### 4.3.3 自动更新证书
```bash
sudo crontab -e
```

添加以下内容：
```bash
0 12 * * * /usr/bin/certbot renew --quiet
```

## 5. Docker部署

### 5.1 构建Docker镜像
创建 `Dockerfile` 文件：
```dockerfile
# 基础镜像
FROM node:16-alpine as build-stage

# 设置工作目录
WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY . .

# 构建生产版本
RUN npm run build

# 生产环境镜像
FROM nginx:alpine as production-stage

# 复制构建产物
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 复制Nginx配置
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80

# 启动Nginx
CMD ["nginx", "-g", "daemon off;"]
```

创建 `nginx.conf` 文件：
```nginx
user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;

    server {
        listen       80;
        server_name  localhost;

        location / {
            root   /usr/share/nginx/html;
            index  index.html index.htm;
            try_files $uri $uri/ /index.html;
        }

        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   /usr/share/nginx/html;
        }
    }
}
```

构建Docker镜像：
```bash
docker build -t help-doc-management .
```

### 5.2 运行Docker容器
```bash
docker run -d -p 80:80 --name help-doc help-doc-management
```

## 6. 后端服务部署

### 6.1 安装Node.js
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_16.x | sudo bash -
sudo yum install -y nodejs
```

### 6.2 配置后端服务
创建后端服务目录：
```bash
sudo mkdir -p /var/www/help-doc-backend
cd /var/www/help-doc-backend
```

克隆后端代码：
```bash
git clone https://github.com/your-repo/help-doc-backend.git .
```

安装依赖：
```bash
npm install
```

配置环境变量：
```bash
cp .env.example .env
```

修改 `.env` 文件中的配置：
```env
# 服务器配置
PORT=3000
NODE_ENV=production

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=help_doc
DB_USER=root
DB_PASSWORD=password

# JWT配置
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d

# 文件上传配置
UPLOAD_PATH=uploads
MAX_FILE_SIZE=10485760

# 备份配置
BACKUP_PATH=backups
BACKUP_RETENTION=30
```

### 6.3 启动后端服务
使用PM2管理Node.js进程：
```bash
# 安装PM2
npm install -g pm2

# 启动服务
pm2 start app.js --name help-doc-backend

# 保存PM2配置
pm2 save

# 设置PM2开机自启
pm2 startup
```

## 7. 数据库部署

### 7.1 安装MySQL
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install mysql-server

# CentOS/RHEL
sudo yum install mysql-server
```

### 7.2 配置MySQL
启动MySQL服务：
```bash
# Ubuntu/Debian
sudo systemctl start mysql

# CentOS/RHEL
sudo systemctl start mysqld
```

设置MySQL root密码：
```bash
# Ubuntu/Debian
sudo mysql_secure_installation

# CentOS/RHEL
sudo grep 'temporary password' /var/log/mysqld.log
sudo mysql_secure_installation
```

创建数据库：
```bash
mysql -u root -p
CREATE DATABASE help_doc CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 7.3 导入数据库结构
```bash
mysql -u root -p help_doc < database.sql
```

## 8. 监控和维护

### 8.1 日志管理
- Nginx日志：`/var/log/nginx/access.log` 和 `/var/log/nginx/error.log`
- 后端服务日志：使用PM2查看日志 `pm2 logs help-doc-backend`
- MySQL日志：`/var/log/mysql/error.log`（Ubuntu/Debian）或 `/var/log/mysqld.log`（CentOS/RHEL）

### 8.2 定期备份
创建备份脚本：
```bash
sudo nano /usr/local/bin/backup-help-doc.sh
```

添加以下内容：
```bash
#!/bin/bash

# 备份目录
BACKUP_DIR="/var/backups/help-doc"
DATE=$(date +%Y%m%d_%H%M%S)

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份数据库
mysqldump -u root -p'password' help_doc > $BACKUP_DIR/help-doc-db-$DATE.sql

# 备份后端文件
 tar -czf $BACKUP_DIR/help-doc-backend-$DATE.tar.gz /var/www/help-doc-backend

# 备份前端文件
 tar -czf $BACKUP_DIR/help-doc-frontend-$DATE.tar.gz /var/www/help-doc/dist

# 删除30天前的备份
find $BACKUP_DIR -type f -mtime +30 -delete
```

设置脚本执行权限：
```bash
sudo chmod +x /usr/local/bin/backup-help-doc.sh
```

添加到定时任务：
```bash
sudo crontab -e
```

添加以下内容：
```bash
0 2 * * * /usr/local/bin/backup-help-doc.sh
```

### 8.3 性能监控
- 使用 `htop` 监控系统资源使用情况
- 使用 `nginx -t` 测试Nginx配置
- 使用 `pm2 monit` 监控Node.js进程
- 使用 `mysqladmin status` 查看MySQL状态

## 9. 故障排除

### 9.1 Nginx无法启动
- 检查Nginx配置：`sudo nginx -t`
- 查看Nginx错误日志：`sudo tail -f /var/log/nginx/error.log`
- 检查端口是否被占用：`sudo netstat -tlnp | grep :80`

### 9.2 后端服务无法启动
- 查看PM2日志：`pm2 logs help-doc-backend`
- 检查端口是否被占用：`sudo netstat -tlnp | grep :3000`
- 检查数据库连接：确保数据库服务正在运行且配置正确

### 9.3 数据库连接失败
- 检查MySQL服务状态：`sudo systemctl status mysql`（Ubuntu/Debian）或 `sudo systemctl status mysqld`（CentOS/RHEL）
- 检查数据库配置：确保 `.env` 文件中的数据库配置正确
- 检查数据库用户权限：确保数据库用户具有足够的权限

### 9.4 页面无法访问
- 检查Nginx服务状态：`sudo systemctl status nginx`
- 检查防火墙设置：确保80和443端口已开放
- 检查DNS配置：确保域名已正确解析到服务器IP

## 10. 安全建议

- 定期更新系统和软件包
- 使用HTTPS加密通信
- 限制数据库用户权限
- 配置防火墙规则
- 定期备份数据
- 监控系统日志
- 禁用不必要的服务
- 使用强密码策略

## 11. 联系方式

如果您在部署过程中遇到问题，请联系技术支持团队：
- 邮箱：support@example.com
- 电话：400-123-4567
- 在线文档：https://example.com/docs/deployment
