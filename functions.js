        // Get all page sections and navigation links
        const sections = document.querySelectorAll('.page-section');
        const navLinks = document.querySelectorAll('nav a');

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