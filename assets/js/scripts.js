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

document.addEventListener("DOMContentLoaded", function () {
    const categoryFilter = document.getElementById("filter-category");
    const formatFilter = document.getElementById("filter-format");
    const orderFilter = document.getElementById("filter-order");
    const photosContainer = document.getElementById("photos");

    // Fonction pour charger les filtres
    function populateFilters() {
        fetch(theme_ajax.ajax_url + "?action=get_filters_terms")
            .then((response) => response.json())
            .then((data) => {
                
                if (data.categories && categoryFilter) {
                    data.categories.forEach((category) => {
                        const option = document.createElement("option");
                        option.value = category.id;
                        option.textContent = category.name;
                        categoryFilter.appendChild(option);
                    });
                }

                if (data.formats && formatFilter) {
                    data.formats.forEach((format) => {
                        const option = document.createElement("option");
                        option.value = format.id;
                        option.textContent = format.name;
                        formatFilter.appendChild(option);
                    });
                }
            })
            .catch((error) =>
                console.error("Erreur lors du chargement des filtres :", error)
            );
    }

    // Fonction pour filtrer les photos
    function filterPhotos() {
        const category = categoryFilter ? categoryFilter.value : "";
        const format = formatFilter ? formatFilter.value : "";
        const order = orderFilter ? orderFilter.value : "DESC";

        const formData = new FormData();
        formData.append("action", "filter_photos");
        formData.append("category", category);
        formData.append("format", format);
        formData.append("order", order);
        formData.append("page", 1);

        fetch(theme_ajax.ajax_url, {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success && data.data.html) {
                    photosContainer.innerHTML = data.data.html;
                } else {
                    photosContainer.innerHTML = "<p>Aucune photo trouvée.</p>";
                }
            })
            .catch((error) =>
                console.error("Erreur lors du filtrage des photos :", error)
            );
    }

    // Charger les filtres au chargement de la page
    populateFilters();

    // Ajouter des écouteurs sur les filtres
    if (categoryFilter) {
        categoryFilter.addEventListener("change", filterPhotos);
    }
    if (formatFilter) {
        formatFilter.addEventListener("change", filterPhotos);
    }
    if (orderFilter) {
        orderFilter.addEventListener("change", filterPhotos);
    }
});


