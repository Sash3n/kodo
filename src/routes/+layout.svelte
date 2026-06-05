<script lang="ts">
	import '../app.css';
	import AnnouncementBar from '$lib/components/AnnouncementBar.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import CartDrawer from '$lib/components/CartDrawer.svelte';
	import { cartStore } from '$lib/stores/cart.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();

	let cartOpen = $state(false);

	onMount(() => {
		cartStore.loadFromStorage();
	});
</script>

<AnnouncementBar />
<Nav onCartOpen={() => (cartOpen = true)} />

<div class="pt-[var(--spacing-nav)] animate-page-in">
	{@render children()}
</div>

<Footer />

<CartDrawer open={cartOpen} onClose={() => (cartOpen = false)} />
