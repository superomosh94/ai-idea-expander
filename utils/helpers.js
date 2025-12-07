const marked = require('marked');

/**
 * Helper utilities
 */

/**
 * Format date to readable string
 */
function formatDate(date) {
    if (!date) return '';

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };

    return new Date(date).toLocaleDateString('en-US', options);
}

/**
 * Get relative time (e.g., "2 hours ago")
 */
function getRelativeTime(date) {
    if (!date) return '';

    const now = new Date();
    const diff = now - new Date(date);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return 'just now';
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    if (days === 1) return '1 day ago';
    if (days < 30) return `${days} days ago`;
    if (months === 1) return '1 month ago';
    if (months < 12) return `${months} months ago`;
    if (years === 1) return '1 year ago';
    return `${years} years ago`;
}

/**
 * Truncate text to specified length
 */
function truncate(text, length = 100) {
    if (!text || text.length <= length) return text;
    return text.substring(0, length) + '...';
}

/**
 * Convert markdown to HTML
 */
function markdownToHtml(markdown) {
    if (!markdown) return '';
    return marked.parse(markdown);
}

/**
 * Get status badge class
 */
function getStatusBadgeClass(status) {
    const statusClasses = {
        draft: 'bg-secondary',
        expanded: 'bg-success',
        archived: 'bg-warning'
    };

    return statusClasses[status] || 'bg-secondary';
}

/**
 * Get section icon based on type
 */
function getSectionIcon(sectionType) {
    const icons = {
        problem: '🎯',
        users: '👥',
        features: '⚡',
        workflow: '🔄',
        risks: '⚠️',
        metrics: '📊'
    };

    return icons[sectionType] || '📝';
}

/**
 * Get section title based on type
 */
function getSectionTitle(sectionType) {
    const titles = {
        problem: 'Problem Statement',
        users: 'Target Users',
        features: 'Core Features',
        workflow: 'User Workflow',
        risks: 'Risks & Challenges',
        metrics: 'Success Metrics'
    };

    return titles[sectionType] || 'Section';
}

/**
 * Generate pagination object
 */
function generatePagination(currentPage, totalPages, baseUrl) {
    const pages = [];
    const maxPages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(totalPages, startPage + maxPages - 1);

    if (endPage - startPage + 1 < maxPages) {
        startPage = Math.max(1, endPage - maxPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push({
            number: i,
            url: `${baseUrl}?page=${i}`,
            active: i === currentPage
        });
    }

    return {
        pages,
        hasPrevious: currentPage > 1,
        hasNext: currentPage < totalPages,
        previousUrl: currentPage > 1 ? `${baseUrl}?page=${currentPage - 1}` : null,
        nextUrl: currentPage < totalPages ? `${baseUrl}?page=${currentPage + 1}` : null,
        firstUrl: `${baseUrl}?page=1`,
        lastUrl: `${baseUrl}?page=${totalPages}`
    };
}

module.exports = {
    formatDate,
    getRelativeTime,
    truncate,
    markdownToHtml,
    getStatusBadgeClass,
    getSectionIcon,
    getSectionTitle,
    generatePagination
};
