<script lang="ts">
	import { cartStore } from '$lib/stores/cart.svelte';
	import { formatZAR } from '$lib/utils/format';

	const cartJson = $derived(JSON.stringify(cartStore.items));

	// Discount code state
	let discountInput = $state('');
	let discountApplied = $state<{
		code: string;
		type: string;
		value: number;
		discountCents: number;
	} | null>(null);
	let discountError = $state('');
	let checkingDiscount = $state(false);

	const discountedTotal = $derived(
		discountApplied ? Math.max(0, cartStore.total - discountApplied.discountCents) : cartStore.total
	);

	async function applyDiscount() {
		if (!discountInput.trim()) return;
		checkingDiscount = true;
		discountError = '';
		discountApplied = null;

		try {
			const res = await fetch('/api/discount', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ code: discountInput.trim(), orderCents: cartStore.total }),
			});
			const data = await res.json();
			if (data.valid) {
				discountApplied = data;
			} else {
				discountError = data.error ?? 'Invalid code';
			}
		} catch {
			discountError = 'Could not validate code. Try again.';
		} finally {
			checkingDiscount = false;
		}
	}

	function removeDiscount() {
		discountApplied = null;
		discountInput = '';
		discountError = '';
	}
</script>

<svelte:head>
	<title>Checkout — KŌDO</title>
</svelte:head>

<main class="min-h-screen bg-[var(--color-kodo-bg)] pt-32">
	<div class="mx-auto max-w-lg px-[var(--spacing-gutter)] py-16">
		<p class="mb-4 font-mono text-xs tracking-widest uppercase text-[var(--color-kodo-muted)]">
			Checkout
		</p>
		<h1 class="mb-12 font-display text-5xl tracking-widest">REVIEW ORDER</h1>

		{#if cartStore.items.length === 0}
			<p class="text-[var(--color-kodo-muted)]">Your cart is empty.</p>
			<a
				href="/shop"
				class="mt-6 inline-block border border-[var(--color-kodo-accent)] px-8 py-3 font-mono text-xs tracking-widest uppercase text-[var(--color-kodo-accent)] transition-colors hover:bg-[var(--color-kodo-accent)] hover:text-[var(--color-kodo-bg)]"
			>
				Back to Shop
			</a>
		{:else}
			<ul class="mb-8 divide-y divide-[var(--color-kodo-border)]" role="list">
				{#each cartStore.items as item}
					<li class="flex items-center justify-between py-4">
						<div>
							<p class="text-sm font-medium">{item.name}</p>
							<p class="font-mono text-xs text-[var(--color-kodo-muted)]">
								{item.sku} · qty {item.quantity}
							</p>
						</div>
						<p class="font-mono text-sm text-[var(--color-kodo-accent)]">
							{formatZAR(item.price * item.quantity)}
						</p>
					</li>
				{/each}
			</ul>

			<!-- Discount code -->
			<div class="mb-6">
				{#if discountApplied}
					<div
						class="flex items-center justify-between border border-[var(--color-kodo-accent)]/30 bg-[var(--color-kodo-accent)]/5 px-4 py-3"
					>
						<div>
							<p
								class="font-mono text-xs tracking-widest text-[var(--color-kodo-accent)] uppercase"
							>
								{discountApplied.code} applied
							</p>
							<p class="font-mono text-xs text-[var(--color-kodo-muted)]">
								{discountApplied.type === 'percent'
									? `${discountApplied.value}% off`
									: formatZAR(discountApplied.value) + ' off'}
								— saving {formatZAR(discountApplied.discountCents)}
							</p>
						</div>
						<button
							type="button"
							onclick={removeDiscount}
							class="font-mono text-xs text-[var(--color-kodo-muted)] hover:text-red-400"
						>
							Remove
						</button>
					</div>
				{:else}
					<div class="flex gap-2">
						<input
							type="text"
							bind:value={discountInput}
							placeholder="Discount code"
							class="flex-1 border border-[var(--color-kodo-border)] bg-transparent px-4 py-3 font-mono text-sm text-[var(--color-kodo-text)] placeholder:text-[var(--color-kodo-muted)] focus:border-[var(--color-kodo-accent)] focus:outline-none uppercase"
							onkeydown={(e) => e.key === 'Enter' && applyDiscount()}
						/>
						<button
							type="button"
							onclick={applyDiscount}
							disabled={checkingDiscount || !discountInput.trim()}
							class="border border-[var(--color-kodo-border)] px-5 font-mono text-xs tracking-widest uppercase text-[var(--color-kodo-muted)] transition-colors hover:border-[var(--color-kodo-accent)] hover:text-[var(--color-kodo-accent)] disabled:opacity-40"
						>
							{checkingDiscount ? '…' : 'Apply'}
						</button>
					</div>
					{#if discountError}
						<p class="mt-2 font-mono text-xs text-red-400">{discountError}</p>
					{/if}
				{/if}
			</div>

			<!-- Totals -->
			<div class="mb-8 border-t border-[var(--color-kodo-border)] pt-4 space-y-2">
				<div class="flex justify-between text-sm text-[var(--color-kodo-muted)]">
					<span>Subtotal</span>
					<span class="font-mono">{formatZAR(cartStore.total)}</span>
				</div>
				{#if discountApplied}
					<div class="flex justify-between text-sm text-[var(--color-kodo-accent)]">
						<span>Discount ({discountApplied.code})</span>
						<span class="font-mono">−{formatZAR(discountApplied.discountCents)}</span>
					</div>
				{/if}
				<div class="flex justify-between pt-2 border-t border-[var(--color-kodo-border)]">
					<span class="font-display text-xl tracking-widest">TOTAL</span>
					<span class="font-mono text-xl text-[var(--color-kodo-accent)]">
						{formatZAR(discountedTotal)}
					</span>
				</div>
			</div>

			<form method="POST">
				<input type="hidden" name="cart" value={cartJson} />
				{#if discountApplied}
					<input type="hidden" name="discountCode" value={discountApplied.code} />
				{/if}
				<button
					type="submit"
					class="w-full bg-[var(--color-kodo-accent)] py-4 font-mono text-xs tracking-widest uppercase text-[var(--color-kodo-bg)] transition-opacity hover:opacity-90"
				>
					Pay {formatZAR(discountedTotal)} with PayFast
				</button>
			</form>

			<p class="mt-4 text-center font-mono text-xs text-[var(--color-kodo-muted)]">
				Secured by PayFast · No card details stored by KŌDO
			</p>
		{/if}
	</div>
</main>
