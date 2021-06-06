export interface getWordsResponse {
    words: string[]
}

export interface FoundWord {
    word: string,
    count: number
}

export interface getAndSearchResponse {
    words: string[],
    foundWords: FoundWord[]
}

chrome.runtime.onMessage.addListener(
    function (request, _sender, sendResponse) {
        console.log(request);

        switch (request.method) {
            case 'getWords':
                chrome.storage.sync.get('words', ({ words }) => {
                    sendResponse({
                        words: words
                    })
                });

                break;

            case 'getAndSearchForWords':
                chrome.storage.sync.get( 'words', ({ words }) => {
                    let paras = document.body.getElementsByTagName('p');
                    let foundWordArray: FoundWord[] = [];
                    words.map((word: string) => {
                        let count = 0;
                        for (let i = 0; i < paras.length; i++) {
                            let index = paras[i].innerText.toLowerCase().indexOf(word);
                            if (index !== -1) {
                                console.log(`${word} found at index ${index}`);
                                count++;
                            }
                        }

                        foundWordArray.push({
                            word: word,
                            count: count
                        })
                    })

                    sendResponse({
                        words: words,
                        foundWords: foundWordArray
                    })
                });

                break;

            default:
                throw new Error('Request reason not defined');
        }

        return true;
    }
)