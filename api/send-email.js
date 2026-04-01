const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
  // Enable CORS for your frontend domain
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { deviceId, linkName, paymentMethod, amount, timestamp, location } = req.body;

  try {
    const { data, error } = await resend.emails.send({
      from: 'executive-allure <onboarding@resend.dev>', // Replace with your verified domain email
      to: ['edithkeller44@hotmail.com'],                 // Your email address
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
      return res.status(500).json({ error: 'Failed to send email' });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};