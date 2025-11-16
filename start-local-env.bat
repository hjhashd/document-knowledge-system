@echo off
REM 本地OnlyOffice测试环境启动脚本 (Windows版本)

echo 启动本地OnlyOffice测试环境...

REM 1. 启动OnlyOffice文档服务器 (如果尚未运行)
docker ps | findstr "local-onlyoffice-docs" >nul
if %errorlevel% neq 0 (
    echo 启动OnlyOffice文档服务器...
    docker run -i -t -d -p 8090:80 --name local-onlyoffice-docs onlyoffice/documentserver
) else (
    echo OnlyOffice文档服务器已在运行
)

REM 2. 启动HTTP服务器提供文件服务 (如果尚未运行)
netstat -an | findstr ":8080" >nul
if %errorlevel% neq 0 (
    echo 启动HTTP文件服务器...
    cd public
    start /B python -m http.server 8080
    cd ..
) else (
    echo HTTP文件服务器已在运行
)

REM 3. 启动Nginx (如果尚未运行)
netstat -an | findstr ":8888" >nul
if %errorlevel% neq 0 (
    echo 启动Nginx...
    nginx -c %cd%/nginx.conf
) else (
    echo Nginx已在运行，重新加载配置...
    nginx -s reload -c %cd%/nginx.conf
)

echo 环境配置完成！
echo 请确保Next.js应用在3000端口运行
echo 然后访问: http://localhost:8888
echo.
echo 服务状态:
echo - OnlyOffice文档服务器: http://localhost:8090
echo - HTTP文件服务器: http://localhost:8080
echo - Nginx代理: http://localhost:8888
echo - Next.js应用: http://localhost:3000
pause