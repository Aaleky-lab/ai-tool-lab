(() => {
  'use strict';

  // Add a GA4 measurement ID here after creating the property. Until then,
  // events stay in dataLayer so the site works without third-party tracking.
  const GA4_ID = '';
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.aiToolLabTrack = (name, parameters = {}) => window.gtag('event', name, parameters);

  if (GA4_ID) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_ID)}`;
    document.head.append(script);
    window.gtag('js', new Date());
    window.gtag('config', GA4_ID, { anonymize_ip: true });
  }

  document.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin) {
      window.aiToolLabTrack('outbound_click', { destination: url.hostname, link_text: link.textContent.trim().slice(0, 80) });
    }
    if (url.pathname.endsWith('/tool.html')) {
      window.aiToolLabTrack('tool_open', { tool: url.searchParams.get('tool') || 'unknown' });
    }
  });
})();
