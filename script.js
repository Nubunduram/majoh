(() => {
    'use strict';

    const CALENDAR_SRC = 'https://zenamu.com/calendar/list.js';
    const RENDER_TIMEOUT_MS = 5000;

    const calendarSection = document.getElementById('zenamu-calendar');
    const contactSection = document.getElementById('contact');

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';

    function scrollToElement(element) {
        if (element) element.scrollIntoView({ behavior: scrollBehavior });
    }

    /* ============================================
       CALENDRIER ZENAMU
       ============================================ */

    let calendarPromise = null;

    function showCalendarError() {
        if (!calendarSection) return;
        const message = document.createElement('p');
        message.className = 'calendar-error';
        message.setAttribute('role', 'alert');
        message.textContent =
            "Le calendrier n'a pas pu se charger. Réessayez dans un instant " +
            "ou contactez-nous par mail ou par téléphone (coordonnées en bas de page).";
        calendarSection.appendChild(message);
    }

    /**
     * Charge le script Zenamu une seule fois et retourne une Promise
     * qui se résout quand le calendrier est affiché (ou après un délai maximum).
     * La Promise ne rejette jamais : en cas d'erreur, un message est affiché
     * et un nouveau clic relancera le chargement.
     */
    function loadCalendar() {
        if (!calendarSection) return Promise.resolve();
        if (calendarPromise) return calendarPromise;

        const previousError = calendarSection.querySelector('.calendar-error');
        if (previousError) previousError.remove();

        calendarPromise = new Promise((resolve) => {
            let timer;

            const observer = new MutationObserver(() => {
                if (calendarSection.childElementCount > 0) done();
            });

            function done() {
                clearTimeout(timer);
                observer.disconnect();
                resolve();
            }

            function fail() {
                calendarPromise = null;
                showCalendarError();
                done();
            }

            observer.observe(calendarSection, { childList: true, subtree: true });
            timer = setTimeout(done, RENDER_TIMEOUT_MS);

            const script = document.createElement('script');
            script.src = CALENDAR_SRC;
            script.async = true;
            script.onerror = fail;
            document.body.appendChild(script);
        });

        return calendarPromise;
    }

    // Bouton "Voir les disponibilités" (CTA) → charge puis scroll vers le calendrier
    const loadBtn = document.getElementById('load-calendar');
    if (loadBtn && calendarSection) {
        loadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loadCalendar().then(() => scrollToElement(calendarSection));
        });
    }

    // Boutons "Réserver" (header, hero…) → préchargent le calendrier
    // en arrière-plan et scrollent vers la CTA
    if (contactSection) {
        document.querySelectorAll('a.btn[href="#contact"]').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                loadCalendar();
                scrollToElement(contactSection);
            });
        });
    }

    /* ============================================
       FAQ
       ============================================ */

    document.querySelectorAll('.faq-item').forEach((item) => {
        const button = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (!button || !answer) return;

        // Relie la réponse à sa question pour les lecteurs d'écran
        if (!button.id && answer.id) button.id = `${answer.id}-button`;
        if (button.id) answer.setAttribute('aria-labelledby', button.id);

        // Une réponse fermée ne doit pas être atteignable au clavier
        // ni lue par les lecteurs d'écran (liens mail/tél inclus)
        const setOpen = (open) => {
            item.classList.toggle('active', open);
            button.setAttribute('aria-expanded', String(open));
            answer.inert = !open;
        };

        setOpen(item.classList.contains('active'));

        button.addEventListener('click', () => {
            setOpen(!item.classList.contains('active'));
        });
    });

    /* ============================================
       NAV : lien actif
       ============================================ */

    // Ignore "index.html", ".html" et le "/" final pour que /location/yoga-gagny,
    // /location/yoga-gagny.html et /location/yoga-gagny/ soient équivalents
    function normalizePath(path) {
        let normalized = path.toLowerCase().replace(/index\.html$/, '').replace(/\.html$/, '');
        if (normalized.length > 1) normalized = normalized.replace(/\/+$/, '');
        return normalized || '/';
    }

    const currentPath = normalizePath(window.location.pathname);

    document.querySelectorAll('.nav-links a').forEach((link) => {
        const isCurrent = normalizePath(new URL(link.href).pathname) === currentPath;
        link.classList.toggle('active', isCurrent);
        if (isCurrent) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
})();