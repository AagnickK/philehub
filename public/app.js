class PhileHub {
    constructor() {
        this.init();
        this.loadFiles();
        this.initTheme();
    }
    
    initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }
    
    updateThemeIcon(theme) {
        const icon = document.getElementById('themeIcon');
        icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    init() {
        // File upload
        const dropZone = document.getElementById('dropZone');
        const fileInput = document.getElementById('fileInput');
        
        dropZone.onclick = () => fileInput.click();
        fileInput.onchange = (e) => this.handleFiles(e.target.files);
        
        // Drag & drop
        dropZone.ondragover = (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        };
        dropZone.ondragleave = () => dropZone.classList.remove('dragover');
        dropZone.ondrop = (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            this.handleFiles(e.dataTransfer.files);
        };
    }



    async handleFiles(files) {
        for (const file of files) {
            if (file.size > 10 * 1024 * 1024) {
                this.showAlert(`File ${file.name} is too large (max 10MB)`, 'warning');
                continue;
            }
            await this.uploadFile(file);
        }
    }

    async uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                this.showAlert(`${file.name} uploaded successfully`, 'success');
                this.loadFiles();
            } else {
                this.showAlert(`Failed to upload ${file.name}`, 'danger');
            }
        } catch (error) {
            this.showAlert(`Upload failed: ${file.name}`, 'danger');
        }
    }

    async loadFiles() {
        try {
            const response = await fetch('/api/files');
            const files = await response.json();
            this.displayFiles(files);
        } catch (error) {
            this.showAlert('Failed to load files', 'danger');
        }
    }

    displayFiles(files) {
        const container = document.getElementById('filesList');
        if (files.length === 0) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i style="font-size: 4rem; opacity: 0.3;">📁</i>
                    <p class="text-muted mt-3">No files uploaded yet</p>
                    <small class="text-muted">Upload your first file to get started!</small>
                </div>
            `;
            return;
        }

        container.innerHTML = files.map(file => `
            <div class="file-item d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <div class="me-3">
                        <i style="font-size: 1.5rem;">${this.getFileIcon(file.filename)}</i>
                    </div>
                    <div>
                        <strong>${file.filename}</strong><br>
                        <small class="text-muted">
                            ${this.formatFileSize(file.size)} • 
                            ${new Date(file.uploaded).toLocaleString()}
                        </small>
                    </div>
                </div>
                <a href="/api/download/${file.storedName}" 
                   class="btn btn-primary btn-sm" download>
                    💾 Download
                </a>
            </div>
        `).join('');
    }
    
    getFileIcon(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        const icons = {
            'pdf': '📄',
            'doc': '📄', 'docx': '📄',
            'xls': '📈', 'xlsx': '📈',
            'ppt': '📉', 'pptx': '📉',
            'jpg': '🖼️', 'jpeg': '🖼️', 'png': '🖼️', 'gif': '🖼️',
            'mp4': '🎥', 'avi': '🎥', 'mov': '🎥',
            'mp3': '🎵', 'wav': '🎵',
            'zip': '🗃️', 'rar': '🗃️',
            'txt': '📄',
            'js': '📜', 'html': '📜', 'css': '📜'
        };
        return icons[ext] || '📁';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    showAlert(message, type) {
        const container = document.getElementById('alertContainer');
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show`;
        alert.style.borderRadius = '15px';
        alert.innerHTML = `
            <strong>${type === 'success' ? '✓' : type === 'danger' ? '⚠️' : '📝'}</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        container.appendChild(alert);
        setTimeout(() => alert.remove(), 5000);
    }
}

// Theme toggle function
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const icon = document.getElementById('themeIcon');
    icon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
}

// Page navigation
function showPage(page) {
    // Hide all pages
    document.getElementById('filesPage').classList.add('d-none');
    document.getElementById('aboutPage').classList.add('d-none');
    
    // Show selected page
    document.getElementById(page + 'Page').classList.remove('d-none');
    
    // Update nav
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
}

// Initialize app
new PhileHub();