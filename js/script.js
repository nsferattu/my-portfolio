// const showMoreBtn = document.getElementById("show-more-btn");
// const moreText = document.getElementById("more-text");
//
// showMoreBtn.addEventListener("click", function () {
//     if (moreText.style.display === "none") {
//         moreText.style.display = "block";
//         showMoreBtn.textContent = "Приховати";
//     } else {
//         moreText.style.display = "none";
//         showMoreBtn.textContent = "показати більше";
//     }
// });

function revealImage(wrapper) {
    wrapper.classList.add('revealed');
}

window.addEventListener('DOMContentLoaded', () => {
    const THEME = {
        DARK: 'dark',
        LIGHT: 'light'
    };

    const IMAGES = {
        SUN: 'photos/sun.png',
        MOON: 'photos/moon.png',
        GITHUB_DARK: 'photos/github-mark.png',
        GITHUB_LIGHT: 'photos/github-mark-white.png'
    };

    const themeBtn = document.getElementById("theme-btn");
    const themeIcon = document.getElementById("theme-icon");
    const githubIcon = document.getElementById("github-icon"); // Додали пошук GitHub іконки

    if (!themeBtn || !themeIcon || !githubIcon) {
        console.error('Required elements not found');
    } else {
        const savedTheme = localStorage.getItem("theme") || THEME.LIGHT;

        if (savedTheme === THEME.DARK) {
            document.body.classList.add('dark-theme');
            themeIcon.src = IMAGES.SUN;
            themeIcon.alt = "Light theme";
            githubIcon.src = IMAGES.GITHUB_LIGHT;
        } else {
            themeIcon.src = IMAGES.MOON;
            themeIcon.alt = "Dark theme";
            githubIcon.src = IMAGES.GITHUB_DARK;
        }

        // theme changer
        themeBtn.addEventListener("click", () => {
            document.body.classList.toggle("dark-theme");
            const isDarkTheme = document.body.classList.contains("dark-theme");

            // updating data theme
            localStorage.setItem("theme", isDarkTheme ? THEME.DARK : THEME.LIGHT);

            // updating icon theme
            themeIcon.src = isDarkTheme ? IMAGES.SUN : IMAGES.MOON;
            themeIcon.alt = isDarkTheme ? "Light theme" : "Dark theme";

            // updating github icon
            githubIcon.src = isDarkTheme ? IMAGES.GITHUB_LIGHT : IMAGES.GITHUB_DARK;

            githubIcon.style.transform = 'scale(1.2)';
            setTimeout(() => {
                githubIcon.style.transform = 'scale(1)';
            }, 300);
        });
    }
});



function updateGitHubIcon() {
    const githubIcon = document.getElementById('github-icon');
    if (document.body.getAttribute('data-theme') === 'dark') {
        githubIcon.src = "photos/github-hub-dark.png";
    } else {
        githubIcon.src = "photos/github-hub-light.jpg";
    }
}

updateGitHubIcon();

window.addEventListener('load', () => {
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(100px)';
        section.style.transition = 'all 1s ease-out';
    });
    animateOnScroll();
});

// Store animation state globally
let isAnimating = false;
let lastScrollTime = 0;

const optimizedAnimateOnScroll = () => {
    const now = Date.now();

    // Throttle to 60fps
    if (isAnimating || (now - lastScrollTime < 16)) return;

    isAnimating = true;
    lastScrollTime = now;

    requestAnimationFrame(() => {
        try {
            const windowHeight = window.innerHeight;
            const triggerOffset = windowHeight * 0.75;

            document.querySelectorAll('section').forEach(section => {
                const rect = section.getBoundingClientRect();

                if (rect.top < triggerOffset && rect.bottom > 0) {
                    section.style.opacity = '1';
                    section.style.transform = 'translateY(0)';
                } else {
                    section.style.opacity = '0';
                    section.style.transform = rect.top >= windowHeight
                        ? 'translateY(100px)'
                        : 'translateY(-100px)';
                }
            });
        } catch (error) {
            console.error('Animation error:', error);
        } finally {
            isAnimating = false;
        }
    });
};

// Use IntersectionObserver for better performance
const setupIntersectionObserver = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            } else {
                const rect = entry.target.getBoundingClientRect();
                entry.target.style.opacity = '0';
                entry.target.style.transform = rect.top >= window.innerHeight
                    ? 'translateY(100px)'
                    : 'translateY(-100px)';
            }
        });
    }, {
        threshold: 0.25
    });

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
};

if ('IntersectionObserver' in window) {
    setupIntersectionObserver();
} else {
    const scrollHandler = () => {
        optimizedAnimateOnScroll();
        updateActiveNav();
    };

    window.addEventListener('scroll', scrollHandler);
    window.addEventListener('load', scrollHandler);

    window.cleanupAnimations = () => {
        window.removeEventListener('scroll', scrollHandler);
        window.removeEventListener('load', scrollHandler);
    };
}

function debounce(func, wait = 5) {
    let timeout;
    return function() {
        clearTimeout(timeout);
        timeout = setTimeout(func, wait);
    };
}
window.addEventListener('scroll', debounce(animateOnScroll));

const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section, header');


function animateOnScroll() {
    try {
        const windowHeight = window.innerHeight;
        const triggerOffset = windowHeight * 0.75;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top;
            const sectionBottom = rect.bottom;

            if (sectionTop < triggerOffset && sectionBottom > 0) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
                section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            } else {
                if (sectionTop >= windowHeight) {
                    section.style.opacity = '0';
                    section.style.transform = 'translateY(100px)';
                } else if (sectionBottom <= 0) {
                    section.style.opacity = '0';
                    section.style.transform = 'translateY(-100px)';
                }
            }
        });
    } catch (error) {
        console.error('Error in animateOnScroll:', error);
    }
}

// Optimized event listeners
const scrollHandler = debounce(() => {
    requestAnimationFrame(() => {
        animateOnScroll();
        updateActiveNav();
    });
});

function updateActiveNav() {
    try {
        let current = '';
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const activeTitleEl = document.getElementById('active-section-title');

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (
                scrollPosition >= sectionTop - windowHeight / 3 &&
                scrollPosition < sectionTop + sectionHeight - windowHeight / 3
            ) {
                current = sectionId;
            }
        });

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const isActive = href === `#${current}` || (current === '' && href === '#');

            link.classList.toggle('active', isActive);

            if (isActive && activeTitleEl) {
                const title = link.dataset.title || link.textContent;
                activeTitleEl.textContent = title;
            }
        });
    } catch (error) {
        console.error('Error in updateActiveNav:', error);
    }
}

