<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import type { ProductVariant } from '$lib/types/product';
	import { formatZAR } from '$lib/utils/format';
	import { cartStore } from '$lib/stores/cart.svelte';

	let { data }: { data: PageData } = $props();

	const product = $derived(data.product);

	// Gallery
	let activeImageIndex = $state(0);

	// Selectors
	let selectedSize = $state<string | null>(null);
	let selectedColour = $state<string | null>(null);

	// Cart state
	let addState = $state<'idle' | 'success' | 'error'>('idle');

	// Size guide modal
	let sizeGuideOpen = $state(false);

	// Derived unique sizes and colours from variants
	const sizes = $derived([
		...new Set((product.variants ?? []).map((v: ProductVariant) => v.size).filter(Boolean)),
	]);

	const colours = $derived([
		...new Set((product.variants ?? []).map((v: ProductVariant) => v.colour).filter(Boolean)),
	]);

	// Selected variant
	const selectedVariant = $derived(
		(product.variants ?? []).find((v: ProductVariant) => {
			const sizeMatch = !selectedSize || v.size === selectedSize;
			const colourMatch = !selectedColour || v.colour === selectedColour;
			return sizeMatch && colourMatch;
		}) ?? null
	);

	const isOOS = $derived(selectedVariant ? selectedVariant.stock <= 0 : false);
	const lowStock = $derived(
		selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= 5
	);

	function isSizeOOS(size: string): boolean {
		const variant = (product.variants ?? []).find((v: ProductVariant) => {
			const colourMatch = !selectedColour || v.colour === selectedColour;
			return v.size === size && colourMatch;
		});
		return variant ? variant.stock <= 0 : false;
	}

	async function addToCart() {
		if (!selectedSize || !selectedVariant || isOOS) {
			addState = 'error';
			setTimeout(() => (addState = 'idle'), 700);
			return;
		}
		cartStore.add({
			productId: product._id,
			variantId: selectedVariant._id,
			name: product.name,
			price: product.price,
			size: selectedVariant.size,
			colour: selectedVariant.colour,
			image: product.images?.[0] ?? null,
			slug: product.slug,
		});
		addState = 'success';
		setTimeout(() => (addState = 'idle'), 1500);
	}

	// Reviews
	let reviewSubmitting = $state(false);
	let reviewDone = $state(false);
	let reviewRating = $state(0);

	function stars(n: number, filled: number) {
		return n <= filled ? '★' : '☆';
	}

	const sizeGuideData = [
		{ size: 'XS', chest: '86–91', length: '66', sleeve: '58' },
		{ size: 'S', chest: '91–96', length: '68', sleeve: '60' },
		{ size: 'M', chest: '96–101', length: '70', sleeve: '62' },
		{ size: 'L', chest: '101–106', length: '72', sleeve: '64' },
		{ size: 'XL', chest: '106–111', length: '74', sleeve: '66' },
		{ size: 'XXL', chest: '111–116', length: '76', sleeve: '68' },
	];
</script>

<svelte:head>
	<title>{product?.name ?? 'Product'} — KŌDO</title>
</svelte:head>

<div class="min-h-screen bg-[var(--color-kodo-bg)] pt-24">
	<div class="mx-auto max-w-7xl px-[var(--spacing-gutter)] py-12">
		<div class="grid grid-cols-1 gap-12 lg:grid-cols-2">
			<!-- LEFT: Image gallery -->
			<div class="flex flex-col gap-4">
				<!-- Main image -->
				<div class="aspect-[3/4] w-full overflow-hidden bg-[var(--color-kodo-surface-2)]">
					{#if product.images?.[activeImageIndex]}
						<img
							src={product.images[activeImageIndex].url}
							alt={product.images[activeImageIndex].alt ?? product.name}
							class="h-full w-full object-cover"
						/>
					{:else}
						<div class="flex h-full w-full items-center justify-center">
							<span
								class="select-none text-8xl text-[var(--color-kodo-border)]"
								style="font-family: var(--font-display);"
							>
								{product.name?.[0] ?? 'K'}
							</span>
						</div>
					{/if}
				</div>

				<!-- Thumbnails -->
				{#if product.images && product.images.length > 1}
					<div class="flex gap-2 overflow-x-auto">
						{#each product.images as img, i}
							<button
								onclick={() => (activeImageIndex = i)}
								class="aspect-square h-16 flex-shrink-0 overflow-hidden border transition-all duration-150"
								class:border-[var(--color-kodo-accent)]={activeImageIndex === i}
								class:border-[var(--color-kodo-border)]={activeImageIndex !== i}
							>
								<img
									src={img.url}
									alt={img.alt ?? product.name}
									class="h-full w-full object-cover"
								/>
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<!-- RIGHT: Product details -->
			<div class="flex flex-col gap-6">
				<!-- Badges -->
				<div class="flex gap-2">
					{#if product.isLimitedDrop}
						<span
							class="bg-[var(--color-kodo-accent)] px-3 py-1 text-[10px] tracking-[0.2em] text-[var(--color-kodo-bg)] uppercase"
							style="font-family: var(--font-mono);">Limited</span
						>
					{/if}
					{#if product.isFinalSale}
						<span
							class="border border-[var(--color-kodo-border)] px-3 py-1 text-[10px] tracking-[0.2em] text-[var(--color-kodo-text-muted)] uppercase"
							style="font-family: var(--font-mono);">Final Sale</span
						>
					{/if}
				</div>

				<!-- Name -->
				<h1
					class="leading-none text-[var(--color-kodo-text)]"
					style="font-family: var(--font-display); font-size: clamp(2.5rem, 6vw, 5rem);"
				>
					{product.name}
				</h1>

				<!-- Price -->
				<div class="flex items-baseline gap-3">
					<span
						class="text-xl text-[var(--color-kodo-text)]"
						style="font-family: var(--font-mono);"
					>
						{formatZAR(product.price)}
					</span>
					{#if product.compareAtPrice && product.compareAtPrice > product.price}
						<span
							class="text-base text-[var(--color-kodo-muted)] line-through"
							style="font-family: var(--font-mono);"
						>
							{formatZAR(product.compareAtPrice)}
						</span>
					{/if}
				</div>

				<!-- Colour selector -->
				{#if colours.length > 1}
					<div class="flex flex-col gap-3">
						<span
							class="text-[10px] tracking-[0.3em] text-[var(--color-kodo-muted)] uppercase"
							style="font-family: var(--font-mono);"
						>
							Colourway: <span class="text-[var(--color-kodo-text)]">{selectedColour ?? '—'}</span>
						</span>
						<div class="flex flex-wrap gap-2">
							{#each colours as colour}
								<button
									onclick={() => (selectedColour = colour)}
									class="border px-4 py-2 text-xs tracking-[0.15em] uppercase transition-all duration-150"
									class:border-[var(--color-kodo-accent)]={selectedColour === colour}
									class:text-[var(--color-kodo-accent)]={selectedColour === colour}
									class:border-[var(--color-kodo-border)]={selectedColour !== colour}
									class:text-[var(--color-kodo-text-muted)]={selectedColour !== colour}
									style="font-family: var(--font-mono);"
								>
									{colour}
								</button>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Size selector -->
				<div class="flex flex-col gap-3">
					<div class="flex items-center justify-between">
						<span
							class="text-[10px] tracking-[0.3em] text-[var(--color-kodo-muted)] uppercase"
							style="font-family: var(--font-mono);"
						>
							Size: <span class="text-[var(--color-kodo-text)]">{selectedSize ?? '—'}</span>
						</span>
						<button
							onclick={() => (sizeGuideOpen = true)}
							class="text-[10px] tracking-[0.2em] text-[var(--color-kodo-accent)] underline-draw uppercase"
							style="font-family: var(--font-mono);"
						>
							Size Guide
						</button>
					</div>
					<div class="flex flex-wrap gap-2">
						{#each sizes as size}
							{@const oos = isSizeOOS(size)}
							<button
								onclick={() => !oos && (selectedSize = size)}
								disabled={oos}
								class="relative border px-4 py-2 text-xs tracking-[0.15em] uppercase transition-all duration-150"
								class:border-[var(--color-kodo-accent)]={selectedSize === size && !oos}
								class:text-[var(--color-kodo-accent)]={selectedSize === size && !oos}
								class:border-[var(--color-kodo-border)]={selectedSize !== size || oos}
								class:text-[var(--color-kodo-text-muted)]={selectedSize !== size && !oos}
								class:opacity-40={oos}
								class:cursor-not-allowed={oos}
								class:line-through={oos}
								style="font-family: var(--font-mono);"
							>
								{size}
							</button>
						{/each}
					</div>
				</div>

				<!-- Stock indicator -->
				{#if lowStock && selectedVariant}
					<p
						class="text-xs tracking-[0.2em] text-[var(--color-kodo-accent)] uppercase"
						style="font-family: var(--font-mono);"
					>
						Only {selectedVariant.stock} left
					</p>
				{/if}

				<!-- Add to cart -->
				<button
					onclick={addToCart}
					disabled={!selectedSize || isOOS}
					class="relative w-full border px-8 py-4 text-sm tracking-[0.3em] uppercase transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40"
					class:border-[var(--color-kodo-accent)]={addState === 'idle' || addState === 'success'}
					class:bg-[var(--color-kodo-accent)]={addState === 'success'}
					class:text-[var(--color-kodo-bg)]={addState === 'success'}
					class:text-[var(--color-kodo-accent)]={addState === 'idle'}
					class:border-red-500={addState === 'error'}
					class:text-red-500={addState === 'error'}
					class:animate-shake={addState === 'error'}
					class:animate-amber-pulse={addState === 'success'}
					style="font-family: var(--font-mono);"
				>
					{#if addState === 'success'}
						Added to Cart
					{:else if addState === 'error'}
						{isOOS ? 'Out of Stock' : 'Select a Size'}
					{:else}
						Add to Cart
					{/if}
				</button>

				<!-- Divider -->
				<div class="h-px bg-[var(--color-kodo-border)]"></div>

				<!-- Fit note -->
				{#if product.fitNote}
					<div>
						<p
							class="mb-1 text-[10px] tracking-[0.3em] text-[var(--color-kodo-muted)] uppercase"
							style="font-family: var(--font-mono);"
						>
							Fit
						</p>
						<p
							class="text-sm leading-relaxed text-[var(--color-kodo-text-muted)]"
							style="font-family: var(--font-body);"
						>
							{product.fitNote}
						</p>
					</div>
				{/if}

				<!-- Care instructions -->
				{#if product.careInstructions}
					<div>
						<p
							class="mb-1 text-[10px] tracking-[0.3em] text-[var(--color-kodo-muted)] uppercase"
							style="font-family: var(--font-mono);"
						>
							Care
						</p>
						<p
							class="text-sm leading-relaxed text-[var(--color-kodo-text-muted)]"
							style="font-family: var(--font-body);"
						>
							{product.careInstructions}
						</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<!-- Reviews section -->
<section class="mx-auto max-w-7xl px-[var(--spacing-gutter)] py-16">
	<h2
		class="mb-8 leading-none text-[var(--color-kodo-text)]"
		style="font-family: var(--font-display); font-size: clamp(2rem, 4vw, 3rem);"
	>
		Reviews
		{#if data.reviews.length > 0}
			<span
				class="ml-3 text-base text-[var(--color-kodo-muted)]"
				style="font-family: var(--font-mono);">({data.reviews.length})</span
			>
		{/if}
	</h2>

	<div class="grid grid-cols-1 gap-12 lg:grid-cols-2">
		<!-- Existing reviews -->
		<div class="flex flex-col gap-6">
			{#if data.reviews.length === 0}
				<p class="text-sm text-[var(--color-kodo-muted)]" style="font-family: var(--font-mono);">
					No reviews yet. Be the first.
				</p>
			{:else}
				{#each data.reviews as review (review.id)}
					<div class="border-b border-[var(--color-kodo-border)] pb-6">
						<div class="mb-2 flex items-center justify-between">
							<span class="text-sm font-semibold text-[var(--color-kodo-text)]"
								>{review.display_name}</span
							>
							<span
								class="text-[var(--color-kodo-accent)]"
								style="font-family: var(--font-mono); letter-spacing: 2px;"
							>
								{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
							</span>
						</div>
						<p class="text-sm leading-relaxed text-[var(--color-kodo-text-muted)]">{review.body}</p>
						<p
							class="mt-2 text-[10px] tracking-[0.15em] text-[var(--color-kodo-muted)] uppercase"
							style="font-family: var(--font-mono);"
						>
							{new Date(review.created_at).toLocaleDateString('en-ZA', {
								day: 'numeric',
								month: 'long',
								year: 'numeric',
							})}
						</p>
					</div>
				{/each}
			{/if}
		</div>

		<!-- Submit a review -->
		<div>
			{#if !data.isLoggedIn}
				<div class="border border-[var(--color-kodo-border)] p-6">
					<p
						class="mb-4 text-sm text-[var(--color-kodo-muted)]"
						style="font-family: var(--font-mono);"
					>
						Sign in to leave a review.
					</p>
					<a
						href="/account"
						class="inline-block border border-[var(--color-kodo-accent)] px-6 py-3 text-xs tracking-[0.2em] text-[var(--color-kodo-accent)] uppercase"
						style="font-family: var(--font-mono);"
					>
						Sign in
					</a>
				</div>
			{:else if reviewDone}
				<div
					class="border border-[var(--color-kodo-accent)]/30 bg-[var(--color-kodo-accent)]/5 p-6"
				>
					<p class="text-sm text-[var(--color-kodo-accent)]" style="font-family: var(--font-mono);">
						Review submitted — pending approval.
					</p>
				</div>
			{:else}
				<form
					method="POST"
					action="?/submitReview"
					use:enhance={() => {
						reviewSubmitting = true;
						return async ({ result, update }) => {
							await update();
							reviewSubmitting = false;
							if (result.type === 'success') reviewDone = true;
						};
					}}
					class="flex flex-col gap-5"
				>
					<h3
						class="text-[10px] tracking-[0.3em] text-[var(--color-kodo-muted)] uppercase"
						style="font-family: var(--font-mono);"
					>
						Write a review
					</h3>

					<!-- Star rating -->
					<div class="flex flex-col gap-2">
						<span
							class="text-[10px] tracking-[0.2em] text-[var(--color-kodo-muted)] uppercase"
							style="font-family: var(--font-mono);"
						>
							Rating
						</span>
						<div class="flex gap-1">
							{#each [1, 2, 3, 4, 5] as n}
								<button
									type="button"
									onclick={() => (reviewRating = n)}
									class="text-2xl transition-colors"
									style="color: {n <= reviewRating
										? 'var(--color-kodo-accent)'
										: 'var(--color-kodo-border)'}; background:none; border:none; cursor:pointer; padding:0;"
									aria-label="{n} stars">{stars(n, reviewRating)}</button
								>
							{/each}
						</div>
						<input type="hidden" name="rating" value={reviewRating} />
					</div>

					<div class="flex flex-col gap-1">
						<label
							for="review-name"
							class="text-[10px] tracking-[0.2em] text-[var(--color-kodo-muted)] uppercase"
							style="font-family: var(--font-mono);"
						>
							Display name
						</label>
						<input
							id="review-name"
							type="text"
							name="displayName"
							required
							maxlength="60"
							class="border border-[var(--color-kodo-border)] bg-transparent px-4 py-3 text-sm text-[var(--color-kodo-text)] placeholder:text-[var(--color-kodo-muted)] focus:border-[var(--color-kodo-accent)] focus:outline-none"
							placeholder="e.g. Alex K."
						/>
					</div>

					<div class="flex flex-col gap-1">
						<label
							for="review-body"
							class="text-[10px] tracking-[0.2em] text-[var(--color-kodo-muted)] uppercase"
							style="font-family: var(--font-mono);"
						>
							Your review
						</label>
						<textarea
							id="review-body"
							name="body"
							required
							minlength="10"
							maxlength="2000"
							rows="5"
							class="border border-[var(--color-kodo-border)] bg-transparent px-4 py-3 text-sm text-[var(--color-kodo-text)] placeholder:text-[var(--color-kodo-muted)] focus:border-[var(--color-kodo-accent)] focus:outline-none resize-none"
							placeholder="How does it fit? Quality? Vibe?"
						></textarea>
					</div>

					<button
						type="submit"
						disabled={reviewSubmitting || reviewRating === 0}
						class="border border-[var(--color-kodo-accent)] px-8 py-4 text-xs tracking-[0.3em] text-[var(--color-kodo-accent)] uppercase transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[var(--color-kodo-accent)] hover:text-[var(--color-kodo-bg)]"
						style="font-family: var(--font-mono);"
					>
						{reviewSubmitting ? 'Submitting…' : 'Submit Review'}
					</button>
				</form>
			{/if}
		</div>
	</div>
</section>

<!-- Size guide modal -->
{#if sizeGuideOpen}
	<div
		class="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center bg-black/80 p-4"
		role="dialog"
		aria-modal="true"
		aria-label="Size Guide"
	>
		<div
			class="relative w-full max-w-lg border border-[var(--color-kodo-border)] bg-[var(--color-kodo-surface)] p-8"
			style="animation: scaleIn 0.2s ease-out;"
		>
			<button
				onclick={() => (sizeGuideOpen = false)}
				class="absolute right-4 top-4 text-[var(--color-kodo-muted)] transition-colors hover:text-[var(--color-kodo-text)]"
				aria-label="Close size guide"
			>
				<svg
					width="20"
					height="20"
					viewBox="0 0 20 20"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
				>
					<path d="M4 4l12 12M16 4L4 16" />
				</svg>
			</button>

			<h2
				class="mb-6 text-2xl leading-none text-[var(--color-kodo-text)]"
				style="font-family: var(--font-display);"
			>
				Size Guide
			</h2>

			<p
				class="mb-4 text-[10px] tracking-[0.2em] text-[var(--color-kodo-muted)] uppercase"
				style="font-family: var(--font-mono);"
			>
				All measurements in centimetres
			</p>

			<table class="w-full text-sm" style="font-family: var(--font-mono);">
				<thead>
					<tr class="border-b border-[var(--color-kodo-border)]">
						{#each ['Size', 'Chest', 'Length', 'Sleeve'] as col}
							<th
								class="pb-2 text-left text-[10px] tracking-[0.2em] text-[var(--color-kodo-muted)] uppercase font-normal"
								>{col}</th
							>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each sizeGuideData as row}
						<tr class="border-b border-[var(--color-kodo-border)]/50">
							<td class="py-2 text-[var(--color-kodo-accent)]">{row.size}</td>
							<td class="py-2 text-[var(--color-kodo-text-muted)]">{row.chest}</td>
							<td class="py-2 text-[var(--color-kodo-text-muted)]">{row.length}</td>
							<td class="py-2 text-[var(--color-kodo-text-muted)]">{row.sleeve}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{/if}

<style>
	@keyframes scaleIn {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
</style>
