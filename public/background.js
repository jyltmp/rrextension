chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'reloadAlarm') {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs.length > 0 && tabs[0].id !== undefined) {
        chrome.tabs.reload(tabs[0].id);
      } else {
        console.log("No active tabs found in the current window.");
      }
    });
  }
});