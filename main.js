/* ============================================================
   ACEH HIJAU — main.js
   File ini berisi seluruh JavaScript untuk website Aceh Hijau.
   Struktur:
   1.  Loading Screen
   2.  Custom Cursor
   3.  Init All (dipanggil setelah loading selesai)
   4.  Navbar (scroll hide/show, dark mode toggle)
   5.  Parallax (hero bg + quote bg)
   6.  Particles Canvas
   7.  Hero Entrance Animation
   8.  Slider / Galeri
   9.  Leaflet Map
   10. Scroll Reveal (IntersectionObserver)
   11. Counter Animation
   12. Music Player
   13. Form Submit Handler
   14. Mobile Menu
============================================================ */

/* ===========================
   1. LOADING SCREEN
=========================== */
const loadBar  = document.getElementById('loadBar');
const loading  = document.getElementById('loading');

let progress = 0;

const loadInterval = setInterval(() => {
  progress += Math.random() * 18;

  if (progress >= 100) {
    progress = 100;
    clearInterval(loadInterval);

    // Tunggu sebentar lalu sembunyikan loading & init website
    setTimeout(() => {
      loading.classList.add('hide');
      initAll();
    }, 400);
  }

  loadBar.style.width = progress + '%';
}, 120);


/* ===========================
   2. CUSTOM CURSOR
=========================== */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

// Update posisi cursor langsung
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

// Animasi ring mengikuti cursor dengan lag (smooth follow)
(function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
})();

// Efek hover pada elemen interaktif
const hoverEls = document.querySelectorAll(
  'a, button, .issue-card, .action-item, .slide, .map-point'
);

hoverEls.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width  = '6px';
    cursor.style.height = '6px';
    ring.style.width    = '52px';
    ring.style.height   = '52px';
    ring.style.opacity  = '0.5';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width  = '10px';
    cursor.style.height = '10px';
    ring.style.width    = '36px';
    ring.style.height   = '36px';
    ring.style.opacity  = '1';
  });
});


/* ===========================
   3. INIT ALL
   Dipanggil setelah loading selesai
=========================== */
function initAll() {
  initNavbar();
  initParallax();
  initParticles();
  initHeroAnim();
  initSlider();
  initMap();
  initScrollReveal();
  initCounters();
}


/* ===========================
   4. NAVBAR
=========================== */
function initNavbar() {
  const nav = document.getElementById('navbar');
  let lastScrollY = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;

    // Tambah background saat scroll
    if (y > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Auto hide navbar saat scroll ke bawah, tampil saat scroll ke atas
    if (y > lastScrollY && y > 200) {
      nav.classList.add('hide-nav');
    } else {
      nav.classList.remove('hide-nav');
    }

    lastScrollY = y;

    // Tampilkan tombol back-to-top
    document.getElementById('backTop').classList.toggle('show', y > 400);
  });

  // Dark / Light mode toggle
  document.getElementById('darkToggle').addEventListener('click', () => {
    const html   = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    document.getElementById('darkToggle').textContent = isDark ? '🌙' : '☀️';
  });

  // Hamburger → buka mobile menu
  document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('mobileMenu').classList.add('open');
  });

  // Tombol close di mobile menu
  document.getElementById('mobileClose').addEventListener('click', () => {
    document.getElementById('mobileMenu').classList.remove('open');
  });
}

// Fungsi global: tutup mobile menu (dipakai di onclick HTML)
function closeMobile() {
  document.getElementById('mobileMenu').classList.remove('open');
}


/* ===========================
   5. PARALLAX
=========================== */
function initParallax() {
  const heroBg  = document.getElementById('heroBg');
  const quoteBg = document.getElementById('quoteBg');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;

    // Hero background bergerak lebih lambat dari scroll
    heroBg.style.transform = `translateY(${y * 0.4}px)`;

    // Quote background parallax
    const quoteSection = document.querySelector('.quote-section');
    if (quoteSection) {
      const rect = quoteSection.getBoundingClientRect();
      quoteBg.style.transform = `translateY(${-rect.top * 0.25}px)`;
    }
  }, { passive: true });
}


/* ===========================
   6. PARTICLES CANVAS
=========================== */
function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx    = canvas.getContext('2d');

  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  // Buat partikel
  const particles = Array.from({ length: 55 }, () => ({
    x:  Math.random() * canvas.width,
    y:  Math.random() * canvas.height,
    r:  Math.random() * 2 + 0.5,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    o:  Math.random() * 0.5 + 0.1,
  }));

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Gambar titik
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < 0)            p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0)            p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(74, 222, 128, ${p.o})`;
      ctx.fill();
    });

    // Gambar garis penghubung antar partikel yang berdekatan
    particles.forEach((a, i) => {
      particles.slice(i + 1).forEach(b => {
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(74, 222, 128, ${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth   = 0.7;
          ctx.stroke();
        }
      });
    });

    requestAnimationFrame(drawParticles);
  }

  drawParticles();

  // Resize canvas saat window berubah ukuran
  window.addEventListener('resize', () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}


/* ===========================
   7. HERO ENTRANCE ANIMATION
=========================== */
function initHeroAnim() {
  // Tambahkan class 'visible' satu per satu dengan delay
  const heroEls = ['heroBadge', 'heroTitle', 'heroSub', 'heroBtns'];
  heroEls.forEach(id => {
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.classList.add('visible');
    }, 100);
  });
}


/* ===========================
   8. SLIDER / GALERI
=========================== */
function initSlider() {
  const track  = document.getElementById('sliderTrack');
  const slides = track.querySelectorAll('.slide');
  const dotsEl = document.getElementById('sliderDots');
  let current  = 0;

  // Buat dots navigasi
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  });

  // Fungsi pindah slide
  function goTo(index) {
    current = ((index % slides.length) + slides.length) % slides.length;
    const slideWidth = slides[0].offsetWidth + 20; // 20 = gap
    track.style.transform = `translateX(-${current * slideWidth}px)`;

    // Update dots
    dotsEl.querySelectorAll('.dot').forEach((d, j) => {
      d.classList.toggle('active', j === current);
    });
  }

  // Tombol prev & next
  document.getElementById('prevBtn').addEventListener('click', () => goTo(current - 1));
  document.getElementById('nextBtn').addEventListener('click', () => goTo(current + 1));

  // Auto play setiap 4.5 detik
  setInterval(() => goTo(current + 1), 4500);

  // Touch / swipe support untuk mobile
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      goTo(current + (diff > 0 ? 1 : -1));
    }
  }, { passive: true });
}


/* ===========================
   9. LEAFLET MAP
=========================== */
function initMap() {
  // Inisialisasi peta dengan center di Aceh
  const map = L.map('map', {
    center: [4.6951, 96.7494],
    zoom:   7,
    zoomControl: true,
  });

  // Tile layer dark (CartoDB Dark Matter)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap © CARTO',
    maxZoom: 18,
  }).addTo(map);

  // Custom icon marker hijau
  const greenIcon = L.divIcon({
    className: '',
    html: `<div style="
      width: 18px;
      height: 18px;
      background: #4ade80;
      border-radius: 50%;
      border: 3px solid #fff;
      box-shadow: 0 0 12px rgba(74,222,128,.6);
    "></div>`,
    iconSize:   [18, 18],
    iconAnchor: [9,  9],
  });

  // Data titik lokasi di Aceh
  const mapPoints = [
    {
      lat:  3.8,
      lng:  97.5,
      name: '🌲 Ekosistem Leuser',
      desc: 'Kawasan warisan dunia, rumah bagi harimau & orangutan Sumatera.',
    },
    {
      lat:  5.888,
      lng:  95.317,
      name: '🏝️ Sabang',
      desc: 'Zona konservasi laut dengan keanekaragaman hayati tertinggi di Aceh.',
    },
    {
      lat:  4.6951,
      lng:  96.7494,
      name: '🏙️ Banda Aceh',
      desc: 'Ibukota Aceh, pusat koordinasi gerakan lingkungan.',
    },
    {
      lat:  4.946,
      lng:  96.013,
      name: '🌾 Gayo Highland',
      desc: 'Dataran tinggi penghasil kopi Arabika terbaik dunia & hutan lindung luas.',
    },
    {
      lat:  4.145,
      lng:  96.147,
      name: '🐘 Koridor Gajah',
      desc: 'Jalur migrasi gajah Sumatera yang dilindungi dari alih fungsi lahan.',
    },
    {
      lat:  2.55,
      lng:  98.0,
      name: '🌿 Hutan Singkil',
      desc: 'Kawasan hutan gambut penting di selatan Aceh.',
    },
  ];

  // Tambah marker ke peta
  mapPoints.forEach(p => {
    L.marker([p.lat, p.lng], { icon: greenIcon })
      .addTo(map)
      .bindPopup(
        `<h3>${p.name}</h3><p>${p.desc}</p>`,
        { maxWidth: 220 }
      );
  });

  // Klik item panel kiri → flyTo lokasi di peta
  document.querySelectorAll('.map-point').forEach(el => {
    el.addEventListener('click', () => {
      // Update active state
      document.querySelectorAll('.map-point').forEach(x => x.classList.remove('active'));
      el.classList.add('active');

      const lat  = parseFloat(el.dataset.lat);
      const lng  = parseFloat(el.dataset.lng);
      const zoom = parseInt(el.dataset.zoom) || 10;

      map.flyTo([lat, lng], zoom, { duration: 1.5 });
    });
  });
}


/* ===========================
   10. SCROLL REVEAL
=========================== */
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.12 }
  );

  // Observe semua elemen dengan class .reveal dan .stat-item
  document.querySelectorAll('.reveal, .stat-item').forEach(el => {
    observer.observe(el);
  });
}


/* ===========================
   11. COUNTER ANIMATION
=========================== */
function initCounters() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el     = entry.target.querySelector('.stat-num');
        if (!el || el.dataset.done) return;

        el.dataset.done = '1'; // Tandai sudah dijalankan

        const target    = parseFloat(el.dataset.target);
        const isDecimal = String(target).includes('.');
        const duration  = 1800; // ms
        const startTime = performance.now();

        function tick(now) {
          const elapsed = now - startTime;
          const t       = Math.min(elapsed / duration, 1);

          // Ease out cubic
          const ease = 1 - Math.pow(1 - t, 3);
          const value = target * ease;

          el.textContent = isDecimal
            ? value.toFixed(1)
            : Math.round(value).toLocaleString();

          if (t < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
      });
    },
    { threshold: 0.4 }
  );

  document.querySelectorAll('.stat-item').forEach(el => observer.observe(el));
}


/* ===========================
   12. MUSIC PLAYER
=========================== */
let isPlaying = false;

function toggleMusic() {
  const audio  = document.getElementById('bgMusic');
  const btn    = document.getElementById('musicToggle');
  const eq     = document.getElementById('musicEq');

  if (isPlaying) {
    audio.pause();
    btn.textContent = '▶';
    eq.classList.add('paused');
  } else {
    // play() returns Promise, catch jika browser blokir autoplay
    audio.play().catch(() => {
      console.log('Autoplay diblokir browser. Klik tombol play untuk memulai.');
    });
    btn.textContent = '⏸';
    eq.classList.remove('paused');
  }

  isPlaying = !isPlaying;
}


/* ===========================
   13. FORM SUBMIT HANDLER
=========================== */
function sendMsg(btn) {
  btn.textContent  = '✓ Pesan Terkirim!';
  btn.style.background = 'var(--accent2)';

  setTimeout(() => {
    btn.textContent      = '🌿 Kirim Pesan';
    btn.style.background = '';
  }, 3000);
}


/* ===========================
   END OF main.js
=========================== */
