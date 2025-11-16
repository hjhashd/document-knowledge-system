#!/bin/bash

# 本地OnlyOffice测试环境启动脚本

echo "启动本地OnlyOffice测试环境..."

# 1. 启动OnlyOffice文档服务器 (如果尚未运行)
if ! docker ps | grep -q "local-onlyoffice-docs"; then
    echo "启动OnlyOffice文档服务器..."
    docker run -i -t -d -p 8090:80 --name local-onlyoffice-docs onlyoffice/documentserver
else
    echo "OnlyOffice文档服务器已在运行"
fi

# 2. 启动HTTP服务器提供文件服务 (如果尚未运行)
if ! lsof -i :8080 > /dev/null; then
    echo "启动HTTP文件服务器..."
    cd public
    python -m http.server 8080 > /dev/null 2>&1 &
    cd ..
else
    echo "HTTP文件服务器已在运行"
fi

# 3. 启动Nginx (如果尚未运行)
if ! lsof -i :8888 > /dev/null; then
    echo "启动Nginx..."
    nginx -c $(pwd)/nginx.conf
else
    echo "Nginx已在运行，重新加载配置..."
    nginx -s reload -c $(pwd)/nginx.conf
fi

echo "环境配置完成！"
echo "请确保Next.js应用在3000端口运行"
echo "然后访问: http://localhost:8888"
echo ""
echo "服务状态:"
echo "- OnlyOffice文档服务器: http://localhost:8090"
echo "- HTTP文件服务器: http://localhost:8080"
echo "- Nginx代理: http://localhost:8888"
echo "- Next.js应用: http://localhost:3000"