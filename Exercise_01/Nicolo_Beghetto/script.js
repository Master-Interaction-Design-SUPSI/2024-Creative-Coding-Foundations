
document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;
    alert(`Grazie ${name}, il tuo messaggio è stato inviato!`);
    this.reset();
});

document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;

    const guantoneSx = document.getElementById('guantoneSx');
    const guantoneDx = document.getElementById('guantoneDx');

    guantoneSx.style.animationName = 'punch-left';
    guantoneSx.classList.add('punch');

    guantoneDx.style.animationName = 'punch-right';
    guantoneDx.classList.add('punch');

    setTimeout(() => {
        this.reset();
        guantoneSx.style.opacity = '0';
        guantoneDx.style.opacity = '0';
        guantoneSx.classList.remove('punch');
        guantoneDx.classList.remove('punch');
    }, 1500);
});

