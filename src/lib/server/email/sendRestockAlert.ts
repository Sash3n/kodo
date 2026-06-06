import { PUBLIC_SITE_URL } from '$env/static/public';
import { resend, FROM } from './client';

export async function sendRestockAlert({
	email,
	productTitle,
	variantSku,
	productSlug,
}: {
	email: string;
	productTitle: string;
	variantSku: string;
	productSlug: string;
}) {
	const productUrl = `${PUBLIC_SITE_URL}/products/${productSlug}`;
	// Extract size/colour from SKU: KDO-HOD-BLK-L-001 → BLK · L
	const skuParts = variantSku.split('-');
	const variantLabel = skuParts.length >= 5 ? `${skuParts[2]} · ${skuParts[3]}` : variantSku;

	await resend.emails.send({
		from: FROM,
		to: email,
		subject: `Back in stock — ${productTitle}`,
		html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><title>Back in Stock — KŌDO</title></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'DM Sans',Arial,sans-serif;color:#e8e8e8;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;">
        <tr>
          <td style="padding-bottom:24px;border-bottom:1px solid #1e1e1e;">
            <span style="font-family:'Bebas Neue',Impact,sans-serif;font-size:28px;letter-spacing:0.15em;color:#e8b44a;">KŌDO</span>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 0 12px;">
            <p style="margin:0;font-family:monospace;font-size:11px;letter-spacing:0.2em;color:#666;text-transform:uppercase;">Back in stock</p>
            <h1 style="margin:8px 0 0;font-family:'Bebas Neue',Impact,sans-serif;font-size:36px;letter-spacing:0.05em;color:#e8e8e8;line-height:1;">
              ${productTitle}
            </h1>
          </td>
        </tr>
        <tr>
          <td style="padding-bottom:24px;">
            <p style="margin:0;font-size:14px;color:#aaa;">
              The <span style="font-family:monospace;color:#e8b44a;">${variantLabel}</span> variant you requested is back in stock.
              Don't wait — limited quantities available.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding-bottom:28px;">
            <a href="${productUrl}"
              style="display:inline-block;padding:14px 32px;background:#e8b44a;color:#0a0a0a;text-decoration:none;font-family:monospace;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;font-weight:bold;">
              Shop Now
            </a>
          </td>
        </tr>
        <tr>
          <td style="border-top:1px solid #1e1e1e;padding-top:20px;">
            <p style="margin:0;font-size:11px;color:#444;text-align:center;">
              KŌDO · <a href="${PUBLIC_SITE_URL}" style="color:#555;text-decoration:none;">kodo.co.za</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
		text: `KŌDO — Back in Stock\n\n${productTitle} (${variantLabel}) is back in stock.\n\nShop now: ${productUrl}\n\nKŌDO — Wear the Code`,
	});
}
