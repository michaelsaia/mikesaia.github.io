/**
 * Excel Wizard Guide System
 * Handles the wizard character with scroll-triggered dialogues
 */
class WizardGuide {
    constructor() {
        this.wizard = document.getElementById('wizard');
        this.dialogueBox = document.getElementById('dialogue-box');
        this.dialogueText = document.getElementById('dialogue-text');
        this.advanceBtn = document.getElementById('dialogue-advance');
        this.wizardContainer = document.getElementById('wizard-container');

        this.isTyping = false;
        this.typewriterTimeout = null;
        this.isMinimized = false;
        this.currentTarget = null;

        // Scroll targets with their dialogues
        // Each target is an element ID that triggers a specific message
        // ORDER MATTERS - must match DOM order for proper scroll triggering
        this.scrollTargets = [
            { id: 'home', text: "Welcome to Mike's corner of the internet. I'm his Excel Wizard (corny I know) and I'm excited to show you around." },
            { id: 'builds', text: "This is where the magic happens. Mike's always building something." },
            { id: 'yoked-card', text: "Yoked is his latest - an AI fitness app. He uses it himself - the gains are... in progress." },
            { id: 'other-projects', text: "More projects here - PT Portal for personal trainers, and Bops for music discovery (still a concept for now)." },
            { id: 'mini-projects', text: "Some fun side projects - a gender reveal betting pool and a fantasy football draft assistant powered by Claude." },
            { id: 'future-ideas', text: "Vote on what Mike should build next! These are mainly web or mobile projects, but Mike wants to explore the desktop form factor and embedded computing here soon." },
            { id: 'ai-journey', text: "Mike has been super invested in the frontier of AI development since Oct 2023. Quite the journey from copy-paste to Claude Code." },
            { id: 'journey', text: "The professional path. Georgia Tech to PwC to Palo Alto Networks." },
            { id: 'experience', text: "Mike loves identifying problems his teams or clients face and leading the build out of creative solutions with his team to solve them." },
            { id: 'skills', text: "And here are all the tools he's picked up along the way." },
            { id: 'adventures', text: "Not all strategy decks and terminals though. Mike's got an opinionated music taste, likes to get out of the country, always has a podcast on, and pre-ACL tear he was a bit of a runner" },
            { id: 'photos', text: "Some highlights from the adventures. Tap the photos for captions!" },
            { id: 'music', text: "Check the playlist, definitely some 2024 gems here." },
            { id: 'askme', text: "That's the tour! Got questions? Ask me anything about Mike." },
        ];

        this.sections = ['home', 'builds', 'journey', 'adventures', 'askme'];
        this.currentSection = null;

        this.init();
    }

    init() {
        // Set up advance button click - goes to next section
        if (this.advanceBtn) {
            this.advanceBtn.addEventListener('click', () => this.goToNextTarget());
        }

        // Click on wizard to minimize/restore
        if (this.wizard) {
            this.wizard.addEventListener('click', () => {
                if (this.isMinimized) {
                    this.restoreWizard();
                } else {
                    this.dismissWizard();
                }
            });
        }

        // Click anywhere on dialogue box to go to next
        if (this.dialogueBox) {
            this.dialogueBox.addEventListener('click', (e) => {
                if (e.target !== this.advanceBtn && !this.advanceBtn.contains(e.target)) {
                    if (this.isTyping) {
                        this.skipTyping();
                    } else {
                        this.goToNextTarget();
                    }
                }
            });
        }

        // Set up scroll observers for each target
        this.setupScrollObservers();
    }

    setupScrollObservers() {
        const options = {
            root: null,
            rootMargin: '-30% 0px -50% 0px', // Trigger when element is in center-ish area
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isMinimized) {
                    const targetId = entry.target.id;
                    const target = this.scrollTargets.find(t => t.id === targetId);
                    if (target && this.currentTarget !== targetId) {
                        this.currentTarget = targetId;
                        this.showDialogue(target.text);

                        // Update current section for nav
                        if (this.sections.includes(targetId)) {
                            this.currentSection = targetId;
                        }
                    }
                }
            });
        }, options);

        // Observe all scroll targets
        this.scrollTargets.forEach(target => {
            const element = document.getElementById(target.id);
            if (element) {
                observer.observe(element);
            }
        });
    }

    showDialogue(text) {
        this.typeDialogue(text);
        this.showBox();
    }

    typeDialogue(text) {
        if (this.typewriterTimeout) {
            clearTimeout(this.typewriterTimeout);
        }

        this.isTyping = true;
        this.dialogueText.textContent = '';

        let charIndex = 0;

        const typeChar = () => {
            if (charIndex < text.length) {
                this.dialogueText.textContent += text.charAt(charIndex);
                charIndex++;
                const delay = 15 + Math.random() * 20;
                this.typewriterTimeout = setTimeout(typeChar, delay);
            } else {
                this.isTyping = false;
            }
        };

        typeChar();
    }

    skipTyping() {
        if (this.typewriterTimeout) {
            clearTimeout(this.typewriterTimeout);
        }
        this.isTyping = false;
        const target = this.scrollTargets.find(t => t.id === this.currentTarget);
        if (target) {
            this.dialogueText.textContent = target.text;
        }
    }

    goToNextTarget() {
        // Find current target index
        const currentIndex = this.scrollTargets.findIndex(t => t.id === this.currentTarget);
        const nextIndex = (currentIndex + 1) % this.scrollTargets.length;
        const nextTarget = this.scrollTargets[nextIndex];

        const element = document.getElementById(nextTarget.id);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }

    dismissWizard() {
        this.isMinimized = true;
        this.hideBox();
        if (this.wizardContainer) {
            this.wizardContainer.classList.add('minimized');
        }
    }

    restoreWizard() {
        this.isMinimized = false;
        if (this.wizardContainer) {
            this.wizardContainer.classList.remove('minimized');
        }
        // Show current dialogue again
        const target = this.scrollTargets.find(t => t.id === this.currentTarget);
        if (target) {
            this.showDialogue(target.text);
        }
    }

    showBox() {
        if (this.dialogueBox) {
            this.dialogueBox.classList.add('visible');
        }
    }

    hideBox() {
        if (this.dialogueBox) {
            this.dialogueBox.classList.remove('visible');
        }
    }

    getCurrentSection() {
        return this.currentSection;
    }
}

// Export for use in other files
window.WizardGuide = WizardGuide;

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.wizardGuide = new WizardGuide();
});
