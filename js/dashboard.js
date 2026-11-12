
const DASHBOARD_API_URL = "http://localhost:5000/api";

document.addEventListener("DOMContentLoaded", async () => {

    // Get logged-in user and token
    let user;

    try {
        user = JSON.parse(localStorage.getItem("inkspireCurrentUser"));
    } catch (error) {
        user = null;
    }

    const token = localStorage.getItem("inkspireToken");

    if (!user || !token) {
        window.location.href = "login.html";
        return;
    }

    // HTML elements
    const greeting = document.getElementById("userGreeting");
    const totalBlogs = document.getElementById("totalBlogs");
    const recentBlogs = document.getElementById("recentBlogs");
    const grid = document.getElementById("dashboardBlogGrid");
    const empty = document.getElementById("emptyState");
    const logoutBtn = document.getElementById("logoutBtn");

    // Display username
    if (greeting) {
        greeting.textContent = "Hello, " + (user.name || "Creator");
    }

    // Load blogs from MongoDB
    async function loadDashboardBlogs() {
        try {
            const response = await fetch(`${DASHBOARD_API_URL}/blogs`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to load blogs.");
            }

            const allBlogs = data.blogs || [];

            // Identify current user
            const currentUserId = String(user._id || user.id || "");
            const currentEmail = (user.email || "").toLowerCase();

            // Filter current user's stories
            const myBlogs = allBlogs.filter(blog => {
                const author = blog.author;

                if (!author) return false;

                if (typeof author === "object") {
                    const authorId = String(author._id || author.id || "");
                    const authorEmail = (author.email || "").toLowerCase();

                    return (
                        (currentUserId && authorId === currentUserId) ||
                        (currentEmail && authorEmail === currentEmail)
                    );
                }

                return currentUserId && String(author) === currentUserId;
            });

            // Update total stories count
            totalBlogs.textContent = myBlogs.length;

            // Recently created stories
            const sevenDays = 7 * 24 * 60 * 60 * 1000;

            const recent = myBlogs.filter(blog => {
                const created = new Date(blog.createdAt).getTime();

                return (
                    !isNaN(created) &&
                    Date.now() - created >= 0 &&
                    Date.now() - created < sevenDays
                );
            });

            recentBlogs.textContent = recent.length;

            // Empty state
            if (myBlogs.length === 0) {
                grid.innerHTML = "";
                empty.hidden = false;
                return;
            }

            empty.hidden = true;

            // Display stories
            grid.innerHTML = myBlogs
                .map(blog => blogCard(blog, true))
                .join("");

            // Edit story
            grid.querySelectorAll("[data-edit]").forEach(button => {
                button.addEventListener("click", () => {
                    const id = button.dataset.edit;
                    window.location.href =
                        `create-blog.html?edit=${encodeURIComponent(id)}`;
                });
            });

            // Delete story
            grid.querySelectorAll("[data-delete]").forEach(button => {
                button.addEventListener("click", async () => {
                    const id = button.dataset.delete;

                    if (!confirm("Are you sure you want to delete this story?")) {
                        return;
                    }

                    try {
                        const deleteResponse = await fetch(
                            `${DASHBOARD_API_URL}/blogs/${id}`,
                            {
                                method: "DELETE",
                                headers: {
                                    "Authorization": `Bearer ${token}`
                                }
                            }
                        );

                        const deleteData = await deleteResponse.json();

                        if (!deleteResponse.ok || !deleteData.success) {
                            alert(deleteData.message || "Delete failed.");
                            return;
                        }

                        alert("Story deleted successfully!");
                        await loadDashboardBlogs();

                    } catch (error) {
                        console.error("Delete Error:", error);
                        alert("Unable to connect to server.");
                    }
                });
            });

        } catch (error) {
            console.error("Dashboard Error:", error);
            grid.innerHTML =
                "<p>Unable to load stories. Please refresh the page.</p>";
        }
    }

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("inkspireCurrentUser");
            localStorage.removeItem("inkspireToken");
            window.location.href = "index.html";
        });
    }

    // Initial load
    await loadDashboardBlogs();
});
