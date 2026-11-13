
const API_URL = "http://localhost:5000/api";

const demoBlogs = [
    {
        _id: "demo-1",
        title: "The quiet art of starting again",
        category: "Lifestyle",
        content: "A fresh start does not need a perfect plan. Sometimes it begins with one small choice, one curious question, or one page written just for yourself.",
        image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=85",
        author: { name: "Inkspire Editors" },
        createdAt: "2026-11-02"
    },
    {
        _id: "demo-2",
        title: "Building a better digital tomorrow",
        category: "Technology",
        content: "Technology is most powerful when it helps people solve real problems. Great products begin with empathy, experimentation, and a willingness to learn.",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=85",
        author: { name: "Inkspire Editors" },
        createdAt: "2026-10-28"
    },
    {
        _id: "demo-3",
        title: "Make creativity a daily habit",
        category: "Creativity",
        content: "Creativity grows when we make space for it. Collect ideas, follow unexpected paths, and give yourself permission to make imperfect things.",
        image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=85",
        author: { name: "Inkspire Editors" },
        createdAt: "2026-10-20"
    }
];

const escapeHTML = (value) =>
    String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);

function formatDate(date) {
    if (!date) return "Recently";

    return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric"
    });
}

// Blog Card
function blogCard(blog, owner = false) {
    const authorName =
        typeof blog.author === "object"
            ? blog.author?.name
            : blog.author;

    const excerpt = escapeHTML(
        (blog.content || "").slice(0, 135)
    ) + (blog.content?.length > 135 ? "…" : "");

    const image = blog.image ||
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=900";

    return `
        <article class="blog-card">
            <img
                class="blog-cover"
                src="${escapeHTML(image)}"
                alt="${escapeHTML(blog.title)} cover"
                onerror="this.style.display='none'"
            >

            <div class="blog-card-body">
                <div class="blog-meta">
                    <span class="category-pill">
                        ${escapeHTML(blog.category || "General")}
                    </span>
                    <span>${escapeHTML(formatDate(blog.createdAt || blog.date))}</span>
                </div>

                <h3>${escapeHTML(blog.title)}</h3>

                <p class="blog-excerpt">${excerpt}</p>

                <div class="card-bottom">
                    <span>By ${escapeHTML(authorName || "Writer")}</span>
                    ${owner ? `
                        <div class="card-actions">
                            <button class="small-action"
                                data-edit="${escapeHTML(blog._id)}">Edit</button>
                            <button class="small-action danger"
                                data-delete="${escapeHTML(blog._id)}">Delete</button>
                        </div>
                    ` : `
                        <span class="read-link">Read story ↗</span>
                    `}
                </div>
            </div>
        </article>
    `;
}

// Get Blogs from MongoDB
async function getBlogsFromAPI() {
    try {
        const response = await fetch(`${API_URL}/blogs`);
        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Unable to load blogs");
        }

        return data.blogs || [];

    } catch (error) {
        console.error("Blog API Error:", error);
        return [];
    }
}

// Search and Category State
let homeBlogs = [];
let activeFilter = "All";
let searchQuery = "";

// Render Home Blogs
function renderHome() {
    const target = document.getElementById("homeBlogGrid");
    const searchMessage = document.getElementById("searchMessage");

    if (!target) return;

    const filteredBlogs = homeBlogs.filter(blog => {

        const title = (blog.title || "").toLowerCase();
        const content = (blog.content || "").toLowerCase();
        const category = (blog.category || "General").toLowerCase();

        const matchesCategory =
            activeFilter === "All" ||
            category === activeFilter.toLowerCase();

        const matchesSearch =
            title.includes(searchQuery) ||
            content.includes(searchQuery);

        return matchesCategory && matchesSearch;
    });

    target.innerHTML = filteredBlogs.length
        ? filteredBlogs.map(blog => blogCard(blog)).join("")
        : `<p class="empty-state">No stories found. Try another search!</p>`;

    if (searchMessage) {
        searchMessage.hidden = filteredBlogs.length > 0;
    }
}

// Load Blogs
async function loadHomeBlogs() {
    const target = document.getElementById("homeBlogGrid");

    if (!target) return;

    target.innerHTML = "<p>Loading stories...</p>";

    const blogs = await getBlogsFromAPI();

    homeBlogs = [...blogs, ...demoBlogs];

    renderHome();
}

// Page Initialization
document.addEventListener("DOMContentLoaded", () => {

    // Current Year
    const year = document.getElementById("year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }

    // Load Blogs
    loadHomeBlogs();

    // Category Filter
    document.querySelectorAll("[data-filter]").forEach(button => {

        button.addEventListener("click", () => {

            document.querySelectorAll("[data-filter]").forEach(btn =>
                btn.classList.remove("selected")
            );

            button.classList.add("selected");

            activeFilter = button.dataset.filter || "All";

            renderHome();
        });
    });

    // Search Functionality
    const searchInput = document.getElementById("blogSearch");
    const clearButton = document.getElementById("clearSearch");

    if (searchInput) {

        searchInput.addEventListener("input", () => {

            searchQuery = searchInput.value.trim().toLowerCase();

            if (clearButton) {
                clearButton.hidden = searchQuery.length === 0;
            }

            renderHome();
        });
    }

    // Clear Search
    if (clearButton && searchInput) {

        clearButton.addEventListener("click", () => {

            searchInput.value = "";
            searchQuery = "";

            clearButton.hidden = true;

            renderHome();

            searchInput.focus();
        });
    }

    // Mobile Navigation
    const toggle = document.querySelector(".menu-toggle");

    if (toggle) {
        toggle.addEventListener("click", () => {

            const links = document.querySelector(".nav-links");

            links?.classList.toggle("open");

            toggle.setAttribute(
                "aria-expanded",
                links?.classList.contains("open") ? "true" : "false"
            );
        });
    }
});
