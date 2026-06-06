<script lang="ts">
	import { recentlyViewed } from '$lib/stores/recentlyViewed.svelte';
	import { formatZAR } from '$lib/utils/format';

	interface Props {
		excludeId?: string; // exclude the current product
	}

	let { excludeId = '' }: Props = $props();

	$effect(() => {
		recentlyViewed.load();
	});

	const visible = $derived(
		recentlyViewed.items.filter((i) => i.productId !== excludeId).slice(0, 6)
	);
</script>

{#if visible.length > 0}
	<section class="recently-section">
		<h2 class="section-title">Recently viewed</h2>
		<div class="product-row">
			{#each visible as item (item.productId)}
				<a href="/products/{item.slug}" class="product-card">
					<div class="thumb">
						{#if item.image}
							<img src={item.image} alt={item.title} />
						{:else}
							<span class="placeholder">K</span>
						{/if}
					</div>
					<p class="title">{item.title}</p>
					<p class="price">{formatZAR(item.price)}</p>
				</a>
			{/each}
		</div>
	</section>
{/if}

<style>
	.recently-section {
		padding: 3rem var(--spacing-gutter, 1.5rem);
		border-top: 1px solid var(--color-kodo-border, #2a2a2a);
	}

	.section-title {
		font-family: 'Space Mono', monospace;
		font-size: 0.7rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--color-kodo-muted, #888);
		margin-bottom: 1.25rem;
	}

	.product-row {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
		gap: 1rem;
	}

	.product-card {
		text-decoration: none;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.thumb {
		aspect-ratio: 3/4;
		overflow: hidden;
		background: var(--color-kodo-surface, #111);
		border: 1px solid var(--color-kodo-border, #2a2a2a);
	}

	.thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.4s ease;
	}

	.product-card:hover .thumb img {
		transform: scale(1.05);
	}

	.placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: 'Bebas Neue', sans-serif;
		font-size: 2rem;
		color: var(--color-kodo-border, #2a2a2a);
	}

	.title {
		font-size: 0.8rem;
		color: var(--color-kodo-text, #f0ede6);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.price {
		font-family: 'Space Mono', monospace;
		font-size: 0.75rem;
		color: var(--color-kodo-accent, #e8b44a);
	}
</style>
