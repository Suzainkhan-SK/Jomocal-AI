const axios = require('axios');

async function createLeadHunterSheet({ accessToken, targetNiche, targetLocation }) {
  const titleNiche = (targetNiche || 'General').toString().trim();
  const titleLocation = (targetLocation || 'Global').toString().trim();

  const createRes = await axios.post(
    'https://sheets.googleapis.com/v4/spreadsheets',
    {
      properties: {
        title: `Jomocal Leads - ${titleNiche} - ${titleLocation}`,
      },
      sheets: [{ properties: { title: 'Leads' } }],
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      timeout: 20000,
    }
  );

  const spreadsheetId = createRes.data?.spreadsheetId;
  if (!spreadsheetId) {
    throw new Error('Failed to create Google Sheet.');
  }

  const headerValues = [[
    'Business Name',
    'Email',
    'Icebreaker',
    'Website',
    'Phone',
    'Status',
    'Mode',
    'Sent On',
  ]];

  await axios.put(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Leads!A1:H1?valueInputOption=USER_ENTERED`,
    { values: headerValues },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      timeout: 20000,
    }
  );

  return { spreadsheetId };
}

module.exports = {
  createLeadHunterSheet,
};
