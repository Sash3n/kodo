<script lang="ts">
	import type { InstagramMedia } from '$lib/server/instagram';

	interface Props {
		posts: InstagramMedia[];
		handle?: string;
		limit?: number;
	}

	let { posts, handle = 'kodoclothing', limit = 9 }: Props = $props();

	const visible = $derived(posts.slice(0, limit));
</script>

{#if visible.length > 0}
	<section class="ig-section">
		<div class="ig-header">
			<h2 class="ig-title">
				<a href="https://instagram.com/{handle}" target="_blank" rel="noopener" class="ig-handle">
					@{handle}
				</a>
			</h2>
			<a href="https://instagram.com/{handle}" target="_blank" rel="noopener" class="ig-follow">
				Follow →
			</a>
		</div>

		<div class="ig-grid">
			{#each visible as post (post.id)}
				<a
					href={post.permalink}
					target="_blank"
					rel="noopener"
					class="ig-post"
					title={post.caption?.slice(0, 120) ?? ''}
				>
					{#if post.media_type === 'VIDEO'}
						<img
							src={post.thumbnail_url ?? post.media_url}
							alt={post.caption?.slice(0, 80) ?? ''}
							class="ig-img"
							loading="lazy"
						/>
						<div class="ig-video-badge">▶</div>
					{:else}
						<img
							src={post.media_url}
							alt={post.caption?.slice(0, 80) ?? ''}
							class="ig-img"
							loading="lazy"
						/>
					{/if}
					{#if post.media_type === 'CAROUSEL_ALBUM'}
						<div class="ig-carousel-badge">⊞</div>
					{/if}
				</a>
			{/each}
		</div>
	</section>
{/if}

<style>
	.ig-section {
		padding: 4rem var(--spacing-gutter, 1.5rem);
		border-top: 1px solid var(--color-kodo-border, #2a2a2a);
	}

	.ig-header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 1.5rem;
	}

	.ig-title {
		font-family: 'Space Mono', monospace;
		font-size: 0.7rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--color-kodo-muted, #888);
	}

	.ig-handle {
		color: var(--color-kodo-muted, #888);
		text-decoration: none;
		transition: color 0.15s;
	}

	.ig-handle:hover {
		color: var(--color-kodo-text, #f0ede6);
	}

	.ig-follow {
		font-family: 'Space Mono', monospace;
		font-size: 0.7rem;
		color: var(--color-kodo-accent, #e8b44a);
		text-decoration: none;
	}

	.ig-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 4px;
	}

	@media (min-width: 640px) {
		.ig-grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	@media (min-width: 1024px) {
		.ig-grid {
			grid-template-columns: repeat(6, 1fr);
		}
	}

	.ig-post {
		position: relative;
		aspect-ratio: 1;
		overflow: hidden;
		display: block;
		background: var(--color-kodo-surface, #111);
	}

	.ig-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition:
			transform 0.4s ease,
			opacity 0.2s;
	}

	.ig-post:hover .ig-img {
		transform: scale(1.06);
		opacity: 0.8;
	}

	.ig-video-badge,
	.ig-carousel-badge {
		position: absolute;
		top: 6px;
		right: 6px;
		font-size: 0.7rem;
		color: #fff;
		background: rgba(0, 0, 0, 0.5);
		padding: 2px 5px;
		border-radius: 3px;
		pointer-events: none;
	}
</style>
