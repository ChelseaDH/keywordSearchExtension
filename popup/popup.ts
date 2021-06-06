import {getAndSearchResponse, FoundWord} from "../content/content";

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0].id === undefined) return;

        chrome.tabs.sendMessage(tabs[0].id, {method: 'getAndSearchForWords'}, (response: getAndSearchResponse) => {
            if (response === undefined) {
                throw new Error('Response was undefined')
            }

            let contentContainer = document.getElementById('contentContainer');
            if (!contentContainer) {
                throw new Error('Content container not found');
            }

            let wordsContainer = document.getElementById('wordsContainer');
            if (!wordsContainer) {
                throw new Error('Words container not found');
            }

            if (response.words.length === 0) {
                const p = document.createElement('p');
                const noWordsFoundContent = document.createTextNode('No words found to search for!')
                p.appendChild(noWordsFoundContent);
                wordsContainer.appendChild(p);
                return;
            }

            response.words.map((word: string) => {
                const li = document.createElement('li');
                const content = document.createTextNode(word);

                li.appendChild(content);
                // @ts-ignore
                wordsContainer.appendChild(li);
            })

            if ((!response.foundWords || response.foundWords.length === 0)) {
                return;
            }

            const resultsContainer = createResultsContainer(response.foundWords);
            contentContainer.appendChild(resultsContainer);
        })
 })

 function createResultsContainer(results: FoundWord[]): HTMLElement  {
     const resultsContainer = document.createElement('div');
     resultsContainer.id = 'resultsContainer';
     const title = document.createTextNode('Found:');
     resultsContainer.appendChild(title);

     for (let i = 0; i < results.length; i++) {
         const foundWord = results[i];
         if (foundWord.count > 0) {
             const li = document.createElement('li');
             const content = document.createTextNode(`${foundWord.word} found ${foundWord.count} times`);
             li.appendChild(content);
             resultsContainer.appendChild(li);
         }
     }

     return resultsContainer;
 }