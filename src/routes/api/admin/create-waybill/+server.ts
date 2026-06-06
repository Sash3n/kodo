import { json, error } from '@sveltejs/kit';
import { createWaybill } from '$lib/server/couriers/tcg';
import type { RequestHandler } from './$types';

// Kōdo dispatch address (configure via env or hardcode for MVP)
const DISPATCH_ADDRESS = {
	streetAddress: '1 Kōdo Way',
	suburb: 'Sandton',
	city: 'Johannesburg',
	postalCode: '2196',
};

export const POST: RequestHandler = async ({ request, locals }) => {
	const { session } = await locals.safeGetSession();
	if (!session) throw error(401, 'Unauthorized');

	const { data: profile } = await locals.supabase
		.from('profiles')
		.select('role')
		.eq('id', session.user.id)
		.single();
	if (profile?.role !== 'admin') throw error(403, 'Forbidden');

	const {
		orderId,
		recipientName,
		streetAddress,
		suburb,
		city,
		postalCode,
		recipientPhone,
		serviceType,
		weightKg,
	} = await request.json();

	if (!orderId || !streetAddress || !city || !postalCode) {
		throw error(400, 'Missing required fields');
	}

	// Fetch order to get email and reference
	const { data: order } = await locals.supabase
		.from('orders')
		.select('id, email, m_payment_id')
		.eq('id', orderId)
		.single();

	if (!order) throw error(404, 'Order not found');

	let waybill;
	try {
		waybill = await createWaybill({
			collectionAddress: DISPATCH_ADDRESS,
			deliveryAddress: { streetAddress, suburb: suburb ?? city, city, postalCode },
			recipientName: recipientName || order.email,
			recipientEmail: order.email,
			recipientPhone: recipientPhone ?? undefined,
			parcels: [{ weight: weightKg ?? 0.5 }],
			referenceNumber: order.m_payment_id ?? orderId,
			serviceType: serviceType ?? 'ECO',
		});
	} catch (err) {
		console.error('[waybill] TCG error', err);
		throw error(502, 'Courier API failed — check TCG_API_KEY and try again');
	}

	// Store waybill info in order notes
	const notes = `Waybill: ${waybill.waybillNumber} | Track: ${waybill.trackingUrl}`;
	await locals.supabase.from('orders').update({ status: 'processing', notes }).eq('id', orderId);

	return json({ waybill });
};
