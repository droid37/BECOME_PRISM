// BECOME PRISM v1.0: Background Service Worker (The Silent Worker)
// Handles downloads with Smart Folder Logic and hotkeys

console.log("BECOME PRISM Service Worker is alive and silent.");

// Default icon and title
// Use object format matching manifest.json structure
const DEFAULT_ICON = {
  16: 'assets/eye_logo.png',
  32: 'assets/eye_logo.png',
  48: 'assets/eye_logo.png',
  128: 'assets/eye_logo.png'
};
const DEFAULT_TITLE = 'BECOME PRISM - The Sentient Eye';

// Oracle's Whisper state
let whisperActive = false;
let iconAnimationInterval: number | null = null;
let currentTabId: number | null = null;

chrome.runtime.onInstalled.addListener(() => {
  // One-time setup if needed
  chrome.action.setIcon({ path: DEFAULT_ICON }, () => {
    if (chrome.runtime.lastError) {
      console.error('[PRISM] Icon set error:', chrome.runtime.lastError);
    }
  });
  chrome.action.setTitle({ title: DEFAULT_TITLE });
});

// Hotkey Handler: Open popup when Ctrl+Shift+Space is pressed
chrome.commands.onCommand.addListener((command) => {
  if (command === '_execute_action') {
    chrome.action.openPopup();
  }
});

// Smart Folder Logic: Listen for saveFile messages
chrome.runtime.onMessage.addListener((
  message: { action: string; content?: string; title?: string; project?: string },
  _sender: chrome.runtime.MessageSender,
  sendResponse: (_response: { success: boolean }) => void
) => {
  if (message.action === 'saveFile') {
    if (!message.content || !message.title) {
      sendResponse({ success: false });
      return;
    }

    // Smart Folder Logic: BECOME_PRISM/[Project]/[Title].md
    const project = message.project?.trim() || '';
    const safeTitle = message.title.replace(/[\\/:*?"<>|]/g, '_');
    
    let filename: string;
    if (project) {
      filename = `BECOME_PRISM/${project}/${safeTitle}.md`;
    } else {
      filename = `BECOME_PRISM/${safeTitle}.md`;
    }

    // Convert content to data URL
    const dataUrl = `data:text/markdown;charset=utf-8,${encodeURIComponent(message.content)}`;

    chrome.downloads.download({
      url: dataUrl,
      filename: filename,
      saveAs: false
    }, (_downloadId) => {
      if (chrome.runtime.lastError) {
        console.error('[PRISM] Download error:', chrome.runtime.lastError);
        sendResponse({ success: false });
      } else {
        sendResponse({ success: true });
      }
    });

    return true; // Keep channel open for async response
  }

  return false;
});

// ============================================
// The Oracle's Whisper: Proactive Nudge System
// ============================================

function resetOracleState() {
  whisperActive = false;
  if (iconAnimationInterval !== null) {
    clearInterval(iconAnimationInterval);
    iconAnimationInterval = null;
  }
  chrome.action.setIcon({ path: DEFAULT_ICON }, () => {
    if (chrome.runtime.lastError) {
      console.error('[PRISM] Icon reset error:', chrome.runtime.lastError);
    }
  });
  chrome.action.setTitle({ title: DEFAULT_TITLE });
  chrome.action.setBadgeText({ text: '' }); // Clear badge
}

function startIconGlowAnimation() {
  if (iconAnimationInterval !== null) return; // Already animating
  
  let frame = 0;
  iconAnimationInterval = window.setInterval(() => {
    // Use badge animation for visual feedback (more reliable than icon swapping)
    // The pulsing badge provides clear visual indication
    frame++;
    if (frame % 2 === 0) {
      chrome.action.setBadgeText({ text: '●' });
      chrome.action.setBadgeBackgroundColor({ color: '#ffd700' });
    } else {
      chrome.action.setBadgeText({ text: '' });
    }
  }, 400); // Pulse every 400ms
}

function triggerOracleWhisper() {
  if (whisperActive) return; // Already whispering
  
  whisperActive = true;
  
  // Start icon glow animation
  startIconGlowAnimation();
  
  // Set suggestive tooltip
  chrome.action.setTitle({
    title: 'This seems important. Shall I preserve its essence?'
  });
  
  console.log('[PRISM Oracle] Whispering to user...');
}

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only process complete page loads
  if (changeInfo.status !== 'complete') return;
  
  // Ignore chrome:// and extension pages
  if (!tab.url || tab.url.startsWith('chrome://') || 
      tab.url.startsWith('chrome-extension://') ||
      tab.url.startsWith('edge://') ||
      tab.url === 'about:blank') {
    return;
  }
  
  // Cancel any existing alarm
  chrome.alarms.clear('oracle-whisper');
  
  // Reset state if user navigated away
  if (currentTabId !== null && currentTabId !== tabId) {
    resetOracleState();
  }
  
  currentTabId = tabId;
  
  // Create alarm for 1 minute
  chrome.alarms.create('oracle-whisper', { delayInMinutes: 1 });
  console.log('[PRISM Oracle] Timer started for tab:', tabId);
});

// Listen for tab activation (switching tabs)
chrome.tabs.onActivated.addListener((activeInfo) => {
  // Cancel alarm if user switched tabs
  chrome.alarms.clear('oracle-whisper');
  
  // Reset state if user switched away
  if (currentTabId !== null && currentTabId !== activeInfo.tabId) {
    resetOracleState();
  }
  
  currentTabId = activeInfo.tabId;
});

// Listen for alarm (1 minute has passed)
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'oracle-whisper') {
    // Check if tab is still active
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0 && tabs[0].id === currentTabId) {
        triggerOracleWhisper();
      }
    });
  }
});

// Reset when user clicks the action icon
chrome.action.onClicked.addListener(() => {
  resetOracleState();
  console.log('[PRISM Oracle] State reset by user click');
});

// Also reset when popup opens (user is engaging)
chrome.runtime.onMessage.addListener((
  message: { action: string },
  _sender: chrome.runtime.MessageSender,
  _sendResponse: () => void
) => {
  if (message.action === 'popup-opened') {
    resetOracleState();
  }
  return false;
});
