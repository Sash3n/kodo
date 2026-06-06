interface OrderItem {
	sku: string;
	name: string;
	quantity: number;
	price_cents: number;
}

interface OrderConfirmationData {
	orderId: string;
	email: string;
	totalCents: number;
	items: OrderItem[];
	siteUrl: string;
}

function formatZAR(cents: number) {
	return `R${(cents / 100).toFixed(2)}`;
}

export function orderConfirmationHtml(data: OrderConfirmationData): string {
	const { orderId, totalCents, items, siteUrl } = data;
	const shortId = orderId.slice(0, 8).toUpperCase();

	const itemRows = items
		.map(
			(item) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #1e1e1e;color:#aaa;font-size:14px;">
        <span style="color:#e8e8e8;font-weight:500;">${item.name}</span>
        <br/><span style="font-family:monospace;font-size:12px;color:#666;">${item.sku}</span>
      </td>
      <td style="padding:10px 0;border-bottom:1px solid #1e1e1e;color:#888;font-size:14px;text-align:center;">
        ×${item.quantity}
      </td>
      <td style="padding:10px 0;border-bottom:1px solid #1e1e1e;color:#e8b44a;font-family:monospace;font-size:14px;text-align:right;">
        ${formatZAR(item.price_cents * item.quantity)}
      </td>
    </tr>`
		)
		.join('');

	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Order Confirmed — KŌDO</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'DM Sans',Arial,sans-serif;color:#e8e8e8;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding-bottom:32px;border-bottom:1px solid #1e1e1e;">
              <a href="${siteUrl}" style="text-decoration:none;">
                <span style="font-family:'Bebas Neue',Impact,sans-serif;font-size:32px;letter-spacing:0.15em;color:#e8b44a;">KŌDO</span>
              </a>
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td style="padding:32px 0 8px;">
              <p style="margin:0;font-family:monospace;font-size:11px;letter-spacing:0.2em;color:#666;text-transform:uppercase;">Order confirmed</p>
              <h1 style="margin:8px 0 0;font-family:'Bebas Neue',Impact,sans-serif;font-size:40px;letter-spacing:0.05em;color:#e8e8e8;line-height:1;">
                Thank you.
              </h1>
            </td>
          </tr>

          <!-- Order ID -->
          <tr>
            <td style="padding-bottom:28px;">
              <p style="margin:0;font-size:14px;color:#888;">
                Your order <span style="font-family:monospace;color:#e8b44a;">#${shortId}</span> has been received and is being processed.
              </p>
            </td>
          </tr>

          <!-- Items table -->
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0">
                <thead>
                  <tr>
                    <th style="text-align:left;padding-bottom:8px;font-family:monospace;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#555;font-weight:normal;">Item</th>
                    <th style="text-align:center;padding-bottom:8px;font-family:monospace;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#555;font-weight:normal;">Qty</th>
                    <th style="text-align:right;padding-bottom:8px;font-family:monospace;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#555;font-weight:normal;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${
										itemRows.length
											? itemRows
											: `
                    <tr>
                      <td colspan="3" style="padding:10px 0;color:#666;font-size:14px;">
                        Item details will be confirmed shortly.
                      </td>
                    </tr>`
									}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Order total -->
          <tr>
            <td style="padding:20px 0;border-top:1px solid #333;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-family:monospace;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:#666;">Order total</td>
                  <td style="text-align:right;font-family:monospace;font-size:20px;color:#e8b44a;font-weight:bold;">${formatZAR(totalCents)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- What's next -->
          <tr>
            <td style="padding:24px;background:#111;border:1px solid #1e1e1e;border-radius:8px;margin-top:8px;">
              <p style="margin:0 0 12px;font-family:monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#555;">What happens next</p>
              <ul style="margin:0;padding:0 0 0 16px;color:#888;font-size:14px;line-height:1.8;">
                <li>We'll pick, pack and dispatch your order within 1–2 business days.</li>
                <li>You'll receive a tracking number by email once it's with the courier.</li>
                <li>Standard delivery: 3–5 business days. Express (metro): next business day.</li>
              </ul>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:28px 0 0;text-align:center;">
              <a href="${siteUrl}/account"
                style="display:inline-block;padding:14px 32px;border:1px solid #e8b44a;color:#e8b44a;text-decoration:none;font-family:monospace;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;">
                View order history
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:32px 0 0;border-top:1px solid #1e1e1e;margin-top:32px;">
              <p style="margin:0;font-size:12px;color:#444;text-align:center;line-height:1.8;">
                Questions? Email us at <a href="mailto:hello@kodo.co.za" style="color:#666;">hello@kodo.co.za</a><br/>
                <a href="${siteUrl}" style="color:#555;text-decoration:none;">kodo.co.za</a>
                &nbsp;·&nbsp;
                <a href="${siteUrl}/policies/returns" style="color:#555;text-decoration:none;">Returns policy</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function orderConfirmationText(data: OrderConfirmationData): string {
	const { orderId, totalCents, items, siteUrl } = data;
	const shortId = orderId.slice(0, 8).toUpperCase();

	const itemLines = items
		.map(
			(i) => `  ${i.name} (${i.sku}) × ${i.quantity}  —  ${formatZAR(i.price_cents * i.quantity)}`
		)
		.join('\n');

	return `KŌDO — Order Confirmed

Order #${shortId}

Thank you for your order. We've received it and will begin processing shortly.

${itemLines || '  Item details to follow.'}

ORDER TOTAL: ${formatZAR(totalCents)}

WHAT HAPPENS NEXT
- Dispatch within 1–2 business days
- Tracking number emailed once with courier
- Standard: 3–5 days · Express (metro): next business day

View your orders: ${siteUrl}/account
Questions: hello@kodo.co.za
Returns policy: ${siteUrl}/policies/returns

KŌDO — Wear the Code`;
}
