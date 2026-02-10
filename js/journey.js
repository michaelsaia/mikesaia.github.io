/**
 * Journey Controller
 * Handles carousels, upvoting, and smooth scrolling
 * (Wizard dialogues now handled by wizard.js)
 */
class JourneyController {
    constructor() {
        this.init();
    }

    init() {
        // Initialize carousels
        this.initPhotoCarousel();
        this.initPodcastCarousel();

        // Initialize caption toggle for mobile
        this.initMobileCaptions();

        // Initialize upvoting system
        this.initUpvoting();

        // Initialize smooth scrolling for anchor links
        this.initSmoothScroll();
    }

    /**
     * Photo carousel functionality
     */
    initPhotoCarousel() {
        const carousel = document.querySelector('.carousel');
        const slides = document.querySelectorAll('.carousel-slide');
        const prevButton = document.querySelector('.carousel-container .carousel-button.prev');
        const nextButton = document.querySelector('.carousel-container .carousel-button.next');

        if (!carousel || slides.length === 0) return;

        let currentSlide = 0;
        let autoplayInterval;

        const updateCarousel = () => {
            const offset = -currentSlide * 100;
            carousel.style.transform = `translateX(${offset}%)`;
        };

        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateCarousel();
        };

        const prevSlide = () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateCarousel();
        };

        const startAutoplay = () => {
            autoplayInterval = setInterval(nextSlide, 5000);
        };

        const resetAutoplay = () => {
            clearInterval(autoplayInterval);
            startAutoplay();
        };

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                nextSlide();
                resetAutoplay();
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                prevSlide();
                resetAutoplay();
            });
        }

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const swipeThreshold = 50;

            if (touchStartX - touchEndX > swipeThreshold) {
                nextSlide();
                resetAutoplay();
            } else if (touchEndX - touchStartX > swipeThreshold) {
                prevSlide();
                resetAutoplay();
            }
        }, { passive: true });

        startAutoplay();
    }

    /**
     * Podcast carousel functionality
     */
    initPodcastCarousel() {
        const podcastEmbeds = document.querySelectorAll('.podcast-embed');
        const prevButton = document.querySelector('.podcast-carousel .podcast-button.prev');
        const nextButton = document.querySelector('.podcast-carousel .podcast-button.next');

        if (podcastEmbeds.length === 0) return;

        let currentIndex = 0;

        const showPodcast = (index) => {
            podcastEmbeds.forEach((embed, i) => {
                embed.style.display = i === index ? 'block' : 'none';
            });
        };

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + podcastEmbeds.length) % podcastEmbeds.length;
                showPodcast(currentIndex);
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % podcastEmbeds.length;
                showPodcast(currentIndex);
            });
        }

        // Initial display
        showPodcast(0);
    }

    /**
     * Mobile caption toggle for photo carousel
     */
    initMobileCaptions() {
        const carouselSlides = document.querySelectorAll('.carousel-slide');

        carouselSlides.forEach(slide => {
            const caption = slide.querySelector('.carousel-caption');
            if (!caption) return;

            slide.addEventListener('click', (e) => {
                e.stopPropagation();

                // Remove active from all other captions
                document.querySelectorAll('.carousel-caption').forEach(cap => {
                    if (cap !== caption) {
                        cap.classList.remove('active');
                    }
                });

                // Toggle current caption
                caption.classList.toggle('active');
            });
        });

        // Close caption when clicking outside
        document.addEventListener('click', () => {
            document.querySelectorAll('.carousel-caption').forEach(caption => {
                caption.classList.remove('active');
            });
        });
    }

    /**
     * Upvoting system for future project ideas
     * Uses Cloudflare KV for global vote storage
     */
    initUpvoting() {
        const WORKER_URL = 'https://geminiproxy.michaelsaia97.workers.dev';
        const VOTED_KEY = 'mikesaia_voted_ideas'; // localStorage tracks which ideas THIS user voted on

        const getVotedIdeas = () => {
            try {
                const stored = localStorage.getItem(VOTED_KEY);
                return stored ? JSON.parse(stored) : [];
            } catch {
                return [];
            }
        };

        const saveVotedIdeas = (votedIds) => {
            try {
                localStorage.setItem(VOTED_KEY, JSON.stringify(votedIds));
            } catch { /* localStorage unavailable */ }
        };

        const updateVoteDisplay = (ideaId, count) => {
            const countEl = document.getElementById(`votes-${ideaId}`);
            if (countEl) {
                countEl.textContent = count;
                countEl.classList.add('pop');
                setTimeout(() => countEl.classList.remove('pop'), 300);
            }
        };

        // Global upvote function
        window.upvoteIdea = async (ideaId) => {
            const votedIds = getVotedIdeas();

            if (votedIds.includes(ideaId)) return;

            // Optimistic UI update
            const countEl = document.getElementById(`votes-${ideaId}`);
            const currentCount = parseInt(countEl?.textContent || '0', 10);
            updateVoteDisplay(ideaId, currentCount + 1);

            // Mark as voted locally (prevents double-voting)
            votedIds.push(ideaId);
            saveVotedIdeas(votedIds);

            const btn = document.querySelector(`[data-idea-id="${ideaId}"] .upvote-btn`);
            if (btn) {
                btn.classList.add('voted');
            }

            // POST to worker to persist vote globally
            try {
                const res = await fetch(`${WORKER_URL}/vote`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ideaId })
                });
                const data = await res.json();
                // Sync with server's count (in case of race conditions)
                updateVoteDisplay(ideaId, data.count);
            } catch (err) {
                console.error('Vote failed:', err);
            }
        };

        // Load global votes from worker on page load
        const loadVotes = async () => {
            try {
                const res = await fetch(`${WORKER_URL}/votes`);
                const votes = await res.json();
                Object.entries(votes).forEach(([id, count]) => {
                    updateVoteDisplay(id, count);
                });
            } catch (err) {
                console.error('Failed to load votes:', err);
            }
        };

        // Mark user's previous votes as voted (from localStorage)
        const votedIds = getVotedIdeas();
        votedIds.forEach(ideaId => {
            const btn = document.querySelector(`[data-idea-id="${ideaId}"] .upvote-btn`);
            if (btn) {
                btn.classList.add('voted');
            }
        });

        // Fetch global vote counts
        loadVotes();
    }

    /**
     * Smooth scrolling for anchor links
     */
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    new JourneyController();
});
