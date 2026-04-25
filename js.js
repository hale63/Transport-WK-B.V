// NAVBAR
// HUMBURGER

function toggleMenu() {
      const menu = document.getElementById('mobileMenu');
      menu.classList.toggle('hidden');
      menu.classList.toggle('flex');
    }



  ///index services
  const SERVICES = [
  {
    label: 'Ocean',
    title: 'Ocean Freight',
    desc: 'Optimized ocean transport solutions for regional and cross-border deliveries. Smart routing and reliable fleet operations keep your cargo on schedule.',
    bullets: ['Regional And Cross-Border Coverage', 'Flexible FTL And LTL Options', 'Optimized Routes For Faster Delivery'],
    img: 'assets/images/692554.jpg'
  },
  {
    label: 'Container',
    title: 'Smart Container',
    desc: 'Secured unit transport featuring impact sensors and humidity control systems for sensitive cargo across all major trade lanes.',
    bullets: ['Impact & Humidity Sensors', 'Tamper-Proof Sealing Systems', 'Real-Time GPS Monitoring'],
    img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80'
  },
  {
    label: 'Air',
    title: 'Global Air',
    desc: 'Priority aviation logistics for urgent deliveries across 190+ countries. Guaranteed 24–48 hour door-to-door delivery worldwide.',
    bullets: ['190+ Country Coverage', '24–48 Hour Door-To-Door', 'Customs Pre-Clearance Included'],
    img: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&q=80'
  },
  {
    label: 'Last Mile',
    title: 'Last Mile',
    desc: 'AI-powered final-leg delivery optimization to reach your doorstep at record speed, every time, with live driver tracking.',
    bullets: ['AI Route Optimization', 'Live Driver Tracking', 'Proof-Of-Delivery Signature'],
    img: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80'
  }
];
 
const N = SERVICES.length;
let current = 0;
 
// ── Build waypoints ──
const wpContainer = document.getElementById('waypoints');
if (wpContainer) {
  const wpLabels = document.getElementById('wp-labels');
  SERVICES.forEach((s, i) => {
    const pct = i / (N - 1) * 100;
    const dot = document.createElement('div');
    dot.className = 'waypoint inactive';
    dot.style.left = pct + '%';
    dot.dataset.index = i;
    dot.onclick = () => goTo(i);
    wpContainer.appendChild(dot);
   
    const lbl = document.createElement('span');
    lbl.textContent = s.label;
    lbl.dataset.li = i;
    lbl.style.cssText = 'font-family:Barlow Condensed,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#4b5563;transition:color 0.3s;cursor:pointer;';
    lbl.onclick = () => goTo(i);
    wpLabels.appendChild(lbl);
  });
 
// ── Build cards ──
const slider = document.getElementById('slider-wrap');
SERVICES.forEach((s, i) => {
  const card = document.createElement('div');
  card.className = 'svc-card';
  card.dataset.ci = i;
  card.style.cssText = 'width:clamp(300px,42vw,560px); display:flex; flex-direction:row; gap:0; min-height:220px;';
  card.onclick = () => goTo(i);
  card.innerHTML = `
    <div class="card-img-wrap" style="width:38%; min-height:220px; flex-shrink:0;">
      <img src="${s.img}" alt="${s.title}" style="width:100%;height:100%;object-fit:cover;"/>
    </div>
    <div style="padding:28px 24px; display:flex; flex-direction:column; justify-content:space-between; flex:1; gap:14px;">
      <div>
        <h3 style="font-family:'Barlow Condensed',sans-serif;font-size:26px;font-weight:800;color:#fff;letter-spacing:0.02em;text-transform:uppercase;margin-bottom:10px;">${s.title}</h3>
        <p style="font-size:13px;color:#6b7280;line-height:1.65;">${s.desc}</p>
      </div>
      <div style="display:flex;flex-direction:column;gap:7px;">
        ${s.bullets.map(b => `<div class="bullet-item">${b}</div>`).join('')}
      </div>
      <div style="padding-top:6px;">
        <button class="read-more-btn">
          Read More
          <span class="arrow-circle">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </span>
        </button>
      </div>
    </div>
  `;
  slider.appendChild(card);
});
 
// ── Build progress dots ──
const dotsWrap = document.getElementById('progress-dots');
for (let i = 0; i < N; i++) {
  const d = document.createElement('div');
  d.dataset.pi = i;
  d.style.cssText = 'height:3px;border-radius:99px;transition:width 0.3s,background 0.3s;cursor:pointer;';
  d.onclick = () => goTo(i);
  dotsWrap.appendChild(d);
}
 
// ── Update UI ──
function update(idx) {
  current = idx;
  const pct = idx / (N - 1) * 100;
 
  document.getElementById('track-fill').style.width = pct + '%';
  document.getElementById('truck-wrap').style.left = pct + '%';
 
  // waypoints
  document.querySelectorAll('.waypoint').forEach((d, i) => {
    d.className = 'waypoint ' + (i <= idx ? 'active-wp' : 'inactive');
  });
  // labels
  document.querySelectorAll('[data-li]').forEach(l => {
    const i = +l.dataset.li;
    l.style.color = i === idx ? '#e85d04' : '#4b5563';
    l.style.fontWeight = i === idx ? '800' : '700';
  });
  // cards
  document.querySelectorAll('.svc-card').forEach((c, i) => {
    c.classList.toggle('is-active', i === idx);
  });
  // progress dots
  document.querySelectorAll('[data-pi]').forEach((d, i) => {
    d.style.width = i === idx ? '24px' : '8px';
    d.style.background = i === idx ? '#e85d04' : 'rgba(255,255,255,0.15)';
  });
  // counter
  document.getElementById('counter').textContent =
    String(idx + 1).padStart(2, '0') + ' / ' + String(N).padStart(2, '0');
  // buttons
  document.getElementById('btn-prev').disabled = idx === 0;
  document.getElementById('btn-next').disabled = idx === N - 1;
}
 
function goTo(idx) {
  idx = Math.max(0, Math.min(N - 1, idx));
  const cardW = slider.querySelector('.svc-card').offsetWidth + 20;
  slider.scrollTo({ left: cardW * idx, behavior: 'smooth' });
  update(idx);
}
 
function navigate(dir) { goTo(current + dir); }
 
// Sync on scroll
let st;
slider.addEventListener('scroll', () => {
  clearTimeout(st);
  st = setTimeout(() => {
    const cardW = slider.querySelector('.svc-card').offsetWidth + 20;
    const idx = Math.round(slider.scrollLeft / cardW);
    if (idx !== current) update(Math.max(0, Math.min(N - 1, idx)));
  }, 80);
});
 
// Keyboard
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') navigate(1);
  if (e.key === 'ArrowLeft')  navigate(-1);
});
 
// Click on track
document.getElementById('track-rail').addEventListener('click', e => {
  const rect = e.currentTarget.getBoundingClientRect();
  const pct = (e.clientX - rect.left) / rect.width;
  goTo(Math.round(pct * (N - 1)));
});
 
// Init
update(0);

// ── Smooth Mouse Wheel Scroller ──
  const sliderWrap = document.getElementById('slider-wrap');
  
  if (sliderWrap) {
    sliderWrap.addEventListener('wheel', (e) => {
      // Prevent the default vertical page scroll
      e.preventDefault();
  
      // 'deltaY' is the vertical scroll amount. 
      // We apply it to 'scrollLeft' to move horizontally.
      sliderWrap.scrollBy({
        left: e.deltaY * 1.5, // Multiply by 1.5 for a "snappier" feel
        behavior: 'auto'      // Using 'auto' here prevents conflict with smooth scroll CSS
      });
    }, { passive: false });
  }
}

    const menuBtn = document.getElementById("menuBtn");
    const mobileMenuElement = document.getElementById("mobileMenu");

    if (menuBtn && mobileMenuElement) {
      menuBtn.addEventListener("click", () => {
        mobileMenuElement.classList.toggle("hidden");
        menuBtn.textContent = mobileMenuElement.classList.contains("hidden") ? "☰" : "×";
      });
    }

    /* REVEAL ANIMATION */
    const revealElements = document.querySelectorAll(".rv");

    if (revealElements.length) {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("on");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: "0px 0px -32px 0px",
        }
      );

      revealElements.forEach((el) => revealObserver.observe(el));
    }

    /* MAP */
    const mapElement = document.getElementById("map");

    if (mapElement && typeof L !== "undefined") {
      const map = L.map("map").setView([37.7578, -122.5076], 12);

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution: "&copy; OpenStreetMap",
        }
      ).addTo(map);

      L.circleMarker([37.7578, -122.5076], {
        color: "#ff6600",
        fillColor: "#ff6600",
        fillOpacity: 1,
        radius: 8,
      }).addTo(map);
    }

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
        if (nav) {
          if (window.scrollY > 10) {
            nav.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
            nav.style.backdropFilter = 'blur(16px)';
          } else {
            nav.style.backgroundColor = 'rgba(0, 0, 0, 0.25)';
            nav.style.backdropFilter = 'blur(12px)';
          }
        }
      });
    })();
// Initialize the animation library
  AOS.init({
    duration: 1000,
    once: true,
    offset: 200
  });