export type UserRole = 'user' | 'admin';

export type OrderStatus =
	| 'pending'
	| 'paid'
	| 'processing'
	| 'shipped'
	| 'delivered'
	| 'cancelled'
	| 'refunded';

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Profile {
	id: string;
	role: UserRole;
	display_name: string | null;
	created_at: string;
	updated_at: string;
}

export interface Order {
	id: string;
	user_id: string | null;
	m_payment_id: string | null;
	payment_id: string | null;
	status: OrderStatus;
	email: string;
	total_cents: number;
	shipping_name: string | null;
	shipping_address: Record<string, unknown> | null;
	notes: string | null;
	created_at: string;
	updated_at: string;
}

export interface OrderItem {
	id: string;
	order_id: string;
	sku: string;
	product_id: string;
	variant_id: string;
	name: string;
	price_cents: number;
	quantity: number;
}

export interface Review {
	id: string;
	product_id: string;
	user_id: string | null;
	display_name: string;
	rating: number;
	body: string;
	status: ReviewStatus;
	created_at: string;
	updated_at: string;
}

export interface SiteSettings {
	announcementBar: {
		enabled: boolean;
		text: string | null;
		link: string | null;
	} | null;
	social: {
		instagram?: string;
		tiktok?: string;
		twitter?: string;
		youtube?: string;
		facebook?: string;
	} | null;
	commerce: {
		freeShippingThresholdCents: number;
		standardShippingCents: number;
	} | null;
	brand: {
		supportEmail?: string;
		supportPhone?: string;
		address?: string;
	} | null;
}
