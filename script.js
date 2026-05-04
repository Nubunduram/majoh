let calendarLoaded = false;

const calendarSection = document.getElementById('zenamu-calendar');

/**
 * Charge le script Zenamu une seule fois.
 * Retourne true si le script vient d'être chargé (et qu'il faut donc attendre),
 * false s'il était déjà chargé.
 */
function loadCalendarScript() {
    if (calendarLoaded) return false;

    const script = document.createElement('script');
    script.src = "https://zenamu.com/calendar/list.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    calendarLoaded = true;
    return true;
}

/**
 * Scroll vers une cible en attendant que le calendrier soit chargé si besoin.
 */
function scrollToTarget(target, justLoaded) {
    if (!target) return;
    const delay = justLoaded ? 750 : 0;
    setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth' });
    }, delay);
}

// Bouton "Voir les disponibilités" (CTA en bas de page) → scroll vers le calendrier
const loadBtn = document.getElementById('load-calendar');
if (loadBtn && calendarSection) {
    loadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const justLoaded = loadCalendarScript();
        scrollToTarget(calendarSection, justLoaded);
    });
}

// Tous les boutons "Réserver" qui pointent vers #contact (header, hero, etc.)
// → préchargent le calendrier en arrière-plan et scrollent vers la CTA
const reserveBtns = document.querySelectorAll('a.btn[href="#contact"]');
const contactSection = document.getElementById('contact');
if (contactSection) {
    reserveBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            loadCalendarScript(); // pré-chargement en arrière-plan
            contactSection.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// FAQ : toggle + sync aria-expanded
document.querySelectorAll(".faq-question").forEach(button => {
    button.addEventListener("click", () => {
        const faqItem = button.parentElement;
        const isActive = faqItem.classList.toggle("active");
        button.setAttribute("aria-expanded", isActive ? "true" : "false");
    });
});

// Nav : marquer le lien actif selon la page courante
document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.href === window.location.href ||
        window.location.pathname.endsWith(new URL(link.href).pathname)) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
    }
});