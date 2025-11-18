function formatDateForAPI(date, time, durationMin) {
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  const start = new Date(Date.UTC(y, m - 1, d, hh, mm));
  const end = new Date(start.getTime() + durationMin * 60000);
  return {
    startISO: start.toISOString(),
    endISO: end.toISOString(),
  };
}

function buildGCalTemplateLink({ title, details, location, startISO, endISO }) {
  const fmt = (dt) => dt.replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const dates = `${fmt(startISO)}/${fmt(endISO)}`;
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    details,
    location,
    dates,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

const form = document.getElementById('booking-form');
const statusEl = document.getElementById('booking-status');
const gcalBtn = document.getElementById('gcal-link');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = '';
    gcalBtn.hidden = true;

    const data = Object.fromEntries(new FormData(form).entries());
    if (!data.name || !data.phone || !data.service || !data.date || !data.time) {
      statusEl.textContent = 'Preencha todos os campos obrigatórios.';
      return;
    }
    const duration = Number(data.duration || 60);
    const { startISO, endISO } = formatDateForAPI(data.date, data.time, duration);

    const payload = {
      name: data.name.trim(),
      phone: data.phone.trim(),
      service: data.service,
      notes: (data.notes || '').trim(),
      startISO,
      endISO,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo',
    };

    // Attempt API booking (salon calendar). If not available, fall back to user GCal link.
    try {
      const res = await fetch('http://localhost:3000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Falha ao criar o agendamento.');
      const json = await res.json();
      statusEl.textContent = 'Agendamento registrado. Você receberá a confirmação.';
      if (json.htmlLink) {
        gcalBtn.hidden = false;
        gcalBtn.textContent = 'Ver no Google Calendar';
        gcalBtn.onclick = () => window.open(json.htmlLink, '_blank');
      }
    } catch (err) {
      // Fallback: open Google Calendar template for the user
      const title = `${data.service} — ${data.name}`;
      const details = `Contato: ${data.phone}\nObservações: ${data.notes || '-'}\n`;
      const location = 'Espaço Aline Mendes, R. do Comerciário, 748 - Jardim das Palmeiras, Uberlândia - MG';
      const url = buildGCalTemplateLink({ title, details, location, startISO, endISO });
      statusEl.textContent = 'Não foi possível registrar automaticamente. Você pode adicionar ao seu Google Calendar:';
      gcalBtn.hidden = false;
      gcalBtn.textContent = 'Adicionar no Google Calendar';
      gcalBtn.onclick = () => window.open(url, '_blank');
    }
  });
}
