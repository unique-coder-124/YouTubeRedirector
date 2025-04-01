chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    const url = new URL(changeInfo.url);

    // Handle YouTube watch videos
    if (url.hostname === 'www.youtube.com' && url.pathname === '/watch') {
      chrome.storage.sync.get(['redirectSetting'], (settings) => {
        const redirectSetting = settings.redirectSetting || 'never';

        if (redirectSetting === 'always') {
          const popupUrl = url.toString().replace('/watch', '/watch_popup') + (url.search ? '&' : '?') + 'autoplay=1';
          chrome.scripting.executeScript({
            target: { tabId },
            func: redirectAndPopHistory,
            args: [popupUrl]
          });
        } else if (redirectSetting === 'ask') {
          chrome.scripting.executeScript({
            target: { tabId },
            func: askUserRedirect,
            args: [url.toString().replace('/watch', '/watch_popup') + (url.search ? '&' : '?') + 'autoplay=1']
          });
        }
      });
    }

    // Handle YouTube shorts
    if (url.hostname === 'www.youtube.com' && url.pathname.startsWith('/shorts')) {
      chrome.storage.sync.get(['redirectShortSetting', 'redirectSetting'], (settings) => {
        const redirectShortSetting = settings.redirectShortSetting || 'never';
        const redirectSetting = settings.redirectSetting || 'never';

        const popupUrl = redirectSetting === 'always'
          ? url.toString().replace('/shorts', '/embed') + (url.search ? '&' : '?') + 'autoplay=1'
          : url.toString().replace('/shorts', '/watch') + (url.search ? '&' : '?') + 'autoplay=1';

        if (redirectShortSetting === 'always') {
          chrome.scripting.executeScript({
            target: { tabId },
            func: redirectAndPopHistory,
            args: [popupUrl]
          });
        } else if (redirectShortSetting === 'ask') {
          chrome.scripting.executeScript({
            target: { tabId },
            func: askUserRedirect,
            args: [popupUrl]
          });
        }
      });
    }
  }
});

// Function to ask user for confirmation
function askUserRedirect(redirectUrl) {
  if (confirm('Do you want to redirect this video to popup mode?')) {
    window.location.href = redirectUrl;
  }
}

function redirectAndPopHistory(newUrl) {
  history.replaceState(null, "", newUrl); // Replaces the last entry without going back
  window.location.href = newUrl;
}
