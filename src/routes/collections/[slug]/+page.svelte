<script lang="ts">
	import type { PageData } from './$types';
	import ProductCard from '$lib/components/ProductCard.svelte';

	let { data }: { data: PageData } = $props();

	const typeBadge: Record<string, string> = {
		core: 'CORE',
		drop: 'DROP',
		collab: 'COLLAB',
		archive: 'ARCHIVE',
	};

	const daysUntilDrop = $derived(() => {
		if (!data.collection?.releaseDate) return null;
		const release = new Date(data.collection.releaseDate);
		const now = new Date();
		if (release <= now) return null;
		const diff = Math.ceil((release.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
		return diff;
	});
</script>

<svelte:head>
	<title>{data.collection?.title ?? 'Collection'} — KŌDO</title>
</svelte:head>

<!-- Editorial header -->
<section
	class="relative overflow-hidden border-b border-[var(--color-kodo-border)] bg-[var(--color-kodo-surface)] pb-16 pt-32"
>
	<div
		class="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--color-kodo-accent)]/3 to-transparent"
	></div>
	<div class="relative mx-auto max-w-7xl px-[var(--spacing-gutter)]">
		{#if data.collection?.type}
			<p
				class="mb-4 text-[10px] tracking-[0.4em] text-[var(--color-kodo-accent)] uppercase"
				style="font-family: var(--font-mono);"
			>
				{typeBadge[data.collection.type] ?? data.collection.type.toUpperCase()}
			</p>
		{/if}

		<h1
			class="mb-4 leading-none text-[var(--color-kodo-text)]"
			style="font-family: var(--font-display); font-size: clamp(3rem, 10vw, 9rem);"
		>
			{data.collection?.title ?? '—'}
		</h1>

		{#if data.collection?.description}
			<p
				class="max-w-xl text-base leading-relaxed text-[var(--color-kodo-text-muted)]"
				style="font-family: var(--font-body);"
			>
				{data.collection.description}
			</p>
		{/if}

		{#if daysUntilDrop() !== null}
			<div
				class="mt-8 inline-flex items-center gap-3 border border-[var(--color-kodo-accent)] px-6 py-3"
			>
				<span class="h-2 w-2 rounded-full bg-[var(--color-kodo-accent)] animate-amber-pulse"></span>
				<span
					class="text-xs tracking-[0.3em] text-[var(--color-kodo-accent)] uppercase"
					style="font-family: var(--font-mono);"
				>
					Drop in {daysUntilDrop()}
					{daysUntilDrop() === 1 ? 'day' : 'days'}
				</span>
			</div>
		{/if}
	</div>
</section>

<!-- Product grid -->
<section class="bg-[var(--color-kodo-bg)] py-[var(--spacing-section)]">
	<div class="mx-auto max-w-7xl px-[var(--spacing-gutter)]">
		{#if data.products && data.products.length > 0}
			<div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
				{#each data.products as product}
					<ProductCard {product} />
				{/each}
			</div>
		{:else}
			<div class="flex flex-col items-center justify-center py-32 text-center">
				<p
					class="mb-2 text-2xl text-[var(--color-kodo-border)]"
					style="font-family: var(--font-display);"
				>
					—
				</p>
				<p
					class="text-sm tracking-[0.2em] text-[var(--color-kodo-text-muted)] uppercase"
					style="font-family: var(--font-mono);"
				>
					No products in this collection yet.
				</p>
			</div>
		{/if}
	</div>
</section>
