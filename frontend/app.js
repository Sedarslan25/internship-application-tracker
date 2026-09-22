const form = document.querySelector('#application-form');
const cards = document.querySelector('#cards');
const filter = document.querySelector('#filter');
const summary = document.querySelector('#summary');
const template = document.querySelector('#card-template');
const today = new Date().toISOString().slice(0, 10);
form.application_date.value = today;

function escapeText(value) { return value || 'Not eklenmedi.'; }
function statusClass(status) { return status.toLocaleLowerCase('tr-TR').replace('ş', 's').replace('ğ', 'g').replace('ü', 'u').replace('ı', 'i').replace('ö', 'o').replace('ç', 'c'); }

async function loadApplications() {
  const query = filter.value ? `?status=${encodeURIComponent(filter.value)}` : '';
  const response = await fetch(`/api/applications${query}`);
  const data = await response.json();
  cards.replaceChildren();
  data.forEach(item => {
    const card = template.content.firstElementChild.cloneNode(true);
    card.querySelector('h3').textContent = item.company;
    card.querySelector('.role').textContent = item.role;
    const status = card.querySelector('.status');
    status.textContent = item.status;
    status.classList.add(statusClass(item.status));
    card.querySelector('.notes').textContent = escapeText(item.notes);
    card.querySelector('.date').textContent = `Başvuru tarihi: ${new Date(item.application_date).toLocaleDateString('tr-TR')}`;
    card.querySelector('.delete').addEventListener('click', async () => { await fetch(`/api/applications/${item.id}`, { method: 'DELETE' }); loadApplications(); loadSummary(); });
    cards.append(card);
  });
  if (!data.length) cards.innerHTML = '<p class="empty">Bu filtrede başvuru bulunamadı.</p>';
}

async function loadSummary() {
  const response = await fetch('/api/applications');
  const data = await response.json();
  const interviews = data.filter(item => item.status === 'Görüşme').length;
  summary.innerHTML = `<b>${data.length}<small>Toplam başvuru</small></b><b>${interviews}<small>Görüşme</small></b><b>${data.filter(item => item.status === 'Teklif').length}<small>Teklif</small></b>`;
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(form));
  const response = await fetch('/api/applications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
  if (!response.ok) return alert('Başvuru kaydedilemedi. Alanları kontrol et.');
  form.reset(); form.application_date.value = today;
  loadApplications(); loadSummary();
});
filter.addEventListener('change', loadApplications);
loadApplications(); loadSummary();
