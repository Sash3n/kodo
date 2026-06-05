<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	type PolicySection = { heading: string; body: string };
	type Policy = { title: string; sections: PolicySection[] };
	type PolicyMap = Record<string, Policy>;

	const policies: PolicyMap = {
		shipping: {
			title: 'Shipping Policy',
			sections: [
				{
					heading: 'Domestic Shipping (South Africa)',
					body: 'Standard shipping via The Courier Guy or similar: 3–5 business days. Flat rate of R99. Free on orders over R999.',
				},
				{
					heading: 'International Shipping',
					body: 'We ship worldwide via DHL Express. Rates are calculated at checkout. Delivery takes 7–14 business days. Import duties and taxes are the responsibility of the customer.',
				},
				{
					heading: 'Processing Time',
					body: 'All orders are processed within 1–2 business days. Drop orders may take up to 3 business days.',
				},
				{
					heading: 'Tracking',
					body: 'You will receive a tracking number by email once your order is dispatched.',
				},
			],
		},
		returns: {
			title: 'Returns Policy',
			sections: [
				{
					heading: '14-Day Window',
					body: 'You may return unworn, unwashed items with original tags attached within 14 days of delivery.',
				},
				{
					heading: 'Final Sale',
					body: 'Items marked "Final Sale" are not eligible for return or exchange.',
				},
				{
					heading: 'How to Return',
					body: 'Initiate a return via our Returns page. We will email you a return label. Once received and inspected, refunds are processed within 5–7 business days.',
				},
				{
					heading: 'Exchanges',
					body: 'We offer size exchanges where stock is available. Please specify your preferred replacement size when initiating a return.',
				},
			],
		},
		privacy: {
			title: 'Privacy Policy',
			sections: [
				{
					heading: 'Data We Collect',
					body: 'We collect your name, email address, shipping address, and payment details when you place an order. We do not store raw card details — payments are processed by Stripe.',
				},
				{
					heading: 'How We Use Your Data',
					body: 'We use your data to fulfil orders, communicate about your purchases, and (with your consent) send you updates about new drops.',
				},
				{
					heading: 'Third Parties',
					body: 'We share necessary data with our shipping partners and payment processor. We do not sell your data to third parties.',
				},
				{
					heading: 'Your Rights',
					body: 'You have the right to access, correct, or delete your personal data. Email hello@kodo.co.za to exercise these rights.',
				},
			],
		},
		terms: {
			title: 'Terms of Service',
			sections: [
				{
					heading: 'Acceptance',
					body: 'By accessing our site and placing orders, you accept these terms in full.',
				},
				{
					heading: 'Product Descriptions',
					body: 'We make every effort to accurately describe products. Colours may vary slightly due to screen calibration.',
				},
				{
					heading: 'Pricing',
					body: 'All prices are in South African Rand (ZAR) and include VAT. Prices may change without notice.',
				},
				{
					heading: 'Intellectual Property',
					body: 'All KŌDO content — photography, copy, branding — is protected by copyright. Do not reproduce without written permission.',
				},
			],
		},
		'size-guide': {
			title: 'Size Guide',
			sections: [
				{
					heading: 'How to Measure',
					body: 'Use a soft tape measure. Chest: measure around the fullest part, keeping the tape horizontal. Length: from highest shoulder point to hem. Sleeve: from shoulder seam to wrist.',
				},
				{
					heading: 'Our Fit Philosophy',
					body: 'KŌDO garments are cut with a relaxed-oversized silhouette. If you are between sizes, we recommend sizing down. Check each product page for specific fit notes.',
				},
				{
					heading: 'Size Chart (cm)',
					body: 'XS: Chest 86–91, Length 66, Sleeve 58 — S: 91–96, 68, 60 — M: 96–101, 70, 62 — L: 101–106, 72, 64 — XL: 106–111, 74, 66 — XXL: 111–116, 76, 68',
				},
			],
		},
	};

	const policy = $derived(policies[data.type] ?? null);
</script>

<svelte:head>
	<title>{policy?.title ?? 'Policy'} — KŌDO</title>
</svelte:head>

<section class="min-h-screen bg-[var(--color-kodo-bg)] pt-32">
	<div class="mx-auto max-w-3xl px-[var(--spacing-gutter)] py-16">
		{#if policy}
			<h1
				class="mb-12 leading-none text-[var(--color-kodo-text)]"
				style="font-family: var(--font-display); font-size: clamp(2.5rem, 8vw, 6rem);"
			>
				{policy.title}
			</h1>

			<div class="flex flex-col gap-10">
				{#each policy.sections as section}
					<div class="border-l-2 border-[var(--color-kodo-border)] pl-6">
						<h2
							class="mb-3 text-sm tracking-[0.2em] text-[var(--color-kodo-accent)] uppercase"
							style="font-family: var(--font-mono);"
						>
							{section.heading}
						</h2>
						<p
							class="text-sm leading-relaxed text-[var(--color-kodo-text-muted)]"
							style="font-family: var(--font-body);"
						>
							{section.body}
						</p>
					</div>
				{/each}
			</div>
		{:else}
			<p
				class="text-sm tracking-[0.2em] text-[var(--color-kodo-text-muted)] uppercase"
				style="font-family: var(--font-mono);"
			>
				Policy not found.
			</p>
		{/if}
	</div>
</section>
