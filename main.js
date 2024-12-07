// Typing Animation
const phrases = ['a tinkerer', 'an engineer', 'a consultant', 'an aspiring entrepreneur'];
let currentPhraseIndex = 0;
const typedText = document.getElementById('typed-text');

async function typePhrase(phrase) {
    for (let i = 0; i <= phrase.length; i++) {
        typedText.textContent = phrase.substring(0, i);
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
    for (let i = phrase.length; i >= 0; i--) {
        typedText.textContent = phrase.substring(0, i);
        await new Promise(resolve => setTimeout(resolve, 50));
    }
}

async function animateTyping() {
    while (true) {
        await typePhrase(phrases[currentPhraseIndex]);
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
    }
}

// Start animation
animateTyping();