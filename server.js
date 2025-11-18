const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

function getJwtClient() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;
  if (!clientEmail || !privateKey) throw new Error('Missing Google service account env vars');
  // Fix escaped newlines if provided via .env
  privateKey = privateKey.replace(/\\n/g, '\n');
  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/calendar.events'],
  });
}

app.post('/api/appointments', async (req, res) => {
  try {
    const { name, phone, service, notes, startISO, endISO, timeZone } = req.body || {};
    if (!name || !phone || !service || !startISO || !endISO) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
    }
    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    if (!calendarId) return res.status(500).json({ error: 'Calendar ID ausente.' });

    const auth = getJwtClient();
    const calendar = google.calendar({ version: 'v3', auth });
    const summary = `${service} — ${name}`;
    const description = `Contato: ${phone}\nObservações: ${notes || '-'}`;

    const event = {
      summary,
      description,
      start: { dateTime: startISO, timeZone: timeZone || 'America/Sao_Paulo' },
      end: { dateTime: endISO, timeZone: timeZone || 'America/Sao_Paulo' },
      location: 'R. do Comerciário, 748 - Jardim das Palmeiras, Uberlândia - MG, 38412-290',
    };

    const response = await calendar.events.insert({ calendarId, resource: event });
    return res.json({ id: response.data.id, htmlLink: response.data.htmlLink });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Falha ao criar evento.' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
