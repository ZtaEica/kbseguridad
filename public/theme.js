// Se ejecuta antes del CSS para restaurar el tema sin un destello claro.
(() => {
  const key = 'kb-theme';
  const root = document.documentElement;
  const readTheme = () => {
    try { return localStorage.getItem(key) === 'dark' ? 'dark' : 'light'; }
    catch { return 'light'; }
  };
  const apply = theme => {
    const dark = theme === 'dark';
    root.dataset.theme = dark ? 'dark' : 'light';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = dark ? '#101010' : '#faf9f6';
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      button.setAttribute('aria-pressed', String(dark));
      button.title = dark ? 'Cambiar al tema claro' : 'Cambiar al tema oscuro';
      button.querySelector('.theme-label').textContent = dark ? 'Claro' : 'Oscuro';
    });
  };
  apply(readTheme());
  document.addEventListener('DOMContentLoaded', () => {
    apply(root.dataset.theme);
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      button.addEventListener('click', () => {
        const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
        apply(theme);
        try { localStorage.setItem(key, theme); } catch { /* El selector funciona sin almacenamiento. */ }
      });
    });
  });
  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) apply(readTheme());
  });
})();
