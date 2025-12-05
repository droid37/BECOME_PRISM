```javascript
// --- BECOME PRISM: The Sentient Spy v2 (Content Script) ---
// This script combines Platform-Aware Intelligence with the 4-Tier Invincible Extraction system.

console.log('BECOME PRISM: Content script loaded (Sentient Spy v2)');

// ============================================
// PLATFORM-AWARE INTELLIGENCE (Special Forces)
// ============================================

function extractFromGoogleAIStudio(): { title: string; content: string; isHtml: boolean } | null {
  const titleElement = document.querySelector('a.prompt-link');
  const contentElement = document.querySelector('div.message-container');
  if (titleElement && contentElement) {
    const titleText = titleElement.textContent?.trim() || 'AI Studio Prompt';
    console.log('[PRISM Spy] AI Studio Adapter: Success. Title found:', titleText);
    return { title: titleText, content: contentElement.innerHTML, isHtml: true };
  }
  return null;
}

function extractFromChatGPT(): { title: string; content: string; isHtml: boolean } | null {
  const titleElement = document.querySelector('div[class*="group"] button[class*="items-center"]');
  const contentElement = document.querySelector('div[class*="react-scroll-to-bottom"]');
  if (titleElement && contentElement) {
    const titleText = titleElement.textContent?.trim() || 'ChatGPT Conversation';
    console.log('[PRISM Spy] ChatGPT Adapter: Success. Title found:', titleText);
    return { title: titleText, content: contentElement.innerHTML, isHtml: true };
  }
  return null;
}

// ============================================
// 4-TIER INVINCIBLE EXTRACTION (Infantry)
// ============================================

function performInvincibleExtraction(): { content: string; isHtml: boolean } | null {
  console.log('[PRISM Spy] Invincible Extraction: Deploying 4-Tier system...');
  
  // Simplified for directness. We will primarily return innerHTML for Turndown.
  
  // Tier 2: Deep Targeting
  const selectors = ['article', 'main', '[role="main"]', '.post-content', '.content', '.main-content'];
  for (const selector of selectors) {
    const element = document.querySelector(selector) as HTMLElement;
    if (element && element.innerText.trim().length > 200) {
      console.log(`[PRISM Spy] Tier 2 Success: Found content in <${selector}>`);
      return { content: element.innerHTML, isHtml: true };
    }
  }

  // Tier 3 & 4 Combined: Cleaned Body HTML
  console.log('[PRISM Spy] Tier 2 Failed. Deploying Tier 3/4: Cleaned Body...');
  const bodyClone = document.body.cloneNode(true) as HTMLElement;
  // Remove noise elements
  const noiseSelectors = 'nav, footer, header, script, style, button, aside, .nav, .footer, .header, .sidebar, .menu, .toolbar, .ad, .advertisement, .icon, .avatar, .timestamp, [role="navigation"], [role="banner"]';
  bodyClone.querySelectorAll(noiseSelectors).forEach(el => el.remove());
  
  const cleanedHtml = bodyClone.innerHTML;
  if (cleanedHtml.trim().length > 100) {
     return { content: cleanedHtml, isHtml: true };
  }

  return null;
}

// ============================================
// MESSAGE LISTENER: The Command Center
// ============================================

chrome.runtime.onMessage.addListener((
  message: { action: string; mode?: string },
  _sender: chrome.runtime.MessageSender,
  sendResponse: (response: { success: boolean; content?: string; error?: string; isHtml?: boolean; title?: string; url?: string }) => void
) => {
  if (message.action === 'extract') {
    console.log('[PRISM] Extraction Command Received. Mode:', message.mode);
    
    let result: { title: string; content: string; isHtml: boolean } | null = null;
    const hostname = window.location.hostname;

    // 1. Try Platform-Specific Adapters first
    if (hostname.includes('aistudio.google.com')) {
      result = extractFromGoogleAIStudio();
    } else if (hostname.includes('openai.com')) {
      result = extractFromChatGPT();
    }

    // 2. If adapters fail, or it's a generic site, use the Invincible Extraction
    if (!result || !result.content) {
      console.log('[PRISM Spy] Platform adapter failed or not applicable. Engaging Invincible Extraction...');
      const fallbackResult = performInvincibleExtraction();
      if (fallbackResult && fallbackResult.content) {
        result = {
          title: document.title, // Use document title as fallback
          content: fallbackResult.content,
          isHtml: fallbackResult.isHtml
        };
      }
    }

    if (result && result.content) {
      console.log('[PRISM] Extraction successful. Title:', result.title);
      sendResponse({
        success: true,
        title: result.title,
        content: result.content,
        isHtml: result.isHtml,
        url: window.location.href
      });
    } else {
      console.error('[PRISM] All extraction methods failed.');
      sendResponse({ success: false, error: 'No meaningful content could be extracted.' });
    }
    
    return true; // Keep channel open for async response
  }
  return false;
});
```