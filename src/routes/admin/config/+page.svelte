<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const s = $derived(data.settings);
</script>

<svelte:head><title>Config — Kōdo Admin</title></svelte:head>

<div class="page">
	<div class="page-header">
		<h1 class="page-title">Site Config</h1>
		<a
			href="https://kodo.sanity.studio/studio/structure/siteSettings"
			target="_blank"
			rel="noopener"
			class="btn-primary"
		>
			↗ Edit in Sanity Studio
		</a>
	</div>

	<p class="hint">
		All config is managed as a Sanity document. Click the button above to edit it in Studio. This
		page shows the current live values.
	</p>

	{#if !s}
		<div class="notice">
			No <code>siteSettings</code> document found in Sanity yet.
			<a href="https://kodo.sanity.studio" target="_blank" rel="noopener">Open Studio</a> to create it.
		</div>
	{:else}
		<div class="config-grid">
			<!-- Announcement Bar -->
			<section class="config-section">
				<h2 class="section-label">Announcement Bar</h2>
				<dl class="config-list">
					<dt>Enabled</dt>
					<dd>
						<span
							class="pill"
							class:on={s.announcementBar?.enabled}
							class:off={!s.announcementBar?.enabled}
						>
							{s.announcementBar?.enabled ? 'ON' : 'OFF'}
						</span>
					</dd>
					<dt>Message</dt>
					<dd>{s.announcementBar?.text ?? '—'}</dd>
					<dt>Link</dt>
					<dd>{s.announcementBar?.link ?? '—'}</dd>
				</dl>
			</section>

			<!-- Commerce -->
			<section class="config-section">
				<h2 class="section-label">Commerce</h2>
				<dl class="config-list">
					<dt>Free shipping threshold</dt>
					<dd class="mono">R{((s.commerce?.freeShippingThresholdCents ?? 0) / 100).toFixed(2)}</dd>
					<dt>Standard shipping cost</dt>
					<dd class="mono">R{((s.commerce?.standardShippingCents ?? 0) / 100).toFixed(2)}</dd>
				</dl>
			</section>

			<!-- Social Links -->
			<section class="config-section">
				<h2 class="section-label">Social Links</h2>
				<dl class="config-list">
					{#each Object.entries(s.social ?? {}) as [platform, url]}
						<dt class="capitalize">{platform}</dt>
						<dd>
							{#if url}
								<a href={url as string} target="_blank" rel="noopener" class="config-link"
									>{url as string}</a
								>
							{:else}
								<span class="muted">—</span>
							{/if}
						</dd>
					{/each}
				</dl>
			</section>

			<!-- Brand -->
			<section class="config-section">
				<h2 class="section-label">Brand</h2>
				<dl class="config-list">
					<dt>Support email</dt>
					<dd>{s.brand?.supportEmail ?? '—'}</dd>
					<dt>Support phone</dt>
					<dd>{s.brand?.supportPhone ?? '—'}</dd>
					<dt>Address</dt>
					<dd class="pre-wrap">{s.brand?.address ?? '—'}</dd>
				</dl>
			</section>
		</div>
	{/if}
</div>

<style>
	.page {
		max-width: 900px;
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

	.btn-primary {
		padding: 0.55rem 1.1rem;
		background: #e8b44a;
		color: #0a0a0a;
		border-radius: 6px;
		text-decoration: none;
		font-size: 0.85rem;
		font-weight: 700;
	}

	.hint {
		font-size: 0.8rem;
		color: #555;
		margin-bottom: 1.5rem;
	}

	.notice {
		background: #1a1a0a;
		border: 1px solid #e8b44a33;
		border-radius: 8px;
		padding: 1rem 1.25rem;
		font-size: 0.875rem;
		color: #aaa;
	}
	.notice a {
		color: #e8b44a;
	}
	.notice code {
		font-family: 'Space Mono', monospace;
		font-size: 0.8rem;
		color: #e8b44a;
	}

	.config-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.config-section {
		background: #111;
		border: 1px solid #1e1e1e;
		border-radius: 8px;
		padding: 1.25rem;
	}

	.section-label {
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #555;
		margin-bottom: 0.75rem;
	}

	.config-list {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.4rem 1rem;
		font-size: 0.85rem;
	}
	.config-list dt {
		color: #666;
		white-space: nowrap;
	}
	.config-list dd {
		color: #ccc;
		overflow-wrap: break-word;
	}

	.pill {
		font-family: 'Space Mono', monospace;
		font-size: 0.65rem;
		padding: 2px 8px;
		border-radius: 10px;
		border: 1px solid;
	}
	.pill.on {
		color: #34d399;
		border-color: #34d39944;
		background: #34d39910;
	}
	.pill.off {
		color: #666;
		border-color: #333;
		background: #1a1a1a;
	}

	.mono {
		font-family: 'Space Mono', monospace;
		font-size: 0.8rem;
	}
	.muted {
		color: #444;
	}
	.pre-wrap {
		white-space: pre-wrap;
	}
	.capitalize {
		text-transform: capitalize;
	}
	.config-link {
		color: #e8b44a;
		text-decoration: none;
		font-size: 0.8rem;
		word-break: break-all;
	}
</style>
