<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function formatDate(iso: string) {
		return new Date(iso).toLocaleDateString('en-ZA', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
		});
	}

	function stars(rating: number) {
		return '★'.repeat(rating) + '☆'.repeat(5 - rating);
	}

	let acting = $state<string | null>(null);
</script>

<svelte:head><title>Reviews — Kōdo Admin</title></svelte:head>

<div class="page">
	<h1 class="page-title">Reviews</h1>

	<div class="filter-tabs">
		{#each ['pending', 'approved', 'rejected'] as status}
			<a
				href="/admin/reviews?status={status}"
				class="tab"
				class:active={data.statusFilter === status}
			>
				{status}
			</a>
		{/each}
	</div>

	{#if data.reviews.length === 0}
		<p class="empty">No {data.statusFilter} reviews.</p>
	{:else}
		<div class="review-list">
			{#each data.reviews as review (review.id)}
				<div class="review-card" class:fading={acting === review.id}>
					<div class="review-header">
						<div>
							<span class="reviewer">{review.display_name}</span>
							<span class="stars">{stars(review.rating)}</span>
						</div>
						<div class="review-meta">
							<span class="product-id mono">{review.product_id}</span>
							<span class="date muted">{formatDate(review.created_at)}</span>
						</div>
					</div>

					<p class="review-body">{review.body}</p>

					<div class="review-actions">
						{#if data.statusFilter !== 'approved'}
							<form
								method="POST"
								action="?/approve"
								use:enhance={() => {
									acting = review.id;
									return async ({ update }) => {
										await update();
										acting = null;
									};
								}}
							>
								<input type="hidden" name="id" value={review.id} />
								<button type="submit" class="btn approve" disabled={acting === review.id}>
									✓ Approve
								</button>
							</form>
						{/if}

						{#if data.statusFilter !== 'rejected'}
							<form
								method="POST"
								action="?/reject"
								use:enhance={() => {
									acting = review.id;
									return async ({ update }) => {
										await update();
										acting = null;
									};
								}}
							>
								<input type="hidden" name="id" value={review.id} />
								<button type="submit" class="btn reject" disabled={acting === review.id}>
									✗ Reject
								</button>
							</form>
						{/if}

						<form
							method="POST"
							action="?/delete"
							use:enhance={() => {
								acting = review.id;
								return async ({ update }) => {
									await update();
									acting = null;
								};
							}}
						>
							<input type="hidden" name="id" value={review.id} />
							<button type="submit" class="btn delete" disabled={acting === review.id}>
								Delete
							</button>
						</form>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.page {
		max-width: 800px;
	}
	.page-title {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 2rem;
		letter-spacing: 0.05em;
		color: #e8e8e8;
		margin-bottom: 1.25rem;
	}

	.filter-tabs {
		display: flex;
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

	.review-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.review-card {
		background: #111;
		border: 1px solid #1e1e1e;
		border-radius: 8px;
		padding: 1.25rem;
		transition: opacity 0.2s;
	}
	.review-card.fading {
		opacity: 0.4;
		pointer-events: none;
	}

	.review-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 0.75rem;
	}
	.reviewer {
		font-weight: 600;
		color: #e8e8e8;
		font-size: 0.9rem;
		margin-right: 0.5rem;
	}
	.stars {
		color: #e8b44a;
		font-size: 0.85rem;
		letter-spacing: 1px;
	}
	.review-meta {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.2rem;
	}
	.product-id {
		font-size: 0.7rem;
		color: #555;
	}
	.mono {
		font-family: 'Space Mono', monospace;
	}
	.date {
		font-size: 0.75rem;
	}
	.muted {
		color: #555;
	}

	.review-body {
		font-size: 0.875rem;
		color: #aaa;
		line-height: 1.6;
		margin-bottom: 1rem;
	}

	.review-actions {
		display: flex;
		gap: 0.5rem;
	}

	.btn {
		padding: 0.4rem 0.85rem;
		border-radius: 5px;
		font-size: 0.78rem;
		font-weight: 600;
		cursor: pointer;
		border: 1px solid;
		transition: opacity 0.15s;
	}
	.btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.btn.approve {
		background: #34d39918;
		border-color: #34d39944;
		color: #34d399;
	}
	.btn.reject {
		background: #f8717118;
		border-color: #f8717144;
		color: #f87171;
	}
	.btn.delete {
		background: transparent;
		border-color: #333;
		color: #555;
	}
	.btn.delete:hover {
		border-color: #f87171;
		color: #f87171;
	}
</style>
