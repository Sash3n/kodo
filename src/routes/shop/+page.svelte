<script lang="ts">
	import type { PageData } from './$types';
	import ProductCard from '$lib/components/ProductCard.svelte';

	let { data }: { data: PageData } = $props();

	const categories = ['All', 'Tops', 'Bottoms', 'Outerwear', 'Accessories'];
	const colourways = ['All', 'Black', 'Ecru', 'Amber', 'Slate'];

	let selectedCategory = $state('All');
	let selectedColour = $state('All');
</script>

<svelte:head>
	<title>Shop — KŌDO</title>
</svelte:head>

<!-- Page header -->
<section class="border-b border-[var(--color-kodo-border)] bg-[var(--color-kodo-bg)] pb-10 pt-32">
	<div class="mx-auto max-w-7xl px-[var(--spacing-gutter)]">
		<h1
			class="mb-6 leading-none text-[var(--color-kodo-text)]"
			style="font-family: var(--font-display); font-size: clamp(3rem, 10vw, 8rem);"
		>
			Shop All
		</h1>

		<!-- Filters -->
		<div class="flex flex-wrap gap-6">
			<!-- Category -->
			<div class="flex flex-col gap-2">
				<span
					class="text-[10px] tracking-[0.3em] text-[var(--color-kodo-muted)] uppercase"
					style="font-family: var(--font-mono);">Category</span
				>
				<div class="flex flex-wrap gap-2">
					{#each categories as cat}
						<button
							onclick={() => (selectedCategory = cat)}
							class="border px-3 py-1 text-[10px] tracking-[0.2em] uppercase transition-all duration-150"
							class:border-[var(--color-kodo-accent)]={selectedCategory === cat}
							class:text-[var(--color-kodo-accent)]={selectedCategory === cat}
							class:border-[var(--color-kodo-border)]={selectedCategory !== cat}
							class:text-[var(--color-kodo-text-muted)]={selectedCategory !== cat}
							style="font-family: var(--font-mono);"
						>
							{cat}
						</button>
					{/each}
				</div>
			</div>

			<!-- Colourway -->
			<div class="flex flex-col gap-2">
				<span
					class="text-[10px] tracking-[0.3em] text-[var(--color-kodo-muted)] uppercase"
					style="font-family: var(--font-mono);">Colourway</span
				>
				<div class="flex flex-wrap gap-2">
					{#each colourways as col}
						<button
							onclick={() => (selectedColour = col)}
							class="border px-3 py-1 text-[10px] tracking-[0.2em] uppercase transition-all duration-150"
							class:border-[var(--color-kodo-accent)]={selectedColour === col}
							class:text-[var(--color-kodo-accent)]={selectedColour === col}
							class:border-[var(--color-kodo-border)]={selectedColour !== col}
							class:text-[var(--color-kodo-text-muted)]={selectedColour !== col}
							style="font-family: var(--font-mono);"
						>
							{col}
						</button>
					{/each}
				</div>
			</div>
		</div>
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
					No products yet. Check back soon.
				</p>
			</div>
		{/if}
	</div>
</section>
