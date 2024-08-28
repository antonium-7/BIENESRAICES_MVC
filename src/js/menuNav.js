(function() {
    const menuBtn = document.getElementById('menu-btn');
    const menu = document.getElementById('menu-items');
    const body = document.body;

    // Función para mostrar el menú
    function toggleMenu() {
        menu.classList.toggle('translate-x-full');
        menu.classList.toggle('translate-x-0');
    }

    // Mostrar el menú al hacer clic en el botón
    menuBtn.addEventListener('click', function(event) {
        event.stopPropagation(); // Evita que el clic en el botón se propague
        toggleMenu();
    });

    // Ocultar el menú al hacer clic fuera del menú
    document.addEventListener('click', function(event) {
        if (!menu.contains(event.target) && !menuBtn.contains(event.target)) {
            if (!menu.classList.contains('translate-x-full')) {
                toggleMenu();
            }
        }
    });

    // También puedes ocultar el menú al hacer clic en el botón de menú si está visible
    menu.addEventListener('click', function(event) {
        event.stopPropagation(); // Evita que el clic en el menú se propague
    });
})();