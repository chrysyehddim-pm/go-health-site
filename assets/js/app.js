const CONTENT_URL = './content.json?v=20260610';

const fallbackContent = {
  global: {
    goHealthUrl: 'https://www.hgs.tw/fp/?t=00M8',
    customerServiceUrl: 'https://www.happygocard.com.tw/official/serviceMail.do',
    logos: {
      happyGo: 'assets/images/logo-happygo.png',
      femh: 'assets/images/logo-femh.png',
      qrCode: 'assets/images/happy-go-go-health-qrcode.png'
    }
  },
  sections: [],
  features: [],
  events: [],
  notices: []
};

function findSection(content, id) {
  return (content.sections || []).find(section => section.section_id === id && section.enabled !== false && section.status !== 'hidden');
}

function safeUrl(url, fallback = '#') {
  if (!url || url === 'TBD') return fallback;
  return url;
}

function setImageIfExists(selector, src) {
  const el = document.querySelector(selector);
  if (el && src) el.src = src;
}

function renderSectionText(content, sectionId) {
  const section = findSection(content, sectionId);
  if (!section) return;
  const scope = document.querySelector(`[data-section="${sectionId}"]`);
  if (!scope) return;

  const fields = {
    title: section.title,
    subtitle: section.subtitle,
    body: section.body
  };
  Object.entries(fields).forEach(([field, value]) => {
    const target = scope.querySelector(`[data-field="${field}"]`);
    if (target && value) target.textContent = value;
  });

  const cta = scope.querySelector('[data-field="cta"]');
  if (cta) {
    cta.textContent = section.cta_text || cta.textContent;
    cta.href = safeUrl(section.cta_url, cta.getAttribute('href') || '#');
  }
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
  const icons = ['🧠', '✅', '💛', '📖'];
  grid.innerHTML = (content.features || []).filter(item => item.enabled !== false).map((item, index) => `
    <article class="feature-card">
      <div class="feature-icon" aria-hidden="true">${icons[index] || '🌿'}</div>
      <h3>${item.title || ''}</h3>
      <strong>${item.subtitle || ''}</strong>
      <p>${item.body || ''}</p>
    </article>
  `).join('');
}

function renderEvents(content) {
  const grid = document.querySelector('#eventGrid');
  if (!grid) return;
  grid.innerHTML = (content.events || []).filter(item => item.enabled !== false).map(item => `
    <article class="event-card">
      <span class="event-type">${item.event_type === 'social' ? '社群活動' : '實體活動'}</span>
      <h3>${item.title || ''}</h3>
      <div class="event-meta">
        <span>日期：${item.date || 'TBD'}</span>
        <span>時間：${item.time || 'TBD'}</span>
        <span>地點：${item.location || 'TBD'}</span>
      </div>
      <p>${item.description || ''}</p>
      <a class="text-link" href="${safeUrl(item.cta_url, '#events')}">${item.cta_text || '查看活動資訊'}</a>
    </article>
  `).join('');
}

function renderNotices(content) {
  const list = document.querySelector('#noticeList');
  if (!list) return;
  list.innerHTML = (content.notices || [])
    .filter(item => item.status !== 'hidden')
    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
    .map((item, index) => `
      <details class="notice-item" ${index === 0 ? 'open' : ''}>
        <summary><span><span class="notice-category">${item.category || ''}</span>${item.title || ''}</span></summary>
        <div class="notice-content">${item.content || ''}</div>
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

function renderAll(content) {
  ['product_intro', 'features', 'social_campaign', 'offline_event', 'notice', 'footer'].forEach(id => renderSectionText(content, id));
  renderHero(content);
  renderFeatures(content);
  renderEvents(content);
  renderNotices(content);
  renderLogos(content);
  renderFooter(content);
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

document.addEventListener('DOMContentLoaded', init);
