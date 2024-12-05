const menu_button = document.getElementById("menu");

menu_button.addEventListener('click', () => {
    document.getElementById('serial_control_bar').classList.toggle('hidden');
})