document.addEventListener('DOMContentLoaded', function () {
    let page = 1;
    const contentContainer = document.querySelector('.homepage-photos__content');
    const loadMoreButton = document.querySelector('#load-more-button');
    const ajaxUrl = theme_ajax.ajax_url;
    let loading = false;

    function resetPagination() {
        page = 1;
        loadMoreButton.style.display = 'block'; // Réafficher le bouton
        loadMoreButton.textContent = 'Charger plus'; // Réinitialiser le texte du bouton
    }

    // Réinitialiser la pagination et le bouton lorsque les filtres changent
    document.getElementById("filter-category").addEventListener("change", resetPagination);
    document.getElementById("filter-format").addEventListener("change", resetPagination);
    document.getElementById("filter-order").addEventListener("change", resetPagination);

    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', function () {
            if (!loading) {
                loading = true;
                
                const category = document.getElementById("filter-category").value;
                const format = document.getElementById("filter-format").value;
                const order = document.getElementById("filter-order").value;

                const formData = new FormData();
                formData.append('action', 'load_more_photos');
                formData.append('page', page + 1);
                formData.append('category', category);
                formData.append('format', format);
                formData.append('order', order);

                loadMoreButton.textContent = 'Chargement...';

                fetch(ajaxUrl, {
                    method: 'POST',
                    body: formData,
                })
                    .then(response => response.text())
                    .then(data => {
                        if (data.trim() === '') {
                            loadMoreButton.style.display = 'none';
                        } else {
                            contentContainer.innerHTML += data;
                            page++;
                        }
                        loading = false;
                    })
                    .catch(error => {
                        console.error('Erreur lors du chargement des posts:', error);
                        loading = false;
                    });
            }
        });
    }
});
