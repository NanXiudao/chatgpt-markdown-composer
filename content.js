(() => {
  'use strict';

  const EXT_ID = 'cgpt-md-composer-root';
  const STORAGE_KEY = 'cgpt-md-composer-draft-v2';
  const SETTINGS_KEY = 'cgpt-md-composer-settings-v2';

  if (document.getElementById(EXT_ID)) return;

  const defaultSettings = {
    width: 1120,
    height: 720,
    preview: true,
    autoCloseAfterSend: false
  };

  const state = {
    open: false,
    draft: readLocal(STORAGE_KEY, ''),
    settings: { ...defaultSettings, ...readLocal(SETTINGS_KEY, {}) }
  };

  const rootHost = document.createElement('div');
  rootHost.id = EXT_ID;
  rootHost.setAttribute('data-chatgpt-markdown-composer', 'true');
  document.documentElement.appendChild(rootHost);

  const shadow = rootHost.attachShadow({ mode: 'open' });
  shadow.innerHTML = `
    <style>
      :host {
        all: initial;
        --surface: #ffffff;
        --surface-soft: #f7f7f8;
        --surface-muted: #ececf1;
        --ink: #202123;
        --muted: #6e6e80;
        --muted-2: #8e8ea0;
        --border: #d9d9e3;
        --border-soft: #ececf1;
        --accent: #10a37f;
        --accent-hover: #0e8f70;
        --danger: #d92d20;
        --shadow: 0 24px 70px rgba(0, 0, 0, .20);
        --mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
        --sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
      }

      @media (prefers-color-scheme: dark) {
        :host {
          --surface: #202123;
          --surface-soft: #171717;
          --surface-muted: #2f2f2f;
          --ink: #ececf1;
          --muted: #c5c5d2;
          --muted-2: #9b9ba7;
          --border: #3f3f46;
          --border-soft: #2f2f2f;
          --shadow: 0 24px 70px rgba(0, 0, 0, .48);
        }
      }

      * { box-sizing: border-box; }
      button, textarea { font: inherit; }

      .launcher {
        position: fixed;
        right: 22px;
        bottom: 92px;
        z-index: 2147483647;
        display: inline-flex;
        align-items: center;
        gap: 9px;
        height: 42px;
        border: 1px solid var(--border);
        background: color-mix(in srgb, var(--surface) 96%, transparent);
        color: var(--ink);
        border-radius: 999px;
        padding: 0 14px 0 10px;
        font: 600 13px/1 var(--sans);
        box-shadow: 0 10px 30px rgba(0,0,0,.14);
        cursor: pointer;
        user-select: none;
        backdrop-filter: blur(14px);
        transition: transform .14s ease, box-shadow .14s ease, border-color .14s ease;
      }
      .launcher:hover {
        transform: translateY(-1px);
        border-color: color-mix(in srgb, var(--accent) 55%, var(--border));
        box-shadow: 0 16px 38px rgba(0,0,0,.18);
      }
      .launcher-mark, .brand-mark {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        overflow: hidden;
      }
      .launcher-mark {
        width: 25px;
        height: 25px;
        border-radius: 9px;
        background: #202123;
        color: #ffffff;
      }
      .brand-mark {
        width: 34px;
        height: 34px;
        border-radius: 12px;
        background: linear-gradient(135deg, #202123 0%, #343541 58%, #10a37f 100%);
        color: #ffffff;
        box-shadow: inset 0 0 0 1px rgba(255,255,255,.12);
      }
      .launcher-mark svg, .brand-mark svg { width: 70%; height: 70%; }

      .overlay {
        position: fixed;
        inset: 0;
        z-index: 2147483646;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 18px;
        background: rgba(32, 33, 35, .34);
        backdrop-filter: blur(7px);
        font-family: var(--sans);
      }
      .overlay.open { display: flex; }

      .panel {
        width: min(calc(100vw - 36px), var(--panel-width));
        height: min(calc(100vh - 36px), var(--panel-height));
        background: var(--surface-soft);
        color: var(--ink);
        border: 1px solid var(--border);
        border-radius: 24px;
        overflow: hidden;
        box-shadow: var(--shadow);
        display: grid;
        grid-template-rows: auto 1fr auto;
      }

      .topbar {
        min-height: 72px;
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 14px 16px 14px 18px;
        border-bottom: 1px solid var(--border-soft);
        background: color-mix(in srgb, var(--surface) 92%, transparent);
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 220px;
        margin-right: auto;
      }
      .brand-title {
        font-size: 15px;
        font-weight: 700;
        letter-spacing: -.01em;
        color: var(--ink);
      }
      .brand-subtitle {
        margin-top: 3px;
        font-size: 12px;
        color: var(--muted);
        white-space: nowrap;
      }
      .actions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
        flex-wrap: wrap;
      }
      .btn {
        border: 1px solid var(--border);
        background: var(--surface);
        color: var(--ink);
        border-radius: 999px;
        padding: 9px 12px;
        min-height: 36px;
        font: 600 12px/1 var(--sans);
        cursor: pointer;
        transition: background .12s ease, border-color .12s ease, transform .12s ease, opacity .12s ease;
      }
      .btn:hover {
        transform: translateY(-1px);
        border-color: color-mix(in srgb, var(--ink) 25%, var(--border));
      }
      .btn.primary {
        background: var(--ink);
        color: var(--surface);
        border-color: var(--ink);
      }
      .btn.accent {
        background: var(--accent);
        color: #ffffff;
        border-color: var(--accent);
      }
      .btn.accent:hover { background: var(--accent-hover); border-color: var(--accent-hover); }
      .btn.danger { color: var(--danger); }
      .btn.icon {
        width: 36px;
        padding: 0;
        font-size: 19px;
        line-height: 1;
      }

      .body {
        min-height: 0;
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, .92fr);
        gap: 12px;
        padding: 12px;
      }
      .body.no-preview { grid-template-columns: minmax(0, 1fr); }
      .body.no-preview .preview-card { display: none; }

      .card {
        min-width: 0;
        min-height: 0;
        display: flex;
        flex-direction: column;
        background: var(--surface);
        border: 1px solid var(--border-soft);
        border-radius: 18px;
        overflow: hidden;
        box-shadow: 0 1px 2px rgba(0,0,0,.04);
      }
      .card-head {
        height: 43px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 0 14px;
        border-bottom: 1px solid var(--border-soft);
        color: var(--muted);
        font-size: 12px;
        font-weight: 600;
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
        background: transparent;
        color: var(--ink);
        caret-color: var(--accent);
        font: 14px/1.72 var(--mono);
        tab-size: 2;
        white-space: pre-wrap;
        overflow-wrap: break-word;
      }
      textarea::placeholder { color: var(--muted-2); }

      .preview {
        flex: 1;
        overflow: auto;
        padding: 20px 24px;
        color: var(--ink);
        font: 14px/1.74 var(--sans);
      }
      .preview .empty {
        height: 100%;
        display: grid;
        place-items: center;
        text-align: center;
        color: var(--muted-2);
        border: 1px dashed var(--border);
        border-radius: 14px;
        padding: 28px;
        background: color-mix(in srgb, var(--surface-soft) 62%, transparent);
      }
      .preview h1, .preview h2, .preview h3, .preview h4, .preview h5, .preview h6 {
        color: var(--ink);
        line-height: 1.25;
        margin: 1.05em 0 .52em;
        letter-spacing: -.02em;
      }
      .preview h1 { font-size: 1.85em; border-bottom: 1px solid var(--border-soft); padding-bottom: .35em; }
      .preview h2 { font-size: 1.42em; }
      .preview h3 { font-size: 1.17em; }
      .preview p { margin: .78em 0; }
      .preview ul, .preview ol { padding-left: 1.55em; margin: .72em 0; }
      .preview li + li { margin-top: .2em; }
      .preview blockquote {
        margin: 1em 0;
        padding: .18em 1em;
        color: var(--muted);
        border-left: 3px solid var(--accent);
        background: color-mix(in srgb, var(--accent) 7%, transparent);
        border-radius: 0 10px 10px 0;
      }
      .preview code {
        font-family: var(--mono);
        background: var(--surface-muted);
        padding: .12em .38em;
        border-radius: 6px;
        font-size: .92em;
      }
      .preview pre {
        overflow: auto;
        background: color-mix(in srgb, var(--surface-soft) 82%, var(--surface));
        border: 1px solid var(--border-soft);
        border-radius: 14px;
        padding: 14px 16px;
      }
      .preview pre code { background: transparent; padding: 0; }
      .preview table { border-collapse: collapse; width: 100%; margin: 1em 0; font-size: .96em; }
      .preview th, .preview td { border: 1px solid var(--border); padding: 7px 9px; }
      .preview th { background: var(--surface-soft); text-align: left; }
      .preview a { color: var(--accent); text-decoration-thickness: .08em; text-underline-offset: .2em; }

      .footer {
        min-height: 44px;
        padding: 10px 16px;
        display: flex;
        gap: 12px;
        align-items: center;
        color: var(--muted);
        border-top: 1px solid var(--border-soft);
        font-size: 12px;
        background: color-mix(in srgb, var(--surface) 92%, transparent);
      }
      .pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        border: 1px solid var(--border-soft);
        border-radius: 999px;
        padding: 4px 8px;
        background: var(--surface-soft);
        white-space: nowrap;
      }
      .status { margin-left: auto; color: var(--muted); white-space: nowrap; }
      .kbd {
        border: 1px solid var(--border);
        border-bottom-width: 2px;
        border-radius: 6px;
        padding: 1px 5px;
        background: var(--surface);
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
        border: 1px solid color-mix(in srgb, var(--surface) 18%, transparent);
        border-radius: 14px;
        box-shadow: 0 16px 44px rgba(0,0,0,.24);
        padding: 11px 13px;
        font: 13px/1.5 var(--sans);
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
        .status { margin-left: 0; }
      }
    </style>

    <button class="launcher" title="Open Markdown Composer (Ctrl/Cmd + Shift + E)">
      <span class="launcher-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none"><path d="M5 7.5h8.7M5 12h14M5 16.5h7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M17 6.5l2 2-2 2" stroke="#10a37f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </span>
      <span>Composer</span>
    </button>

    <div class="overlay" role="dialog" aria-modal="true" aria-label="Markdown Composer for ChatGPT">
      <section class="panel">
        <header class="topbar">
          <div class="brand">
            <span class="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none"><path d="M5 7.5h8.7M5 12h14M5 16.5h7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M17 6.5l2 2-2 2" stroke="#10a37f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </span>
            <span>
              <div class="brand-title">Markdown Composer</div>
              <div class="brand-subtitle">为长 Prompt 准备的本地增强输入层</div>
            </span>
          </div>
          <div class="actions">
            <button class="btn import-current" title="读取当前 ChatGPT 输入框内容">导入当前</button>
            <button class="btn toggle-preview">隐藏预览</button>
            <button class="btn copy">复制</button>
            <button class="btn sync">放入输入框</button>
            <button class="btn accent send">发送</button>
            <button class="btn danger clear">清空</button>
            <button class="btn icon close" title="关闭">×</button>
          </div>
        </header>

        <main class="body">
          <section class="card editor-card">
            <div class="card-head">
              <span>Markdown 原文</span>
              <code>Ctrl/Cmd + Enter 发送</code>
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
          <span class="pill">草稿保存在本机 localStorage</span>
          <span class="pill"><span class="kbd">Esc</span> 关闭</span>
          <span class="status">Ready</span>
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

  panel.style.setProperty('--panel-width', `${state.settings.width}px`);
  panel.style.setProperty('--panel-height', `${state.settings.height}px`);
  textarea.value = state.draft;
  body.classList.toggle('no-preview', !state.settings.preview);
  updatePreviewButton();
  render();

  launcher.addEventListener('click', toggleOpen);
  $('.close').addEventListener('click', closeComposer);
  togglePreviewButton.addEventListener('click', togglePreview);
  $('.copy').addEventListener('click', copyDraft);
  $('.sync').addEventListener('click', () => syncToChatGPT(false));
  $('.send').addEventListener('click', () => syncToChatGPT(true));
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
      syncToChatGPT(true);
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
    writeLocal(SETTINGS_KEY, state.settings);
    body.classList.toggle('no-preview', !state.settings.preview);
    updatePreviewButton();
  }

  function updatePreviewButton() {
    togglePreviewButton.textContent = state.settings.preview ? '隐藏预览' : '显示预览';
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

  async function syncToChatGPT(shouldSend) {
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

      if (!shouldSend) {
        showToast('已放入 ChatGPT 输入框。');
        return;
      }

      const sent = await clickSendButton();
      if (sent) {
        setStatus('已发送');
        showToast('已调用 ChatGPT 原生发送按钮。');
        if (state.settings.autoCloseAfterSend) closeComposer();
      } else {
        showToast('已放入输入框，但没有找到可点击的发送按钮。你可以手动点击发送。');
      }
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

  async function clickSendButton() {
    for (let i = 0; i < 24; i += 1) {
      const button = findSendButton();
      if (button && !button.disabled && button.getAttribute('aria-disabled') !== 'true') {
        button.click();
        return true;
      }
      await sleep(100);
    }
    return false;
  }

  function findSendButton() {
    const exactSelectors = [
      '[data-testid="send-button"]',
      '[data-testid="composer-submit-button"]',
      'button[aria-label="Send prompt"]',
      'button[aria-label="Send message"]',
      'button[aria-label="发送"]',
      'button[aria-label="发送消息"]'
    ];

    for (const selector of exactSelectors) {
      const el = document.querySelector(selector);
      if (el && isVisible(el)) return el;
    }

    const buttons = Array.from(document.querySelectorAll('button')).filter(isVisible);
    const byLabel = buttons.find(button => {
      const label = `${button.getAttribute('aria-label') || ''} ${button.title || ''} ${button.textContent || ''}`.toLowerCase();
      return label.includes('send') || label.includes('发送');
    });
    if (byLabel) return byLabel;

    return buttons.find(button => {
      const rect = button.getBoundingClientRect();
      return rect.bottom > window.innerHeight - 220 && rect.right > window.innerWidth / 2 && !button.disabled;
    }) || null;
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

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
})();
