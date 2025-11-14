# --- 阶段 1: 构建 (Builder) ---
# 使用 Node.js 18 (Alpine Linux 版本，体积小)
FROM node:18-alpine AS builder

# 启用 pnpm
RUN corepack enable

WORKDIR /app

# 复制依赖清单
COPY package.json pnpm-lock.yaml ./

# 安装所有依赖 (包括 devDependencies，因为 build 需要它们)
RUN pnpm install --frozen-lockfile --prod=false

# 复制所有项目代码
COPY . .

# 传入构建时的环境变量 (用于打包 NEXT_PUBLIC_ 变量)
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_DS_BASE_URL
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_DS_BASE_URL=$NEXT_PUBLIC_DS_BASE_URL

# 执行构建
RUN pnpm build

# --- 阶段 2: 运行 (Runner) ---
# 同样使用 Alpine 镜像
FROM node:18-alpine AS runner
WORKDIR /app

# 设置为生产环境
ENV NODE_ENV=production

# 从 builder 阶段复制构建好的 'standalone' 输出
# 这会把所有需要运行的 .js 文件和 node_modules 文件夹都拷过来
COPY --from=builder /app/.next/standalone ./
# 复制 public 目录
COPY --from=builder /app/public ./public
# 复制 .next/static 目录 (用于静态资源)
COPY --from=builder /app/.next/static ./.next/static

# 暴露端口 3000 (Next.js 独立服务器默认端口)
EXPOSE 3000

# 运行 Next.js 独立服务器
CMD ["node", "server.js"]
