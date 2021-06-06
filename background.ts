let words: string[] = ['parfum', 'fragrance', 'fragrance-free'];

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ words: words });
    console.log('Default words set');
})
