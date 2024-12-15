// Typing Animation
const typingText = document.getElementById('typing-text');
const words = ['a builder', 'a tinkerer', 'a consultant', 'an aspiring entrepreneur'];
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

// Podcast Carousel functionality
document.addEventListener('DOMContentLoaded', function() {
    const podcastEmbeds = document.querySelectorAll('.podcast-embed');
    const podcastPrevButton = document.querySelector('.podcast-carousel .podcast-button.prev');
    const podcastNextButton = document.querySelector('.podcast-carousel .podcast-button.next');
    let currentPodcastIndex = 0;

    function showPodcast(index) {
        podcastEmbeds.forEach((embed, i) => {
            if (i === index) {
                embed.style.display = 'block';
            } else {
                embed.style.display = 'none';
            }
        });
    }

    if (podcastPrevButton && podcastNextButton) {
        podcastPrevButton.addEventListener('click', () => {
            currentPodcastIndex = (currentPodcastIndex - 1 + podcastEmbeds.length) % podcastEmbeds.length;
            showPodcast(currentPodcastIndex);
        });

        podcastNextButton.addEventListener('click', () => {
            currentPodcastIndex = (currentPodcastIndex + 1) % podcastEmbeds.length;
            showPodcast(currentPodcastIndex);
        });
    }

    // Show initial podcast
    showPodcast(0);
});

document.addEventListener('DOMContentLoaded', function() {
    const carouselSlides = document.querySelectorAll('.carousel-slide');

    carouselSlides.forEach(slide => {
        const caption = slide.querySelector('.carousel-caption');

        slide.addEventListener('click', (e) => {
            // Prevent this click from triggering any parent handlers
            e.stopPropagation();

            // Remove active class from all other captions
            document.querySelectorAll('.carousel-caption').forEach(cap => {
                if (cap !== caption) {
                    cap.classList.remove('active');
                }
            });

            // Toggle the active class on the clicked caption
            caption.classList.toggle('active');
        });
    });

    // Close caption when clicking outside
    document.addEventListener('click', () => {
        document.querySelectorAll('.carousel-caption').forEach(caption => {
            caption.classList.remove('active');
        });
    });
});
