<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function formatDate(iso: string) {
		return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
	}

	let expanded = $state<string | null>(null);
</script>

<svelte:head><title>Waitlist — Kōdo Admin</title></svelte:head>

<div class="page">
	<div class="page-header">
		<h1 class="page-title">Drop Waitlist</h1>
		<span class="total-badge">{data.total} total sign-ups</span>
	</div>

	{#if data.groups.length === 0}
		<p class="empty">No waitlist entries yet.</p>
	{:else}
		<div class="groups">
			{#each data.groups as group (group.collectionId)}
				<div class="group-card">
					<button
						type="button"
						class="group-header"
						onclick={() => (expanded = expanded === group.collectionId ? null : group.collectionId)}
					>
						<div>
							<span class="group-title">{group.title}</span>
							<span class="group-id mono">{group.collectionId}</span>
						</div>
						<div class="group-meta">
							<span class="count-badge">{group.count} sign-ups</span>
							<span class="expand-icon">{expanded === group.collectionId ? '▲' : '▼'}</span>
						</div>
					</button>

					{#if expanded === group.collectionId}
						<table class="entry-table">
							<thead>
								<tr>
									<th>Email</th>
									<th>Signed up</th>
									<th>Notified</th>
								</tr>
							</thead>
							<tbody>
								{#each group.entries as entry}
									<tr>
										<td>{entry.email}</td>
										<td class="muted">{formatDate(entry.created_at)}</td>
										<td>
											{#if entry.notified}
												<span class="notified-yes">✓ Yes</span>
											{:else}
												<span class="notified-no">Pending</span>
											{/if}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.page {
		max-width: 800px;
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
	.total-badge {
		font-family: 'Space Mono', monospace;
		font-size: 0.75rem;
		color: #666;
	}
	.empty {
		color: #555;
	}

	.groups {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.group-card {
		background: #111;
		border: 1px solid #1e1e1e;
		border-radius: 8px;
		overflow: hidden;
	}

	.group-header {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.25rem;
		background: transparent;
		border: none;
		cursor: pointer;
		text-align: left;
	}
	.group-header:hover {
		background: #141414;
	}

	.group-title {
		display: block;
		font-size: 0.9rem;
		color: #e8e8e8;
		font-weight: 600;
	}
	.group-id {
		display: block;
		font-family: 'Space Mono', monospace;
		font-size: 0.65rem;
		color: #444;
		margin-top: 2px;
	}
	.mono {
		font-family: 'Space Mono', monospace;
	}

	.group-meta {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}
	.count-badge {
		font-family: 'Space Mono', monospace;
		font-size: 0.7rem;
		color: #e8b44a;
		background: #e8b44a18;
		border: 1px solid #e8b44a33;
		padding: 2px 8px;
		border-radius: 10px;
	}
	.expand-icon {
		font-size: 0.65rem;
		color: #444;
	}

	.entry-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.85rem;
	}
	.entry-table th {
		text-align: left;
		padding: 0.5rem 1.25rem;
		color: #555;
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		border-top: 1px solid #1a1a1a;
	}
	.entry-table td {
		padding: 0.5rem 1.25rem;
		border-top: 1px solid #141414;
		color: #ccc;
	}
	.muted {
		color: #666;
	}
	.notified-yes {
		color: #34d399;
		font-family: 'Space Mono', monospace;
		font-size: 0.75rem;
	}
	.notified-no {
		color: #888;
		font-family: 'Space Mono', monospace;
		font-size: 0.75rem;
	}
</style>
