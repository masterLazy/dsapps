import { copyFileSync, cpSync, mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const pageFiles = ['index.html', 'a1z26.html', 'format.html', 'gen.html', 'graph.html', 'masonry.html'];

const pageMetadata = {
  'index.html': {
    title: 'dsapps | 由 DeepSeek 编写的网页小程序',
    heading: 'dsapps',
    description: '由 DeepSeek 编写的网页小程序',
    home: true
  },
  'a1z26.html': {
    title: 'dsapps | A1Z26 编码转换器',
    heading: 'A1Z26 编码转换器',
    description: 'A1Z26 是一种简单的替换密码，其中字母 A=1，B=2，...，Z=26'
  },
  'format.html': {
    title: 'dsapps | 格式清理工具',
    heading: '格式清理工具',
    description: '去除文本中的连续换行符，一键清理从网页或 Markdown 复制时产生的多余空行'
  },
  'gen.html': {
    title: 'dsapps | 发疯文学生成器',
    heading: '发疯文学生成器',
    description: '输入对象名称，一键生成发疯文学'
  },
  'graph.html': {
    title: 'dsapps | 图论在线画图工具',
    heading: '图论在线画图工具',
    description: '可视化创建和编辑图结构，支持有向图和无向图，可自定义节点和边的颜色'
  },
  'masonry.html': {
    title: 'dsapps | 瀑布视图',
    heading: '瀑布视图',
    description: '从本地图片文件夹浏览和筛选参考图',
    showTitleHeader: false
  }
};

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

function sharedShellPlugin() {
  const headerTemplate = readFileSync(path.join(rootDir, 'src/partials/site-header.html'), 'utf8');
  const footer = readFileSync(path.join(rootDir, 'src/partials/site-footer.html'), 'utf8');

  return {
    name: 'dsapps-shared-shell',
    transformIndexHtml(html, context) {
      const pageFile = path.basename(context.filename ?? context.path);
      const page = pageMetadata[pageFile];
      if (!page) return html;

      const header = headerTemplate
        .replaceAll('{{title}}', escapeHtml(page.heading))
        .replaceAll('{{description}}', escapeHtml(page.description))
        .replaceAll('{{homeHref}}', page.home ? 'https://github.com/masterlazy/dsapps/' : './index.html')
        .replaceAll('{{homeIcon}}', page.home ? 'code' : 'home')
        .replaceAll('{{homeLabel}}', page.home ? 'GitHub' : '返回应用列表');
      let pageHeader = page.home
        ? header.replace(/<!-- dsapps:top-bar-start -->[\s\S]*?<!-- dsapps:top-bar-end -->/, '')
        : header.replace('<!-- dsapps:top-bar-start -->', '').replace('<!-- dsapps:top-bar-end -->', '');
      if (page.showTitleHeader === false) {
        pageHeader = pageHeader.replace(/<!-- dsapps:title-header-start -->[\s\S]*?<!-- dsapps:title-header-end -->/, '');
      }

      return html
        .replace(/^[\t ]*<!-- dsapps:site-header -->/m, pageHeader)
        .replace(/^[\t ]*<!-- dsapps:site-footer -->/m, footer);
    },
    writeBundle(outputOptions) {
      const outputDir = path.resolve(rootDir, outputOptions.dir ?? 'dist');
      mkdirSync(outputDir, { recursive: true });
      for (const file of ['cmo.html', 'cmo_2.html']) {
        copyFileSync(path.join(rootDir, file), path.join(outputDir, file));
      }
      cpSync(path.join(rootDir, 'sound'), path.join(outputDir, 'sound'), { recursive: true });
    }
  };
}

export default defineConfig({
  base: './',
  publicDir: false,
  plugins: [sharedShellPlugin()],
  build: {
    outDir: 'docs',
    rollupOptions: {
      input: Object.fromEntries(pageFiles.map(file => [path.basename(file, '.html'), path.join(rootDir, file)]))
    }
  }
});