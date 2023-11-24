// popup.js
let currentChunk = 0;
let chunks = [];

document.getElementById("splitText").addEventListener("click", function() {
    let inputText = document.getElementById("inputText").value;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "splitText", text: inputText}, function(response) {
            if (response && response.result) {
                chunks = response.result;
                currentChunk = 0;
                if (chunks.length > 1) {
                    document.getElementById("copySection").innerText = `Copy Section 1/${chunks.length}`;
                    document.getElementById("copySection").style.display = 'block';
                } else if (chunks.length === 1) {
                    document.getElementById("copySection").innerText = `Copy Text`;
                    document.getElementById("copySection").style.display = 'block';
                } else {
                    document.getElementById("copySection").style.display = 'none';
                    console.error('Split text resulted in no chunks');
                }
            } else {
                console.error('No response or result from content script');
            }
        });
    });
});

document.getElementById("copySection").addEventListener("click", function() {
    let textToInsert = chunks[currentChunk];
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "insertText", text: textToInsert}, function(response) {
            currentChunk++;
            if (currentChunk < chunks.length) {
                document.getElementById("copySection").innerText = `Copy Section ${currentChunk + 1}/${chunks.length}`;
            } else {
                document.getElementById("copySection").style.display = 'none';
            }
        });
    });
});
