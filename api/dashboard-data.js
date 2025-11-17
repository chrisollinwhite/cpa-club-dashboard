// API endpoint: /api/dashboard-data
// This serverless function fetches partner data from Google Sheets

import { google } from 'googleapis';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get email from query parameter
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email parameter is required' });
    }

    // Google Sheets configuration
    const SPREADSHEET_ID = '1Nze3siSJ9l6XBW4XWKhi8q1YKC5t-iaWI7kmObP__9I';
    const SHEET_NAME = 'Sheet1';
    const RANGE = `${SHEET_NAME}!A:P`; // Columns A through P

    // Authenticate with Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: 'service_account',
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Fetch data from Google Sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'No data found in sheet' });
    }

    // First row contains headers
    const headers = rows[0];
    
    // Find the row matching the email
    const userRow = rows.slice(1).find(row => row[0] && row[0].toLowerCase() === email.toLowerCase());

    if (!userRow) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Map row data to object
    const userData = {
      email: userRow[0] || '',
      firstName: userRow[1] || '',
      lastName: userRow[2] || '',
      memberLevel: userRow[3] || 'Member',
      totalClients: parseInt(userRow[4]) || 0,
      approved: parseInt(userRow[5]) || 0,
      declined: parseInt(userRow[6]) || 0,
      pending: parseInt(userRow[7]) || 0,
      totalFunded: parseFloat(userRow[8]) || 0,
      commissionRate: parseFloat(userRow[9]) || 0,
      totalEarned: parseFloat(userRow[10]) || 0,
      paid: parseFloat(userRow[11]) || 0,
      pendingPayment: parseFloat(userRow[12]) || 0,
      clubTarget: parseFloat(userRow[13]) || 0,
      joinDate: userRow[14] || '',
      lastActivity: userRow[15] || '',
    };

    // Calculate additional metrics
    const approvalRate = userData.totalClients > 0 
      ? Math.round((userData.approved / userData.totalClients) * 100) 
      : 0;

    // Return formatted data
    return res.status(200).json({
      success: true,
      data: {
        ...userData,
        fullName: `${userData.firstName} ${userData.lastName}`,
        approvalRate,
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch dashboard data',
      message: error.message 
    });
  }
}

