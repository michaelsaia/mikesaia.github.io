// Terminal Chatbot for Mike Saia's website
class TerminalChatbot {
    constructor() {
        this.container = document.getElementById('chatbot-container');
        this.toggleBtn = document.getElementById('chatbot-toggle');
        this.closeBtn = document.getElementById('chatbot-close');
        this.window = document.getElementById('chatbot-window');
        this.messagesContainer = document.getElementById('chatbot-messages');
        this.input = document.getElementById('chatbot-input');
        this.remainingDisplay = document.getElementById('messages-remaining');

        this.messagesRemaining = 10;
        this.isTyping = false;

        // Mike's context for local responses
        this.context = {
            role: "Technical Business Consultant at Palo Alto Networks",
            previousRole: "Technology Strategy Senior Associate at PwC",
            education: "Georgia Tech",
            location: "NYC",
            projects: {
                yoked: "AI-powered fitness app for personalized workout programming. Currently in TestFlight beta. Visit yoked.fitness to learn more.",
                ptPortal: "CRM for personal trainers with AI workout generation, client management, and Stripe payments. In beta with real trainers.",
                bops: "Music discovery and taste credentialing app - like Beli + Reddit + Instagram for music. Currently a Figma prototype."
            },
            skills: ["Python", "TypeScript", "React/React Native", "Django", "FastAPI", "Claude Code", "Claude MCP", "Figma", "Supabase"],
            interests: ["AI-enabled development", "indie & house music", "Saints football", "economics", "building products"],
            email: "michaelsaia97@gmail.com"
        };

        this.init();
    }

    init() {
        this.toggleBtn.addEventListener('click', () => this.toggle());
        this.closeBtn.addEventListener('click', () => this.close());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.isTyping) {
                this.handleInput();
            }
        });

        // Load remaining messages from session storage
        const stored = sessionStorage.getItem('chatbot-remaining');
        if (stored !== null) {
            this.messagesRemaining = parseInt(stored);
            this.remainingDisplay.textContent = this.messagesRemaining;
        }
    }

    toggle() {
        this.window.classList.toggle('hidden');
        if (!this.window.classList.contains('hidden')) {
            this.input.focus();
        }
    }

    close() {
        this.window.classList.add('hidden');
    }

    handleInput() {
        const message = this.input.value.trim();
        if (!message) return;

        if (this.messagesRemaining <= 0) {
            this.addMessage('system', "You've reached the message limit for this session. Feel free to reach out directly at michaelsaia97@gmail.com!");
            return;
        }

        // Add user message
        this.addMessage('user', message);
        this.input.value = '';

        // Decrement remaining
        this.messagesRemaining--;
        this.remainingDisplay.textContent = this.messagesRemaining;
        sessionStorage.setItem('chatbot-remaining', this.messagesRemaining);

        // Generate response
        this.isTyping = true;
        setTimeout(() => {
            const response = this.generateResponse(message.toLowerCase());
            this.typeResponse(response);
        }, 500);
    }

    addMessage(type, content) {
        const messageEl = document.createElement('div');
        messageEl.className = `chat-message ${type}`;

        if (type === 'user') {
            messageEl.innerHTML = `<span class="prompt">visitor@mikesaia.me:~$</span> ${this.escapeHtml(content)}`;
        } else {
            messageEl.innerHTML = `<span class="prompt">${type}:</span> ${content}`;
        }

        this.messagesContainer.appendChild(messageEl);
        this.scrollToBottom();
    }

    typeResponse(text) {
        const messageEl = document.createElement('div');
        messageEl.className = 'chat-message assistant';
        messageEl.innerHTML = '<span class="prompt">mike-bot:</span> <span class="typing-text"></span><span class="typing-cursor">|</span>';

        this.messagesContainer.appendChild(messageEl);
        this.scrollToBottom();

        const textSpan = messageEl.querySelector('.typing-text');
        const cursorSpan = messageEl.querySelector('.typing-cursor');
        let i = 0;

        const typeChar = () => {
            if (i < text.length) {
                textSpan.innerHTML += text.charAt(i);
                i++;
                this.scrollToBottom();
                setTimeout(typeChar, 20 + Math.random() * 30);
            } else {
                cursorSpan.remove();
                this.isTyping = false;
            }
        };

        typeChar();
    }

    generateResponse(query) {
        // Help command
        if (query === 'help' || query === '?') {
            return "Try asking about: <br>- Mike's projects (Yoked, PT Portal, Bops)<br>- His experience and current role<br>- His skills and tech stack<br>- His interests<br>- How to contact him";
        }

        // Projects
        if (query.includes('yoked') || query.includes('fitness') || query.includes('workout')) {
            return this.context.projects.yoked;
        }
        if (query.includes('pt portal') || query.includes('trainer') || query.includes('crm')) {
            return this.context.projects.ptPortal;
        }
        if (query.includes('bops') || query.includes('music')) {
            return this.context.projects.bops;
        }
        if (query.includes('project')) {
            return `Mike's main projects are: <br>1. <strong>Yoked</strong> - ${this.context.projects.yoked}<br>2. <strong>PT Portal</strong> - ${this.context.projects.ptPortal}<br>3. <strong>Bops</strong> - ${this.context.projects.bops}`;
        }

        // Experience
        if (query.includes('work') || query.includes('job') || query.includes('role') || query.includes('experience') || query.includes('panw') || query.includes('palo alto')) {
            return `Mike is currently a ${this.context.role}. Before that, he was a ${this.context.previousRole} where he managed $10M+ programs and built automation tools that helped retain millions in at-risk revenue.`;
        }
        if (query.includes('pwc') || query.includes('consult')) {
            return `Mike spent about 4 years at PwC, starting as a Cloud & Digital Strategy Associate and getting promoted to Senior Associate in just 1.5 years. He worked on tech strategy across Tech, Financial Services, and Telecom industries.`;
        }

        // Skills
        if (query.includes('skill') || query.includes('tech') || query.includes('stack') || query.includes('code') || query.includes('programming')) {
            return `Mike's tech stack includes: ${this.context.skills.join(', ')}. He's particularly passionate about AI-enabled development using Claude Code and MCPs.`;
        }

        // Education
        if (query.includes('school') || query.includes('college') || query.includes('georgia tech') || query.includes('education') || query.includes('degree')) {
            return `Mike graduated from ${this.context.education}. He was part of the CREATE-X accelerator where he co-founded Linkd Supply, a B2B group purchasing platform.`;
        }

        // Location
        if (query.includes('where') || query.includes('live') || query.includes('location') || query.includes('nyc') || query.includes('new york')) {
            return `Mike is based in ${this.context.location}. He moved there after working at PwC.`;
        }

        // Interests
        if (query.includes('interest') || query.includes('hobby') || query.includes('like') || query.includes('passion') || query.includes('fun')) {
            return `Mike is into: ${this.context.interests.join(', ')}. He's a big Fred Again fan and loves discovering new indie and house music.`;
        }

        // Contact
        if (query.includes('contact') || query.includes('email') || query.includes('reach') || query.includes('hire') || query.includes('talk')) {
            return `You can reach Mike at ${this.context.email} or book a chat on his Calendly (link in the header).`;
        }

        // AI/Claude/MCP
        if (query.includes('ai') || query.includes('claude') || query.includes('mcp') || query.includes('llm')) {
            return "Mike is deep into AI-enabled development. He's been on a journey from copy/paste Claude workflows to full agentic development with Claude Code and MCPs. Check out his AI Development Journey timeline on this page!";
        }

        // Greeting
        if (query.includes('hello') || query.includes('hi') || query.includes('hey') || query === 'yo') {
            return "Hey! I'm Mike's AI assistant. Ask me anything about his work, projects, or interests.";
        }

        // Who is Mike
        if (query.includes('who') && query.includes('mike')) {
            return `Mike Saia is a builder at heart - currently a ${this.context.role}, but always working on side projects. He bridges technical and non-technical worlds and is obsessed with using AI to ship products faster.`;
        }

        // Fallback
        return "That's outside what I can help with! Try asking about Mike's projects, experience, skills, or interests. Or reach out directly at michaelsaia97@gmail.com";
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TerminalChatbot();
});
