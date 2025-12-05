// --- BECOME PRISM v1.0: The Minimalist Spy (Content Script) ---
// ONLY extracts raw data. No UI. No libraries. Pure extraction.

console.log('BECOME PRISM: Content script loaded (The Minimalist Spy)');

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

// Tier 2: Deep Targeting
function extractWithSelectors(): { html: string; text: string } | null {
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
        return { html: element.innerHTML, text };
      }
    }
  }
  return null;
}

// Tier 3: TreeWalker (The Drill)
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
        
        if (noiseTags.includes(parent.tagName)) {
          return NodeFilter.FILTER_REJECT;
        }
        
        const classList = parent.classList;
        for (const noiseClass of noiseClasses) {
          if (classList.contains(noiseClass)) {
            return NodeFilter.FILTER_REJECT;
          }
        }
        
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
  while ((node = walker.nextNode())) {
    const text = node.textContent?.trim();
    if (text && text.length > 0) {
      textNodes.push(text);
    }
  }

  return textNodes.join('\n\n');
}

// Tier 4: Nuclear Option
function extractNuclear(): { html: string; text: string } {
  const bodyClone = document.body.cloneNode(true) as HTMLElement;
  const noiseSelectors = 'nav, footer, header, script, style, button, aside, .nav, .footer, .header, .sidebar, .menu, .toolbar, .ad, .advertisement, .icon, .avatar, .timestamp';
  bodyClone.querySelectorAll(noiseSelectors).forEach(el => el.remove());
  return { html: bodyClone.innerHTML, text: bodyClone.innerText || '' };
}

// ============================================
// DEEP SCRAPE PROTOCOL: Multi-Tiered Extraction
// ============================================

// Tier 1: Official Copy Button Strategy
async function tryOfficialCopyButton(): Promise<string | null> {
  // Common selectors for copy conversation buttons
  const copyButtonSelectors: string[] = [
    // ChatGPT
    'button[data-testid*="copy"]',
    'button[aria-label*="Copy"]',
    'button[aria-label*="copy"]',
    // Google AI Studio / Gemini
    '[data-testid="copy-button"]',
    'button[data-testid*="copy-conversation"]',
    // Claude
    'button[aria-label*="Copy conversation"]',
  ];
  
  // Also search by text content for buttons (more comprehensive)
  const allButtons = Array.from(document.querySelectorAll('button, [role="button"], a[role="button"]'));
  for (const button of allButtons) {
    const buttonElem = button as HTMLElement;
    const text = (buttonElem.textContent || buttonElem.innerText || button.getAttribute('aria-label') || '').toLowerCase();
    if (text.includes('copy conversation') || 
        text.includes('copy chat') ||
        text.includes('export conversation') ||
        text.includes('share conversation') ||
        (text.includes('export') && (text.includes('conversation') || text.includes('chat'))) ||
        (text.includes('copy') && (text.includes('all') || text.includes('full')))) {
      // Try this button directly
      try {
        if ((button as HTMLElement).offsetParent !== null) { // Check if visible
          console.log('[PRISM Deep Scrape] Found copy button by text:', text);
          
          (button as HTMLElement).click();
          await new Promise(resolve => setTimeout(resolve, 500));
          
          try {
            const clipboardText = await navigator.clipboard.readText();
            if (clipboardText && clipboardText.trim().length > 50) {
              console.log('[PRISM Deep Scrape] Successfully extracted via text-matched button');
              return clipboardText;
            }
          } catch (clipError) {
            // Continue to next button
          }
        }
      } catch (error) {
        // Continue to next button
      }
    }
  }

  for (const selector of copyButtonSelectors) {
    try {
      const button = document.querySelector(selector) as HTMLElement;
      
      if (button && button.offsetParent !== null) { // Check if visible
        console.log('[PRISM Deep Scrape] Found copy button');
        
        // Click the button
        button.click();
        
        // Wait a bit for clipboard to update
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Read from clipboard
        try {
          const clipboardText = await navigator.clipboard.readText();
          if (clipboardText && clipboardText.trim().length > 50) {
            console.log('[PRISM Deep Scrape] Successfully extracted via official button');
            return clipboardText;
          }
        } catch (clipError) {
          console.log('[PRISM Deep Scrape] Clipboard read failed, trying next method');
        }
      }
    } catch (error) {
      // Continue to next selector
      continue;
    }
  }
  
  return null;
}

// Tier 2: Container Drill Strategy (X-Ray Vision)
function tryContainerDrill(): string | null {
  // Common selectors for conversation containers (ordered by specificity)
  const containerSelectors = [
    // ChatGPT - specific patterns
    'main > div > div > div.overflow-y-auto',
    'div[data-testid*="conversation"]',
    'div[role="presentation"] > div > div > div',
    'div[data-testid*="conversation-turn"]',
    // Google AI Studio / Gemini
    'div[data-message-author-role]',
    'div[role="log"]',
    'div[aria-live="polite"]',
    'div[data-message-id]',
    // Claude
    'div[data-testid*="conversation"]',
    'main > div > div',
    'div[class*="Message"]',
    // Generic chat containers
    'div.chat-container',
    'div.conversation',
    'div.messages',
    'div[class*="chat"]',
    'div[class*="conversation"]',
    'div[class*="message"]',
    // Fallback: find scrollable containers with substantial content
    'main',
    'article',
  ];

  for (const selector of containerSelectors) {
    try {
      const containers = document.querySelectorAll(selector);
      
      // Try all matching containers, pick the one with most content
      let bestContainer: HTMLElement | null = null;
      let maxLength = 0;
      
      for (let i = 0; i < containers.length; i++) {
        const container = containers[i] as HTMLElement;
        
        // X-Ray Vision: Try to expand collapsed content
        // Look for "Show more" or expand buttons within the container
        const expandButtons = container.querySelectorAll('button, [role="button"]');
        expandButtons.forEach((btn) => {
          const btnText = (btn.textContent || '').toLowerCase();
          if (btnText.includes('show more') || 
              btnText.includes('expand') ||
              btnText.includes('view more')) {
            try {
              (btn as HTMLElement).click();
            } catch (e) {
              // Ignore click errors
            }
          }
        });
        
        // Get content (innerText often contains all text, even non-rendered)
        const html = container.innerHTML || '';
        const text = container.innerText || container.textContent || '';
        const contentLength = Math.max(html.length, text.length);
        
        if (contentLength > maxLength && contentLength > 100) {
          maxLength = contentLength;
          bestContainer = container;
        }
      }
      
      if (bestContainer) {
        console.log('[PRISM Deep Scrape] Found container via:', selector);
        
        // X-Ray Vision: innerText often contains full content even if not visible
        // Try to get HTML first for better formatting
        const html = bestContainer.innerHTML;
        if (html && html.trim().length > 100) {
          return html;
        }
        
        // Fallback to text if HTML is not available
        // innerText is key here - it often includes non-rendered virtual scroll content
        const text = bestContainer.innerText || bestContainer.textContent || '';
        if (text.trim().length > 100) {
          return text;
        }
      }
    } catch (error) {
      continue;
    }
  }
  
  return null;
}

// ============================================
// EXTRACTION MODES
// ============================================

async function extractFull(): Promise<string> {
  // DEEP SCRAPE PROTOCOL: Tier 1 - Official Copy Button
  try {
    const officialCopy = await tryOfficialCopyButton();
    if (officialCopy) {
      return officialCopy;
    }
  } catch (error) {
    console.log('[PRISM Deep Scrape] Tier 1 failed, trying Tier 2');
  }

  // DEEP SCRAPE PROTOCOL: Tier 2 - Container Drill
  const containerResult = tryContainerDrill();
  if (containerResult && containerResult.trim().length > 100) {
    return containerResult;
  }

  // DEEP SCRAPE PROTOCOL: Tier 3 - Visible Fallback (Original Logic)
  // Tier 1: User Selection
  const selectedText = getSelectedText();
  if (selectedText) {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const container = document.createElement('div');
      container.appendChild(range.cloneContents());
      const html = container.innerHTML;
      if (html.trim().length > 0) {
        return html;
      }
    }
  }

  // Tier 2: Deep Targeting
  const selectorResult = extractWithSelectors();
  if (selectorResult && selectorResult.html.trim().length > 50) {
    return selectorResult.html;
  }

  // Tier 3: TreeWalker
  const treeWalkerText = extractWithTreeWalker();
  if (treeWalkerText.trim().length > 50) {
    const bodyClone = document.body.cloneNode(true) as HTMLElement;
    const noiseSelectors = 'nav, footer, header, script, style, button, aside, .nav, .footer, .header, .sidebar, .menu, .toolbar, .ad, .advertisement, .icon, .avatar, .timestamp';
    bodyClone.querySelectorAll(noiseSelectors).forEach(el => el.remove());
    const html = bodyClone.innerHTML;
    if (html.trim().length > 50) {
      return html;
    }
  }

  // Tier 4: Nuclear Option
  const nuclear = extractNuclear();
  return nuclear.html;
}

function extractCode(): string {
  const codeElements = document.querySelectorAll('pre, code');
  const codeBlocks: string[] = [];
  
  codeElements.forEach((el) => {
    const text = el.textContent?.trim() || '';
    if (text.length > 0) {
      codeBlocks.push(text);
    }
  });
  
  if (codeBlocks.length === 0) {
    throw new Error('No code blocks found');
  }
  
  return codeBlocks.join('\n\n---\n\n');
}

function extractSoul(): string {
  let mainHtml = '';
  
  const selectorResult = extractWithSelectors();
  if (selectorResult && selectorResult.html.trim().length > 50) {
    mainHtml = selectorResult.html;
  } else {
    const treeWalkerText = extractWithTreeWalker();
    if (treeWalkerText.trim().length > 50) {
      const bodyClone = document.body.cloneNode(true) as HTMLElement;
      const noiseSelectors = 'nav, footer, header, script, style, button, aside, .nav, .footer, .header, .sidebar, .menu, .toolbar, .ad, .advertisement, .icon, .avatar, .timestamp';
      bodyClone.querySelectorAll(noiseSelectors).forEach(el => el.remove());
      mainHtml = bodyClone.innerHTML;
    } else {
      const nuclear = extractNuclear();
      mainHtml = nuclear.html;
    }
  }
  
  if (!mainHtml || mainHtml.trim().length === 0) {
    throw new Error('No content found');
  }
  
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = mainHtml;
  tempDiv.querySelectorAll('pre, code').forEach(el => el.remove());
  
  const text = tempDiv.innerText || tempDiv.textContent || '';
  const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);
  
  if (paragraphs.length === 0) {
    throw new Error('No context found');
  }
  
  if (paragraphs.length > 6) {
    const firstThree = paragraphs.slice(0, 3);
    const lastThree = paragraphs.slice(-3);
    return [...firstThree, '...', ...lastThree].join('\n\n');
  }
  
  return paragraphs.join('\n\n');
}

// ============================================
// MESSAGE LISTENER: The Only Interface
// ============================================

chrome.runtime.onMessage.addListener((
  message: { action: string; mode?: 'preserve' | 'transplant' | 'dna' | 'soul' },
  _sender: chrome.runtime.MessageSender,
  sendResponse: (_response: { success: boolean; content?: string; error?: string; title?: string; isHtml?: boolean }) => void
) => {
  if (message.action !== 'extract') {
    return false;
  }

  console.log('[PRISM] Extraction requested, mode:', message.mode);

  // Handle async extraction
  (async () => {
    try {
      let content: string;
      const title = document.title || 'Untitled';

      switch (message.mode) {
        case 'preserve':
          content = await extractFull();
          sendResponse({
            success: true,
            content: content,
            title: title,
            isHtml: true
          });
          break;

        case 'transplant':
          content = await extractFull();
          sendResponse({
            success: true,
            content: content,
            title: title,
            isHtml: true
          });
          break;

        case 'dna':
          content = extractCode();
          sendResponse({
            success: true,
            content: content,
            title: title,
            isHtml: false
          });
          break;

        case 'soul':
          content = extractSoul();
          sendResponse({
            success: true,
            content: content,
            title: title,
            isHtml: false
          });
          break;

        default:
          throw new Error(`Unknown mode: ${message.mode}`);
      }

    } catch (error) {
      console.error('[PRISM] Extraction failed:', error);
      sendResponse({
        success: false,
        error: error instanceof Error ? error.message : 'Extraction failed'
      });
    }
  })();

  return true; // Keep channel open for async response
});
