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

// Carousel functionality
const carousel = document.querySelector('.carousel-inner');
const items = document.querySelectorAll('.carousel-item');
let currentIndex = 0;
let autoRotateInterval;

function updateCarousel() {
    carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % items.length;
    updateCarousel();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateCarousel();
}

function startAutoRotate() {
    autoRotateInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
}

function stopAutoRotate() {
    clearInterval(autoRotateInterval);
}

document.querySelector('.carousel-button.next').addEventListener('click', () => {
    stopAutoRotate();
    nextSlide();
    startAutoRotate();
});

document.querySelector('.carousel-button.prev').addEventListener('click', () => {
    stopAutoRotate();
    prevSlide();
    startAutoRotate();
});

// Start animations
animateTyping();
startAutoRotate();

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});