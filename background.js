chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    const url = new URL(changeInfo.url);

    // Handle YouTube watch videos
    if (url.hostname === 'www.youtube.com' && url.pathname === '/watch') {
      chrome.storage.sync.get(['redirectSetting', 'showRelatedVideosSetting'], (settings) => {
        const redirectSetting = settings.redirectSetting || 'never';
        const showRelatedVideosSetting = settings.showRelatedVideosSetting || 'never';

        if (redirectSetting === 'always') {
          const popupUrl = url.toString().replace(
            '/watch',
            '/watch_popup'
          ) + (url.search ? '&' : '?') + 'autoplay=1' +
          ((showRelatedVideosSetting == 'never') ? '&rel=0' : '');
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
      chrome.storage.sync.get(['redirectShortSetting', 'redirectSetting', 'showRelatedVideosSetting'], (settings) => {
        const redirectShortSetting = settings.redirectShortSetting || 'never';
        const redirectSetting = settings.redirectSetting || 'never';
        const showRelatedVideosSetting = settings.showRelatedVideosSetting || 'never';

        const popupUrl = url.toString().replace(
          '/shorts', 
          ((redirectSetting === 'always') ? '/embed' : '/watch')
        ) + (url.search ? '&' : '?') + 'autoplay=1' +
        ((showRelatedVideosSetting == 'never') ? '&rel=0' : '');

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
