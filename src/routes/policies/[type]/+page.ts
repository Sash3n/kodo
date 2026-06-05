import type { LoadEvent } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

const ALLOWED_TYPES = ['shipping', 'returns', 'privacy', 'terms', 'size-guide'] as const;
type PolicyType = (typeof ALLOWED_TYPES)[number];

export function load({ params }: LoadEvent): { type: PolicyType } {
	const { type } = params as { type: string };

	if (!ALLOWED_TYPES.includes(type as PolicyType)) {
		throw error(404, 'Policy not found');
	}

	return { type: type as PolicyType };
}
