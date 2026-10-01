(function () {
    const root = document.documentElement;
    const themeToggle = document.getElementById("themeToggle");
    const sidebar = document.getElementById("sidebar");
    const mobileMenuButton = document.getElementById("mobileMenuButton");
    const navItems = Array.from(document.querySelectorAll(".nav-item"));
    const tocItems = Array.from(document.querySelectorAll(".toc a"));
    const sections = Array.from(document.querySelectorAll(".doc-section"));

    const savedTheme = localStorage.getItem("topspin-docs-theme");
    if (savedTheme) {
        root.setAttribute("data-theme", savedTheme);
    }

    themeToggle.addEventListener("click", function () {
        const current = root.getAttribute("data-theme");
        const next = current === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        localStorage.setItem("topspin-docs-theme", next);
    });

    mobileMenuButton.addEventListener("click", function () {
        sidebar.classList.toggle("open");
    });

    navItems.forEach(function (item) {
        item.addEventListener("click", function () {
            sidebar.classList.remove("open");
        });
    });

    function setActiveLink(id) {
        navItems.forEach(function (item) {
            item.classList.toggle("active", item.getAttribute("href") === "#" + id);
        });

        tocItems.forEach(function (item) {
            item.classList.toggle("active", item.getAttribute("href") === "#" + id);
        });
    }

    const observer = new IntersectionObserver(function (entries) {
        const visible = entries
            .filter(function (entry) { return entry.isIntersecting; })
            .sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top; });

        if (visible.length) {
            setActiveLink(visible[0].target.id);
        }
    }, {
        rootMargin: "-90px 0px -68% 0px",
        threshold: 0
    });

    sections.forEach(function (section) {
        observer.observe(section);
    });

    document.querySelectorAll(".copy-button").forEach(function (button) {
        button.addEventListener("click", async function () {
            const code = button.closest(".code-block").querySelector("code").innerText;
            const original = button.textContent;

            try {
                await navigator.clipboard.writeText(code);
                button.textContent = "Copied";
            } catch (e) {
                const textarea = document.createElement("textarea");
                textarea.value = code;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand("copy");
                textarea.remove();
                button.textContent = "Copied";
            }

            setTimeout(function () {
                button.textContent = original;
            }, 1300);
        });
    });

    const searchTrigger = document.getElementById("searchTrigger");
    const searchModal = document.getElementById("searchModal");
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");

    const searchIndex = sections.map(function (section) {
        return {
            id: section.id,
            title: section.dataset.title || section.querySelector("h2, h1").textContent,
            text: section.innerText.replace(/\s+/g, " ").trim()
        };
    });

    function openSearch() {
        searchModal.classList.add("open");
        searchModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        setTimeout(function () { searchInput.focus(); }, 20);
    }

    function closeSearch() {
        searchModal.classList.remove("open");
        searchModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        searchInput.value = "";
        searchResults.innerHTML = '<div class="search-empty">Start typing to search the documentation.</div>';
    }

    searchTrigger.addEventListener("click", openSearch);
    document.querySelector("[data-close-search]").addEventListener("click", closeSearch);

    document.addEventListener("keydown", function (event) {
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
            event.preventDefault();
            openSearch();
        }

        if (event.key === "Escape" && searchModal.classList.contains("open")) {
            closeSearch();
        }
    });

    searchInput.addEventListener("input", function () {
        const query = searchInput.value.trim().toLowerCase();

        if (!query) {
            searchResults.innerHTML = '<div class="search-empty">Start typing to search the documentation.</div>';
            return;
        }

        const matches = searchIndex.filter(function (item) {
            return item.title.toLowerCase().includes(query) || item.text.toLowerCase().includes(query);
        }).slice(0, 8);

        if (!matches.length) {
            searchResults.innerHTML = '<div class="search-empty">No results found for “' + escapeHtml(query) + '”.</div>';
            return;
        }

        searchResults.innerHTML = matches.map(function (item) {
            const lowerText = item.text.toLowerCase();
            const matchIndex = lowerText.indexOf(query);
            const start = Math.max(0, matchIndex - 55);
            const end = Math.min(item.text.length, matchIndex + query.length + 95);
            const excerpt = item.text.slice(start, end);

            return '<a class="search-result" href="#' + item.id + '">' +
                '<strong>' + escapeHtml(item.title) + '</strong>' +
                '<span>' + escapeHtml((start > 0 ? "…" : "") + excerpt + (end < item.text.length ? "…" : "")) + '</span>' +
                '</a>';
        }).join("");

        searchResults.querySelectorAll(".search-result").forEach(function (result) {
            result.addEventListener("click", closeSearch);
        });
    });

    function escapeHtml(value) {
        return value
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
})();
