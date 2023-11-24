// content.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "splitText") {
        let text = request.text;
        let chunks = [];
        const maxChunkSize = 4096; // Max characters for ChatGPT
        while (text.length > 0) {
            let chunk = text.slice(0, maxChunkSize);
            let lastSpace = chunk.lastIndexOf(' ');
            if (lastSpace > -1 && text.length > maxChunkSize) {
                chunk = chunk.slice(0, lastSpace);
            }
            chunks.push(chunk);
            text = text.slice(chunk.length);
        }
        sendResponse({result: chunks});
    } else if (request.action === "insertText") {
        // Find the ChatGPT chat field and insert text
        let chatField = document.querySelector('#prompt-textarea');
        let sendButton = document.querySelector('[data-testid="send-button"]');
        if (chatField && sendButton) {
            chatField.value = request.text;
            // Trigger any necessary events (like 'input' or 'change')
            let event = new Event('input', { bubbles: true });
            chatField.dispatchEvent(event);

            // Click the send button
            sendButton.click();

            sendResponse({status: "Text inserted and sent"});
        } else {
            sendResponse({error: "Chat field or send button not found"});
        }
    }
    return true; // Keeps the message channel open for asynchronous sendResponse
});
