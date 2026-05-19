# Markdown Composer for ChatGPT

一个面向长 Prompt 的本地 Markdown 输入增强插件。

它不会替换 ChatGPT 的原生发送流程，而是在 ChatGPT 页面上增加一个更舒服的本地编辑器：你可以在插件编辑器里写长文本、预览 Markdown、保存草稿，然后把 Markdown 原文放入 ChatGPT 原输入框并发送。

## 功能

- 接近 ChatGPT 官网风格的轻量 UI
- 右下角 Composer 启动按钮
- 浏览器工具栏图标可打开/关闭编辑器
- 大尺寸 Markdown 编辑区
- 实时 Markdown 预览
- 本地草稿保存
- 导入当前 ChatGPT 输入框内容
- 一键放入 ChatGPT 原输入框
- 一键调用 ChatGPT 原生发送按钮
- 快捷键：Ctrl/Cmd + Shift + E 打开/关闭；Ctrl/Cmd + Enter 发送

## 安装到本地浏览器

1. 解压本压缩包。
2. 打开 Chrome / Edge 的扩展管理页面。
3. 开启“开发者模式”。
4. 选择“加载已解压的扩展程序”。
5. 选择包含 `manifest.json` 的插件目录。
6. 打开 https://chatgpt.com/ ，右下角会出现 Composer 按钮。

## 商店发布注意

- 不要声称本扩展由 OpenAI 或 ChatGPT 官方提供、授权或背书。
- 不要使用 OpenAI / ChatGPT 官方商标或 Logo 作为图标。
- 商店上传包应使用包含 `manifest.json` 的 zip，且 `manifest.json` 位于 zip 根目录。
- 商店截图和推广图请单独上传到开发者后台，不需要打包进扩展 zip。

## 隐私说明

本扩展不请求后端服务，不上传用户输入，不调用外部接口。草稿保存在当前浏览器访问 `chatgpt.com` 时的本地 `localStorage` 中。

## 技术边界

ChatGPT 页面 DOM 更新后，输入框或发送按钮选择器可能需要维护。核心逻辑位于 `content.js` 的 `findComposer()` 和 `findSendButton()`。
