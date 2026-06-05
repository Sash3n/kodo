<script lang="ts">
	import type { Product } from '$lib/types/product';
	import { formatZAR } from '$lib/utils/format';

	let { product }: { product: Product } = $props();

	let hovered = $state(false);

	const hasSecondImage = $derived(product.images && product.images.length > 1);
	const displayImage = $derived(
		hovered && hasSecondImage ? product.images[1] : (product.images?.[0] ?? null)
	);
</script>

<a
	href="/products/{product.slug}"
	class="group relative block border border-[var(--color-kodo-border)] transition-all duration-300 hover:border-[var(--color-kodo-accent)]"
	onmouseenter={() => (hovered = true)}
	onmouseleave={() => (hovered = false)}
>
	<!-- Image -->
	<div class="relative aspect-[3/4] w-full overflow-hidden bg-[var(--color-kodo-surface-2)]">
		{#if displayImage}
			<img
				src={displayImage.url}
				alt={displayImage.alt ?? product.name}
				class="h-full w-full object-cover transition-all duration-500"
				class:opacity-0={hovered && hasSecondImage && !product.images[1]}
			/>
		{:else}
			<div class="flex h-full w-full items-center justify-center">
				<span
					class="select-none text-6xl text-[var(--color-kodo-border)]"
					style="font-family: var(--font-display);"
				>
					{product.name?.[0] ?? 'K'}
				</span>
			</div>
		{/if}

		<!-- Badges overlay -->
		<div class="absolute left-3 top-3 flex flex-col gap-1">
			{#if product.isLimitedDrop}
				<span
					class="bg-[var(--color-kodo-accent)] px-2 py-0.5 text-[9px] tracking-[0.2em] text-[var(--color-kodo-bg)] uppercase"
					style="font-family: var(--font-mono);"
				>
					Limited
				</span>
			{/if}
			{#if product.isFinalSale}
				<span
					class="bg-[var(--color-kodo-bg)] px-2 py-0.5 text-[9px] tracking-[0.2em] text-[var(--color-kodo-text-muted)] uppercase"
					style="font-family: var(--font-mono);"
				>
					Final Sale
				</span>
			{/if}
		</div>
	</div>

	<!-- Info -->
	<div class="p-4">
		<h3
			class="mb-1 text-sm font-medium text-[var(--color-kodo-text)]"
			style="font-family: var(--font-body);"
		>
			{product.name}
		</h3>
		<div class="flex items-center gap-2">
			<span class="text-sm text-[var(--color-kodo-text)]" style="font-family: var(--font-mono);">
				{formatZAR(product.price)}
			</span>
			{#if product.compareAtPrice && product.compareAtPrice > product.price}
				<span
					class="text-xs text-[var(--color-kodo-muted)] line-through"
					style="font-family: var(--font-mono);"
				>
					{formatZAR(product.compareAtPrice)}
				</span>
			{/if}
		</div>
	</div>
</a>
