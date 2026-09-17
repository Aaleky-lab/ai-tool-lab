(() => {
  'use strict';

  const GA4_ID = 'G-R3BCK3MD5J';
  const CONSENT_KEY = 'ai-tool-lab-analytics-consent';
  let analyticsEnabled = false;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.aiToolLabTrack = (name, parameters = {}) => {
    if (analyticsEnabled) window.gtag('event', name, parameters);
  };

  const loadAnalytics = () => {
    if (!GA4_ID || analyticsEnabled) return;
    analyticsEnabled = true;
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_ID)}`;
    document.head.append(script);
    window.gtag('js', new Date());
    window.gtag('config', GA4_ID, { anonymize_ip: true });
  };

  const readConsent = () => {
    try { return localStorage.getItem(CONSENT_KEY); } catch { return null; }
  };

  const saveConsent = value => {
    try { localStorage.setItem(CONSENT_KEY, value); } catch { /* Storage may be blocked. */ }
  };

  const showConsent = () => {
    if (document.querySelector('[data-analytics-consent]')) return;
    const banner = document.createElement('section');
    banner.dataset.analyticsConsent = '';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Analytics privacy choices');
    banner.style.cssText = 'position:fixed;z-index:1000;right:18px;bottom:18px;left:18px;max-width:700px;margin:auto;padding:18px;border:1px solid rgba(255,255,255,.22);border-radius:6px;background:#1c130f;color:#fbf5ea;box-shadow:0 18px 55px rgba(28,19,15,.3);font:14px/1.5 Inter,system-ui,sans-serif';
    banner.innerHTML = '<strong style="display:block;margin-bottom:5px;font-size:16px">Help us improve AI Tool Lab</strong><span>With your permission, Google Analytics measures anonymous visits and clicks. Analytics stays off unless you allow it. </span><a href="privacy.html" style="color:#f0c28f;text-decoration:underline">Privacy details</a><div style="display:flex;gap:9px;flex-wrap:wrap;margin-top:14px"><button type="button" data-consent="deny" style="padding:10px 14px;border:1px solid rgba(255,255,255,.35);border-radius:4px;background:transparent;color:#fbf5ea;font:inherit;font-weight:800;cursor:pointer">Decline</button><button type="button" data-consent="allow" style="padding:10px 14px;border:1px solid #fbf5ea;border-radius:4px;background:#fbf5ea;color:#1c130f;font:inherit;font-weight:800;cursor:pointer">Allow analytics</button></div>';
    banner.addEventListener('click', event => {
      const choice = event.target.closest('[data-consent]')?.dataset.consent;
      if (!choice) return;
      saveConsent(choice);
      if (choice === 'allow') loadAnalytics();
      banner.remove();
    });
    document.body.append(banner);
  };

  const addPrivacyLink = () => {
    const footer = document.querySelector('.footer-row');
    if (!footer || footer.querySelector('[data-privacy-link]')) return;
    const link = document.createElement('a');
    link.href = 'privacy.html';
    link.dataset.privacyLink = '';
    link.textContent = 'Privacy';
    link.style.cssText = 'color:inherit;text-decoration:underline;text-underline-offset:3px';
    footer.append(link);
  };

  const initializePrivacy = () => {
    addPrivacyLink();
    const consent = readConsent();
    if (consent === 'allow') loadAnalytics();
    else if (consent !== 'deny') showConsent();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializePrivacy);
  else initializePrivacy();

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
