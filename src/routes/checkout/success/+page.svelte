<script lang="ts">
	import { cartStore } from '$lib/stores/cart.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		cartStore.clear();
	});
</script>

<svelte:head>
	<title>Order Confirmed — KŌDO</title>
</svelte:head>

<main
	class="flex min-h-screen flex-col items-center justify-center bg-[var(--color-kodo-bg)] px-4 text-center"
>
	<p class="mb-4 font-mono text-xs tracking-widest uppercase text-[var(--color-kodo-accent)]">
		Confirmed
	</p>
	<h1 class="mb-6 font-display text-7xl md:text-9xl tracking-widest text-[var(--color-kodo-text)]">
		ORDER<br />PLACED.
	</h1>
	<p class="mb-8 max-w-sm text-sm text-[var(--color-kodo-muted)]">
		Thanks for your order. You'll receive a confirmation email with tracking details within 24
		hours.
	</p>
	<a
		href="/shop"
		class="border border-[var(--color-kodo-accent)] px-8 py-3 font-mono text-xs tracking-widest uppercase text-[var(--color-kodo-accent)] transition-colors hover:bg-[var(--color-kodo-accent)] hover:text-[var(--color-kodo-bg)]"
	>
		Continue Shopping
	</a>
</main>
