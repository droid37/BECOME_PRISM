// --- BECOME PRISM: The Minimalist Spy (Content Script) ---
// SINGLE PURPOSE: Extract raw content from webpage and return it to popup
// NO UI, NO SHADOW DOM, NO CSS INJECTION - Pure data extraction only

console.log('BECOME PRISM: Content script loaded (Minimalist Spy)');

// ============================================
// 4-TIER INVINCIBLE EXTRACTION
// ============================================

// Tier 1: User Selection
function getSelectedText(): string | null {
  const selection = window.getSelection();
  if (selection && selection.toString().trim().length > 10) {
    return selection.toString().trim();
  }
  return null;
}

// Tier 2: Deep Targeting (Specific selectors for common content areas)
function extractWithSelectors(): string | null {
  const selectors = [
    'article',
    'main',
    '[role="article"]',
    '[role="main"]',
    '.content',
    '.post',
    '.message',
    '.chat-message',
    'div[role="presentation"]'
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      const text = element.innerText || element.textContent || '';
      if (text.trim().length > 50) {
        return element.innerHTML;
      }
    }
  }
  return null;
}

// Tier 3: TreeWalker (The Drill) - Extract all visible text nodes
function extractWithTreeWalker(): string {
  const noiseTags = ['NAV', 'FOOTER', 'HEADER', 'SCRIPT', 'STYLE', 'BUTTON', 'ASIDE'];
  const noiseClasses = ['nav', 'footer', 'header', 'sidebar', 'menu', 'toolbar', 'ad', 'advertisement', 'icon', 'avatar', 'timestamp'];
  
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node: Node) => {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        
        // Filter out noise tags
        if (noiseTags.includes(parent.tagName)) {
          return NodeFilter.FILTER_REJECT;
        }
        
        // Filter out noise classes
        const classList = parent.classList;
        for (const noiseClass of noiseClasses) {
          if (classList.contains(noiseClass)) {
            return NodeFilter.FILTER_REJECT;
          }
        }
        
        // Only accept visible text nodes
        const style = window.getComputedStyle(parent);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
          return NodeFilter.FILTER_REJECT;
        }
        
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  const textNodes: string[] = [];
  let node: Node | null;
  while (node = walker.nextNode()) {
    const text = node.textContent?.trim();
    if (text && text.length > 0) {
      textNodes.push(text);
    }
  }

  return textNodes.join('\n\n');
}

// Tier 4: Nuclear Option - document.body.innerText
function extractNuclear(): string {
  return document.body.innerText || '';
}

// Platform-Specific Extraction: Google AI Studio
function extractFromGoogleAIStudio(): { title: string; content: string } | null {
  // **[FINAL SNIPE]**
  // Targeting the `a.prompt-link` as per the ground truth evidence.
  const titleElement = document.querySelector('a.prompt-link');
  const contentElement = document.querySelector('div.message-container');

  if (titleElement && contentElement) {
    const titleText = titleElement.textContent?.trim() || 'AI Studio Prompt';
    return {
      title: titleText,
      content: contentElement.innerHTML,
    };
  }
  return null;
}

// Main Extraction Function: 4-Tier Black Hole Strategy
function performExtraction(mode: 'full' | 'transplant' | 'code' | 'logic' | 'context'): { success: boolean; content?: string; error?: string; isHtml?: boolean; title?: string } {
  try {
    // Platform-Specific: Google AI Studio (Highest Priority for aistudio.google.com)
    const hostname = window.location.hostname;
    if (hostname.includes('aistudio.google.com')) {
      const aiStudioResult = extractFromGoogleAIStudio();
      if (aiStudioResult) {
        return {
          success: true,
          content: aiStudioResult.content,
          title: aiStudioResult.title,
          isHtml: true
        };
      }
    }

    // Tier 1: User Selection (Highest Priority)
    const selectedText = getSelectedText();
    if (selectedText) {
      if (mode === 'full') {
        // For full mode, try to get HTML from selection
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const container = document.createElement('div');
          container.appendChild(range.cloneContents());
          const html = container.innerHTML;
          if (html.trim().length > 0) {
            return { success: true, content: html, isHtml: true };
          }
        }
        return { success: true, content: selectedText, isHtml: false };
      } else {
        return { success: true, content: selectedText, isHtml: false };
      }
    }

    // Tier 2: Deep Targeting
    const selectorContent = extractWithSelectors();
    if (selectorContent && selectorContent.trim().length > 50) {
      return { success: true, content: selectorContent, isHtml: true };
    }

    // Tier 3: TreeWalker (The Drill)
    const treeWalkerText = extractWithTreeWalker();
    if (treeWalkerText.trim().length > 50) {
      if (mode === 'full') {
        // For full mode, try to get HTML
        const bodyClone = document.body.cloneNode(true) as HTMLElement;
        // Remove noise elements
        const noiseSelectors = 'nav, footer, header, script, style, button, aside, .nav, .footer, .header, .sidebar, .menu, .toolbar, .ad, .advertisement, .icon, .avatar, .timestamp';
        bodyClone.querySelectorAll(noiseSelectors).forEach(el => el.remove());
        const html = bodyClone.innerHTML;
        if (html.trim().length > 50) {
          return { success: true, content: html, isHtml: true };
        }
      }
      return { success: true, content: treeWalkerText, isHtml: false };
    }

    // Tier 4: Nuclear Option
    const nuclearText = extractNuclear();
    if (nuclearText.trim().length > 50) {
      if (mode === 'full') {
        // For full mode, return body HTML
        const bodyClone = document.body.cloneNode(true) as HTMLElement;
        const noiseSelectors = 'nav, footer, header, script, style, button, aside';
        bodyClone.querySelectorAll(noiseSelectors).forEach(el => el.remove());
        return { success: true, content: bodyClone.innerHTML, isHtml: true };
      }
      return { success: true, content: nuclearText, isHtml: false };
    }

    return { success: false, error: 'No content found' };
  } catch (error) {
    console.error('[PRISM] Extraction error:', error);
    return { success: false, error: 'Extraction failed' };
  }
}

// ============================================
// MESSAGE LISTENER: The Only Interface
// ============================================

chrome.runtime.onMessage.addListener((
  message: { action: string; mode?: 'full' | 'transplant' | 'code' | 'logic' | 'context' },
  _sender: chrome.runtime.MessageSender,
  sendResponse: (response: { success: boolean; content?: string; error?: string; isHtml?: boolean }) => void
) => {
  if (message.action === 'extract') {
    console.log('[PRISM] Extraction requested, mode:', message.mode);
    
    // Perform 4-Tier Extraction (transplant uses same logic as full)
    const extractionMode = message.mode === 'transplant' ? 'full' : (message.mode || 'full');
    const result = performExtraction(extractionMode);
    
    if (result.success && result.content) {
      console.log('[PRISM] Extraction successful, content length:', result.content.length);
      sendResponse({
        success: true,
        content: result.content,
        isHtml: result.isHtml || false
      });
    } else {
      console.error('[PRISM] Extraction failed:', result.error);
      sendResponse({
        success: false,
        error: result.error || 'No content found'
      });
    }
    
    return true; // Keep channel open for async response
  }
  
  return false;
});