document.addEventListener('DOMContentLoaded', () => {
  const redirectDropdown = document.getElementById('redirect');
  const redirectShortDropdown = document.getElementById('redirect-short');
  const showRelatedVideosDropdown = document.getElementById('show-rel');
  const resetDefaultsButton = document.getElementById('resetDefaults');

  // Load saved settings
  chrome.storage.sync.get(['redirectSetting', 'redirectShortSetting', 'showRelatedVideosSetting'], (settings) => {
    redirectDropdown.value = settings.redirectSetting || 'ask'; // Default to 'ask'
    redirectShortDropdown.value = settings.redirectShortSetting || 'ask'; // Default to 'ask'
    showRelatedVideosDropdown.value = settings.showRelatedVideosSetting || 'never'; // Default to 'ask'
  });

  // Save settings on change and reset appropriate counter
  redirectDropdown.addEventListener('change', () => {
    chrome.storage.sync.set({ 
      redirectSetting: redirectDropdown.value,
    });
  });

  redirectShortDropdown.addEventListener('change', () => {
    chrome.storage.sync.set({ 
      redirectShortSetting: redirectShortDropdown.value,
    });
  });

  showRelatedVideosDropdown.addEventListener('change', () => {
    chrome.storage.sync.set({ 
      showRelatedVideosSetting: showRelatedVideosDropdown.value,
    });
  });

  // Reset to defaults
  resetDefaultsButton.addEventListener('click', () => {
    chrome.storage.sync.set({
      redirectSetting: 'ask',
      redirectShortSetting: 'ask',
      showRelatedVideosSetting: 'never',
    }, () => {
      redirectDropdown.value = 'ask';
      redirectShortDropdown.value = 'ask';
      showRelatedVideosDropdown.value = 'never';
    });
  });
});
