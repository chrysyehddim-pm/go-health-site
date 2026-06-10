const CONTENT_URL = './content.json?v=20260610v7_1';

const fallbackContent = {
  global: {
    goHealthUrl: 'https://www.hgs.tw/fp/?t=00M8',
    customerServiceUrl: 'https://www.happygocard.com.tw/official/serviceMail.do',
    logos: {
      happyGo: 'assets/images/logo-happygo.png',
      femh: 'assets/images/logo-femh.png',
      qrCode: 'assets/images/happy-go-go-health-qrcode.svg'
    }
  },
  sections: [],
  features: [],
  events: [],
  notices: [],
  rewards: [],
  campaign_steps: [],
  kol_profiles: []
};

function findSection(content, id) {
  return (content.sections || []).find(section => section.section_id === id && section.enabled !== false && section.status !== 'hidden');
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function textWithBreaks(value = '') {
  return escapeHtml(value).replace(/\s*｜\s*/g, '<br>').replace(/\n/g, '<br>');
}

function isEmptyUrl(url) {
  return !url || String(url).trim() === '' || String(url).trim().toUpperCase() === 'TBD';
}

function safeUrl(url, fallback = '#') {
  return isEmptyUrl(url) ? fallback : url;
}

function renderInlineCta(text, url, emptyText = '即將公開') {
  if (!text && !emptyText) return '';
  if (isEmptyUrl(url)) {
    return `<span class="text-link is-disabled" aria-disabled="true">${escapeHtml(emptyText || text)}</span>`;
  }
  return `<a class="text-link" href="${escapeHtml(safeUrl(url))}" target="_blank" rel="noopener noreferrer">${escapeHtml(text || emptyText)}</a>`;
}

function setImageIfExists(selector, src) {
  const el = document.querySelector(selector);
  if (el && src) el.src = src;
}

function setCta(cta, text, url, fallbackText = '') {
  if (!cta) return;
  if (text) cta.textContent = text;
  if (!text && fallbackText) cta.textContent = fallbackText;
  if (isEmptyUrl(url)) {
    cta.href = '#';
    cta.classList.add('is-disabled');
    cta.setAttribute('aria-disabled', 'true');
    cta.addEventListener('click', event => event.preventDefault(), { once: true });
  } else {
    cta.href = url;
    cta.classList.remove('is-disabled');
    cta.removeAttribute('aria-disabled');
  }
}

function renderSectionText(content, sectionId) {
  const section = findSection(content, sectionId);
  if (!section) return;
  const scopes = document.querySelectorAll(`[data-section="${sectionId}"]`);
  if (!scopes.length) return;

  scopes.forEach(scope => {
    const fields = { title: section.title, subtitle: section.subtitle, body: section.body };
    Object.entries(fields).forEach(([field, value]) => {
      const target = scope.querySelector(`[data-field="${field}"]`) || (scope.dataset.field === field ? scope : null);
      if (target && value) target.textContent = value;
    });
    const cta = scope.querySelector('[data-field="cta"]');
    if (cta) setCta(cta, section.cta_text, section.cta_url, cta.textContent);
  });
}

function renderHero(content) {
  const hero = findSection(content, 'hero');
  if (!hero) return;
  const desktopImg = document.querySelector('.hero-bg img');
  const mobileSource = document.querySelector('.hero-bg source');
  if (desktopImg && hero.desktop_image) desktopImg.src = hero.desktop_image;
  if (mobileSource && hero.mobile_image) mobileSource.srcset = hero.mobile_image;
  renderSectionText(content, 'hero');

  const qr = content.global?.logos?.qrCode;
  const qrWrap = document.querySelector('#heroQr');
  if (qr && qrWrap) {
    document.querySelector('#heroQrImg').src = qr;
    qrWrap.hidden = false;
  }
}

function renderFeatures(content) {
  const grid = document.querySelector('#featureGrid');
  if (!grid) return;
  const icons = { brain_game: '🧠', daily_task: '✅', family_companion: '💛', health_content: '📖' };
  grid.innerHTML = (content.features || [])
    .filter(item => item.enabled !== false && item.status !== 'hidden')
    .map(item => `
      <article class="feature-card">
        <div class="feature-icon" aria-hidden="true">${icons[item.feature_id] || '🌿'}</div>
        <h3>${escapeHtml(item.title || '')}</h3>
        <strong>${escapeHtml(item.subtitle || '')}</strong>
        <p>${escapeHtml(item.body || '')}</p>
      </article>
    `).join('');
}

function renderRewards(content) {
  const grid = document.querySelector('#rewardGrid');
  if (!grid) return;
  const rewards = (content.rewards || [])
    .filter(item => item.enabled !== false && item.status !== 'hidden')
    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  grid.innerHTML = rewards.map(item => `
    <article class="reward-card reward-${escapeHtml(item.reward_id || 'item')}">
      <div class="reward-copy">
        <span>${escapeHtml(item.subtitle || '')}</span>
        <h3>${escapeHtml(item.title || '')}</h3>
        <p>${escapeHtml(item.body || '')}</p>
      </div>
      ${item.image ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title || '活動獎項')}" loading="lazy">` : `<div class="reward-points" aria-hidden="true">萬點</div>`}
    </article>
  `).join('');
}

function ordinalLabel(index) {
  return ['第一重', '第二重', '第三重'][index] || `第 ${index + 1} 重`;
}

function renderCampaignTrilogy(content) {
  const grid = document.querySelector('#campaignTrilogyGrid');
  if (!grid) return;
  const icons = ['💬', '✉️', '🌿'];
  const steps = (content.campaign_steps && content.campaign_steps.length ? content.campaign_steps : [])
    .filter(item => item.enabled !== false && item.status !== 'hidden')
    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

  const fallbackSteps = (content.events || [])
    .filter(item => item.enabled !== false && item.status !== 'hidden')
    .slice(0, 3)
    .map((item, index) => ({
      step_label: ordinalLabel(index),
      title: item.title,
      description: item.description,
      meta: [item.date, item.location].filter(Boolean).join('｜'),
      cta_text: item.cta_text,
      cta_url: item.cta_url,
      display_order: index + 1
    }));

  const items = steps.length ? steps : fallbackSteps;
  grid.innerHTML = items.map((item, index) => `
    <article class="trilogy-card trilogy-${index + 1}">
      <div class="trilogy-top">
        <span class="trilogy-step">${escapeHtml(item.step_label || ordinalLabel(index))}</span>
        <span class="trilogy-icon" aria-hidden="true">${icons[index] || '🌿'}</span>
      </div>
      <h3>${escapeHtml(item.title || '')}</h3>
      <p>${escapeHtml(item.description || '')}</p>
      ${item.meta ? `<div class="trilogy-meta"><span>${textWithBreaks(item.meta || '')}</span></div>` : ''}
      ${renderInlineCta(item.cta_text || '', item.cta_url || '', index === 0 ? '活動貼文即將公開' : '')}
    </article>
  `).join('');
}

function renderKols(content) {
  const grid = document.querySelector('#kolGrid');
  if (!grid) return;
  const items = (content.kol_profiles || [])
    .filter(item => item.enabled !== false && item.status !== 'hidden')
    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  grid.innerHTML = items.map(item => `
    <article class="kol-guide-card">
      <div class="kol-avatar" aria-hidden="true">${escapeHtml((item.name || '').slice(0, 1))}</div>
      <div class="kol-guide-copy">
        <h4>${escapeHtml(item.name || '')}</h4>
        <strong>${escapeHtml(item.title || '')}</strong>
        <p>${escapeHtml(item.description || '')}</p>
        ${renderInlineCta(item.link_text || '查看分享貼文', item.link_url || '', '分享貼文即將公開')}
      </div>
    </article>
  `).join('');
}

function renderEvents(content) {
  const grid = document.querySelector('#eventGrid');
  if (!grid) return;
  grid.innerHTML = (content.events || [])
    .filter(item => item.enabled !== false && item.status !== 'hidden' && item.event_type !== 'social')
    .map(item => {
      const hasCta = item.cta_text && !isEmptyUrl(item.cta_url);
      return `
        <article class="event-card">
          <span class="event-type">實體活動</span>
          <h3>${escapeHtml(item.title || '')}</h3>
          <div class="event-meta">
            <span>日期：${textWithBreaks(item.date || 'TBD')}</span>
            <span>時間：${textWithBreaks(item.time || 'TBD')}</span>
            <span>地點：${textWithBreaks(item.location || 'TBD')}</span>
          </div>
          <p>${escapeHtml(item.description || '')}</p>
          ${hasCta ? `<a class="text-link" href="${escapeHtml(safeUrl(item.cta_url))}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.cta_text)}</a>` : ''}
        </article>
      `;
    }).join('');
}

function renderNotices(content) {
  const list = document.querySelector('#noticeList');
  if (!list) return;
  list.innerHTML = (content.notices || [])
    .filter(item => item.status !== 'hidden')
    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
    .map((item, index) => `
      <details class="notice-item" ${index === 0 ? 'open' : ''}>
        <summary><span><span class="notice-category">${escapeHtml(item.category || '')}</span>${escapeHtml(item.title || '')}</span></summary>
        <div class="notice-content">${escapeHtml(item.content || '')}</div>
      </details>
    `).join('');
}

function renderLogos(content) {
  const logos = content.global?.logos || {};
  setImageIfExists('#happyGoLogo', logos.happyGo);
  setImageIfExists('#femhLogo', logos.femh);
}

function renderFooter(content) {
  renderSectionText(content, 'footer');
  const footerCta = document.querySelector('footer [data-field="cta"]');
  if (footerCta) footerCta.href = content.global?.customerServiceUrl || footerCta.href;
}

function setupMotionEffects() {
  const targets = document.querySelectorAll('.hero-content, .section-copy, .section-heading, .intro-visual, .campaign-master-heading, .campaign-kv-card, .campaign-hero-copy, .reward-card, .trilogy-card, .kol-guides-heading, .kol-guide-card, .feature-card, .event-card, .partner-strip, .notice-item');
  targets.forEach((el, index) => {
    el.classList.add('reveal-init');
    el.style.setProperty('--reveal-delay', `${Math.min(index % 5, 4) * 80}ms`);
  });

  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

  targets.forEach(el => observer.observe(el));
}

function renderAll(content) {
  ['product_intro', 'features', 'social_campaign', 'offline_event', 'notice', 'footer'].forEach(id => renderSectionText(content, id));
  renderHero(content);
  renderFeatures(content);
  renderRewards(content);
  renderCampaignTrilogy(content);
  renderKols(content);
  renderEvents(content);
  renderNotices(content);
  renderLogos(content);
  renderFooter(content);
  setupMotionEffects();
}

function setupNavControls() {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const menu = document.querySelector('#mobileMenu');
  const topBtn = document.querySelector('.back-to-top');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      menu.hidden = open;
      document.body.classList.toggle('mobile-menu-open', !open);
    });
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        menu.hidden = true;
        document.body.classList.remove('mobile-menu-open');
      });
    });
  }

  if (topBtn) {
    const updateTopButton = () => {
      topBtn.classList.toggle('is-visible', window.scrollY > 520);
    };
    window.addEventListener('scroll', updateTopButton, { passive: true });
    updateTopButton();
    topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
}

async function init() {
  try {
    const res = await fetch(CONTENT_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Cannot load content.json: ${res.status}`);
    const content = await res.json();
    renderAll(content);
  } catch (error) {
    console.warn(error);
    renderAll(fallbackContent);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setupNavControls();
  init();
});
