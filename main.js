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

// Image Carousel functionality
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

// Podcast Carousel functionality
document.addEventListener('DOMContentLoaded', function() {
    const podcastUrls = [
        'https://open.spotify.com/embed/episode/YOUR_PODCAST_ID_1',
        'https://open.spotify.com/embed/episode/YOUR_PODCAST_ID_2',
        'https://open.spotify.com/embed/episode/YOUR_PODCAST_ID_3'
        // Add more podcast URLs as needed
    ];
    
    let currentPodcastIndex = 0;
    const podcastEmbed = document.querySelector('.podcast-embed iframe');
    const podcastPrevButton = document.querySelector('.podcast-button.prev');
    const podcastNextButton = document.querySelector('.podcast-button.next');

    function updatePodcast() {
        podcastEmbed.src = podcastUrls[currentPodcastIndex];
    }

    if (podcastPrevButton && podcastNextButton && podcastEmbed) {
        podcastPrevButton.addEventListener('click', () => {
            currentPodcastIndex = (currentPodcastIndex - 1 + podcastUrls.length) % podcastUrls.length;
            updatePodcast();
        });

        podcastNextButton.addEventListener('click', () => {
            currentPodcastIndex = (currentPodcastIndex + 1) % podcastUrls.length;
            updatePodcast();
        });
    }
});