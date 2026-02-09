// Typing Animation
const typingText = document.getElementById('typing-text');
const words = ['a builder', 'an AI-enabled developer', 'an aspiring entrepreneur', 'a problem solver'];
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

// Project Idea Upvoting System
// Uses localStorage to track votes per session

const VOTES_STORAGE_KEY = 'mikesaia_idea_votes';
const VOTED_IDEAS_KEY = 'mikesaia_voted_ideas';

function getStoredVotes() {
    try {
        const stored = localStorage.getItem(VOTES_STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch {
        return {};
    }
}

function getVotedIdeas() {
    try {
        const stored = localStorage.getItem(VOTED_IDEAS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

function saveVotes(votes) {
    try {
        localStorage.setItem(VOTES_STORAGE_KEY, JSON.stringify(votes));
    } catch {
        // localStorage not available
    }
}

function saveVotedIdeas(votedIds) {
    try {
        localStorage.setItem(VOTED_IDEAS_KEY, JSON.stringify(votedIds));
    } catch {
        // localStorage not available
    }
}

function upvoteIdea(ideaId) {
    const votedIds = getVotedIdeas();

    // Check if already voted
    if (votedIds.includes(ideaId)) {
        return;
    }

    // Get current votes
    const votes = getStoredVotes();
    votes[ideaId] = (votes[ideaId] || 0) + 1;

    // Save updated votes
    saveVotes(votes);

    // Mark as voted
    votedIds.push(ideaId);
    saveVotedIdeas(votedIds);

    // Update UI
    updateVoteDisplay(ideaId, votes[ideaId]);

    // Mark button as voted
    const btn = document.querySelector(`[data-idea-id="${ideaId}"] .upvote-btn`);
    if (btn) {
        btn.classList.add('voted');
    }
}

function updateVoteDisplay(ideaId, count) {
    const countEl = document.getElementById(`votes-${ideaId}`);
    if (countEl) {
        countEl.textContent = count;
        countEl.classList.add('pop');
        setTimeout(() => countEl.classList.remove('pop'), 300);
    }
}

// Initialize vote counts on page load
document.addEventListener('DOMContentLoaded', function() {
    const votes = getStoredVotes();
    const votedIds = getVotedIdeas();

    // Update all vote displays
    Object.keys(votes).forEach(ideaId => {
        updateVoteDisplay(ideaId, votes[ideaId]);
    });

    // Mark already voted buttons
    votedIds.forEach(ideaId => {
        const btn = document.querySelector(`[data-idea-id="${ideaId}"] .upvote-btn`);
        if (btn) {
            btn.classList.add('voted');
        }
    });
});
