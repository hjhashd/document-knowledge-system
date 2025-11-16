# 本地OnlyOffice测试环境配置指南

本指南帮助您在本地环境中配置和测试OnlyOffice文档编辑功能。

## 环境要求

1. Docker Desktop (用于运行OnlyOffice文档服务器)
2. Python (用于运行简单的HTTP文件服务器)
3. Nginx (用于代理和路由)
4. Node.js (用于运行Next.js应用)

## 快速启动

### 1. 启动OnlyOffice文档服务器

```bash
docker run -i -t -d -p 8090:80 --name local-onlyoffice-docs onlyoffice/documentserver
```

### 2. 启动HTTP文件服务器

```bash
cd public
python -m http.server 8080
```

### 3. 启动Nginx

```bash
nginx -c $(pwd)/nginx.conf  # Linux/Mac
nginx -c %cd%/nginx.conf    # Windows
```

### 4. 启动Next.js应用

```bash
npm run dev
```

### 5. 访问应用

打开浏览器访问: http://localhost:8888

## 使用启动脚本

为了方便，我们提供了启动脚本：

- Windows: `start-local-env.bat`
- Linux/Mac: `start-local-env.sh`

运行脚本将自动启动所有必要的服务。

## 配置说明

### 环境变量 (.env.local)

```env
# 本地测试配置
NEXT_PUBLIC_BASE_URL=http://localhost:8888
NEXT_PUBLIC_DS_BASE_URL=http://localhost:8888
NEXT_PUBLIC_ONLYOFFICE_API_URL=http://localhost:8090/office/web-apps/apps/api/documents/api.js
FILE_SERVE_WHITELIST=./public/upload:./public/save
```

### Nginx配置

Nginx配置文件 (`nginx.conf`) 包含以下路由规则：

1. `/files/` - 转发到HTTP文件服务器 (8080端口)
2. `/onlyoffice-callback` - 转发到Next.js应用 (3000端口)
3. `/api/upload` - 转发到Next.js应用 (3000端口)
4. `/office/` - 转发到OnlyOffice文档服务器 (8090端口)
5. 其他所有请求 - 转发到Next.js应用 (3000端口)

## 测试流程

1. 启动所有服务
2. 访问 http://localhost:8888
3. 点击"上传文档"按钮
4. 选择一个PDF或Word文档
5. 文档上传后，会自动跳转到编辑页面
6. 在编辑页面中，可以查看PDF预览和使用OnlyOffice编辑器

## 故障排除

### OnlyOffice无法加载

1. 确认OnlyOffice容器正在运行: `docker ps`
2. 确认端口8090未被占用: `netstat -an | grep 8090`
3. 检查浏览器控制台是否有错误信息

### 文件无法加载

1. 确认HTTP文件服务器正在运行
2. 确认端口8080未被占用
3. 检查文件是否存在于 `public/upload/` 目录中

### 回调失败

1. 确认Next.js应用正在运行在3000端口
2. 确认Nginx配置正确
3. 检查 `/onlyoffice-callback` 路由是否可访问

## 停止服务

停止所有服务的命令：

```bash
# 停止OnlyOffice容器
docker stop local-onlyoffice-docs
docker rm local-onlyoffice-docs

# 停止Nginx
nginx -s stop

# 停止HTTP文件服务器 (Ctrl+C)
# 停止Next.js应用 (Ctrl+C)
```

## 注意事项

1. 本地测试环境仅用于开发和测试，不应用于生产环境
2. 文件上传到 `public/upload/` 目录，确保该目录存在且有写权限
3. OnlyOffice文档服务器需要一些时间来初始化，首次启动可能需要等待几分钟
4. 如果修改了配置，可能需要重启相关服务