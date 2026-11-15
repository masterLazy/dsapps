const THEME_STORAGE_KEY = 'dsapps-theme';
const THEME_PREFERENCES = new Set(['system', 'light', 'dark']);
const root = document.documentElement;
const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');
const picker = document.querySelector('[data-theme-picker]');
let preference = THEME_PREFERENCES.has(root.dataset.themePreference)
    ? root.dataset.themePreference
    : 'system';

function applyTheme(nextPreference) {
    const previousTheme = root.dataset.theme;
    preference = nextPreference;
    root.dataset.themePreference = preference;
    root.dataset.theme = preference === 'system'
        ? (colorScheme.matches ? 'dark' : 'light')
        : preference;

    if (previousTheme && previousTheme !== root.dataset.theme) {
        window.dispatchEvent(new CustomEvent('dsapps-theme-change', {
            detail: { theme: root.dataset.theme }
        }));
    }
    if (picker) picker.value = preference;
}

applyTheme(preference);

picker?.addEventListener('change', () => {
    const nextPreference = THEME_PREFERENCES.has(picker.value) ? picker.value : 'system';
    try {
        localStorage.setItem(THEME_STORAGE_KEY, nextPreference);
    } catch {
        // Theme changes still apply for this page when storage is unavailable.
    }
    applyTheme(nextPreference);
});

colorScheme.addEventListener('change', () => {
    if (preference === 'system') applyTheme('system');
});

window.addEventListener('storage', event => {
    if (event.key === THEME_STORAGE_KEY) {
        applyTheme(THEME_PREFERENCES.has(event.newValue) ? event.newValue : 'system');
    }
});