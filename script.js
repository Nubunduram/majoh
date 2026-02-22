let calendarLoaded = false;

const loadBtn = document.getElementById('load-calendar');
const calendarSection = document.getElementById('zenamu-calendar');

loadBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if (!calendarLoaded) {
        // Charger le script Zenamu
        const script = document.createElement('script');
        script.src = "https://zenamu.com/calendar/list.js";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        calendarLoaded = true;

        setTimeout(() => {
            calendarSection.scrollIntoView({ behavior: 'smooth' });
        }, 750);
    } else {
        calendarSection.scrollIntoView({ behavior: 'smooth' });
    }
});

document.querySelectorAll(".faq-question").forEach(button => {
    button.addEventListener("click", () => {
        const faqItem = button.parentElement;
        faqItem.classList.toggle("active");
    });
});