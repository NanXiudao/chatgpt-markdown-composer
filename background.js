chrome.action.onClicked.addListener(async tab => {
  if (!tab || !tab.id || !tab.url) return;

  const allowed = /^https:\/\/(chatgpt\.com|chat\.openai\.com)\//.test(tab.url);
  if (!allowed) return;

  try {
    await chrome.tabs.sendMessage(tab.id, { type: 'CGPT_MD_COMPOSER_TOGGLE' });
  } catch (_) {
    // The content script may not be ready yet. A page refresh will load it.
  }
});
