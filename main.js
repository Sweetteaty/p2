
        let currentPage = 0;
        const resultsPerPage = 20;

        document.getElementById('searchInput').addEventListener('keydown', function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                searchUsers();
            }
        });

        async function searchUsers() {
            let query = document.getElementById('searchInput').value.trim();
            let resultsDiv = document.getElementById('results');
            let paginationDiv = document.getElementById('pagination');

            if (query.length < 2) {
                resultsDiv.innerHTML = "<p>Type at least 2 characters...</p>";
                paginationDiv.innerHTML = "";
                return;
            }

            let url = `https://api.giphy.com/v1/gifs/search?api_key=RTQ4mSw5Xl4dSYRmurYUwhEpqSpRmBTA&q=${encodeURIComponent(query)}&limit=${resultsPerPage}&offset=${currentPage * resultsPerPage}&rating=g&lang=en`;
            
            try {
                let response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                let data = await response.json();
                
                if (!data.data || !Array.isArray(data.data)) throw new Error("Invalid API response format");

                resultsDiv.innerHTML = data.data.length > 0 
                    ? data.data.map(gif => `<img src="${gif.images.fixed_height.url}" alt="${gif.title}" class="m-2 img-fluid rounded">`).join("") 
                    : "<p>No results found.</p>";

                paginationDiv.innerHTML = generatePaginationButtons(query, data.pagination.total_count);

            } catch (error) {
                console.error("Error fetching GIFs:", error);
                resultsDiv.innerHTML = "<p>Something went wrong. Please try again.</p>";
            }
        }

        function generatePaginationButtons(query, totalResults) {
            let totalPages = Math.ceil(totalResults / resultsPerPage);
            let paginationHTML = "";

            // Previous button
            if (currentPage > 0) {
                paginationHTML += `<li class="page-item">
                    <a class="page-link" href="#" onclick="changePage(${currentPage - 1}, '${query}')">Previous</a>
                </li>`;
            }

            // Page numbers
            let startPage = Math.max(0, currentPage - 2);
            let endPage = Math.min(totalPages, currentPage + 3);

            for (let i = startPage; i < endPage; i++) {
                paginationHTML += `<li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${i}, '${query}')">${i + 1}</a>
                </li>`;
            }

            // Next button
            if (currentPage < totalPages - 1) {
                paginationHTML += `<li class="page-item">
                    <a class="page-link" href="#" onclick="changePage(${currentPage + 1}, '${query}')">Next</a>
                </li>`;
            }

            return paginationHTML;
        }

        function changePage(page, query) {
            currentPage = page;
            searchUsers();
        }
        