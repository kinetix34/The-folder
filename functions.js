// Kinetix - Enhanced with Live Effects and Settings

document.addEventListener('DOMContentLoaded', function() {
    // Get all page sections and navigation links
    const sections = document.querySelectorAll('.page-section');
    const navLinks = document.querySelectorAll('nav a');

    // Settings state
    const settings = {
        particles: true,
        glow: true,
        midnight: true,
        background: true,
        hover: true,
        autoAnim: true,
        particleCount: 30  // Default particle count
    };

    // Load settings from localStorage
    loadSettings();

    // Function to fade in a section
    function showSection(sectionId) {
        sections.forEach(section => {
            section.classList.remove('active');
        });

        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    }

    // Add click handlers to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            showSection(targetId);
        });
    });

    // Handle hash changes (browser back/forward buttons)
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            showSection(hash);
        }
    });

    // Initialize effects
    initializeParticles();
    initializeSettings();

    // Settings toggle handlers
    function initializeSettings() {
        // Particles toggle
        document.getElementById('particles-toggle').addEventListener('change', function(e) {
            settings.particles = e.target.checked;
            toggleParticles();
            saveSettings();
        });

        // Particle count slider
        document.getElementById('particle-count').addEventListener('input', function(e) {
            settings.particleCount = parseInt(e.target.value);
            document.getElementById('particle-count-value').textContent = settings.particleCount;
            if (settings.particles) {
                initializeParticles(); // Recreate particles with new count
            }
            saveSettings();
        });

        // Glow toggle
        document.getElementById('glow-toggle').addEventListener('change', function(e) {
            settings.glow = e.target.checked;
            toggleGlow();
            saveSettings();
        });

        // Midnight theme toggle
        document.getElementById('midnight-toggle').addEventListener('change', function(e) {
            settings.midnight = e.target.checked;
            toggleMidnightTheme();
            saveSettings();
        });

        // Background animation toggle
        document.getElementById('background-toggle').addEventListener('change', function(e) {
            settings.background = e.target.checked;
            toggleBackground();
            saveSettings();
        });

        // Hover effects toggle
        document.getElementById('hover-toggle').addEventListener('change', function(e) {
            settings.hover = e.target.checked;
            toggleHoverEffects();
            saveSettings();
        });

        // Auto animations toggle
        document.getElementById('auto-anim-toggle').addEventListener('change', function(e) {
            settings.autoAnim = e.target.checked;
            toggleAutoAnimations();
            saveSettings();
        });

        // Set initial states
        updateSettingsUI();
    }

    // Particle effects
    function initializeParticles() {
        const container = document.getElementById('particles-container');
        if (!settings.particles) {
            container.style.display = 'none';
            return;
        }

        // Clear existing particles
        container.innerHTML = '';

        // Create particles based on setting
        for (let i = 0; i < settings.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.width = (Math.random() * 3 + 1) + 'px';
            particle.style.height = particle.style.width;
            container.appendChild(particle);
        }
    }

    function toggleParticles() {
        const container = document.getElementById('particles-container');
        container.style.display = settings.particles ? 'block' : 'none';
    }

    // Glow effects
    function toggleGlow() {
        const body = document.body;
        if (settings.glow) {
            body.classList.add('glow-enabled');
        } else {
            body.classList.remove('glow-enabled');
        }
    }

    // Midnight theme
    function toggleMidnightTheme() {
        const body = document.body;
        if (settings.midnight) {
            body.classList.add('midnight-theme');
        } else {
            body.classList.remove('midnight-theme');
        }
    }

    // Background animation
    function toggleBackground() {
        const body = document.body;
        if (settings.background) {
            body.classList.add('background-anim');
        } else {
            body.classList.remove('background-anim');
        }
    }

    // Hover effects
    function toggleHoverEffects() {
        const links = document.querySelectorAll('#links li');
        links.forEach(link => {
            if (settings.hover) {
                link.classList.add('hover-enabled');
            } else {
                link.classList.remove('hover-enabled');
            }
        });
    }

    // Auto animations
    function toggleAutoAnimations() {
        const containers = document.querySelectorAll('.container');
        containers.forEach(container => {
            if (settings.autoAnim) {
                container.classList.add('auto-anim');
            } else {
                container.classList.remove('auto-anim');
            }
        });
    }

    // Settings persistence
    function saveSettings() {
        localStorage.setItem('kinetix-settings', JSON.stringify(settings));
    }

    function loadSettings() {
        const saved = localStorage.getItem('kinetix-settings');
        if (saved) {
            Object.assign(settings, JSON.parse(saved));
        }
    }

    function updateSettingsUI() {
        document.getElementById('particles-toggle').checked = settings.particles;
        document.getElementById('glow-toggle').checked = settings.glow;
        document.getElementById('midnight-toggle').checked = settings.midnight;
        document.getElementById('background-toggle').checked = settings.background;
        document.getElementById('hover-toggle').checked = settings.hover;
        document.getElementById('auto-anim-toggle').checked = settings.autoAnim;

        // Update particle count slider
        document.getElementById('particle-count').value = settings.particleCount;
        document.getElementById('particle-count-value').textContent = settings.particleCount;

        // Apply current settings
        toggleParticles();
        toggleGlow();
        toggleMidnightTheme();
        toggleBackground();
        toggleHoverEffects();
        toggleAutoAnimations();
    }

    // Initialize on page load
    updateSettingsUI();
});