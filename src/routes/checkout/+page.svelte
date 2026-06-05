<script lang="ts">
	import { cartStore } from '$lib/stores/cart.svelte';
	import { formatZAR } from '$lib/utils/format';

	const cartJson = $derived(JSON.stringify(cartStore.items));
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

			<div class="mb-8 border-t border-[var(--color-kodo-border)] pt-4 flex justify-between">
				<span class="font-display text-xl tracking-widest">TOTAL</span>
				<span class="font-mono text-xl text-[var(--color-kodo-accent)]"
					>{formatZAR(cartStore.total)}</span
				>
			</div>

			<form method="POST">
				<input type="hidden" name="cart" value={cartJson} />
				<button
					type="submit"
					class="w-full bg-[var(--color-kodo-accent)] py-4 font-mono text-xs tracking-widest uppercase text-[var(--color-kodo-bg)] transition-opacity hover:opacity-90"
				>
					Pay with PayFast
				</button>
			</form>

			<p class="mt-4 text-center font-mono text-xs text-[var(--color-kodo-muted)]">
				Secured by PayFast · No card details stored by KŌDO
			</p>
		{/if}
	</div>
</main>
