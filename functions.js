// Kinetix - Enhanced with Live Effects and Settings

document.addEventListener('DOMContentLoaded', function() {
    // Get all page sections and navigation links
    const sections = document.querySelectorAll('.page-section');
    const navLinks = document.querySelectorAll('nav a');

    // Settings state
    const settings = {
        theme: 'ocean',
        customTheme: {
            bg: 'linear-gradient(180deg, #08101d 0%, #0f141e 100%)',
            surface: '#0c1422',
            text: '#eef4ff',
            accent: '#5e7bff',
            border: '#ffffff'
        },
        particles: true,
        particleCount: 30  // Default particle count
    };

    // Load settings from localStorage
    loadSettings();

    // Function to fade in a section and update sidebar navigation state
    function showSection(sectionId) {
        sections.forEach(section => {
            section.classList.remove('active');
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
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
            window.location.hash = `#${targetId}`;
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

    // Settings handlers
    function initializeSettings() {
        const themeButtons = document.querySelectorAll('.theme-card');
        themeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const selectedTheme = this.dataset.theme;
                if (!selectedTheme) return;
                settings.theme = selectedTheme;
                applyTheme(selectedTheme);
                updateSettingsUI();
                saveSettings();
            });
        });

        // Custom theme editor
        const applyCustomBtn = document.getElementById('apply-custom-theme');
        const resetCustomBtn = document.getElementById('reset-custom-theme');

        if (applyCustomBtn) {
            applyCustomBtn.addEventListener('click', function() {
                settings.customTheme.bg = document.getElementById('custom-bg').value;
                settings.customTheme.surface = document.getElementById('custom-surface').value;
                settings.customTheme.text = document.getElementById('custom-text').value;
                settings.customTheme.accent = document.getElementById('custom-accent').value;
                settings.customTheme.border = document.getElementById('custom-border').value;
                settings.theme = 'custom';
                applyTheme('custom');
                updateSettingsUI();
                saveSettings();
            });
        }

        if (resetCustomBtn) {
            resetCustomBtn.addEventListener('click', function() {
                settings.customTheme = {
                    bg: 'linear-gradient(180deg, #08101d 0%, #0f141e 100%)',
                    surface: '#0c1422',
                    text: '#eef4ff',
                    accent: '#5e7bff',
                    border: '#ffffff'
                };
                document.getElementById('custom-bg').value = settings.customTheme.bg;
                document.getElementById('custom-surface').value = settings.customTheme.surface;
                document.getElementById('custom-text').value = settings.customTheme.text;
                document.getElementById('custom-accent').value = settings.customTheme.accent;
                document.getElementById('custom-border').value = settings.customTheme.border;
                settings.theme = 'custom';
                applyTheme('custom');
                updateSettingsUI();
                saveSettings();
            });
        }

        applyTheme(settings.theme);
        updateSettingsUI();
    }

    function applyTheme(theme) {
        document.body.classList.remove('theme-ocean', 'theme-forest', 'theme-beach', 'theme-sunset', 'theme-sunrise', 'theme-moonlight', 'theme-raspberry', 'theme-simplelight', 'theme-custom');
        if (theme === 'custom') {
            applyCustomTheme();
        } else {
            document.body.classList.add(`theme-${theme}`);
        }
    }

    function applyCustomTheme() {
        document.body.classList.add('theme-custom');
        document.documentElement.style.setProperty('--body-bg', settings.customTheme.bg);
        document.documentElement.style.setProperty('--surface', settings.customTheme.surface + 'e6'); // Add alpha
        document.documentElement.style.setProperty('--surface-strong', settings.customTheme.surface + 'f8');
        document.documentElement.style.setProperty('--text', settings.customTheme.text);
        document.documentElement.style.setProperty('--accent', settings.customTheme.accent);
        document.documentElement.style.setProperty('--border', settings.customTheme.border + '14'); // Add alpha
    }

    function updateSettingsUI() {
        document.querySelectorAll('.theme-card').forEach(card => {
            card.classList.toggle('selected', card.dataset.theme === settings.theme);
        });
        // Show/hide custom theme editor
        const editor = document.getElementById('custom-theme-editor');
        if (editor) {
            editor.style.display = settings.theme === 'custom' ? 'block' : 'none';
        }
        // Populate custom theme inputs if custom theme is selected
        if (settings.theme === 'custom') {
            document.getElementById('custom-bg').value = settings.customTheme.bg;
            document.getElementById('custom-surface').value = settings.customTheme.surface;
            document.getElementById('custom-text').value = settings.customTheme.text;
            document.getElementById('custom-accent').value = settings.customTheme.accent;
            document.getElementById('custom-border').value = settings.customTheme.border;
        }
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
        document.querySelectorAll('.theme-card').forEach(card => {
            card.classList.toggle('selected', card.dataset.theme === settings.theme);
        });
    }

    // Initialize on page load
    updateSettingsUI();

// kinetix 1.8
function loadIframe() {
    console.log('loadIframe called');
    var iframe = document.getElementById('targetIframe');
    if (iframe) {
        var src = iframe.getAttribute('data-src');
        console.log('Opening in new window:', src);
        window.open(src, '_blank');
    } else {
        console.error('Iframe not found');
    }
}

});