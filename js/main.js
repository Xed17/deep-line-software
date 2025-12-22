/**
 * NexDev Studio - Main Application Logic
 * * Contiene:
 * 1. Lógica de cambio de tema (Claro/Oscuro)
 * 2. Barra de progreso de lectura (Scroll Progress)
 * 3. Navegación móvil
 * 4. Scroll suave (Smooth Scroll)
 * 5. Animaciones de entrada (Intersection Observer)
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Theme Toggle Logic ---
    const html = document.documentElement;
    // Nota: El script anti-flash en el head ya seteó el atributo inicial

    window.toggleTheme = function () {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    // --- 2. Scroll Progress Bar (Optimized) ---
    const scrollProgress = document.getElementById('scrollProgress');
    let isScrolling = false;

    function updateProgressBar() {
        const scrollPx = document.documentElement.scrollTop;
        const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = `${(scrollPx / winHeightPx) * 100}%`;

        if (scrollProgress) {
            scrollProgress.style.width = scrolled;
        }
        isScrolling = false;
    }

    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(updateProgressBar);
            isScrolling = true;
        }
    });

    // --- 3. Mobile Menu Logic ---
    const btnMobile = document.getElementById('mobile-menu-btn');
    const menuMobile = document.getElementById('mobile-menu');

    if (btnMobile && menuMobile) {
        btnMobile.addEventListener('click', () => {
            menuMobile.classList.toggle('hidden');
            menuMobile.classList.toggle('flex');
        });

        // Cerrar menú al hacer click en links
        menuMobile.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuMobile.classList.add('hidden');
                menuMobile.classList.remove('flex');
            });
        });
    }

    // --- 4. Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // --- 5. Intersection Observer (Fade In Animations) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target); // Animar solo una vez
            }
        });
    }, observerOptions);

    // Seleccionar elementos a animar que no tengan ya la clase (si se cargó estático)
    const elementsToAnimate = document.querySelectorAll('.glass-card, .section-badge, .stat-card, .project-image, .tech-badge');

    elementsToAnimate.forEach((el, index) => {
        // Forzar opacidad inicial 0 vía JS para asegurar la animación
        el.style.opacity = '0';
        // Añadir pequeño delay escalonado si están en grupo (opcional)
        // el.style.animationDelay = `${index * 0.05}s`; 
        observer.observe(el);
    });
    // ... (Tu código anterior del menú, scroll, etc.) ...

    // --- 6. Typewriter Effect (Máquina de Escribir) ---
    const typewriterElement = document.getElementById('typewriter');

    if (typewriterElement) {
        const phrases = [
            "Soluciones Reales",
            "Apps Móviles",
            "Software a Medida",
            "Experiencias Únicas"
        ];

        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100; // Velocidad al escribir

        function type() {
            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                // Borrando
                typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50; // Borra más rápido
            } else {
                // Escribiendo
                typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100; // Escribe a velocidad normal
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                // Frase completa, esperar antes de borrar
                isDeleting = true;
                typeSpeed = 2000; // Pausa de 2 segundos al terminar la frase
            } else if (isDeleting && charIndex === 0) {
                // Frase borrada completa, pasar a la siguiente
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length; // Bucle infinito
                typeSpeed = 500; // Pequeña pausa antes de empezar la nueva
            }

            setTimeout(type, typeSpeed);
        }

        // Iniciar el efecto
        type();
    }
    // ... tu código anterior ...

    // --- 6. Scroll To Top Logic (Robust) ---
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            // Si bajamos más de 300px
            if (window.scrollY > 300) {
                // Hacemos visible el botón
                scrollTopBtn.classList.remove('opacity-0', 'translate-y-10');
                scrollTopBtn.classList.add('opacity-100', 'translate-y-0');
            } else {
                // Ocultamos el botón (bajándolo y haciéndolo transparente)
                scrollTopBtn.classList.add('opacity-0', 'translate-y-10');
                scrollTopBtn.classList.remove('opacity-100', 'translate-y-0');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ... (Tu código anterior) ...

    // --- 7. ScrollSpy (Menú Activo Inteligente) ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightMenu() {
        let current = '';
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // 150px es un "offset" para que detecte la sección un poco antes de llegar
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            // Comparamos el href del link (#inicio) con el id actual (inicio)
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    }

    // Ejecutar al hacer scroll
    window.addEventListener('scroll', highlightMenu);


    // --- 8. Animated Stats Counters (Contadores Animados) ---
    const stats = document.querySelectorAll('.stat-number');

    // Función para animar un contador individual
    const animateCount = (el) => {
        const originalText = el.innerText; // Ej: "10+" o "100%"
        const target = parseInt(originalText.replace(/\D/g, '')); // Extrae solo números (10)
        const suffix = originalText.replace(/[0-9]/g, ''); // Extrae lo que no es número (+ o %)

        const duration = 2000; // Duración en ms (2 segundos)
        const stepTime = 20;   // Actualizar cada 20ms
        const steps = duration / stepTime;
        const increment = target / steps;

        let current = 0;

        const timer = setInterval(() => {
            current += increment;

            if (current >= target) {
                el.innerText = target + suffix; // Asegurar valor final exacto
                clearInterval(timer);
            } else {
                el.innerText = Math.ceil(current) + suffix;
            }
        }, stepTime);
    };

    // Usamos Intersection Observer para animar SOLO cuando se ve en pantalla
    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                observer.unobserve(entry.target); // Animar solo una vez
            }
        });
    }, { threshold: 0.5 }); // Se activa cuando el 50% del número es visible

    stats.forEach(stat => {
        statsObserver.observe(stat);
    });
    // ... tu código anterior ...

    // --- 9. FAQ Accordion Logic ---
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');

        header.addEventListener('click', () => {
            // Cerrar otros items abiertos (opcional, para efecto acordeón único)
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-content').style.height = '0';
                }
            });

            // Toggle del item actual
            item.classList.toggle('active');
            const content = item.querySelector('.faq-content');

            if (item.classList.contains('active')) {
                // Abrir: Asignamos la altura real del contenido (scrollHeight)
                content.style.height = content.scrollHeight + 'px';
            } else {
                // Cerrar
                content.style.height = '0';
            }
        });
    });
});