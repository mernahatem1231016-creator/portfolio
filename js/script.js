const sectionFiles = [
  'sections/hero.html',
  'sections/about.html',
  'sections/education.html',
  'sections/projects.html',
  'sections/skills.html',
  'sections/contact.html',
  'sections/footer.html'
];

async function loadSections() {
  const content = document.getElementById('content');
  const htmlParts = [];

  for (const file of sectionFiles) {
    const response = await fetch(file);
    if (!response.ok) throw new Error(`Could not load ${file}`);
    htmlParts.push(await response.text());
  }

  content.innerHTML = htmlParts.join('');
  initializeInteractions();
}

function hideLoader() {
  const loader = document.getElementById('loadingScreen');
  if (loader) {
    loader.classList.add('hidden');
    document.body.classList.add('loaded');
    setTimeout(() => loader.remove(), 650);
  }
}

function initializeInteractions() {
  const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const backToTop = document.getElementById('backToTop');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinksContainer = document.querySelector('.nav-links');
  const form = document.querySelector('form');
  const formMessage = document.querySelector('.form-message');

  hideLoader();

  if (navToggle && navLinksContainer) {
    navToggle.addEventListener('click', () => navLinksContainer.classList.toggle('active'));
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navLinksContainer) navLinksContainer.classList.remove('active');
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            const target = link.getAttribute('href')?.replace('#', '');
            link.classList.toggle('active', target === entry.target.id);
          });
        }
      });
    },
    { threshold: 0.45 }
  );

  sections.forEach((section) => observer.observe(section));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));

  window.addEventListener('scroll', () => {
    if (backToTop) {
      backToTop.style.display = window.scrollY > 600 ? 'grid' : 'none';
    }
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  document.querySelectorAll('.btn').forEach((button) => {
    button.addEventListener('click', (event) => {
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const rect = button.getBoundingClientRect();
      ripple.style.left = `${event.clientX - rect.left}px`;
      ripple.style.top = `${event.clientY - rect.top}px`;
      button.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    });
  });

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = form.querySelector('input[name="name"]').value.trim();
      const email = form.querySelector('input[name="email"]').value.trim();
      const message = form.querySelector('textarea[name="message"]').value.trim();
      const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      window.location.href = `mailto:mernahatem474@gmail.com?subject=${subject}&body=${body}`;
      if (formMessage) {
        formMessage.textContent = 'Opening your email app...';
      }
    });
  }

  const typingTarget = document.querySelector('.typed-text');
  if (typingTarget) {
    const roles = ['Computer Engineering Student', 'Flutter Developer', 'Cybersecurity Enthusiast'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
      const current = roles[roleIndex];
      typingTarget.textContent = current.slice(0, charIndex);

      if (!isDeleting && charIndex < current.length) {
        charIndex += 1;
      } else if (!isDeleting && charIndex === current.length) {
        isDeleting = true;
        setTimeout(type, 1100);
        return;
      } else if (isDeleting && charIndex > 0) {
        charIndex -= 1;
      } else {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }

      setTimeout(type, isDeleting ? 70 : 110);
    };

    type();
  }
}

loadSections().catch((error) => {
  console.error(error);
  hideLoader();
});
