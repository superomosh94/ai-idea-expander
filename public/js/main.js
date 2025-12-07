/**
 * Main JavaScript for AI Idea Expander
 */

// Show loading spinner
function showLoading(message = 'Processing...') {
    const overlay = document.createElement('div');
    overlay.className = 'spinner-overlay';
    overlay.id = 'loadingOverlay';
    overlay.innerHTML = `
        <div class="spinner-content">
            <div class="spinner-border text-primary mb-3" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mb-0 fw-semibold">${message}</p>
        </div>
    `;
    document.body.appendChild(overlay);
}

// Hide loading spinner
function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.remove();
    }
}

// Toggle favorite
document.querySelectorAll('.favorite-btn').forEach(btn => {
    btn.addEventListener('click', async function (e) {
        e.preventDefault();
        const ideaId = this.dataset.ideaId;
        const isFavorite = this.dataset.favorite === 'true';

        try {
            const response = await fetch(`/ideas/${ideaId}/favorite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (data.success) {
                const icon = this.querySelector('i');
                if (data.is_favorite) {
                    icon.className = 'bi bi-heart-fill text-danger';
                    this.dataset.favorite = 'true';
                } else {
                    icon.className = 'bi bi-heart';
                    this.dataset.favorite = 'false';
                }
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    });
});

// Auto-dismiss alerts after 5 seconds
document.addEventListener('DOMContentLoaded', function () {
    const alerts = document.querySelectorAll('.alert:not(.alert-permanent)');
    alerts.forEach(alert => {
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });
});

// Confirm delete actions
document.querySelectorAll('[data-confirm-delete]').forEach(element => {
    element.addEventListener('click', function (e) {
        const message = this.dataset.confirmDelete || 'Are you sure you want to delete this?';
        if (!confirm(message)) {
            e.preventDefault();
        }
    });
});

// Form validation enhancement
document.querySelectorAll('form[data-validate]').forEach(form => {
    form.addEventListener('submit', function (e) {
        if (!form.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
        }
        form.classList.add('was-validated');
    });
});

// Password strength indicator
const passwordInput = document.getElementById('password');
if (passwordInput) {
    passwordInput.addEventListener('input', function () {
        const strength = calculatePasswordStrength(this.value);
        updatePasswordStrengthUI(strength);
    });
}

function calculatePasswordStrength(password) {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    return strength;
}

function updatePasswordStrengthUI(strength) {
    const indicator = document.getElementById('passwordStrength');
    if (!indicator) return;

    const strengthTexts = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const strengthColors = ['danger', 'danger', 'warning', 'info', 'success', 'success'];

    indicator.className = `badge bg-${strengthColors[strength]}`;
    indicator.textContent = strengthTexts[strength];
}

// Search with debounce
let searchTimeout;
const searchInput = document.querySelector('input[name="search"]');
if (searchInput) {
    searchInput.addEventListener('input', function () {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            // Auto-submit search form
            const form = this.closest('form');
            if (form && this.value.length >= 3) {
                form.submit();
            }
        }, 500);
    });
}

// Tooltips initialization
document.addEventListener('DOMContentLoaded', function () {
    const tooltipTriggerList = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Copy to clipboard functionality
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy:', err);
        showToast('Failed to copy', 'danger');
    });
}

// Toast notification
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer') || createToastContainer();

    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;

    toastContainer.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();

    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container position-fixed top-0 end-0 p-3';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
    return container;
}

// Expand idea with loading state
const expandForms = document.querySelectorAll('form[action*="/expand"]');
expandForms.forEach(form => {
    form.addEventListener('submit', function (e) {
        showLoading('Expanding your idea with AI... This may take a moment.');
    });
});

// Character counter for textareas
document.querySelectorAll('textarea[maxlength]').forEach(textarea => {
    const maxLength = textarea.getAttribute('maxlength');
    const counter = document.createElement('div');
    counter.className = 'form-text text-end';
    counter.innerHTML = `<span class="char-count">0</span> / ${maxLength} characters`;

    textarea.parentNode.appendChild(counter);

    const countSpan = counter.querySelector('.char-count');

    textarea.addEventListener('input', function () {
        countSpan.textContent = this.value.length;
        if (this.value.length > maxLength * 0.9) {
            countSpan.classList.add('text-warning');
        } else {
            countSpan.classList.remove('text-warning');
        }
    });

    // Initialize count
    countSpan.textContent = textarea.value.length;
});

// Handle network errors
window.addEventListener('unhandledrejection', function (event) {
    console.error('Unhandled promise rejection:', event.reason);
    if (event.reason && event.reason.message) {
        showToast('An error occurred. Please try again.', 'danger');
    }
});

// Export functions for use in other scripts
window.aiIdeaExpander = {
    showLoading,
    hideLoading,
    showToast,
    copyToClipboard
};
