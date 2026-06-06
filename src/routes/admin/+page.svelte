<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function formatPrice(cents: number) {
		return `R${(cents / 100).toFixed(2)}`;
	}

	function formatDate(iso: string) {
		return new Date(iso).toLocaleDateString('en-ZA', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
		});
	}

	const statusColors: Record<string, string> = {
		pending: '#888',
		paid: '#e8b44a',
		processing: '#60a5fa',
		shipped: '#34d399',
		delivered: '#4ade80',
		cancelled: '#f87171',
		refunded: '#c084fc',
	};
</script>

<svelte:head><title>Dashboard — Kōdo Admin</title></svelte:head>

<div class="page">
	<h1 class="page-title">Dashboard</h1>

	<div class="stat-grid">
		<div class="stat-card">
			<span class="stat-label">Total orders</span>
			<span class="stat-value">{data.orderStats.total}</span>
		</div>
		<div class="stat-card accent">
			<span class="stat-label">Awaiting payment</span>
			<span class="stat-value">{data.orderStats.pending}</span>
		</div>
		<div class="stat-card">
			<span class="stat-label">Paid / to process</span>
			<span class="stat-value">{data.orderStats.paid}</span>
		</div>
		<div class="stat-card">
			<span class="stat-label">Processing</span>
			<span class="stat-value">{data.orderStats.processing}</span>
		</div>
		<div class="stat-card">
			<span class="stat-label">Shipped</span>
			<span class="stat-value">{data.orderStats.shipped}</span>
		</div>
		<div class="stat-card highlight">
			<span class="stat-label">Reviews pending</span>
			<span class="stat-value">{data.pendingReviews}</span>
			{#if data.pendingReviews > 0}
				<a href="/admin/reviews" class="stat-action">Review →</a>
			{/if}
		</div>
	</div>

	<section class="section">
		<div class="section-header">
			<h2 class="section-title">Recent orders</h2>
			<a href="/admin/orders" class="see-all">See all →</a>
		</div>

		{#if data.recentOrders.length === 0}
			<p class="empty">No orders yet.</p>
		{:else}
			<table class="data-table">
				<thead>
					<tr>
						<th>ID</th>
						<th>Email</th>
						<th>Total</th>
						<th>Status</th>
						<th>Date</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{#each data.recentOrders as order}
						<tr>
							<td class="mono">{order.id.slice(0, 8)}&hellip;</td>
							<td>{order.email}</td>
							<td class="mono">{formatPrice(order.total_cents)}</td>
							<td>
								<span class="status-badge" style="color:{statusColors[order.status]}">
									{order.status}
								</span>
							</td>
							<td class="muted">{formatDate(order.created_at)}</td>
							<td><a href="/admin/orders/{order.id}" class="row-link">View →</a></td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</section>

	<section class="section">
		<h2 class="section-title">Quick links</h2>
		<div class="quick-links">
			<a href="/admin/products" class="quick-link">▦ Manage products & drops</a>
			<a href="/admin/reviews" class="quick-link">◇ Review queue</a>
			<a href="/admin/config" class="quick-link">⚙ Site config</a>
			<a
				href="https://kodo.sanity.studio"
				target="_blank"
				rel="noopener"
				class="quick-link external"
			>
				↗ Sanity Studio
			</a>
		</div>
	</section>
</div>

<style>
	.page {
		max-width: 960px;
	}
	.page-title {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 2rem;
		letter-spacing: 0.05em;
		color: #e8e8e8;
		margin-bottom: 1.5rem;
	}

	.stat-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
		gap: 1rem;
		margin-bottom: 2.5rem;
	}

	.stat-card {
		background: #111;
		border: 1px solid #222;
		border-radius: 8px;
		padding: 1rem 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.stat-card.accent {
		border-color: #e8b44a44;
	}
	.stat-card.highlight {
		border-color: #60a5fa44;
	}

	.stat-label {
		font-size: 0.75rem;
		color: #666;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	.stat-value {
		font-size: 2rem;
		font-family: 'Bebas Neue', sans-serif;
		color: #e8e8e8;
	}
	.stat-action {
		font-size: 0.75rem;
		color: #60a5fa;
		text-decoration: none;
	}

	.section {
		margin-bottom: 2.5rem;
	}
	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 0.75rem;
	}
	.section-title {
		font-size: 1rem;
		font-weight: 600;
		color: #aaa;
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}
	.see-all {
		font-size: 0.8rem;
		color: #e8b44a;
		text-decoration: none;
	}
	.empty {
		color: #555;
		font-size: 0.875rem;
	}

	.data-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875rem;
	}
	.data-table th {
		text-align: left;
		padding: 0.5rem 0.75rem;
		color: #555;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		border-bottom: 1px solid #1a1a1a;
	}
	.data-table td {
		padding: 0.65rem 0.75rem;
		border-bottom: 1px solid #161616;
	}
	.data-table tr:last-child td {
		border-bottom: none;
	}

	.mono {
		font-family: 'Space Mono', monospace;
		font-size: 0.8rem;
	}
	.muted {
		color: #666;
	}
	.status-badge {
		font-family: 'Space Mono', monospace;
		font-size: 0.75rem;
		text-transform: uppercase;
	}
	.row-link {
		font-size: 0.8rem;
		color: #e8b44a;
		text-decoration: none;
		white-space: nowrap;
	}

	.quick-links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}
	.quick-link {
		padding: 0.6rem 1rem;
		background: #111;
		border: 1px solid #222;
		border-radius: 6px;
		color: #aaa;
		text-decoration: none;
		font-size: 0.875rem;
		transition:
			border-color 0.15s,
			color 0.15s;
	}
	.quick-link:hover {
		border-color: #e8b44a44;
		color: #e8b44a;
	}
	.quick-link.external::after {
		content: '';
	}
</style>
