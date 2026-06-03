document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.contact-form');
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const button = form.querySelector('button');
    button.textContent = 'Mensagem enviada!';
    button.disabled = true;
    setTimeout(() => {
      button.textContent = 'Enviar mensagem';
      button.disabled = false;
      form.reset();
    }, 1800);
  });
});
