/**
 * Map Navigation Controller
 * Handles the pixel art map nav bar accordion with wizard walking animation
 */
class NavMapController {
    constructor() {
        // Nav elements
        this.navMap = document.getElementById('nav-map');
        this.navToggle = document.getElementById('nav-toggle');
        this.navClose = document.getElementById('nav-close');
        this.navHotspots = document.querySelectorAll('.nav-hotspot');
        this.navWizard = document.getElementById('nav-wizard');

        // Section tracking
        this.sections = ['home', 'builds', 'journey', 'adventures', 'askme'];
        this.currentSection = 'home';
        this.currentIndex = 0;
        this.isOpen = false;

        // Wizard positions on the nav map (percentage from left)
        // Centered on each section based on user-provided values
        this.wizardPositions = {
            'home': 12,       // Center of 0-24%
            'builds': 34,     // Center of 24-44%
            'journey': 54,    // Center of 44-64%
            'adventures': 72, // Center of 64-80%
            'askme': 90       // Center of 80-100%
        };

        this.init();
    }

    init() {
        this.setupToggle();
        this.setupHotspots();
        this.setupScrollObserver();
        this.updateActiveSection('home');
    }

    /**
     * Set up accordion toggle
     */
    setupToggle() {
        // Open nav when clicking toggle button
        if (this.navToggle) {
            this.navToggle.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent document click from firing
                this.openNav();
            });
        }

        // Close nav when clicking X button
        if (this.navClose) {
            this.navClose.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeNav();
            });
        }

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeNav();
            }
        });

        // Close when clicking outside the nav map
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.navMap.contains(e.target)) {
                this.closeNav();
            }
        });

        // Prevent clicks inside the nav from closing it (except hotspots)
        if (this.navMap) {
            this.navMap.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    openNav() {
        this.isOpen = true;
        if (this.navMap) {
            this.navMap.classList.add('open');
        }
        if (this.navToggle) {
            this.navToggle.style.opacity = '0';
            this.navToggle.style.pointerEvents = 'none';
        }
        // Sync wizard position with current section from wizard guide
        if (window.wizardGuide) {
            const currentSection = window.wizardGuide.getCurrentSection();
            if (currentSection && this.sections.includes(currentSection)) {
                this.updateActiveSection(currentSection);
            }
        }
    }

    closeNav() {
        this.isOpen = false;
        if (this.navMap) {
            this.navMap.classList.remove('open');
        }
        if (this.navToggle) {
            this.navToggle.style.opacity = '1';
            this.navToggle.style.pointerEvents = 'auto';
        }
    }

    /**
     * Set up click handlers for nav hotspots
     */
    setupHotspots() {
        this.navHotspots.forEach(hotspot => {
            hotspot.addEventListener('click', (e) => {
                e.stopPropagation();
                const sectionId = hotspot.dataset.section;
                this.navigateToSection(sectionId);
                // Close the nav after clicking
                setTimeout(() => this.closeNav(), 300);
            });
        });
    }

    /**
     * Navigate to a specific section with smooth scroll
     */
    navigateToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            this.updateActiveSection(sectionId);
        }
    }

    /**
     * Set up Intersection Observer to detect current section
     */
    setupScrollObserver() {
        const options = {
            root: null,
            rootMargin: '-40% 0px -40% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    if (this.sections.includes(sectionId)) {
                        this.updateActiveSection(sectionId);
                    }
                }
            });
        }, options);

        // Observe all biome sections
        this.sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                observer.observe(section);
            }
        });
    }

    /**
     * Update the active section state
     */
    updateActiveSection(sectionId) {
        if (this.currentSection === sectionId) return;

        this.currentSection = sectionId;
        this.currentIndex = this.sections.indexOf(sectionId);

        // Update hotspot active states
        this.navHotspots.forEach(hotspot => {
            if (hotspot.dataset.section === sectionId) {
                hotspot.classList.add('active');
            } else {
                hotspot.classList.remove('active');
            }
        });

        // Move wizard to the new position
        this.moveWizard(sectionId);
    }

    /**
     * Animate wizard moving to a section position
     */
    moveWizard(sectionId) {
        if (this.navWizard && this.wizardPositions[sectionId] !== undefined) {
            const position = this.wizardPositions[sectionId];
            this.navWizard.style.left = `${position}%`;
        }
    }

    /**
     * Get current section
     */
    getCurrentSection() {
        return this.currentSection;
    }
}

// Export for use in other files
window.NavMapController = NavMapController;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.navMapController = new NavMapController();
});
