<script lang="ts">
	import { cartStore } from '$lib/stores/cart.svelte';
	import { formatZAR } from '$lib/utils/format';

	const FREE_SHIPPING_THRESHOLD = 99900; // R999 in cents
</script>

<svelte:head>
	<title>Cart — KŌDO</title>
</svelte:head>

<section class="min-h-screen bg-[var(--color-kodo-bg)] pt-32">
	<div class="mx-auto max-w-7xl px-[var(--spacing-gutter)] py-16">
		<div class="mb-12">
			<h1
				class="leading-none text-[var(--color-kodo-text)]"
				style="font-family: var(--font-display); font-size: clamp(3rem, 10vw, 8rem);"
			>
				Cart
			</h1>
			{#if cartStore.itemCount > 0}
				<p
					class="mt-2 text-xs tracking-[0.2em] text-[var(--color-kodo-muted)] uppercase"
					style="font-family: var(--font-mono);"
				>
					{cartStore.itemCount}
					{cartStore.itemCount === 1 ? 'item' : 'items'}
				</p>
			{/if}
		</div>

		{#if cartStore.items.length === 0}
			<div class="flex flex-col items-center justify-center py-32 text-center">
				<p
					class="mb-6 text-2xl text-[var(--color-kodo-border)]"
					style="font-family: var(--font-display);"
				>
					—
				</p>
				<p
					class="mb-8 text-sm tracking-[0.2em] text-[var(--color-kodo-text-muted)] uppercase"
					style="font-family: var(--font-mono);"
				>
					Your cart is empty.
				</p>
				<a
					href="/shop"
					class="border border-[var(--color-kodo-accent)] px-8 py-3 text-xs tracking-[0.25em] text-[var(--color-kodo-accent)] uppercase transition-all duration-200 hover:bg-[var(--color-kodo-accent)] hover:text-[var(--color-kodo-bg)]"
					style="font-family: var(--font-mono);"
				>
					Shop All
				</a>
			</div>
		{:else}
			<div class="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]">
				<!-- Cart items -->
				<div class="flex flex-col gap-0">
					{#each cartStore.items as item (item.variantId)}
						<div class="flex gap-4 border-b border-[var(--color-kodo-border)] py-6">
							<!-- Image -->
							<div
								class="aspect-[3/4] w-20 flex-shrink-0 overflow-hidden bg-[var(--color-kodo-surface-2)]"
							>
								{#if item.image?.url}
									<img src={item.image.url} alt={item.name} class="h-full w-full object-cover" />
								{:else}
									<div class="flex h-full w-full items-center justify-center">
										<span
											class="select-none text-xl text-[var(--color-kodo-border)]"
											style="font-family: var(--font-display);">{item.name?.[0] ?? 'K'}</span
										>
									</div>
								{/if}
							</div>

							<!-- Details -->
							<div class="flex flex-1 flex-col gap-2">
								<div class="flex items-start justify-between gap-4">
									<div>
										<a
											href="/products/{item.slug}"
											class="text-sm font-medium text-[var(--color-kodo-text)] hover:text-[var(--color-kodo-accent)] transition-colors"
											style="font-family: var(--font-body);"
										>
											{item.name}
										</a>
										<p
											class="mt-0.5 text-[10px] tracking-[0.2em] text-[var(--color-kodo-muted)] uppercase"
											style="font-family: var(--font-mono);"
										>
											{[item.size, item.colour].filter(Boolean).join(' / ')}
										</p>
									</div>
									<span
										class="flex-shrink-0 text-sm text-[var(--color-kodo-text)]"
										style="font-family: var(--font-mono);"
									>
										{formatZAR(item.price * item.quantity)}
									</span>
								</div>

								<!-- Quantity controls -->
								<div class="flex items-center gap-3">
									<button
										onclick={() => cartStore.updateQuantity(item.variantId, item.quantity - 1)}
										class="flex h-7 w-7 items-center justify-center border border-[var(--color-kodo-border)] text-[var(--color-kodo-text-muted)] transition-colors hover:border-[var(--color-kodo-accent)] hover:text-[var(--color-kodo-accent)]"
										aria-label="Decrease quantity"
									>
										<svg width="10" height="2" viewBox="0 0 10 2" fill="currentColor">
											<rect width="10" height="2" />
										</svg>
									</button>
									<span
										class="w-6 text-center text-sm text-[var(--color-kodo-text)]"
										style="font-family: var(--font-mono);"
									>
										{item.quantity}
									</span>
									<button
										onclick={() => cartStore.updateQuantity(item.variantId, item.quantity + 1)}
										class="flex h-7 w-7 items-center justify-center border border-[var(--color-kodo-border)] text-[var(--color-kodo-text-muted)] transition-colors hover:border-[var(--color-kodo-accent)] hover:text-[var(--color-kodo-accent)]"
										aria-label="Increase quantity"
									>
										<svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
											<rect x="4" width="2" height="10" />
											<rect y="4" width="10" height="2" />
										</svg>
									</button>

									<button
										onclick={() => cartStore.remove(item.variantId)}
										class="ml-2 text-[10px] tracking-[0.15em] text-[var(--color-kodo-muted)] uppercase underline-draw transition-colors hover:text-red-400"
										style="font-family: var(--font-mono);"
									>
										Remove
									</button>
								</div>
							</div>
						</div>
					{/each}

					<!-- Clear cart -->
					<div class="pt-4">
						<button
							onclick={() => cartStore.clear()}
							class="text-[10px] tracking-[0.2em] text-[var(--color-kodo-muted)] uppercase underline-draw transition-colors hover:text-red-400"
							style="font-family: var(--font-mono);"
						>
							Clear Cart
						</button>
					</div>
				</div>

				<!-- Order summary -->
				<div class="flex flex-col gap-6 lg:sticky lg:top-32 lg:self-start">
					<div class="border border-[var(--color-kodo-border)] bg-[var(--color-kodo-surface)] p-6">
						<h2
							class="mb-6 text-xl leading-none text-[var(--color-kodo-text)]"
							style="font-family: var(--font-display);"
						>
							Order Summary
						</h2>

						<div class="flex flex-col gap-3">
							<div class="flex items-center justify-between text-sm">
								<span
									class="text-[var(--color-kodo-text-muted)]"
									style="font-family: var(--font-body);">Subtotal</span
								>
								<span class="text-[var(--color-kodo-text)]" style="font-family: var(--font-mono);">
									{formatZAR(cartStore.total)}
								</span>
							</div>
							<div class="flex items-center justify-between text-sm">
								<span
									class="text-[var(--color-kodo-text-muted)]"
									style="font-family: var(--font-body);">Shipping</span
								>
								<span
									class="text-sm"
									class:text-[var(--color-kodo-accent)]={cartStore.qualifiesForFreeShipping}
									class:text-[var(--color-kodo-text-muted)]={!cartStore.qualifiesForFreeShipping}
									style="font-family: var(--font-mono);"
								>
									{cartStore.qualifiesForFreeShipping ? 'FREE' : 'Calculated at checkout'}
								</span>
							</div>

							{#if !cartStore.qualifiesForFreeShipping}
								<div class="border-t border-[var(--color-kodo-border)] pt-3">
									<div class="mb-2 h-1 w-full overflow-hidden bg-[var(--color-kodo-border)]">
										<div
											class="h-full bg-[var(--color-kodo-accent)] transition-all duration-300"
											style="width: {Math.min(
												100,
												(cartStore.total / FREE_SHIPPING_THRESHOLD) * 100
											)}%"
										></div>
									</div>
									<p
										class="text-[10px] tracking-[0.15em] text-[var(--color-kodo-muted)] uppercase"
										style="font-family: var(--font-mono);"
									>
										{formatZAR(cartStore.amountToFreeShipping)} away from free shipping
									</p>
								</div>
							{/if}

							<div
								class="flex items-center justify-between border-t border-[var(--color-kodo-border)] pt-3 text-base font-medium"
							>
								<span class="text-[var(--color-kodo-text)]" style="font-family: var(--font-body);"
									>Total</span
								>
								<span
									class="text-[var(--color-kodo-accent)]"
									style="font-family: var(--font-mono);"
								>
									{formatZAR(cartStore.total)}
								</span>
							</div>
						</div>

						<a
							href="/checkout"
							class="mt-6 block w-full border border-[var(--color-kodo-accent)] bg-[var(--color-kodo-accent)] py-4 text-center text-xs tracking-[0.3em] text-[var(--color-kodo-bg)] uppercase transition-all duration-200 hover:bg-transparent hover:text-[var(--color-kodo-accent)]"
							style="font-family: var(--font-mono);"
						>
							Proceed to Checkout
						</a>
						<a
							href="/shop"
							class="mt-3 block w-full py-3 text-center text-[10px] tracking-[0.2em] text-[var(--color-kodo-muted)] uppercase underline-draw"
							style="font-family: var(--font-mono);"
						>
							Continue Shopping
						</a>
					</div>
				</div>
			</div>
		{/if}
	</div>
</section>
