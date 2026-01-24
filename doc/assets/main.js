/* =========================
   GLOBAL ELEMENTS
========================= */
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar       = document.getElementById('sidebar');
const overlay       = document.getElementById('overlay');

const navToggles = document.querySelectorAll('.nav-toggle');
const navLinks   = document.querySelectorAll('.sidebar-nav a');

/* =========================
   PRELOADER MANAGER
========================= */
class PreloaderManager {
    constructor() {
        this.init();
    }

    init() {
        window.addEventListener('load', () => {
            const preloader = document.querySelector('.preloader');
            if (preloader) {
                setTimeout(() => {
                    preloader.classList.add('fade-out');
                    setTimeout(() => {
                        preloader.style.display = 'none';
                    }, 800);
                }, 1000);
            }
        });
    }
}

/* =========================
   THEME MANAGER (DIHAPUS)
========================= */

/* =========================
   SIDEBAR MANAGER
========================= */
class SidebarManager {
    constructor() {
        this.open = false;
        this.bind();
    }

    toggle() {
        this.open = !this.open;
        sidebar.classList.toggle('active', this.open);
        overlay.classList.toggle('active', this.open);

        if (window.innerWidth <= 1199) {
            document.body.style.overflow = this.open ? 'hidden' : '';
        }
    }

    close() {
        this.open = false;
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    bind() {
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => this.toggle());
        }

        if (overlay) {
            overlay.addEventListener('click', () => this.close());
        }

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && this.open) {
                this.close();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 1199) {
                this.close();
            }
        });
    }
}

/* =========================
   NAVIGATION (MULTI-PAGE SAFE)
========================= */
class NavigationManager {
    constructor(sidebarManager) {
        this.sidebar = sidebarManager;
        this.bindToggles();
        this.markActiveLink();
    }

    bindToggles() {
        navToggles.forEach(toggle => {
            toggle.addEventListener('click', e => {
                if (e.target.tagName === 'A' && e.target.getAttribute('href') !== '#') return;
                if (e.target.closest('a') && e.target.closest('a').getAttribute('href') !== '#') return;

                const parent = toggle.parentElement;
                const nested = parent.querySelector('.nested-nav');
                if (!nested) return;

                const isActive = nested.classList.contains('active');
                
                // Optional: Accordion style (uncomment if needed)
                // parent.parentElement.querySelectorAll('.nested-nav').forEach(n => n.classList.remove('active'));

                nested.classList.toggle('active');
            });
        });
    }

    markActiveLink() {
        const currentPath = location.pathname.split('/').pop();

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;

            const file = href.split('/').pop();
            if (file === currentPath) {
                link.classList.add('active');

                // buka parent menu
                let parent = link.closest('.nested-nav');
                while (parent) {
                    parent.classList.add('active');
                    parent = parent.parentElement.closest('.nested-nav');
                }
            }
        });
    }
}

/* =========================
   CODE COPY (OPTIONAL)
========================= */
class CodeCopyManager {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('pre code').forEach(code => {
            const pre = code.parentElement;
            if (pre.querySelector('.copy-button')) return;

            const btn = document.createElement('button');
            btn.className = 'copy-button';
            btn.innerHTML = '<i class="fas fa-copy"></i>';
            btn.style.cssText = `
                position: absolute; top: 10px; right: 10px;
                background: rgba(212, 175, 55, 0.2); color: var(--primary-gold);
                border:1px solid var(--primary-gold); border-radius: 4px;
                padding: 5px 10px; cursor: pointer; z-index: 10;
                font-size: 0.8rem; transition: all 0.3s ease;
            `;

            btn.onmouseenter = () => { btn.style.background = 'var(--primary-gold)'; btn.style.color = '#000'; };
            btn.onmouseleave = () => { btn.style.background = 'rgba(212, 175, 55, 0.2)'; btn.style.color = 'var(--primary-gold)'; };

            btn.onclick = async () => {
                try {
                    await navigator.clipboard.writeText(code.textContent);
                    btn.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => {
                        btn.innerHTML = '<i class="fas fa-copy"></i>';
                    }, 1500);
                } catch {
                    btn.innerHTML = '<i class="fas fa-times"></i>';
                }
            };

            pre.style.position = 'relative';
            pre.appendChild(btn);
        });
    }
}

/* =========================
   INIT
========================= */
document.addEventListener('DOMContentLoaded', () => {
    const preloaderManager = new PreloaderManager();
    const sidebarManager   = new SidebarManager();
    const navManager       = new NavigationManager(sidebarManager);
    const copyManager      = new CodeCopyManager();

    window.app = {
        sidebarManager,
        navManager,
        copyManager
    };
});
