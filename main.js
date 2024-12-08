// Typing Animation
const typingText = document.getElementById('typing-text');
const words = ['a tinkerer', 'an engineer', 'a consultant', 'an aspiring entrepreneur'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let isWaiting = false;

function type() {
    const currentWord = words[wordIndex];
    const shouldDelete = isDeleting && charIndex > 0;
    const shouldWrite = !isDeleting && charIndex < currentWord.length;

    if (shouldDelete) {
        typingText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else if (shouldWrite) {
        typingText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    } else if (!isWaiting) {
        isWaiting = true;
        setTimeout(() => {
            isDeleting = !isDeleting;
            if (!isDeleting) {
                wordIndex = (wordIndex + 1) % words.length;
            }
            isWaiting = false;
        }, isDeleting ? 200 : 1000);
    }

    setTimeout(type, isDeleting ? 100 : 200);
}

// Start typing animation
type();

// Carousel functionality
const carousel = document.querySelector('.carousel');
const slides = document.querySelectorAll('.carousel-slide');
const prevButton = document.querySelector('.carousel-button.prev');
const nextButton = document.querySelector('.carousel-button.next');
let currentSlide = 0;
let autoplayInterval;

function updateCarousel() {
    const offset = -currentSlide * 100;
    carousel.style.transform = `translateX(${offset}%)`;
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    updateCarousel();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateCarousel();
}

// Event listeners for buttons
nextButton.addEventListener('click', () => {
    nextSlide();
    resetAutoplay();
});

prevButton.addEventListener('click', () => {
    prevSlide();
    resetAutoplay();
});

// Autoplay functionality
function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 5000);
}

function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
}

startAutoplay();

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});