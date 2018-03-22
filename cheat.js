async function cheat(wpm = 90) {
    const elem = document.querySelector('[id^="gwt-uid-"] > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(1) > td > div > div');
    if (!elem) return new Error(`Goal element not found`);

    const goal = Array.from(elem.children)
        .filter((v) => v.tagName === 'SPAN')
        .map((v) => v.innerHTML)
        .join('');
        

    const input = document.getElementsByClassName('txtInput')[0];
    if (!input) return new Error(`Input element not found`);

    // Pause until input is enabled
    if (input.disabled) {
        await new Promise((resolve) => {
            const observer = new MutationObserver((mutations) => {
                mutations.find((m) => m.type === 'attributes' && m.attributeName === 'disabled');
                observer.disconnect();
                resolve();
            });
    
            observer.observe(input, { attributes: true, attributeFilter: ['disabled'] });
        });
    }
    
    const AVG_WORD_LEN = 5;
    const interval = 60 * 1000 / wpm / AVG_WORD_LEN;
    for (let i = 0; i < goal.length; ++i) {
        input.value += goal[i];
        input.dispatchEvent(new Event('keydown'));
        await new Promise(resolve => setTimeout(resolve, interval));
    }

    return { goal, input };
}
