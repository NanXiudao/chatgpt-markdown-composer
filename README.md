# Markdown Composer for ChatGPT

一个面向长 Prompt 的本地 Markdown 输入增强插件。

它不会替换 ChatGPT 的原生发送流程，也不会主动触发发送按钮，而是在 ChatGPT 页面上增加一个更适合长文本写作的本地编辑器。

你可以在插件编辑器里编写长 Prompt、预览 Markdown、保存草稿，然后一键把 Markdown 原文放入 ChatGPT 原输入框。最终是否发送，仍然由你在 ChatGPT 页面手动决定。

GitHub 地址：

https://github.com/NanXiudao/chatgpt-markdown-composer

---

## 为什么做这个插件

ChatGPT 默认输入框更像一个聊天框，适合短消息，但不太适合编写复杂 Prompt。

当你需要写较长内容时，常见问题包括：

- 长文本编辑区域太小
- 多段结构不容易检查
- Markdown 标题、列表、代码块不够直观
- 写到一半容易失去整体结构
- 修改复杂 Prompt 时不够舒服
- 草稿没有独立的编辑空间

Markdown Composer for ChatGPT 的目标很简单：

> 让 ChatGPT 的输入体验更接近一个干净、专业的 Markdown 写作工具。

---

## 功能特性

- 面向长 Prompt 的大尺寸编辑器
- 更接近 Notion 文档工具的简洁 UI
- 默认暗色模式
- 支持插件内明暗切换
- 实时 Markdown 预览
- 本地草稿自动保存
- 支持导入当前 ChatGPT 输入框内容
- 一键放入 ChatGPT 原输入框
- 不主动发送消息
- 不调用 ChatGPT 私有接口
- 不请求后端服务
- 不上传用户输入内容
- 浏览器工具栏图标可打开 / 关闭编辑器
- 右下角 GitHub Star 引导链接

---

## 适合谁使用

这个插件适合经常在 ChatGPT 中编写复杂输入的人，例如：

- 开发者
- 产品经理
- 独立开发者
- 研究人员
- 写作者
- Prompt 工程实践者
- 经常使用 ChatGPT 处理长文本任务的人

典型使用场景包括：

- 编写复杂 Prompt
- 编写代码需求说明
- 编写技术分析任务
- 编写多段结构化问题
- 编写带 Markdown 格式的上下文
- 编写用于 AI 任务的长指令
- 临时整理发送给 ChatGPT 的文档片段

---

## 安装到本地浏览器

目前可以通过开发者模式安装本地版本。

### Chrome

1. 下载并解压本插件压缩包。
2. 打开 Chrome。
3. 地址栏输入：

   ```text
   chrome://extensions/
````

4. 打开右上角的「开发者模式」。

5. 点击「加载已解压的扩展程序」。

6. 选择包含 `manifest.json` 的插件目录。

7. 打开或刷新：

   ```text
   https://chatgpt.com/
   ```

8. 页面右下角会出现 `Composer` 按钮。

### Microsoft Edge

1. 下载并解压本插件压缩包。

2. 打开 Edge。

3. 地址栏输入：

   ```text
   edge://extensions/
   ```

4. 打开「开发人员模式」。

5. 点击「加载解压缩的扩展」。

6. 选择包含 `manifest.json` 的插件目录。

7. 打开或刷新：

   ```text
   https://chatgpt.com/
   ```

8. 页面右下角会出现 `Composer` 按钮。

---

## 如何使用

### 1. 打开 Composer

安装插件后，进入 ChatGPT 页面。

你可以通过以下方式打开编辑器：

* 点击页面右下角的 `Composer` 按钮
* 点击浏览器工具栏中的插件图标
* 使用快捷键：

  ```text
  Ctrl / Cmd + Shift + E
  ```

打开后，页面中会出现一个独立的 Markdown 编辑器。

---

### 2. 编写长 Prompt

在左侧编辑区输入内容。

你可以直接使用 Markdown 语法，例如：

````markdown
# 任务

请帮我分析下面这段代码。

## 要求

- 找出潜在 bug
- 给出重构建议
- 解释性能风险
- 输出修改后的完整代码

## 代码

```js
function add(a, b) {
  return a + b
}
````

````

编辑器适合写：

- 标题
- 列表
- 引用
- 代码块
- 分段说明
- 结构化任务
- 长上下文

---

### 3. 预览 Markdown

右侧区域会实时显示 Markdown 预览。

这样你可以在发送前检查：

- 标题层级是否正确
- 列表是否清晰
- 代码块是否完整
- 任务说明是否有遗漏
- Prompt 结构是否容易理解

需要注意：预览只在插件内部显示。放入 ChatGPT 输入框的仍然是 Markdown 原文。

---

### 4. 自动保存草稿

插件会自动保存当前编辑内容。

即使你关闭 Composer，再次打开时，之前写过的内容仍然会保留。

草稿只保存在当前浏览器本地，不会上传到任何服务器。

---

### 5. 导入当前输入框内容

如果你已经在 ChatGPT 默认输入框里写了一部分内容，可以点击：

```text
导入输入框
````

插件会尝试读取当前 ChatGPT 输入框中的内容，并放入 Composer 编辑器。

这个功能适合在你写到一半时，发现默认输入框不够用，然后切换到 Composer 继续编辑。

---

### 6. 放入 ChatGPT 输入框

写完之后，点击：

```text
放入输入框
```

插件会把 Markdown 原文同步到 ChatGPT 原生输入框。

同步完成后，你可以继续在 ChatGPT 输入框中检查，确认没问题后再手动点击 ChatGPT 页面自己的发送按钮。

插件不会主动点击发送按钮。

---

### 7. 切换明暗模式

右下角提供明暗切换按钮。

默认是暗色模式。你可以根据当前使用环境切换为亮色模式。

主题偏好会保存在本地浏览器中。

---

## 快捷键

| 快捷键                      | 作用                |
| ------------------------ | ----------------- |
| `Ctrl / Cmd + Shift + E` | 打开或关闭 Composer    |
| `Ctrl / Cmd + Enter`     | 将内容放入 ChatGPT 输入框 |
| `Esc`                    | 关闭 Composer       |

说明：

`Ctrl / Cmd + Enter` 只会把内容放入输入框，不会发送消息。

---

## Markdown 支持

当前版本支持常用 Markdown 语法：

* 标题
* 段落
* 加粗
* 斜体
* 行内代码
* 代码块
* 引用
* 无序列表
* 有序列表
* 表格
* 链接

示例：

````markdown
# 标题

这是一个段落。

- 第一项
- 第二项

> 这是一段引用。

```python
print("hello")
````

````

---

## 隐私说明

本扩展不请求后端服务，不上传用户输入，不调用外部接口。

当前版本的数据保存方式如下：

- 草稿保存在当前浏览器访问 `chatgpt.com` 时的本地 `localStorage` 中
- 主题偏好保存在本地 `localStorage` 中
- 插件不会把输入内容发送到第三方服务器
- 插件不会调用 OpenAI API
- 插件不会读取除 ChatGPT 输入框以外的页面数据

你写入 Composer 的内容只会在以下位置出现：

1. 插件编辑器中
2. 当前浏览器本地草稿中
3. 你主动点击「放入输入框」后的 ChatGPT 原生输入框中

最终发送给 ChatGPT 的内容，由你手动决定。

---

## 技术原理

本插件是一个 Manifest V3 浏览器扩展。

核心逻辑如下：

1. 通过 content script 注入到 ChatGPT 页面
2. 在页面右下角挂载 Composer 启动按钮
3. 使用独立 UI 提供 Markdown 编辑和预览
4. 使用本地 `localStorage` 保存草稿和主题偏好
5. 点击「放入输入框」时，查找 ChatGPT 原生输入框
6. 将 Markdown 原文写入输入框
7. 派发输入事件，让 ChatGPT 页面感知内容变化

它不会绕过 ChatGPT 的页面流程，也不会调用 ChatGPT 的私有接口。

---

## 技术边界

由于 ChatGPT 页面本身会持续更新，页面 DOM 结构可能发生变化。

如果未来插件无法正确识别输入框，通常需要维护以下逻辑：

```text
content.js -> findComposer()
````

如果未来无法正确打开或同步，也可能与 ChatGPT 页面结构调整有关。

---

## 商店发布注意

如果你要将本扩展发布到 Chrome Web Store 或其他浏览器插件市场，请注意：

* 不要声称本扩展由 OpenAI 或 ChatGPT 官方提供、授权或背书
* 不要使用 OpenAI / ChatGPT 官方商标或 Logo 作为图标
* 插件名称和描述应明确说明这是第三方输入增强工具
* 商店上传包应使用包含 `manifest.json` 的 zip
* `manifest.json` 必须位于 zip 根目录
* 商店截图和推广图请单独上传到开发者后台
* 截图、描述、权限说明需要与实际功能一致

推荐描述方式：

```text
A local Markdown composer that improves long-form prompt writing on ChatGPT.
```

不推荐描述方式：

```text
Official ChatGPT Markdown Editor
```

---

## 本地开发

项目结构大致如下：

```text
chatgpt-markdown-composer/
├── manifest.json
├── background.js
├── content.js
├── icons/
│   ├── icon-16.png
│   ├── icon-32.png
│   ├── icon-48.png
│   └── icon-128.png
├── README.md
└── PRIVACY.md
```

开发时可以直接修改 `content.js`，然后在浏览器扩展管理页点击「重新加载」。

修改完成后刷新 ChatGPT 页面即可看到效果。

---

## 常见问题

### 这个插件会自动发送消息吗？

不会。

当前版本已经去掉发送按钮，也不会主动点击 ChatGPT 的发送按钮。

插件只负责把 Composer 中的 Markdown 原文放入 ChatGPT 输入框。最终是否发送，由你手动决定。

---

### 这个插件会上传我的 Prompt 吗？

不会。

插件没有后端服务，也不会调用外部接口。草稿和主题偏好保存在浏览器本地。

---

### 为什么放入输入框后，ChatGPT 里显示的还是 Markdown 原文？

这是正常的。

插件的预览区用于帮助你检查 Markdown 结构。真正放入 ChatGPT 的是 Markdown 原文，因为 ChatGPT 可以理解 Markdown 文本。

---

### 为什么 Composer 没有替换掉 ChatGPT 原输入框？

这是有意设计。

直接替换 ChatGPT 原输入框会更脆弱，因为 ChatGPT 页面本身有复杂的内部状态和交互逻辑。

当前方案保留原输入框，只做本地增强编辑层，稳定性更好，也更符合“输入增强插件”的定位。

---

### 为什么有时无法同步到输入框？

可能是 ChatGPT 页面 DOM 更新导致输入框选择器失效。

可以检查 `content.js` 中的：

```text
findComposer()
```

如果 ChatGPT 页面结构变化，需要更新输入框选择逻辑。

---

## 免责声明

本项目是第三方浏览器扩展，不隶属于 OpenAI，也不由 OpenAI 或 ChatGPT 官方提供、授权、赞助或背书。

ChatGPT 是 OpenAI 的产品名称。项目中提及 ChatGPT 仅用于说明本扩展的适用页面和使用场景。

---

## 反馈与贡献

如果你觉得这个插件有帮助，欢迎在 GitHub 点一个 Star：

[https://github.com/NanXiudao/chatgpt-markdown-composer](https://github.com/NanXiudao/chatgpt-markdown-composer)

也欢迎提交 issue 或 pull request。

适合反馈的问题包括：

* 输入框无法识别
* UI 显示异常
* Markdown 预览问题
* 快捷键冲突
* 浏览器兼容性问题
* 希望增加的新功能
