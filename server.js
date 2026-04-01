const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static('public'));

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

// API endpoint to send email
app.post('/api/send-email', async (req, res) => {
  const { deviceId, linkName, paymentMethod, amount, timestamp, location } = req.body;

  // Validate required fields
  if (!deviceId || !linkName || !paymentMethod || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'executive-allure <onboarding@resend.dev>', // Use your verified domain if you have one
      to: ['edithkeller44@hotmail.com'],                  // <-- YOUR EMAIL
      subject: `Payment Approval Request: ${linkName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2>✈️ Payment Approval Request</h2>
          <p><strong>Device ID:</strong> ${deviceId}</p>
          <p><strong>Link:</strong> ${linkName}</p>
          <p><strong>Payment Method:</strong> ${paymentMethod}</p>
          <p><strong>Amount:</strong> $${amount}</p>
          <p><strong>Timestamp:</strong> ${timestamp}</p>
          <p><strong>Location:</strong> ${location}</p>
          <hr />
          <p>To approve, add this device ID to your <code>approved.json</code> with the link name.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Failed to send email via Resend' });
    }

    console.log('Email sent successfully:', data);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});