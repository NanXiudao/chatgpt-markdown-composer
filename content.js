(() => {
  'use strict';

  const EXT_ID = 'cgpt-md-composer-root';
  const STORAGE_KEY = 'cgpt-md-composer-draft-v3';
  const SETTINGS_KEY = 'cgpt-md-composer-settings-v3';
  const GITHUB_URL = 'https://github.com/NanXiudao/chatgpt-markdown-composer';

  if (document.getElementById(EXT_ID)) return;

  const defaultSettings = {
    width: 1120,
    height: 720,
    preview: true,
    theme: 'dark'
  };

  const state = {
    open: false,
    draft: readLocal(STORAGE_KEY, ''),
    settings: { ...defaultSettings, ...readLocal(SETTINGS_KEY, {}) }
  };

  if (!['dark', 'light'].includes(state.settings.theme)) state.settings.theme = 'dark';

  const rootHost = document.createElement('div');
  rootHost.id = EXT_ID;
  rootHost.setAttribute('data-chatgpt-markdown-composer', 'true');
  rootHost.setAttribute('data-theme', state.settings.theme);
  document.documentElement.appendChild(rootHost);

  const shadow = rootHost.attachShadow({ mode: 'open' });
  shadow.innerHTML = `
    <style>
      :host {
        all: initial;
        --mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
        --sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
        --accent: #8f7a52;
        --accent-soft: rgba(143, 122, 82, .14);
        --danger: #c34a36;
      }

      :host([data-theme="dark"]) {
        --page: #111111;
        --surface: #191919;
        --surface-elevated: #202020;
        --surface-hover: #2a2a2a;
        --surface-muted: #252525;
        --ink: #f1f1ef;
        --ink-soft: #d7d7d4;
        --muted: #a8a8a3;
        --muted-2: #787774;
        --border: #30302e;
        --border-soft: #2a2a28;
        --overlay: rgba(0, 0, 0, .52);
        --shadow: 0 26px 80px rgba(0, 0, 0, .44);
        --input: #191919;
        --selection: rgba(143, 122, 82, .32);
      }

      :host([data-theme="light"]) {
        --page: #f7f7f5;
        --surface: #ffffff;
        --surface-elevated: #ffffff;
        --surface-hover: #f1f1ef;
        --surface-muted: #f7f7f5;
        --ink: #2f3437;
        --ink-soft: #37352f;
        --muted: #6b6b66;
        --muted-2: #9b9a97;
        --border: #e5e4df;
        --border-soft: #eeeeea;
        --overlay: rgba(15, 15, 15, .28);
        --shadow: 0 26px 80px rgba(15, 15, 15, .18);
        --input: #ffffff;
        --selection: rgba(143, 122, 82, .20);
      }

      * { box-sizing: border-box; }
      button, textarea, a { font: inherit; }
      ::selection { background: var(--selection); }

      .launcher {
        position: fixed;
        right: 22px;
        bottom: 92px;
        z-index: 2147483647;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 38px;
        border: 1px solid var(--border);
        background: color-mix(in srgb, var(--surface-elevated) 94%, transparent);
        color: var(--ink-soft);
        border-radius: 10px;
        padding: 0 13px;
        font: 520 13px/1 var(--sans);
        letter-spacing: -.01em;
        box-shadow: 0 10px 28px rgba(0,0,0,.16);
        cursor: pointer;
        user-select: none;
        backdrop-filter: blur(14px);
        transition: background .14s ease, border-color .14s ease, transform .14s ease, color .14s ease;
      }
      .launcher:hover {
        transform: translateY(-1px);
        background: var(--surface-hover);
        border-color: color-mix(in srgb, var(--border) 72%, var(--ink));
        color: var(--ink);
      }

      .overlay {
        position: fixed;
        inset: 0;
        z-index: 2147483646;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 18px;
        background: var(--overlay);
        backdrop-filter: blur(5px);
        font-family: var(--sans);
      }
      .overlay.open { display: flex; }

      .panel {
        width: min(calc(100vw - 36px), var(--panel-width));
        height: min(calc(100vh - 36px), var(--panel-height));
        background: var(--page);
        color: var(--ink);
        border: 1px solid var(--border);
        border-radius: 12px;
        overflow: hidden;
        box-shadow: var(--shadow);
        display: grid;
        grid-template-rows: auto 1fr auto;
      }

      .topbar {
        min-height: 66px;
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 13px 15px 13px 18px;
        border-bottom: 1px solid var(--border-soft);
        background: var(--surface);
      }
      .brand {
        min-width: 220px;
        margin-right: auto;
      }
      .brand-title {
        font-size: 15px;
        font-weight: 620;
        letter-spacing: -.02em;
        color: var(--ink);
      }
      .brand-subtitle {
        margin-top: 4px;
        font-size: 12px;
        line-height: 1.2;
        color: var(--muted);
        white-space: nowrap;
      }
      .actions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 7px;
        flex-wrap: wrap;
      }
      .btn {
        border: 1px solid transparent;
        background: transparent;
        color: var(--ink-soft);
        border-radius: 7px;
        padding: 7px 10px;
        min-height: 32px;
        font: 520 12px/1 var(--sans);
        letter-spacing: -.005em;
        cursor: pointer;
        transition: background .12s ease, border-color .12s ease, color .12s ease;
      }
      .btn:hover {
        background: var(--surface-hover);
        border-color: var(--border-soft);
        color: var(--ink);
      }
      .btn.primary {
        background: var(--ink);
        color: var(--surface);
        border-color: var(--ink);
      }
      :host([data-theme="dark"]) .btn.primary {
        background: #f1f1ef;
        color: #191919;
        border-color: #f1f1ef;
      }
      .btn.primary:hover { opacity: .88; }
      .btn.danger { color: var(--danger); }

      .body {
        min-height: 0;
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, .92fr);
        gap: 10px;
        padding: 10px;
      }
      .body.no-preview { grid-template-columns: minmax(0, 1fr); }
      .body.no-preview .preview-card { display: none; }

      .card {
        min-width: 0;
        min-height: 0;
        display: flex;
        flex-direction: column;
        background: var(--surface-elevated);
        border: 1px solid var(--border-soft);
        border-radius: 9px;
        overflow: hidden;
      }
      .card-head {
        height: 42px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 0 13px;
        border-bottom: 1px solid var(--border-soft);
        color: var(--muted);
        font-size: 12px;
        font-weight: 520;
      }
      .card-head code {
        color: var(--muted-2);
        font-family: var(--mono);
        font-size: 11px;
        font-weight: 500;
      }
      textarea {
        width: 100%;
        height: 100%;
        flex: 1;
        resize: none;
        border: 0;
        outline: none;
        padding: 20px 22px;
        background: var(--input);
        color: var(--ink);
        caret-color: var(--accent);
        font: 14px/1.74 var(--mono);
        tab-size: 2;
        white-space: pre-wrap;
        overflow-wrap: break-word;
      }
      textarea::placeholder { color: var(--muted-2); }

      .preview {
        flex: 1;
        overflow: auto;
        padding: 20px 24px;
        color: var(--ink-soft);
        font: 14px/1.74 var(--sans);
      }
      .preview .empty {
        height: 100%;
        display: grid;
        place-items: center;
        text-align: center;
        color: var(--muted-2);
        border: 1px dashed var(--border);
        border-radius: 8px;
        padding: 28px;
        background: var(--surface-muted);
      }
      .preview h1, .preview h2, .preview h3, .preview h4, .preview h5, .preview h6 {
        color: var(--ink);
        line-height: 1.25;
        margin: 1.05em 0 .52em;
        letter-spacing: -.025em;
      }
      .preview h1 { font-size: 1.78em; border-bottom: 1px solid var(--border-soft); padding-bottom: .34em; }
      .preview h2 { font-size: 1.36em; }
      .preview h3 { font-size: 1.14em; }
      .preview p { margin: .78em 0; }
      .preview ul, .preview ol { padding-left: 1.55em; margin: .72em 0; }
      .preview li + li { margin-top: .2em; }
      .preview blockquote {
        margin: 1em 0;
        padding: .2em 1em;
        color: var(--muted);
        border-left: 3px solid var(--accent);
        background: var(--accent-soft);
        border-radius: 0 7px 7px 0;
      }
      .preview code {
        font-family: var(--mono);
        background: var(--surface-muted);
        border: 1px solid var(--border-soft);
        padding: .12em .36em;
        border-radius: 5px;
        font-size: .92em;
      }
      .preview pre {
        overflow: auto;
        background: var(--surface-muted);
        border: 1px solid var(--border-soft);
        border-radius: 8px;
        padding: 14px 16px;
      }
      .preview pre code { background: transparent; border: 0; padding: 0; }
      .preview table { border-collapse: collapse; width: 100%; margin: 1em 0; font-size: .96em; }
      .preview th, .preview td { border: 1px solid var(--border); padding: 7px 9px; }
      .preview th { background: var(--surface-muted); text-align: left; }
      .preview a { color: var(--accent); text-decoration-thickness: .08em; text-underline-offset: .2em; }

      .footer {
        min-height: 46px;
        padding: 9px 14px;
        display: flex;
        gap: 10px;
        align-items: center;
        color: var(--muted);
        border-top: 1px solid var(--border-soft);
        font-size: 12px;
        background: var(--surface);
      }
      .pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        border: 1px solid var(--border-soft);
        border-radius: 7px;
        padding: 4px 8px;
        background: var(--surface-muted);
        white-space: nowrap;
      }
      .footer-right {
        margin-left: auto;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
        min-width: 0;
      }
      .github {
        color: var(--muted);
        text-decoration: none;
        border: 1px solid var(--border-soft);
        background: var(--surface-muted);
        border-radius: 7px;
        padding: 6px 9px;
        white-space: nowrap;
        transition: color .12s ease, background .12s ease, border-color .12s ease;
      }
      .github:hover {
        color: var(--ink);
        background: var(--surface-hover);
        border-color: var(--border);
      }
      .theme-toggle {
        border: 1px solid var(--border-soft);
        background: var(--surface-muted);
        color: var(--muted);
        border-radius: 7px;
        padding: 6px 9px;
        cursor: pointer;
      }
      .theme-toggle:hover {
        color: var(--ink);
        background: var(--surface-hover);
        border-color: var(--border);
      }
      .status { color: var(--muted); white-space: nowrap; }
      .kbd {
        border: 1px solid var(--border);
        border-bottom-width: 2px;
        border-radius: 5px;
        padding: 1px 5px;
        background: var(--surface-elevated);
        color: var(--muted);
        font: 600 11px/1.35 var(--sans);
      }

      .toast {
        position: fixed;
        right: 22px;
        bottom: 150px;
        z-index: 2147483647;
        display: none;
        max-width: min(440px, calc(100vw - 44px));
        background: var(--ink);
        color: var(--surface);
        border: 1px solid var(--border);
        border-radius: 9px;
        box-shadow: 0 16px 44px rgba(0,0,0,.24);
        padding: 10px 12px;
        font: 13px/1.5 var(--sans);
      }
      :host([data-theme="dark"]) .toast {
        background: #f1f1ef;
        color: #191919;
      }
      .toast.show { display: block; }

      @media (max-width: 880px) {
        .topbar { align-items: flex-start; flex-direction: column; }
        .brand { margin-right: 0; }
        .actions { justify-content: flex-start; }
        .body { grid-template-columns: 1fr; }
        .preview-card { display: none; }
        .body.no-preview { grid-template-columns: 1fr; }
        .brand-subtitle { white-space: normal; }
        .footer { flex-wrap: wrap; }
        .footer-right { margin-left: 0; flex-wrap: wrap; }
      }
    </style>

    <button class="launcher" title="Open Markdown Composer (Ctrl/Cmd + Shift + E)">Composer</button>

    <div class="overlay" role="dialog" aria-modal="true" aria-label="Markdown Composer for ChatGPT">
      <section class="panel">
        <header class="topbar">
          <div class="brand">
            <div class="brand-title">Markdown Composer</div>
            <div class="brand-subtitle">为长 Prompt 准备的本地增强输入层</div>
          </div>
          <div class="actions">
            <button class="btn import-current" title="读取当前 ChatGPT 输入框内容">导入当前</button>
            <button class="btn toggle-preview">隐藏预览</button>
            <button class="btn copy">复制</button>
            <button class="btn primary sync">放入输入框</button>
            <button class="btn danger clear">清空</button>
            <button class="btn close">关闭</button>
          </div>
        </header>

        <main class="body">
          <section class="card editor-card">
            <div class="card-head">
              <span>Markdown 原文</span>
              <code>Ctrl/Cmd + Enter 放入输入框</code>
            </div>
            <textarea spellcheck="false" placeholder="在这里写长文本 Prompt。支持 Markdown、代码块、表格、列表。\n\n示例：\n# 任务\n请基于以下上下文进行分析……\n\n\`\`\`python\nprint('hello')\n\`\`\`"></textarea>
          </section>

          <section class="card preview-card">
            <div class="card-head">
              <span>实时预览</span>
              <code>本地渲染，不上传</code>
            </div>
            <div class="preview"></div>
          </section>
        </main>

        <footer class="footer">
          <span class="pill count">0 字符 · 0 行</span>
          <span class="pill"><span class="kbd">Esc</span> 关闭</span>
          <span class="status">Ready</span>
          <span class="footer-right">
            <a class="github" href="${GITHUB_URL}" target="_blank" rel="noreferrer noopener">GitHub · 点个 Star</a>
            <button class="theme-toggle" type="button">切换浅色</button>
          </span>
        </footer>
      </section>
    </div>
    <div class="toast"></div>
  `;

  const $ = selector => shadow.querySelector(selector);
  const launcher = $('.launcher');
  const overlay = $('.overlay');
  const panel = $('.panel');
  const body = $('.body');
  const textarea = $('textarea');
  const preview = $('.preview');
  const count = $('.count');
  const status = $('.status');
  const toast = $('.toast');
  const togglePreviewButton = $('.toggle-preview');
  const themeToggleButton = $('.theme-toggle');

  panel.style.setProperty('--panel-width', `${state.settings.width}px`);
  panel.style.setProperty('--panel-height', `${state.settings.height}px`);
  textarea.value = state.draft;
  body.classList.toggle('no-preview', !state.settings.preview);
  updatePreviewButton();
  updateThemeButton();
  render();

  launcher.addEventListener('click', toggleOpen);
  $('.close').addEventListener('click', closeComposer);
  togglePreviewButton.addEventListener('click', togglePreview);
  themeToggleButton.addEventListener('click', toggleTheme);
  $('.copy').addEventListener('click', copyDraft);
  $('.sync').addEventListener('click', syncToChatGPT);
  $('.clear').addEventListener('click', clearDraft);
  $('.import-current').addEventListener('click', importCurrentComposer);

  overlay.addEventListener('mousedown', event => {
    if (event.target === overlay) closeComposer();
  });

  textarea.addEventListener('input', () => {
    state.draft = textarea.value;
    writeLocal(STORAGE_KEY, state.draft);
    render();
  });

  textarea.addEventListener('keydown', event => {
    if (event.key === 'Tab') {
      event.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      textarea.setRangeText('  ', start, end, 'end');
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }

    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
      syncToChatGPT();
    }
  });

  window.addEventListener('keydown', event => {
    if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key.toLowerCase() === 'e') {
      event.preventDefault();
      toggleOpen();
    }
    if (state.open && event.key === 'Escape') closeComposer();
  }, true);

  try {
    chrome.runtime.onMessage.addListener((message) => {
      if (message && message.type === 'CGPT_MD_COMPOSER_TOGGLE') toggleOpen();
    });
  } catch (_) {
    // Runtime messaging is unavailable in rare isolated contexts.
  }

  function toggleOpen() {
    state.open ? closeComposer() : openComposer();
  }

  function openComposer() {
    state.open = true;
    overlay.classList.add('open');
    setTimeout(() => textarea.focus(), 0);
  }

  function closeComposer() {
    state.open = false;
    overlay.classList.remove('open');
  }

  function togglePreview() {
    state.settings.preview = !state.settings.preview;
    persistSettings();
    body.classList.toggle('no-preview', !state.settings.preview);
    updatePreviewButton();
  }

  function updatePreviewButton() {
    togglePreviewButton.textContent = state.settings.preview ? '隐藏预览' : '显示预览';
  }

  function toggleTheme() {
    state.settings.theme = state.settings.theme === 'dark' ? 'light' : 'dark';
    rootHost.setAttribute('data-theme', state.settings.theme);
    persistSettings();
    updateThemeButton();
    showToast(state.settings.theme === 'dark' ? '已切换到暗色。' : '已切换到浅色。');
  }

  function updateThemeButton() {
    themeToggleButton.textContent = state.settings.theme === 'dark' ? '切换浅色' : '切换暗色';
    themeToggleButton.setAttribute('aria-label', state.settings.theme === 'dark' ? '切换到浅色模式' : '切换到暗色模式');
  }

  function persistSettings() {
    writeLocal(SETTINGS_KEY, state.settings);
  }

  async function copyDraft() {
    try {
      await navigator.clipboard.writeText(textarea.value);
      showToast('已复制 Markdown 原文。');
    } catch (_) {
      showToast('复制失败：浏览器拒绝 clipboard 权限。');
    }
  }

  function clearDraft() {
    const ok = confirm('确认清空当前草稿？');
    if (!ok) return;
    textarea.value = '';
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    showToast('草稿已清空。');
  }

  function importCurrentComposer() {
    const composer = findComposer();
    if (!composer) {
      showToast('没有找到当前 ChatGPT 输入框。');
      return;
    }
    const text = readInputText(composer).trimEnd();
    if (!text) {
      showToast('当前 ChatGPT 输入框为空。');
      return;
    }
    textarea.value = text;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    showToast('已导入当前输入框内容。');
  }

  function syncToChatGPT() {
    const text = textarea.value.trimEnd();
    if (!text) {
      showToast('当前编辑器为空。');
      return;
    }

    const composer = findComposer();
    if (!composer) {
      showToast('没有找到 ChatGPT 输入框。请刷新页面后再试。');
      return;
    }

    try {
      insertText(composer, text);
      setStatus('已放入 ChatGPT 输入框');
      showToast('已放入 ChatGPT 输入框。请在原页面手动发送。');
    } catch (error) {
      console.error('[Markdown Composer for ChatGPT]', error);
      showToast(`同步失败：${error && error.message ? error.message : '未知错误'}`);
    }
  }

  function findComposer() {
    const selectors = [
      '#prompt-textarea',
      '[data-testid="composer-input"]',
      '[contenteditable="true"][role="textbox"]',
      '[contenteditable="true"]',
      'textarea[placeholder]',
      'textarea'
    ];

    for (const selector of selectors) {
      const nodes = Array.from(document.querySelectorAll(selector));
      const visible = nodes.find(el => isVisible(el) && isProbablyInput(el));
      if (visible) return visible;
    }

    return null;
  }

  function isProbablyInput(el) {
    const rect = el.getBoundingClientRect();
    const aria = (el.getAttribute('aria-label') || '').toLowerCase();
    const placeholder = (el.getAttribute('placeholder') || el.getAttribute('data-placeholder') || '').toLowerCase();
    const id = (el.id || '').toLowerCase();
    const text = `${aria} ${placeholder} ${id}`;

    if (text.includes('prompt') || text.includes('message') || text.includes('send') || text.includes('输入') || text.includes('消息')) return true;
    return rect.width > 240 && rect.height > 24;
  }

  function isVisible(el) {
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
  }

  function readInputText(el) {
    if (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) return el.value || '';
    return el.innerText || el.textContent || '';
  }

  function insertText(el, text) {
    el.focus();

    if (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) {
      const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
      if (setter) setter.call(el, text);
      else el.value = text;
      el.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      return;
    }

    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(el);
    selection.removeAllRanges();
    selection.addRange(range);

    const inserted = document.execCommand && document.execCommand('insertText', false, text);
    if (!inserted) el.textContent = text;

    el.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function render() {
    const text = textarea.value;
    const html = renderMarkdown(text);
    preview.innerHTML = html || '<div class="empty">Markdown 预览会显示在这里。<br>内容只在本地渲染。</div>';
    const lines = text ? text.split(/\r\n|\r|\n/).length : 0;
    count.textContent = `${text.length} 字符 · ${lines} 行`;
  }

  function renderMarkdown(input) {
    const codeBlocks = [];
    let text = input.replace(/```([\w-]*)\n([\s\S]*?)```/g, (_, lang, code) => {
      const token = `\u0000CODEBLOCK_${codeBlocks.length}\u0000`;
      codeBlocks.push(`<pre><code${lang ? ` data-lang="${escapeAttr(lang)}"` : ''}>${escapeHtml(code)}</code></pre>`);
      return token;
    });

    text = escapeHtml(text);
    text = renderTables(text);

    const lines = text.split(/\r\n|\r|\n/);
    const out = [];
    let inUl = false;
    let inOl = false;
    let paragraph = [];

    const flushParagraph = () => {
      if (paragraph.length) {
        out.push(`<p>${inline(paragraph.join('<br>'))}</p>`);
        paragraph = [];
      }
    };
    const closeLists = () => {
      if (inUl) { out.push('</ul>'); inUl = false; }
      if (inOl) { out.push('</ol>'); inOl = false; }
    };

    for (const line of lines) {
      if (/^\u0000CODEBLOCK_\d+\u0000$/.test(line.trim())) {
        flushParagraph(); closeLists(); out.push(line.trim()); continue;
      }
      if (!line.trim()) {
        flushParagraph(); closeLists(); continue;
      }
      const h = line.match(/^(#{1,6})\s+(.+)$/);
      if (h) {
        flushParagraph(); closeLists();
        const level = h[1].length;
        out.push(`<h${level}>${inline(h[2])}</h${level}>`);
        continue;
      }
      const quote = line.match(/^&gt;\s?(.*)$/);
      if (quote) {
        flushParagraph(); closeLists();
        out.push(`<blockquote>${inline(quote[1])}</blockquote>`);
        continue;
      }
      const ul = line.match(/^\s*[-*+]\s+(.+)$/);
      if (ul) {
        flushParagraph();
        if (inOl) { out.push('</ol>'); inOl = false; }
        if (!inUl) { out.push('<ul>'); inUl = true; }
        out.push(`<li>${inline(ul[1])}</li>`);
        continue;
      }
      const ol = line.match(/^\s*\d+\.\s+(.+)$/);
      if (ol) {
        flushParagraph();
        if (inUl) { out.push('</ul>'); inUl = false; }
        if (!inOl) { out.push('<ol>'); inOl = true; }
        out.push(`<li>${inline(ol[1])}</li>`);
        continue;
      }
      paragraph.push(line);
    }

    flushParagraph(); closeLists();

    let html = out.join('\n');
    html = html.replace(/\u0000CODEBLOCK_(\d+)\u0000/g, (_, index) => codeBlocks[Number(index)] || '');
    return html;
  }

  function renderTables(text) {
    const lines = text.split(/\r\n|\r|\n/);
    const result = [];
    for (let i = 0; i < lines.length; i += 1) {
      if (isTableLine(lines[i]) && i + 1 < lines.length && isSeparatorLine(lines[i + 1])) {
        const header = splitTableLine(lines[i]);
        i += 2;
        const rows = [];
        while (i < lines.length && isTableLine(lines[i])) {
          rows.push(splitTableLine(lines[i]));
          i += 1;
        }
        i -= 1;
        result.push(renderTable(header, rows));
      } else {
        result.push(lines[i]);
      }
    }
    return result.join('\n');
  }

  function isTableLine(line) {
    const trimmed = line.trim();
    return trimmed.includes('|') && trimmed.split('|').length >= 3;
  }

  function isSeparatorLine(line) {
    return /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
  }

  function splitTableLine(line) {
    return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(cell => cell.trim());
  }

  function renderTable(header, rows) {
    const head = `<thead><tr>${header.map(cell => `<th>${inline(cell)}</th>`).join('')}</tr></thead>`;
    const body = `<tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${inline(cell)}</td>`).join('')}</tr>`).join('')}</tbody>`;
    return `<table>${head}${body}</table>`;
  }

  function inline(text) {
    return text
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/__([^_]+)__/g, '<strong>$1</strong>')
      .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>')
      .replace(/_([^_]+)_/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer noopener">$1</a>');
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function escapeAttr(value) {
    return String(value).replace(/[^a-zA-Z0-9_-]/g, '');
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  function setStatus(message) {
    status.textContent = message;
    clearTimeout(setStatus.timer);
    setStatus.timer = setTimeout(() => { status.textContent = 'Ready'; }, 2200);
  }

  function readLocal(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch (_) {
      return fallback;
    }
  }

  function writeLocal(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (_) {
      // Ignore storage quota / privacy-mode failures.
    }
  }
})();
