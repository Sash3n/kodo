import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { data: codes } = await locals.supabase
		.from('discount_codes')
		.select(
			'id, code, type, value, min_order_cents, max_uses, uses, active, expires_at, created_at'
		)
		.order('created_at', { ascending: false });

	return { codes: codes ?? [] };
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const form = await request.formData();
		const code = (form.get('code') as string)?.trim().toUpperCase();
		const type = form.get('type') as string;
		const value = parseInt(form.get('value') as string, 10);
		const minOrderCents = Math.round(parseFloat((form.get('minOrder') as string) || '0') * 100);
		const maxUses = form.get('maxUses') ? parseInt(form.get('maxUses') as string, 10) : null;
		const expiresAt = (form.get('expiresAt') as string) || null;

		if (!code || !['percent', 'fixed'].includes(type) || isNaN(value) || value <= 0) {
			return fail(400, { createError: 'Invalid input' });
		}
		if (type === 'percent' && value > 100) {
			return fail(400, { createError: 'Percent cannot exceed 100' });
		}

		const { error } = await locals.supabase.from('discount_codes').insert({
			code,
			type,
			value,
			min_order_cents: minOrderCents,
			max_uses: maxUses || null,
			expires_at: expiresAt || null,
		});

		if (error?.code === '23505') return fail(400, { createError: 'Code already exists' });
		if (error) return fail(500, { createError: 'Failed to create code' });
		return { created: true };
	},

	toggle: async ({ request, locals }) => {
		const form = await request.formData();
		const id = form.get('id') as string;
		const active = form.get('active') === 'true';

		if (!id) return fail(400, { error: 'Missing id' });

		const { error } = await locals.supabase
			.from('discount_codes')
			.update({ active: !active })
			.eq('id', id);

		if (error) return fail(500, { error: 'Update failed' });
		return { toggled: true };
	},

	delete: async ({ request, locals }) => {
		const form = await request.formData();
		const id = form.get('id') as string;
		if (!id) return fail(400, { error: 'Missing id' });

		const { error } = await locals.supabase.from('discount_codes').delete().eq('id', id);
		if (error) return fail(500, { error: 'Delete failed' });
		return { deleted: true };
	},
};
