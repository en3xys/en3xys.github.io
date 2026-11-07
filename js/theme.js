/**
 * Enes Çetin Portfolyo - Tema Yönetimi (Dark / Light Mode)
 * - İlk ziyarette cihazın sistem tercihini (prefers-color-scheme) algılar
 * - Kullanıcının manuel tercihini localStorage üzerinde saklar
 * - Sayfa açılışında beyaz parlama (FOUC) oluşmaması için anında data-theme atar
 */

(function initTheme() {
    try {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
        }
    } catch (e) {
        // LocalStorage erişim engeli (örn. özel pencere kısıtlamaları) durumunda sessizce devam et
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    // Navigasyon çubuğunu bul
    const nav = document.querySelector('nav');
    let toggleBtn = document.getElementById('themeToggle');

    // Eğer sayfada henüz buton yoksa otomatik oluştur ve nav içine ekle
    if (!toggleBtn && nav) {
        toggleBtn = document.createElement('button');
        toggleBtn.id = 'themeToggle';
        toggleBtn.className = 'theme-toggle-btn';
        toggleBtn.setAttribute('aria-label', 'Karanlık Modu Aç/Kapat');
        toggleBtn.setAttribute('title', 'Karanlık / Aydınlık Mod');
        toggleBtn.type = 'button';
        nav.appendChild(toggleBtn);
    }

    function updateIcon() {
        if (!toggleBtn) return;
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        toggleBtn.innerHTML = isDark 
            ? '<i class="fas fa-sun"></i>' 
            : '<i class="fas fa-moon"></i>';
        toggleBtn.setAttribute('aria-label', isDark ? 'Aydınlık Moda Geç' : 'Karanlık Moda Geç');
        toggleBtn.setAttribute('title', isDark ? 'Aydınlık Mod' : 'Karanlık Mod');
    }

    updateIcon();

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', targetTheme);
            try {
                localStorage.setItem('theme', targetTheme);
            } catch (e) {}
            
            updateIcon();
        });
    }

    // Cihazın işletim sistemi teması değiştiğinde (kullanıcı manuel seçim yapmadıysa) otomatik güncelle
    if (window.matchMedia) {
        const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        colorSchemeQuery.addEventListener('change', (e) => {
            try {
                const userChoice = localStorage.getItem('theme');
                if (!userChoice) {
                    const newTheme = e.matches ? 'dark' : 'light';
                    document.documentElement.setAttribute('data-theme', newTheme);
                    updateIcon();
                }
            } catch (err) {}
        });
    }
});
