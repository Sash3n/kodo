<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function formatPrice(cents: number) {
		return `R${(cents / 100).toFixed(2)}`;
	}

	function formatDate(iso: string) {
		return new Date(iso).toLocaleString('en-ZA', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
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

	let saving = $state(false);
</script>

<svelte:head><title>Order #{data.order.id.slice(0, 8)} — Kōdo Admin</title></svelte:head>

<div class="page">
	<a href="/admin/orders" class="back-link">← Orders</a>

	<div class="order-header">
		<div>
			<h1 class="page-title">Order</h1>
			<p class="order-id mono">{data.order.id}</p>
		</div>
		<span class="status-badge large" style="color:{statusColors[data.order.status]}">
			{data.order.status}
		</span>
	</div>

	<div class="grid">
		<!-- Order info -->
		<div class="card">
			<h2 class="card-title">Details</h2>
			<dl class="detail-list">
				<dt>Email</dt>
				<dd>{data.order.email}</dd>
				<dt>Payment ID</dt>
				<dd class="mono">{data.order.m_payment_id ?? '—'}</dd>
				<dt>PF ID</dt>
				<dd class="mono">{data.order.payment_id ?? '—'}</dd>
				<dt>Total</dt>
				<dd class="mono">{formatPrice(data.order.total_cents)}</dd>
				<dt>Created</dt>
				<dd>{formatDate(data.order.created_at)}</dd>
				<dt>Updated</dt>
				<dd>{formatDate(data.order.updated_at)}</dd>
			</dl>
		</div>

		<!-- Shipping -->
		{#if data.order.shipping_address}
			<div class="card">
				<h2 class="card-title">Shipping</h2>
				<p class="shipping-name">{data.order.shipping_name ?? ''}</p>
				<pre class="shipping-addr">{JSON.stringify(data.order.shipping_address, null, 2)}</pre>
			</div>
		{/if}

		<!-- Status + notes editor -->
		<div class="card span-2">
			<h2 class="card-title">Update order</h2>
			<form
				method="POST"
				action="?/updateStatus"
				use:enhance={() => {
					saving = true;
					return async ({ update }) => {
						await update();
						saving = false;
					};
				}}
				class="update-form"
			>
				<div class="field-row">
					<label for="status-select">Status</label>
					<select id="status-select" name="status" class="select">
						{#each data.statuses as s}
							<option value={s} selected={s === data.order.status}>{s}</option>
						{/each}
					</select>
				</div>
				<div class="field-row">
					<label for="notes">Internal notes</label>
					<textarea
						id="notes"
						name="notes"
						class="textarea"
						rows="3"
						placeholder="Tracking number, courier details, etc.">{data.order.notes ?? ''}</textarea
					>
				</div>
				<button type="submit" class="btn" disabled={saving}>
					{saving ? 'Saving…' : 'Save changes'}
				</button>
			</form>
		</div>
	</div>

	<!-- Line items -->
	<section class="section">
		<h2 class="section-title">Items ({data.items.length})</h2>
		{#if data.items.length === 0}
			<p class="empty">No items recorded (paid order may have item descriptions only).</p>
		{:else}
			<table class="data-table">
				<thead>
					<tr>
						<th>SKU</th>
						<th>Name</th>
						<th>Qty</th>
						<th>Unit price</th>
						<th>Subtotal</th>
					</tr>
				</thead>
				<tbody>
					{#each data.items as item}
						<tr>
							<td class="mono">{item.sku}</td>
							<td>{item.name}</td>
							<td>{item.quantity}</td>
							<td class="mono">{formatPrice(item.price_cents)}</td>
							<td class="mono">{formatPrice(item.price_cents * item.quantity)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</section>
</div>

<style>
	.page {
		max-width: 900px;
	}
	.back-link {
		font-size: 0.8rem;
		color: #666;
		text-decoration: none;
		display: inline-block;
		margin-bottom: 1.5rem;
	}
	.back-link:hover {
		color: #e8b44a;
	}

	.order-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 1.5rem;
	}
	.page-title {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 2rem;
		letter-spacing: 0.05em;
		color: #e8e8e8;
	}
	.order-id {
		font-family: 'Space Mono', monospace;
		font-size: 0.75rem;
		color: #555;
	}

	.status-badge {
		font-family: 'Space Mono', monospace;
		text-transform: uppercase;
		font-size: 0.75rem;
	}
	.status-badge.large {
		font-size: 1rem;
	}

	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin-bottom: 2rem;
	}
	.card {
		background: #111;
		border: 1px solid #1e1e1e;
		border-radius: 8px;
		padding: 1.25rem;
	}
	.card.span-2 {
		grid-column: span 2;
	}
	.card-title {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: #555;
		margin-bottom: 0.75rem;
	}

	.detail-list {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.35rem 1rem;
		font-size: 0.875rem;
	}
	.detail-list dt {
		color: #555;
	}
	.detail-list dd {
		color: #ccc;
	}

	.shipping-name {
		font-size: 0.875rem;
		color: #ccc;
		margin-bottom: 0.5rem;
	}
	.shipping-addr {
		font-family: 'Space Mono', monospace;
		font-size: 0.75rem;
		color: #777;
		white-space: pre-wrap;
	}

	.update-form {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.field-row {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}
	.field-row label {
		font-size: 0.75rem;
		color: #666;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.select,
	.textarea {
		background: #1a1a1a;
		border: 1px solid #2a2a2a;
		color: #aaa;
		font-size: 0.875rem;
		padding: 0.5rem 0.75rem;
		border-radius: 6px;
		width: 100%;
	}

	.textarea {
		font-family: inherit;
		resize: vertical;
	}

	.btn {
		align-self: flex-start;
		background: #e8b44a;
		color: #0a0a0a;
		border: none;
		padding: 0.6rem 1.25rem;
		border-radius: 6px;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.section {
		margin-top: 1.5rem;
	}
	.section-title {
		font-size: 0.875rem;
		font-weight: 600;
		color: #666;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 0.75rem;
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
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		border-bottom: 1px solid #1a1a1a;
	}
	.data-table td {
		padding: 0.65rem 0.75rem;
		border-bottom: 1px solid #161616;
	}
	.mono {
		font-family: 'Space Mono', monospace;
		font-size: 0.8rem;
	}
</style>
