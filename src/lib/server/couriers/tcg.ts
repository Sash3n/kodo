// The Courier Guy (TCG) API integration
// Docs: https://tcg-api.courierguy.co.za/
// Auth: API key in header X-API-Key

import { TCG_API_KEY } from '$env/static/private';

const TCG_BASE = 'https://tcg-api.courierguy.co.za/waybill';

export interface TCGAddress {
	streetAddress: string;
	suburb: string;
	city: string;
	postalCode: string;
	country?: string; // defaults to ZA
}

export interface TCGParcel {
	weight: number; // kg
	width?: number; // cm
	height?: number; // cm
	length?: number; // cm
}

export interface TCGWaybillRequest {
	collectionAddress: TCGAddress;
	deliveryAddress: TCGAddress;
	recipientName: string;
	recipientPhone?: string;
	recipientEmail?: string;
	parcels: TCGParcel[];
	specialInstructions?: string;
	referenceNumber: string;
	serviceType?: 'ECO' | 'EXP'; // Economy (3-5 days) or Express (next day)
}

export interface TCGWaybillResponse {
	waybillNumber: string;
	trackingUrl: string;
	labelUrl: string;
	estimatedDelivery?: string;
}

export async function createWaybill(req: TCGWaybillRequest): Promise<TCGWaybillResponse> {
	if (!TCG_API_KEY) {
		throw new Error('TCG_API_KEY not configured');
	}

	const body = {
		collection_address: {
			street_address: req.collectionAddress.streetAddress,
			suburb: req.collectionAddress.suburb,
			city: req.collectionAddress.city,
			postal_code: req.collectionAddress.postalCode,
			country: req.collectionAddress.country ?? 'ZA',
		},
		delivery_address: {
			street_address: req.deliveryAddress.streetAddress,
			suburb: req.deliveryAddress.suburb,
			city: req.deliveryAddress.city,
			postal_code: req.deliveryAddress.postalCode,
			country: req.deliveryAddress.country ?? 'ZA',
		},
		recipient_name: req.recipientName,
		recipient_phone: req.recipientPhone,
		recipient_email: req.recipientEmail,
		parcels: req.parcels.map((p) => ({
			weight: p.weight,
			width: p.width ?? 30,
			height: p.height ?? 10,
			length: p.length ?? 30,
		})),
		special_instructions: req.specialInstructions ?? '',
		reference_number: req.referenceNumber,
		service_type: req.serviceType ?? 'ECO',
	};

	const res = await fetch(TCG_BASE, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-API-Key': TCG_API_KEY,
		},
		body: JSON.stringify(body),
	});

	if (!res.ok) {
		const text = await res.text();
		throw new Error(`TCG API error ${res.status}: ${text}`);
	}

	const data = await res.json();

	return {
		waybillNumber: data.waybill_number ?? data.waybillNumber,
		trackingUrl: data.tracking_url ?? `https://tcg.co.za/tracking/${data.waybill_number}`,
		labelUrl: data.label_url ?? data.labelUrl ?? '',
		estimatedDelivery: data.estimated_delivery,
	};
}
