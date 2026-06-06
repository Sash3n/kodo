<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function formatPrice(cents: number) {
		return `R${(cents / 100).toFixed(2)}`;
	}

	let expandedProduct = $state<string | null>(null);
	let saving = $state<string | null>(null); // sku of variant being saved

	function toggleExpand(id: string) {
		expandedProduct = expandedProduct === id ? null : id;
	}

	const collectionTypeLabel: Record<string, string> = {
		core: 'CORE',
		drop: 'DROP',
		collab: 'COLLAB',
		archive: 'ARCHIVE',
	};
</script>

<svelte:head><title>Products — Kōdo Admin</title></svelte:head>

<div class="page">
	<div class="page-header">
		<h1 class="page-title">Products & Drops</h1>
		<a
			href="https://kodo.sanity.studio/studio/structure/product"
			target="_blank"
			rel="noopener"
			class="btn-outline"
		>
			↗ Add product in Sanity
		</a>
	</div>

	<p class="hint">
		Product content (images, descriptions, collections) is managed in Sanity Studio. Use this panel
		to quickly update stock quantities.
	</p>

	{#if data.products.length === 0}
		<p class="empty">No products found in Sanity.</p>
	{:else}
		<div class="product-list">
			{#each data.products as product (product._id)}
				<div class="product-row">
					<button class="product-summary" onclick={() => toggleExpand(product._id)} type="button">
						<div class="product-thumb">
							{#if product.images?.[0]}
								<img src={product.images[0]} alt={product.title} />
							{:else}
								<div class="thumb-placeholder">—</div>
							{/if}
						</div>
						<div class="product-info">
							<span class="product-name">{product.title}</span>
							<span class="product-meta">
								<span class="collection-badge"
									>{collectionTypeLabel[product.collection?.type] ?? ''}</span
								>
								{product.collection?.title ?? '—'}
								&nbsp;·&nbsp;
								{formatPrice(product.price)}
								{#if product.isLimitedDrop}
									<span class="limited-badge">LIMITED DROP</span>
								{/if}
							</span>
						</div>
						<div class="variant-summary">
							{product.variants?.length ?? 0} variants ·
							{product.variants?.reduce((t: number, v: { stock: number }) => t + v.stock, 0) ?? 0} units
							total
						</div>
						<span class="expand-icon">{expandedProduct === product._id ? '▲' : '▼'}</span>
					</button>

					{#if expandedProduct === product._id}
						<div class="variant-table-wrap">
							<table class="variant-table">
								<thead>
									<tr>
										<th>SKU</th>
										<th>Size</th>
										<th>Colour</th>
										<th>Stock</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									{#each product.variants ?? [] as variant}
										<tr>
											<td class="mono">{variant.sku}</td>
											<td>{variant.size}</td>
											<td>{variant.colourway}</td>
											<td>
												<form
													method="POST"
													action="?/updateStock"
													use:enhance={() => {
														saving = variant.sku;
														return async ({ update }) => {
															await update();
															saving = null;
														};
													}}
													class="stock-form"
												>
													<input type="hidden" name="productId" value={product._id} />
													<input type="hidden" name="variantSku" value={variant.sku} />
													<input
														type="number"
														name="stock"
														value={variant.stock}
														min="0"
														class="stock-input"
														class:low={variant.stock <= 3}
													/>
													<button type="submit" class="save-btn" disabled={saving === variant.sku}>
														{saving === variant.sku ? '…' : 'Save'}
													</button>
												</form>
											</td>
											<td>
												{#if variant.stock === 0}
													<span class="out-badge">OUT</span>
												{:else if variant.stock <= 3}
													<span class="low-badge">LOW</span>
												{/if}
											</td>
										</tr>
									{/each}
								</tbody>
							</table>

							<div class="product-actions">
								<a
									href="https://kodo.sanity.studio/studio/structure/product;{product._id}"
									target="_blank"
									rel="noopener"
									class="action-link"
								>
									Edit in Sanity ↗
								</a>
								<a href="/products/{product.slug}" target="_blank" class="action-link">
									View on site ↗
								</a>
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.page {
		max-width: 960px;
	}
	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}
	.page-title {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 2rem;
		letter-spacing: 0.05em;
		color: #e8e8e8;
	}

	.btn-outline {
		padding: 0.5rem 1rem;
		border: 1px solid #e8b44a44;
		border-radius: 6px;
		color: #e8b44a;
		text-decoration: none;
		font-size: 0.8rem;
	}

	.hint {
		font-size: 0.8rem;
		color: #555;
		margin-bottom: 1.5rem;
	}
	.empty {
		color: #555;
	}

	.product-list {
		display: flex;
		flex-direction: column;
		gap: 0;
		border: 1px solid #1e1e1e;
		border-radius: 8px;
		overflow: hidden;
	}

	.product-row {
		border-bottom: 1px solid #1a1a1a;
	}
	.product-row:last-child {
		border-bottom: none;
	}

	.product-summary {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.85rem 1rem;
		background: #111;
		border: none;
		cursor: pointer;
		text-align: left;
		transition: background 0.15s;
	}

	.product-summary:hover {
		background: #141414;
	}

	.product-thumb {
		width: 48px;
		height: 48px;
		flex-shrink: 0;
		border-radius: 4px;
		overflow: hidden;
		background: #1a1a1a;
	}
	.product-thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.thumb-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #333;
	}

	.product-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}
	.product-name {
		font-size: 0.9rem;
		color: #e8e8e8;
		font-weight: 500;
	}
	.product-meta {
		font-size: 0.75rem;
		color: #666;
	}

	.collection-badge {
		font-family: 'Space Mono', monospace;
		font-size: 0.65rem;
		background: #1a1a1a;
		border: 1px solid #2a2a2a;
		padding: 1px 5px;
		border-radius: 3px;
		color: #888;
		margin-right: 4px;
	}

	.limited-badge {
		font-family: 'Space Mono', monospace;
		font-size: 0.65rem;
		color: #e8b44a;
		margin-left: 6px;
	}

	.variant-summary {
		font-size: 0.75rem;
		color: #555;
		white-space: nowrap;
	}
	.expand-icon {
		font-size: 0.65rem;
		color: #444;
		margin-left: 0.5rem;
	}

	.variant-table-wrap {
		background: #0e0e0e;
		padding: 1rem;
	}

	.variant-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.85rem;
		margin-bottom: 0.75rem;
	}
	.variant-table th {
		text-align: left;
		padding: 0.4rem 0.75rem;
		color: #555;
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		border-bottom: 1px solid #1a1a1a;
	}
	.variant-table td {
		padding: 0.5rem 0.75rem;
		border-bottom: 1px solid #141414;
	}
	.variant-table tr:last-child td {
		border-bottom: none;
	}

	.mono {
		font-family: 'Space Mono', monospace;
		font-size: 0.78rem;
	}

	.stock-form {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}
	.stock-input {
		width: 64px;
		background: #1a1a1a;
		border: 1px solid #2a2a2a;
		color: #e8e8e8;
		font-family: 'Space Mono', monospace;
		font-size: 0.85rem;
		padding: 0.3rem 0.5rem;
		border-radius: 4px;
		text-align: right;
	}
	.stock-input.low {
		border-color: #f8714444;
		color: #f87171;
	}

	.save-btn {
		background: transparent;
		border: 1px solid #333;
		color: #888;
		font-size: 0.75rem;
		padding: 0.3rem 0.6rem;
		border-radius: 4px;
		cursor: pointer;
	}
	.save-btn:hover {
		border-color: #e8b44a44;
		color: #e8b44a;
	}
	.save-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.out-badge {
		font-size: 0.65rem;
		color: #f87171;
		font-family: 'Space Mono', monospace;
	}
	.low-badge {
		font-size: 0.65rem;
		color: #fb923c;
		font-family: 'Space Mono', monospace;
	}

	.product-actions {
		display: flex;
		gap: 1rem;
	}
	.action-link {
		font-size: 0.78rem;
		color: #e8b44a;
		text-decoration: none;
	}
</style>
