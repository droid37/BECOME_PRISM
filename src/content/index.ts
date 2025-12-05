// src/content/index.ts

// This script runs in the context of the webpage
// It extracts content based on the action requested by the popup

// Function to extract content from ChatGPT
function extractFromChatGPT(): { title: string; content: string } | null {
  const titleElement = document.querySelector('div[class*="group"] button[class*="items-center"]');
  const contentElement = document.querySelector('div[class*="react-scroll-to-bottom"]');

  if (titleElement && contentElement) {
    return {
      title: titleElement.textContent?.trim() || 'ChatGPT Conversation',
      content: contentElement.innerHTML,
    };
  }
  return null;
}

// Function to extract content from Google AI Studio
function extractFromGoogleAIStudio(): { title:string; content: string } | null {
  // **[GROUND TRUTH FIX - DIRECT INJECTION]**
  // Targeting based on verified data-testid attributes.
  const titleElement = document.querySelector('h2[data-testid="context-panel-title"]');
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

// Function to extract content from Claude.ai
function extractFromClaudeAI(): { title: string; content: string } | null {
  const titleElement = document.querySelector('h2[data-testid="conversation-title"]');
  const contentElement = document.querySelector('div[data-testid="conversation-main"]');

  if (titleElement && contentElement) {
    return {
      title: titleElement.textContent?.trim() || 'Claude Conversation',
      content: contentElement.innerHTML,
    };
  }
  return null;
}

// Generic content extraction (fallback)
function extractGenericContent(): { title: string; content: string } {
  const title = document.title;
  const mainContent = document.querySelector('main, article, #content, #main');
  const content = mainContent ? mainContent.innerHTML : document.body.innerHTML;
  return { title, content };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extract') {
    let extractedData: { title: string; content: string } | null = null;
    const hostname = window.location.hostname;

    if (hostname.includes('openai.com')) {
      extractedData = extractFromChatGPT();
    } else if (hostname.includes('aistudio.google.com')) {
      extractedData = extractFromGoogleAIStudio();
    } else if (hostname.includes('claude.ai')) {
      extractedData = extractFromClaudeAI();
    }

    if (!extractedData) {
      extractedData = extractGenericContent();
    }

    if (extractedData) {
      sendResponse({ success: true, ...extractedData, url: window.location.href });
    } else {
      sendResponse({ success: false, error: 'Content extraction failed completely.' });
    }
    return true;
  }
});