<script lang="ts">
	import { wishlistStore } from '$lib/stores/wishlist.svelte';

	interface Props {
		productId: string;
		slug: string;
		title: string;
		price: number;
		image?: string | null;
		class?: string;
	}

	let { productId, slug, title, price, image = null, class: className = '' }: Props = $props();

	const isSaved = $derived(wishlistStore.has(productId));

	function handleToggle() {
		wishlistStore.toggle({ productId, slug, title, price, image });
	}
</script>

<button
	type="button"
	onclick={handleToggle}
	aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
	class="wishlist-btn {className}"
	class:saved={isSaved}
	title={isSaved ? 'Saved' : 'Save'}
>
	<!-- Heart icon -->
	<svg
		width="18"
		height="18"
		viewBox="0 0 24 24"
		fill={isSaved ? 'currentColor' : 'none'}
		stroke="currentColor"
		stroke-width="1.5"
	>
		<path
			d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
		/>
	</svg>
</button>

<style>
	.wishlist-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: 1px solid var(--color-kodo-border, #2a2a2a);
		color: var(--color-kodo-muted, #888);
		padding: 0.5rem;
		cursor: pointer;
		transition:
			color 0.15s,
			border-color 0.15s;
		border-radius: 2px;
	}

	.wishlist-btn:hover {
		color: var(--color-kodo-accent, #e8b44a);
		border-color: var(--color-kodo-accent, #e8b44a);
	}

	.wishlist-btn.saved {
		color: var(--color-kodo-accent, #e8b44a);
		border-color: var(--color-kodo-accent, #e8b44a);
	}
</style>
