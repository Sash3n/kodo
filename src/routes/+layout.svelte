<script lang="ts">
	import '../app.css';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	let cartOpen = $state(false);
</script>

<Nav onCartOpen={() => (cartOpen = true)} />

<div class="pt-[var(--spacing-nav)] animate-page-in">
	{@render children()}
</div>

<Footer />

<!-- Cart drawer will be wired here in feature/cart-drawer -->
