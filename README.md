# dsapps

由 DeepSeek 编写的网页小程序。项目使用 Vite 多页面构建，每个工具仍是独立的静态 HTML 页面。

## 开发

```sh
npm install
npm run dev
```

## 构建

```sh
npm run build
npm run preview
```

发布文件输出到 `docs/`，可直接用于 GitHub Pages。`cmo.html` 和 `cmo_2.html` 保持独立主题；构建会原样复制两个游戏页面及 `sound/` 音效资源，不接入共享设计系统。

## 一键发布

运行仓库根目录的 `deploy.bat`，脚本会构建到 `docs/`、提交所有未忽略的更改，并推送当前分支到 `origin`。首次运行且依赖未安装时会先执行 `npm ci`。
