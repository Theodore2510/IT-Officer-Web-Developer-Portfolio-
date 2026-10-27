/* ==========================================================================
   THEODORE PORTFOLIO — INTERACTIVE JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --------------------------------------------------------------------------
       0. CENTRALIZED CONFIGURATION: PERSONAL WEBSITE URL
       -------------------------------------------------------------------------- */
    // Replace this placeholder with your actual deployed personal website URL when ready.
    const PERSONAL_SITE_URL = "https://your-personal-site.example";

    const personalSiteLink = document.getElementById('personal-site-link');
    if (personalSiteLink) {
        personalSiteLink.addEventListener('click', (e) => {
            // Check if the URL is still the default placeholder
            if (PERSONAL_SITE_URL.includes("your-personal-site.example") || !PERSONAL_SITE_URL) {
                e.preventDefault();
                alert("Personal website URL is currently set to a placeholder. Once your personal site is deployed, update `PERSONAL_SITE_URL` in script.js to connect your live site!");
            } else {
                personalSiteLink.setAttribute('href', PERSONAL_SITE_URL);
            }
        });
    }

    /* --------------------------------------------------------------------------
       1. TWO-STAGE INTRO LOADING & WELCOME SCREEN
       -------------------------------------------------------------------------- */
    const introScreen = document.getElementById('intro-screen');
    const loadingStage = document.getElementById('loading-stage');
    const welcomeStage = document.getElementById('welcome-stage');
    const progressBar = document.getElementById('progress-bar');
    const skipLoadingBtn = document.getElementById('skip-loading-btn');
    const enterBtn = document.getElementById('enter-btn');
    const skipWelcomeBtn = document.getElementById('skip-welcome-btn');

    function dismissIntro() {
        if (introScreen) {
            introScreen.classList.add('dismissed');
            sessionStorage.setItem('theodore_intro_seen', 'true');
        }
    }

    if (sessionStorage.getItem('theodore_intro_seen') === 'true') {
        if (introScreen) introScreen.style.display = 'none';
    } else {
        let progress = 0;
        const intervalTime = 25;
        const loadingInterval = setInterval(() => {
            progress += 1;
            if (progressBar) {
                progressBar.style.width = `${progress}%`;
            }
            if (progress >= 100) {
                clearInterval(loadingInterval);
                if (loadingStage && welcomeStage) {
                    loadingStage.classList.remove('active');
                    welcomeStage.classList.add('active');
                }
            }
        }, intervalTime);

        if (skipLoadingBtn) skipLoadingBtn.addEventListener('click', () => {
            clearInterval(loadingInterval);
            dismissIntro();
        });
    }

    if (enterBtn) enterBtn.addEventListener('click', dismissIntro);
    if (skipWelcomeBtn) skipWelcomeBtn.addEventListener('click', dismissIntro);

    /* --------------------------------------------------------------------------
       2. THEME TOGGLE (LIGHT / DARK MODE) WITH LOCALSTORAGE
       -------------------------------------------------------------------------- */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    const savedTheme = localStorage.getItem('theodore_theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    htmlElement.setAttribute('data-theme', savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theodore_theme', newTheme);
        });
    }

    /* --------------------------------------------------------------------------
       3. MOBILE NAVIGATION MENU
       -------------------------------------------------------------------------- */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-open');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('mobile-open');
            });
        });
    }

    /* --------------------------------------------------------------------------
       4. CODE EDITOR TABS INTERACTIVITY
       -------------------------------------------------------------------------- */
    const codeTabs = document.querySelectorAll('.code-tab');
    const codePanes = document.querySelectorAll('.code-pane');

    codeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');

            codeTabs.forEach(t => t.classList.remove('active'));
            codePanes.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            const targetPane = document.getElementById(`pane-${targetTab}`);
            if (targetPane) targetPane.classList.add('active');
        });
    });

    /* --------------------------------------------------------------------------
       5. AUDIO / BACKGROUND MUSIC PLAYER WITH WEB AUDIO SYNTH FALLBACK
       -------------------------------------------------------------------------- */
    const musicWidget = document.getElementById('music-widget');
    const musicToggleBtn = document.getElementById('music-toggle-btn');
    const bgAudio = document.getElementById('bg-audio');
    let isPlaying = false;
    let audioCtx = null;
    let oscillator = null;
    let gainNode = null;

    function playAmbientSynth() {
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            oscillator = audioCtx.createOscillator();
            gainNode = audioCtx.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(220, audioCtx.currentTime);

            gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime);

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            oscillator.start();
        } catch (e) {
            console.log('Web Audio API not supported or blocked');
        }
    }

    function stopAmbientSynth() {
        if (oscillator) {
            try {
                oscillator.stop();
                oscillator.disconnect();
            } catch (e) {}
            oscillator = null;
        }
    }

    if (musicToggleBtn && bgAudio) {
        musicToggleBtn.addEventListener('click', () => {
            if (!isPlaying) {
                bgAudio.play().then(() => {
                    isPlaying = true;
                    musicWidget.classList.add('playing');
                }).catch(() => {
                    playAmbientSynth();
                    isPlaying = true;
                    musicWidget.classList.add('playing');
                });
            } else {
                bgAudio.pause();
                stopAmbientSynth();
                isPlaying = false;
                musicWidget.classList.remove('playing');
            }
        });
    }

    /* --------------------------------------------------------------------------
       6. TRACK FOCUS HELPER
       -------------------------------------------------------------------------- */
    window.focusTrack = function(track) {
        console.log(`Focused professional track: ${track}`);
    };

    /* --------------------------------------------------------------------------
       7. PROJECT MODALS CONFIGURATION & DATA
       -------------------------------------------------------------------------- */
    const projectData = {
        todo: {
            title: "To-Do List Application",
            status: "In Progress / Coming Soon",
            description: "A focused task management application for organizing daily work, managing tasks, and tracking completion with a responsive interface.",
            stack: ["HTML5", "CSS3", "JavaScript"],
            features: [
                "Create, read, update, and delete tasks seamlessly.",
                "Task status tracking and categorization filters.",
                "Responsive design optimized for both desktop and mobile devices."
            ],
            repo: "#"
        },
        tracker: {
            title: "IT Issue Tracking System",
            status: "In Progress",
            description: "An internal IT issue tracking application designed to help an IT team report, assign, manage, and resolve technical issues efficiently.",
            stack: ["Laravel", "Bootstrap", "MySQL"],
            features: [
                "Issue reporting & technician assignment workflow.",
                "Priority level tagging and status tracking dashboards.",
                "Full CRUD operations with secure database integration."
            ],
            repo: "#"
        },
        ai: {
            title: "AI Agent & Workflow Automation",
            status: "Exploring / Coming Soon",
            description: "Exploring practical AI agents and workflow automation tools (such as n8n) to simplify repetitive tasks and improve daily productivity.",
            stack: ["AI Agents", "n8n", "Workflow Automation"],
            features: [
                "Automating routine data synchronization and notifications.",
                "Exploring LLM-driven assistance for technical troubleshooting.",
                "Streamlining operational handoffs."
            ],
            repo: "#"
        }
    };

    window.openProjectModal = function(projectId) {
        const modal = document.getElementById('project-modal');
        const modalBody = document.getElementById('modal-content-body');
        const proj = projectData[projectId];

        if (!proj || !modal || !modalBody) return;

        modalBody.innerHTML = `
            <div class="modal-inner">
                <span class="project-status ${projectId === 'ai' ? 'exploring' : 'in-progress'}" style="margin-bottom: 1rem; display: inline-block;">${proj.status}</span>
                <h3>${proj.title}</h3>
                <p>${proj.description}</p>
                
                <div class="modal-meta-box">
                    <h4>Technology Stack</h4>
                    <div class="tech-stack-tags" style="margin-top: 0.5rem; margin-bottom: 0;">
                        ${proj.stack.map(s => `<span>${s}</span>`).join('')}
                    </div>
                </div>

                <div class="modal-meta-box">
                    <h4>Key Features &amp; Scope</h4>
                    <ul class="timeline-bullets" style="margin-top: 0.5rem;">
                        ${proj.features.map(f => `<li>${f}</li>`).join('')}
                    </ul>
                </div>

                <div style="margin-top: 2rem; display: flex; gap: 1rem;">
                    <a href="${proj.repo}" class="btn btn-primary" target="_blank" rel="noopener">View Repository ↗</a>
                </div>
            </div>
        `;

        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    const modalCloseBtn = document.getElementById('modal-close-btn');
    const projectModal = document.getElementById('project-modal');

    function closeModal() {
        if (projectModal) {
            projectModal.classList.remove('open');
            document.body.style.overflow = '';
        }
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (projectModal) {
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) closeModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    /* --------------------------------------------------------------------------
       8. DYNAMIC YEAR IN FOOTER
       -------------------------------------------------------------------------- */
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});