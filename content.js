// ===== Mudakkik Floating Button & Result Panel =====

const API_URL = "https://mudakkik.ddns.net/api";
let floatingBtn = null;
let resultPanel = null;
let selectedText = "";

// ===== Styles =====
const styles = `
  #mudakkik-float-btn {
    position: absolute;
    z-index: 2147483647;
    display: none;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    background: linear-gradient(135deg, #001246 0%, #002080 100%);
    color: white;
    font-family: 'Cairo', 'Segoe UI', sans-serif;
    font-size: 13px;
    font-weight: 600;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(0, 18, 70, 0.4);
    transition: all 0.2s ease;
    direction: rtl;
  }
  
  #mudakkik-float-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 28px rgba(0, 18, 70, 0.5);
  }
  
  #mudakkik-float-btn svg {
    width: 16px;
    height: 16px;
  }
  
  #mudakkik-result-panel {
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 2147483647;
    width: 380px;
    max-height: 80vh;
    overflow-y: auto;
    background: white;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
    font-family: 'Cairo', 'Segoe UI', sans-serif;
    direction: rtl;
    display: none;
  }
  
  #mudakkik-result-panel .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    background: linear-gradient(135deg, #001246 0%, #002080 100%);
    color: white;
    border-radius: 16px 16px 0 0;
  }
  
  #mudakkik-result-panel .panel-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  #mudakkik-result-panel .close-btn {
    background: rgba(255,255,255,0.2);
    border: none;
    color: white;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }
  
  #mudakkik-result-panel .close-btn:hover {
    background: rgba(255,255,255,0.3);
  }
  
  #mudakkik-result-panel .panel-content {
    padding: 20px;
  }
  
  #mudakkik-result-panel .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 40px;
  }
  
  #mudakkik-result-panel .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #e5e7eb;
    border-top-color: #001246;
    border-radius: 50%;
    animation: mudakkik-spin 0.8s linear infinite;
  }
  
  @keyframes mudakkik-spin {
    to { transform: rotate(360deg); }
  }
  
  #mudakkik-result-panel .selected-text {
    background: #f8fafc;
    border: 1px solid #d1d5db;
    border-radius: 10px;
    padding: 12px;
    font-size: 14px;
    color: #111827;
    margin-bottom: 16px;
    max-height: 100px;
    overflow-y: auto;
    line-height: 1.6;
  }
  
  #mudakkik-result-panel .verdict-box {
    border-radius: 14px;
    padding: 20px;
    text-align: center;
    margin-bottom: 16px;
  }
  
  #mudakkik-result-panel .verdict-box.true {
    background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
    border: 2px solid #4caf50;
  }
  
  #mudakkik-result-panel .verdict-box.false {
    background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
    border: 2px solid #ef5350;
  }
  
  #mudakkik-result-panel .verdict-box.neutral {
    background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
    border: 2px solid #ff9800;
  }
  
  #mudakkik-result-panel .percentage {
    font-size: 32px;
    font-weight: 900;
    margin-bottom: 4px;
  }
  
  #mudakkik-result-panel .verdict-box.true .percentage { color: #2e7d32; }
  #mudakkik-result-panel .verdict-box.false .percentage { color: #c62828; }
  #mudakkik-result-panel .verdict-box.neutral .percentage { color: #e65100; }
  
  #mudakkik-result-panel .verdict-label {
    font-size: 16px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 8px;
  }
  
  #mudakkik-result-panel .verdict-summary {
    font-size: 14px;
    color: #111827;
    line-height: 1.7;
    margin: 0;
  }
  
  #mudakkik-result-panel .sources-section h4 {
    font-size: 14px;
    font-weight: 700;
    color: #001246;
    margin: 0 0 12px 0;
    padding-bottom: 8px;
    border-bottom: 2px solid #D00000;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  #mudakkik-result-panel .source-link {
    display: block;
    padding: 12px 14px;
    font-size: 14px;
    border-radius: 8px;
    border: 1px solid #d1d5db;
    text-decoration: none;
    color: #111827;
    font-weight: 600;
    margin-bottom: 8px;
    background: #f8fafc;
    transition: all 0.2s;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  #mudakkik-result-panel .source-link:hover {
    background: #001246;
    color: white;
    border-color: #001246;
  }
  
  #mudakkik-result-panel .error-msg {
    padding: 14px;
    background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
    border: 1px solid #ef9a9a;
    border-radius: 10px;
    color: #c62828;
    font-size: 13px;
    font-weight: 600;
    text-align: center;
  }
  
  #mudakkik-result-panel .login-prompt {
    text-align: center;
    padding: 20px;
  }
  
  #mudakkik-result-panel .login-btn {
    display: inline-block;
    padding: 12px 24px;
    background: linear-gradient(135deg, #001246 0%, #002080 100%);
    color: white;
    text-decoration: none;
    border-radius: 10px;
    font-weight: 700;
    margin-top: 12px;
    transition: all 0.2s;
  }
  
  #mudakkik-result-panel .login-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 18, 70, 0.3);
  }
`;

// ===== Inject Styles =====
function injectStyles() {
  if (document.getElementById('mudakkik-styles')) return;
  const styleEl = document.createElement('style');
  styleEl.id = 'mudakkik-styles';
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);
}

// ===== Create Floating Button =====
function createFloatingButton() {
  if (floatingBtn) return floatingBtn;

  floatingBtn = document.createElement('button');
  floatingBtn.id = 'mudakkik-float-btn';
  floatingBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <path d="m9 12 2 2 4-4"/>
        </svg>
        تحقق
    `;

  floatingBtn.addEventListener('click', handleVerifyClick);
  document.body.appendChild(floatingBtn);

  return floatingBtn;
}

// ===== Create Result Panel =====
function createResultPanel() {
  if (resultPanel) return resultPanel;

  resultPanel = document.createElement('div');
  resultPanel.id = 'mudakkik-result-panel';
  resultPanel.innerHTML = `
        <div class="panel-header">
            <h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="m9 12 2 2 4-4"/>
                </svg>
                مُدَقِّق
            </h3>
            <button class="close-btn" id="mudakkik-close">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>
        <div class="panel-content" id="mudakkik-panel-content"></div>
    `;

  document.body.appendChild(resultPanel);

  document.getElementById('mudakkik-close').addEventListener('click', () => {
    resultPanel.style.display = 'none';
  });

  return resultPanel;
}

// ===== Show/Hide Floating Button =====
function showFloatingButton(x, y) {
  createFloatingButton();
  floatingBtn.style.left = `${x}px`;
  floatingBtn.style.top = `${y}px`;
  floatingBtn.style.display = 'flex';
}

function hideFloatingButton() {
  if (floatingBtn) {
    floatingBtn.style.display = 'none';
  }
}

// ===== Handle Text Selection =====
document.addEventListener('mouseup', (e) => {
  // Ignore if clicking on our elements
  if (e.target.closest('#mudakkik-float-btn') || e.target.closest('#mudakkik-result-panel')) {
    return;
  }

  setTimeout(() => {
    const selection = window.getSelection();
    const text = selection.toString().trim();

    if (text && text.length >= 10) {
      selectedText = text;
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      showFloatingButton(
        rect.left + window.scrollX + (rect.width / 2) - 40,
        rect.bottom + window.scrollY + 10
      );
    } else {
      hideFloatingButton();
    }
  }, 10);
});

// Hide button when clicking elsewhere
document.addEventListener('mousedown', (e) => {
  if (!e.target.closest('#mudakkik-float-btn') && !e.target.closest('#mudakkik-result-panel')) {
    hideFloatingButton();
  }
});

// ===== Handle Verify Click =====
async function handleVerifyClick() {
  hideFloatingButton();
  createResultPanel();

  const content = document.getElementById('mudakkik-panel-content');
  resultPanel.style.display = 'block';

  // Show loading
  content.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <span>جاري التحليل...</span>
        </div>
    `;

  // Get token from storage
  const { token } = await chrome.storage.local.get('token');

  if (!token) {
    showLoginPrompt(content);
    return;
  }

  try {
    const response = await chrome.runtime.sendMessage({
      action: 'verifyNews',
      text: selectedText,
      token: token,
      period: 3
    });

    if (!response.success) {
      if (response.status === 401) {
        await chrome.storage.local.remove('token');
        showLoginPrompt(content, "جلسة منتهية، يرجى إعادة تسجيل الدخول");
        return;
      }
      throw new Error(response.message || 'فشل في التحقق');
    }

    renderResult(response.data.result);

  } catch (error) {
    content.innerHTML = `<div class="error-msg">${error.message}</div>`;
  }
}

function showLoginPrompt(container, message = "يجب تسجيل الدخول أولاً") {
  container.innerHTML = `
        <div class="login-prompt">
            <p style="color: #64748b; margin-bottom: 12px; font-weight: 500;">${message}</p>
            <a href="${API_URL.replace('/api', '/login')}" target="_blank" class="login-btn">
                تسجيل الدخول
            </a>
        </div>
    `;
}

// ===== Render Result =====
function renderResult(data) {
  const content = document.getElementById('mudakkik-panel-content');
  const confidence = parseInt(data.verdict.confidence) || 0;

  let verdictClass = 'neutral';
  if (confidence >= 70) verdictClass = 'true';
  else if (confidence < 40) verdictClass = 'false';

  let sourcesHtml = '';
  if (data.sources && data.sources.length > 0) {
    sourcesHtml = data.sources.map(src => `
            <a href="${src.url}" target="_blank" rel="noopener" class="source-link">
                ${src.title || new URL(src.url).hostname}
            </a>
        `).join('');
  } else {
    sourcesHtml = '<p style="color: #64748b; text-align: center; font-size: 13px;">لم يتم العثور على مصادر</p>';
  }

  content.innerHTML = `
        <div class="selected-text">"${selectedText}"</div>
        
        <div class="verdict-box ${verdictClass}">
            <div class="percentage">${confidence}%</div>
            <div class="verdict-label">${data.verdict.label}</div>
            <p class="verdict-summary">${data.verdict.summary}</p>
        </div>
        
        <div class="sources-section">
            <h4>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                المصادر
            </h4>
            ${sourcesHtml}
        </div>
    `;
}

// ===== Listen for messages from popup =====
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSelectedText') {
    sendResponse({ text: window.getSelection().toString().trim() });
  }
  return true;
});

// ===== Initialize =====
injectStyles();