import React, { useState, useEffect } from "react";
import "./App.css";

const App: React.FC = () => {
  const [seconds, setSeconds] = useState(30);
  const [isEnabled, setIsEnabled] = useState(false);
  const [extensionRunning, setExtensionRunning] = useState(true);

  useEffect(() => {
    chrome.storage.local.get(
      ["seconds", "isEnabled", "extensionRunning"],
      (result) => {
        if (result.seconds !== undefined) setSeconds(result.seconds);
        if (result.isEnabled !== undefined) setIsEnabled(result.isEnabled);
        if (result.extensionRunning !== undefined)
          setExtensionRunning(result.extensionRunning);
      }
    );
  }, []);

  useEffect(() => {
    chrome.storage.local.set({ seconds, isEnabled, extensionRunning });
  }, [seconds, isEnabled, extensionRunning]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setIsEnabled(checked);

    if (checked && extensionRunning && seconds > 0) {
      chrome.alarms.create("reloadAlarm", {
        delayInMinutes: seconds / 60,
        periodInMinutes: seconds / 60,
      });
    } else {
      chrome.alarms.clear("reloadAlarm");
    }
  };

  const handleExtensionToggle = () => {
    const shouldRun = !extensionRunning;
    setExtensionRunning(shouldRun);

    chrome.storage.local.set({ extensionRunning: !extensionRunning });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0 && tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          extensionRunning: !extensionRunning,
        });
      }
    });

    if (!shouldRun) {
      chrome.alarms.clear("reloadAlarm");
    } else if (shouldRun && isEnabled && seconds > 0) {
      chrome.alarms.create("reloadAlarm", {
        delayInMinutes: seconds / 60,
        periodInMinutes: seconds / 60,
      });
    }
  };

  return (
    <div className="content">
      <div className="row1">
        <input
          type="number"
          className="number"
          value={seconds}
          min="5"
          onChange={(e) => {
            const sec = Number(e.target.value);
            setSeconds(sec >= 5 ? sec : 5);
          }}
        />
        <button onClick={handleExtensionToggle}>
          {extensionRunning ? "Stop" : "Start"}
        </button>
      </div>
      <div className="checkboxContent">
        <div className="timerLabel">Enable Timer:</div>
        <input
          type="checkbox"
          className="checkbox"
          checked={isEnabled}
          onChange={handleCheckboxChange}
        />
      </div>
      <div style={{ color: extensionRunning ? "green" : "red" }}>
        Status: {extensionRunning ? "Active" : "Inactive"}
      </div>
    </div>
  );
};

export default App;
