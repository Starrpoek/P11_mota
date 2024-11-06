document.addEventListener('DOMContentLoaded', function() {
    const openModalButton = document.querySelector('a[href="#contactModal"]');
    const modal = document.getElementById('contactModal');
    const closeModalButton = document.getElementById('closeModal');

    if (openModalButton) {
        openModalButton.addEventListener('click', function(event) {
            event.preventDefault();
            if (modal) {
                modal.style.display = 'block';
            }
        });
    }

    if (closeModalButton) {
        closeModalButton.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', function(event) {
        if (modal && event.target === modal) {
            modal.style.display = 'none';
        }
    });
});
