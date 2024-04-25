let isClickEnabled = true;

function clickButton() {
    if (!isClickEnabled) return;
    
    const iframe = document.querySelector('#cardashboardframe')
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
    const iframe2 = iframeDoc.querySelector('#leftpaneframe')
    const iframeDoc2 = iframe2.contentDocument || iframe2.contentWindow.document
    const button = iframeDoc2.querySelector('input[type="button"][value="Claim"]')
    
    console.log(button)

    if (button) {
        button.click();
    }
}

document.addEventListener('DOMContentLoaded', () => setTimeout(clickButton, 4000));

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.extensionRunning !== undefined) {
            isClickEnabled = request.extensionRunning;
            console.log(`Clicking is now ${isClickEnabled ? 'enabled' : 'disabled'}`);
        }
    }
);

chrome.storage.local.get(['extensionRunning'], function(result) {
    if (result.extensionRunning !== undefined) {
        isClickEnabled = result.extensionRunning;
    }
    setTimeout(clickButton, 4000);
});