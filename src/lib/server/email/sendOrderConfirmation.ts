import { PUBLIC_SITE_URL } from '$env/static/public';
import { resend, FROM } from './client';
import { orderConfirmationHtml, orderConfirmationText } from './templates/orderConfirmation';

interface OrderItem {
	sku: string;
	name: string;
	quantity: number;
	price_cents: number;
}

export async function sendOrderConfirmation({
	orderId,
	email,
	totalCents,
	items,
}: {
	orderId: string;
	email: string;
	totalCents: number;
	items: OrderItem[];
}) {
	const data = { orderId, email, totalCents, items, siteUrl: PUBLIC_SITE_URL };
	const shortId = orderId.slice(0, 8).toUpperCase();

	const { error } = await resend.emails.send({
		from: FROM,
		to: email,
		subject: `Order confirmed — #${shortId}`,
		html: orderConfirmationHtml(data),
		text: orderConfirmationText(data),
	});

	if (error) {
		console.error('[email] order confirmation failed', error);
	}
}
