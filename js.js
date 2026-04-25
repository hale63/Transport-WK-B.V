// NAVBAR
(function() {
      // --- Mobile Menu toggle and animations with glass consistency
      const hamburger = document.getElementById('hamburger');
      const mobileMenu = document.getElementById('mobileMenu');
      const body = document.body;

      function toggleMobileMenu() {
        if (mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.remove('hidden');
          hamburger.classList.add('hamburger-active');
          body.classList.add('menu-open');
          // Optional: add small animation
          mobileMenu.style.animation = 'slideDown 0.3s ease forwards';
        } else {
          mobileMenu.classList.add('hidden');
          hamburger.classList.remove('hamburger-active');
          body.classList.remove('menu-open');
          mobileMenu.style.animation = '';
        }
      }

      // Add keyframe for slideDown if not already
      if (!document.querySelector('#dynamic-styles')) {
        const style = document.createElement('style');
        style.id = 'dynamic-styles';
        style.textContent = `
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .mobile-nav-toggle svg {
            transition: transform 0.2s;
          }
          .mobile-nav-toggle.open svg {
            transform: rotate(180deg);
          }
        `;
        document.head.appendChild(style);
      }

      if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
      }

      // Submenu toggle for mobile (accordion style)
      const toggleButtons = document.querySelectorAll('.mobile-nav-toggle');
      toggleButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          const targetId = this.getAttribute('data-target');
          // Find the next sibling submenu div (since structure is button + div.submenu)
          const parentLi = this.closest('li');
          if (!parentLi) return;
          const submenuDiv = parentLi.querySelector('.submenu');
          if (submenuDiv) {
            // Toggle current submenu
            const isOpen = submenuDiv.classList.contains('!block') || (!submenuDiv.classList.contains('hidden') && getComputedStyle(submenuDiv).display !== 'none');
            if (isOpen) {
              submenuDiv.classList.add('hidden');
              this.classList.remove('open');
            } else {
              // close others first? better UX: close other open submenus
              document.querySelectorAll('.submenu').forEach(sub => {
                if (sub !== submenuDiv) {
                  sub.classList.add('hidden');
                  const prevBtn = sub.closest('li')?.querySelector('.mobile-nav-toggle');
                  if (prevBtn) prevBtn.classList.remove('open');
                }
              });
              submenuDiv.classList.remove('hidden');
              this.classList.add('open');
            }
          }
        });
      });

      // Ensure that submenu starts hidden
      document.querySelectorAll('.submenu').forEach(sub => {
        sub.classList.add('hidden');
      });

      // Close mobile menu on window resize if screen becomes lg (avoid layout glitch)
      function handleResize() {
        if (window.innerWidth >= 1024) {
          if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            if (hamburger) hamburger.classList.remove('hamburger-active');
            body.classList.remove('menu-open');
          }
        }
      }
      window.addEventListener('resize', handleResize);

      // Optional: Click outside mobile menu to close? improve UX
      document.addEventListener('click', function(event) {
        if (window.innerWidth < 1024 && mobileMenu && !mobileMenu.classList.contains('hidden')) {
          // if click is not inside nav and not on hamburger button
          const isClickInsideNav = mobileMenu.contains(event.target) || (hamburger && hamburger.contains(event.target));
          if (!isClickInsideNav) {
            mobileMenu.classList.add('hidden');
            if (hamburger) hamburger.classList.remove('hamburger-active');
            body.classList.remove('menu-open');
          }
        }
      });

      // Ensure video plays even in some browsers (safari)
      const heroVideo = document.querySelector('video');
      if (heroVideo) {
        heroVideo.play().catch(e => console.log("Autoplay prevented: ", e));
      }

      // Add glass effect on scroll intensity (optional: slight background darkening)
      const nav = document.querySelector('nav');
      window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
          nav.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
          nav.style.backdropFilter = 'blur(16px)';
        } else {
          nav.style.backgroundColor = 'rgba(0, 0, 0, 0.25)';
          nav.style.backdropFilter = 'blur(12px)';
        }
      });
    })();