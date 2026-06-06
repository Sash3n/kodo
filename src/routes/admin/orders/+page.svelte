<script lang="ts">
	import { enhance } from '$app/forms';
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

	let updatingId = $state<string | null>(null);
</script>

<svelte:head><title>Orders — Kōdo Admin</title></svelte:head>

<div class="page">
	<div class="page-header-row">
		<h1 class="page-title">Orders</h1>
		<a
			href="/api/admin/orders-export?status={data.statusFilter === 'all' ? '' : data.statusFilter}"
			class="export-btn"
			download
		>
			↓ Export CSV
		</a>
	</div>

	<!-- Status filter tabs -->
	<div class="filter-tabs">
		<a href="/admin/orders" class="tab" class:active={data.statusFilter === 'all'}>
			All ({data.total})
		</a>
		{#each data.statuses as status}
			<a
				href="/admin/orders?status={status}"
				class="tab"
				class:active={data.statusFilter === status}
			>
				{status}
			</a>
		{/each}
	</div>

	{#if data.orders.length === 0}
		<p class="empty">No orders found.</p>
	{:else}
		<table class="data-table">
			<thead>
				<tr>
					<th>Order ID</th>
					<th>Email</th>
					<th>Total</th>
					<th>Status</th>
					<th>Date</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each data.orders as order}
					<tr class:updating={updatingId === order.id}>
						<td class="mono">
							<a href="/admin/orders/{order.id}" class="id-link">{order.id.slice(0, 8)}&hellip;</a>
						</td>
						<td>{order.email}</td>
						<td class="mono">{formatPrice(order.total_cents)}</td>
						<td>
							<span class="status-badge" style="color:{statusColors[order.status]}">
								{order.status}
							</span>
						</td>
						<td class="muted">{formatDate(order.created_at)}</td>
						<td>
							<form
								method="POST"
								action="?/updateStatus"
								use:enhance={() => {
									updatingId = order.id;
									return async ({ update }) => {
										await update();
										updatingId = null;
									};
								}}
								class="status-form"
							>
								<input type="hidden" name="id" value={order.id} />
								<select
									name="status"
									class="status-select"
									onchange={(e) => (e.currentTarget.form as HTMLFormElement)?.requestSubmit()}
								>
									{#each data.statuses as s}
										<option value={s} selected={s === order.status}>{s}</option>
									{/each}
								</select>
							</form>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>

		<!-- Pagination -->
		<div class="pagination">
			{#if data.page > 1}
				<a href="/admin/orders?page={data.page - 1}&status={data.statusFilter}" class="page-btn"
					>← Prev</a
				>
			{/if}
			<span class="page-info">
				Page {data.page} of {Math.ceil(data.total / data.pageSize)}
			</span>
			{#if data.page * data.pageSize < data.total}
				<a href="/admin/orders?page={data.page + 1}&status={data.statusFilter}" class="page-btn"
					>Next →</a
				>
			{/if}
		</div>
	{/if}
</div>

<style>
	.page {
		max-width: 1100px;
	}
	.page-header-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.25rem;
	}
	.page-title {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 2rem;
		letter-spacing: 0.05em;
		color: #e8e8e8;
	}
	.export-btn {
		font-family: 'Space Mono', monospace;
		font-size: 0.75rem;
		color: #888;
		text-decoration: none;
		border: 1px solid #2a2a2a;
		padding: 0.4rem 0.85rem;
		border-radius: 5px;
		transition:
			border-color 0.15s,
			color 0.15s;
	}
	.export-btn:hover {
		border-color: #e8b44a44;
		color: #e8b44a;
	}

	.filter-tabs {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
	}

	.tab {
		padding: 0.35rem 0.75rem;
		border: 1px solid #222;
		border-radius: 20px;
		font-size: 0.75rem;
		color: #666;
		text-decoration: none;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		transition:
			border-color 0.15s,
			color 0.15s;
	}

	.tab:hover,
	.tab.active {
		border-color: #e8b44a44;
		color: #e8b44a;
	}

	.empty {
		color: #555;
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
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		border-bottom: 1px solid #1a1a1a;
	}
	.data-table td {
		padding: 0.65rem 0.75rem;
		border-bottom: 1px solid #161616;
	}
	.data-table tr.updating td {
		opacity: 0.5;
	}

	.mono {
		font-family: 'Space Mono', monospace;
		font-size: 0.8rem;
	}
	.muted {
		color: #666;
	}
	.id-link {
		color: #e8b44a;
		text-decoration: none;
	}
	.status-badge {
		font-family: 'Space Mono', monospace;
		font-size: 0.75rem;
		text-transform: uppercase;
	}

	.status-form {
		display: flex;
	}
	.status-select {
		background: #1a1a1a;
		border: 1px solid #2a2a2a;
		color: #aaa;
		font-size: 0.75rem;
		padding: 0.3rem 0.5rem;
		border-radius: 4px;
		cursor: pointer;
	}

	.pagination {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-top: 1.5rem;
		font-size: 0.875rem;
	}

	.page-btn {
		color: #e8b44a;
		text-decoration: none;
	}

	.page-info {
		color: #555;
	}
</style>
