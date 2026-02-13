document.getElementById('load-calendar').addEventListener('click', () => {
    const script = document.createElement('script');
    script.src = "https://zenamu.com/calendar/list.js";
    document.body.appendChild(script);
});