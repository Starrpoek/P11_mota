document.addEventListener('DOMContentLoaded', function() {
    const openModalButton = document.querySelector('a[href="#contactModal"]');
    const openPhotoModalButton = document.getElementById('openPhotoModal');
    const modal = document.getElementById('contactModal');
    const closeModalButton = document.getElementById('closeModal');

    function openModal(event) {
        event.preventDefault();
        if (modal) {
            modal.style.display = 'block';
            if (event.target && event.target.dataset.reference) {
                const referenceValue = event.target.dataset.reference;
                const formReferenceField = document.getElementById('reference');
                if (formReferenceField) {
                    formReferenceField.value = referenceValue;
                }
            }
        }
    }

    if (openModalButton) {
        openModalButton.addEventListener('click', openModal);
    }

    if (openPhotoModalButton) {
        openPhotoModalButton.addEventListener('click', openModal);
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
