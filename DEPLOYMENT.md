# 项目部署与上线指南

本文档详细介绍了本项目（Vite + React 前端，搭配 Node.js 后端）的架构拆分逻辑、部署方案选择以及完整的上线流程。

---

## 1. 项目架构与代码拆分说明

本项目是一个**前后端同构**的应用。为了适应现代云平台的部署标准，我们对代码进行了合理的拆分。

### 1.1 前端代码

- **位置**：`src/` 目录。
- **技术栈**：React, Vite, TailwindCSS。
- **作用**：负责用户界面渲染和交互。前端通过 `fetch` 或 `axios` 调用 `/api/...` 接口与后端通信。

### 1.2 后端代码（拆分逻辑）

原本项目的所有后端逻辑（Express 服务和 AI 接口）都集中在 `server.ts` 中。为了兼容不同的部署方式，我们进行了如下拆分：

1. **本地开发/传统服务器环境**：

   - 依然保留 `server.ts`。在本地运行 `npm run dev` 时，它会启动一个 Express 服务器并集成 Vite 的中间件。
   - 在传统服务器上，通过 `npm run build` 打包后，运行 `dist/server.cjs` 即可启动服务。
2. **Serverless 环境（如 Vercel）**：

   - 像 Vercel 这样的平台不会运行持续监听的 Express 服务，而是将后端接口视为独立的**无服务器函数 (Serverless Functions)**。
   - 因此，我们将 `server.ts` 中的 AI 接口抽取到了根目录的 `api/` 文件夹下（例如 `api/generate-preview.ts` 和 `api/generate-evaluation.ts`）。
   - 我们配置了 `vercel.json`，确保前端页面请求指向 `index.html`，而 `/api/*` 的请求会自动路由到 `api/` 目录下的 Serverless 函数。

---

## 2. 端口冲突问题解决 (EADDRINUSE)

如果你在本地或服务器上运行 `npm run start` 时遇到以下报错：
\`\`\`text
Error: listen EADDRINUSE: address already in use 0.0.0.0:3000
\`\`\`
**原因**：这说明你的 3000 端口已经被其他程序占用（可能是你之前运行的开发服务器没有完全关闭）。

**解决方法**：

- **Windows**：
  1. 打开 PowerShell 或 CMD，查找占用 3000 端口的进程 PID：`netstat -ano | findstr :3000`
  2. 强制结束该进程：`taskkill /PID <PID数字> /F`
- **Mac/Linux**：
  1. 查找进程：`lsof -i :3000`
  2. 杀死进程：`kill -9 <PID数字>`

---

## 3. 部署方案选择

根据你的实际情况，我们提供两种部署方案：

- **方案 A：Vercel 部署（强烈推荐）** —— 适合没有自己服务器的开发者，免费、自动化程度高、无需管理运维。
- **方案 B：自有云服务器 (VPS) 部署** —— 适合有阿里云、腾讯云等自有服务器的开发者。

---

## 4. 方案 A：Vercel 一键部署流程（推荐）

Vercel 是目前对前端和 Serverless 最友好的托管平台，本项目已经完全适配了 Vercel 标准。

### 第一步：代码托管

1. 确保你的代码已经通过 Git 提交。
2. 将代码推送到 GitHub、GitLab 或 Bitbucket 仓库。

### 第二步：导入 Vercel

1. 登录 [Vercel 官网](https://vercel.com/)。
2. 点击右上角的 **"Add New..." -> "Project"**。
3. 关联你的 GitHub 账号，找到你刚刚推送的仓库，点击 **"Import"**。

### 第三步：配置部署参数（极其重要）

在部署设置页面（Configure Project），大部分设置保持默认即可，但**必须配置环境变量**：

1. 展开 **Environment Variables** 面板。
2. 填入你的通义千问 API 密钥：
   - **Key**: `DASHSCOPE_API_KEY`
   - **Value**: `sk-xxxxxxxxxxxxxxxxxxxxxxxx`（你的真实密钥）
3. 点击 **Add** 添加环境变量。

### 第四步：部署上线

1. 点击 **"Deploy"** 按钮。
2. 等待大约 1-2 分钟，Vercel 会自动完成前端构建（`npm run build`）和后端 Serverless 函数的部署。
3. 部署完成后，Vercel 会为你分配一个免费的域名（如 `https://your-project.vercel.app`），点击即可访问线上项目！

---

## 5. 方案 B：传统云服务器（VPS）部署流程

如果你有自己的服务器（如阿里云、腾讯云、Linux/Windows 服务器），请按以下步骤操作：

### 第一步：环境准备

1. 确保服务器上已安装 **Node.js** (推荐 v18 或 v20 以上版本)。
2. 将代码克隆或上传到服务器。

### 第二步：安装依赖与配置

1. 在项目根目录运行安装命令：
   \`\`\`bash
   npm install
   \`\`\`
2. 在根目录创建 `.env` 文件，并写入你的 API 密钥：
   \`\`\`text
   DASHSCOPE_API_KEY="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
   PORT=80
   \`\`\`
   *(将 PORT 设为 80，这样你可以直接通过 IP 访问，无需加端口号)*

### 第三步：打包构建

运行构建命令，这会将前端代码打包到 `dist/`，并将 `server.ts` 编译为 `dist/server.cjs`：
\`\`\`bash
npm run build
\`\`\`

### 第四步：启动服务并保持后台运行

不要直接用 `npm run start`，因为它在关闭终端后会停止。推荐使用 `PM2` 来管理进程：

1. 全局安装 PM2：
   \`\`\`bash
   npm install pm2 -g
   \`\`\`
2. 使用 PM2 启动服务：
   \`\`\`bash
   pm2 start dist/server.cjs --name studyclaw
   \`\`\`
3. 设置开机自启：
   \`\`\`bash
   pm2 save
   pm2 startup
   \`\`\`

现在，你的服务已经在服务器上稳定运行了，你可以通过服务器的公网 IP 进行访问。

---

## 6. 上线与后续维护建议

- **域名绑定**：无论是 Vercel 还是自有服务器，建议购买一个独立域名并进行 CNAME 或 A 记录解析，提升项目专业度。
- **更新代码**：
  - 如果使用 Vercel：只需将修改后的代码 `git push` 到 GitHub，Vercel 会自动触发重新部署。
  - 如果使用云服务器：在服务器上拉取最新代码，重新运行 `npm run build`，然后执行 `pm2 restart studyclaw` 重启服务即可。
- **跨域问题**：由于本项目的后端（`/api`）与前端部署在同一个域名下，因此天然不存在 CORS 跨域问题。
