
const BLOG_API_URL = "http://localhost:5000/api";

// Get logged-in user and token
function getAuthData() {
    try {
        return {
            user: JSON.parse(localStorage.getItem("inkspireCurrentUser")),
            token: localStorage.getItem("inkspireToken")
        };
    } catch (error) {
        return { user: null, token: null };
    }
}

// Show messages
function showMessage(message, success = false) {
    const msg = document.getElementById("blogMessage");

    if (msg) {
        msg.textContent = message;
        msg.className = "form-message" + (success ? " success" : "");
    }
}

// Initialize blog form
document.addEventListener("DOMContentLoaded", async () => {
    const { user, token } = getAuthData();

    if (!user || !token) {
        window.location.href = "login.html";
        return;
    }

    const form = document.getElementById("blogForm");
    const title = document.getElementById("blogTitle");
    const category = document.getElementById("blogCategory");
    const image = document.getElementById("blogImage");
    const content = document.getElementById("blogContent");
    const preview = document.getElementById("imagePreview");
    const counter = document.getElementById("wordCount");

    if (!form || !title || !category || !image || !content) {
        console.error("Blog form elements are missing.");
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const editId = params.get("edit");

    // Image preview
    function previewImage() {
        const url = image.value.trim();

        preview.innerHTML = "";

        if (url) {
            const img = document.createElement("img");
            img.src = url;
            img.alt = "Cover preview";

            img.onerror = () => {
                preview.textContent = "Image could not be loaded.";
            };

            preview.appendChild(img);
        } else {
            preview.textContent = "Cover image preview will appear here";
        }
    }

    image.addEventListener("input", previewImage);

    // Word counter
    function updateWordCount() {
        const words = content.value.trim()
            ? content.value.trim().split(/\s+/).length
            : 0;

        if (counter) {
            counter.textContent = words + " words";
        }
    }

    content.addEventListener("input", updateWordCount);

    // Load existing blog for editing
    if (editId) {
        try {
            const response = await fetch(`${BLOG_API_URL}/blogs/${editId}`);
            const data = await response.json();

            if (!response.ok || !data.blog) {
                showMessage(data.message || "Blog not found.");
                return;
            }

            const blog = data.blog;

            title.value = blog.title || "";
            category.value = blog.category || "";
            image.value = blog.image || "";
            content.value = blog.content || "";

            previewImage();
            updateWordCount();

            const heading = document.querySelector(".editor-heading h1");
            const button = document.querySelector(".editor-footer button");

            if (heading) {
                heading.textContent = "Edit your story.";
            }

            if (button) {
                button.textContent = "Save changes ↗";
            }

        } catch (error) {
            console.error("Load Blog Error:", error);
            showMessage("Unable to load blog. Check backend connection.");
            return;
        }
    }

    // Create or Update Blog
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const blogData = {
            title: title.value.trim(),
            content: content.value.trim(),
            category: category.value,
            image: image.value.trim()
        };

        if (!blogData.title || !blogData.content || !blogData.category) {
            showMessage("Please fill in the title, category and story.");
            return;
        }

        if (blogData.content.length < 20) {
            showMessage("Story must contain at least 20 characters.");
            return;
        }

        const submitButton = form.querySelector('button[type="submit"]');

        try {
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Publishing...";
            }

            const url = editId
                ? `${BLOG_API_URL}/blogs/${editId}`
                : `${BLOG_API_URL}/blogs`;

            const method = editId ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(blogData)
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                showMessage(data.message || "Unable to save blog.");
                return;
            }

            showMessage(
                editId
                    ? "Story updated successfully!"
                    : "Your story has been published!",
                true
            );

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);

        } catch (error) {
            console.error("Save Blog Error:", error);
            showMessage("Cannot connect to backend server. Please check it.");
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = editId
                    ? "Save changes ↗"
                    : "Publish story ↗";
            }
        }
    });

    previewImage();
    updateWordCount();
});
