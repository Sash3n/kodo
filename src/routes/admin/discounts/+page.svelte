<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function formatDate(iso: string | null) {
		if (!iso) return '—';
		return new Date(iso).toLocaleDateString('en-ZA', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
		});
	}

	function formatValue(type: string, value: number) {
		return type === 'percent' ? `${value}%` : `R${(value / 100).toFixed(2)}`;
	}

	let showForm = $state(false);
	let acting = $state<string | null>(null);
</script>

<svelte:head><title>Discount Codes — Kōdo Admin</title></svelte:head>

<div class="page">
	<div class="page-header">
		<h1 class="page-title">Discount Codes</h1>
		<button type="button" class="btn-primary" onclick={() => (showForm = !showForm)}>
			{showForm ? 'Cancel' : '+ New code'}
		</button>
	</div>

	{#if showForm}
		<form
			method="POST"
			action="?/create"
			use:enhance={() => {
				return async ({ update }) => {
					await update();
					showForm = false;
				};
			}}
			class="create-form card"
		>
			<div class="form-grid">
				<div class="field">
					<label for="code">Code</label>
					<input
						id="code"
						name="code"
						type="text"
						required
						placeholder="LAUNCH20"
						class="input"
						style="text-transform:uppercase;"
					/>
				</div>
				<div class="field">
					<label for="type">Type</label>
					<select id="type" name="type" class="input">
						<option value="percent">Percent off</option>
						<option value="fixed">Fixed amount (ZAR)</option>
					</select>
				</div>
				<div class="field">
					<label for="value">Value</label>
					<input
						id="value"
						name="value"
						type="number"
						required
						min="1"
						placeholder="20"
						class="input"
					/>
					<span class="field-hint">% for percent · ZAR for fixed</span>
				</div>
				<div class="field">
					<label for="minOrder">Min order (R)</label>
					<input
						id="minOrder"
						name="minOrder"
						type="number"
						min="0"
						step="0.01"
						placeholder="0.00"
						class="input"
					/>
				</div>
				<div class="field">
					<label for="maxUses">Max uses</label>
					<input
						id="maxUses"
						name="maxUses"
						type="number"
						min="1"
						placeholder="Unlimited"
						class="input"
					/>
				</div>
				<div class="field">
					<label for="expiresAt">Expires</label>
					<input id="expiresAt" name="expiresAt" type="datetime-local" class="input" />
				</div>
			</div>
			<button type="submit" class="btn-primary">Create code</button>
		</form>
	{/if}

	{#if data.codes.length === 0}
		<p class="empty">No discount codes yet.</p>
	{:else}
		<table class="data-table">
			<thead>
				<tr>
					<th>Code</th>
					<th>Discount</th>
					<th>Min order</th>
					<th>Uses</th>
					<th>Expires</th>
					<th>Status</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each data.codes as code (code.id)}
					<tr class:dim={!code.active}>
						<td class="mono code-cell">{code.code}</td>
						<td>{formatValue(code.type, code.value)}</td>
						<td class="mono"
							>{code.min_order_cents ? `R${(code.min_order_cents / 100).toFixed(0)}` : '—'}</td
						>
						<td class="mono">{code.uses}{code.max_uses ? ` / ${code.max_uses}` : ''}</td>
						<td class="muted">{formatDate(code.expires_at)}</td>
						<td>
							<form
								method="POST"
								action="?/toggle"
								use:enhance={() => {
									acting = code.id;
									return async ({ update }) => {
										await update();
										acting = null;
									};
								}}
							>
								<input type="hidden" name="id" value={code.id} />
								<input type="hidden" name="active" value={code.active} />
								<button
									type="submit"
									class="toggle-btn"
									class:on={code.active}
									disabled={acting === code.id}
								>
									{code.active ? 'Active' : 'Inactive'}
								</button>
							</form>
						</td>
						<td>
							<form
								method="POST"
								action="?/delete"
								use:enhance={() => {
									acting = code.id;
									return async ({ update }) => {
										await update();
										acting = null;
									};
								}}
							>
								<input type="hidden" name="id" value={code.id} />
								<button type="submit" class="del-btn" disabled={acting === code.id}>Delete</button>
							</form>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
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
		margin-bottom: 1.5rem;
	}
	.page-title {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 2rem;
		letter-spacing: 0.05em;
		color: #e8e8e8;
	}

	.btn-primary {
		background: #e8b44a;
		color: #0a0a0a;
		border: none;
		padding: 0.55rem 1.1rem;
		border-radius: 6px;
		font-size: 0.85rem;
		font-weight: 700;
		cursor: pointer;
	}

	.card {
		background: #111;
		border: 1px solid #1e1e1e;
		border-radius: 8px;
		padding: 1.25rem;
		margin-bottom: 1.5rem;
	}

	.form-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
		gap: 0.75rem;
		margin-bottom: 1rem;
	}
	.field {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}
	.field label {
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #666;
	}
	.field-hint {
		font-size: 0.65rem;
		color: #555;
	}

	.input {
		background: #1a1a1a;
		border: 1px solid #2a2a2a;
		color: #aaa;
		font-size: 0.875rem;
		padding: 0.45rem 0.65rem;
		border-radius: 5px;
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
	.data-table tr.dim td {
		opacity: 0.4;
	}

	.mono {
		font-family: 'Space Mono', monospace;
		font-size: 0.8rem;
	}
	.muted {
		color: #666;
	}
	.code-cell {
		color: #e8b44a;
		font-weight: 600;
		letter-spacing: 0.05em;
	}

	.toggle-btn {
		font-family: 'Space Mono', monospace;
		font-size: 0.7rem;
		padding: 3px 8px;
		border-radius: 10px;
		border: 1px solid #333;
		color: #555;
		background: transparent;
		cursor: pointer;
	}
	.toggle-btn.on {
		color: #34d399;
		border-color: #34d39944;
	}
	.toggle-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.del-btn {
		font-size: 0.75rem;
		color: #555;
		background: transparent;
		border: none;
		cursor: pointer;
	}
	.del-btn:hover {
		color: #f87171;
	}
</style>
