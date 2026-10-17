function giscusTheme(theme) {
    return theme === 'dark' ? 'transparent_dark' : 'light';
}

// Keep the giscus comments iframe in sync with the site theme
function setGiscusTheme(theme) {
    const frame = document.querySelector('iframe.giscus-frame');
    if (!frame) return;
    frame.contentWindow.postMessage({ giscus: { setConfig: { theme: giscusTheme(theme) } } }, 'https://giscus.app');
}

// Update copyright year automatically
document.addEventListener('DOMContentLoaded', function() {
    const yearElements = document.querySelectorAll('#current-year');
    const currentYear = new Date().getFullYear();
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });

    // Dark mode toggle
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', currentTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        setGiscusTheme(newTheme);
    });

    // Share: copy link
    document.querySelectorAll('.share-copy').forEach(function(button) {
        button.addEventListener('click', function() {
            if (!navigator.clipboard) return;
            navigator.clipboard.writeText(button.dataset.url).then(function() {
                const label = button.querySelector('.share-copy-text');
                button.classList.add('copied');
                label.textContent = 'Copied!';
                setTimeout(function() {
                    button.classList.remove('copied');
                    label.textContent = 'Copy link';
                }, 1500);
            });
        });
    });

    // Share: native share sheet on phones
    if (navigator.share) {
        document.querySelectorAll('.share-native').forEach(function(button) {
            button.hidden = false;
            button.addEventListener('click', function() {
                navigator.share({ title: button.dataset.title, url: button.dataset.url }).catch(function() {});
            });
        });
    }

    // Code blocks: language label and copy button
    document.querySelectorAll('.blog-post-body .highlight').forEach(function(block) {
        const code = block.querySelector('code');
        if (!code) return;

        const lang = code.getAttribute('data-lang');
        if (lang) {
            const label = document.createElement('span');
            label.className = 'code-lang';
            label.textContent = lang;
            block.appendChild(label);
        }

        if (!navigator.clipboard) return;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'copy-code';
        button.textContent = 'Copy';
        button.addEventListener('click', function() {
            navigator.clipboard.writeText(code.innerText).then(function() {
                button.textContent = 'Copied';
                button.classList.add('copied');
                setTimeout(function() {
                    button.textContent = 'Copy';
                    button.classList.remove('copied');
                }, 1500);
            });
        });
        block.appendChild(button);
    });
});
