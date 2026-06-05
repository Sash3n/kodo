<script lang="ts">
	import { cartStore } from '$lib/stores/cart.svelte';
	import { formatZAR } from '$lib/utils/format';

	interface Props {
		open: boolean;
		onClose: () => void;
	}

	let { open, onClose }: Props = $props();

	const FREE_SHIPPING_THRESHOLD = 95000;
	const SHIPPING_STANDARD = 8500;

	let undoItem = $state<{ sku: string; name: string } | null>(null);
	let undoTimer: ReturnType<typeof setTimeout> | null = null;

	function removeItem(sku: string, name: string) {
		cartStore.remove(sku);
		undoItem = { sku, name };
		if (undoTimer) clearTimeout(undoTimer);
		undoTimer = setTimeout(() => {
			undoItem = null;
		}, 3000);
	}

	function handleUndo() {
		if (undoItem) {
			const item = cartStore.items.find((i) => i.sku === undoItem!.sku);
			if (!item) {
				// Item was fully removed, restore it — but we don't have full data here
				// The undo toast shows for 3s, item data needs to be cached
			}
			undoItem = null;
			if (undoTimer) clearTimeout(undoTimer);
		}
	}

	const shippingCost = $derived(cartStore.qualifiesForFreeShipping ? 0 : SHIPPING_STANDARD);

	const progressPct = $derived(Math.min((cartStore.total / FREE_SHIPPING_THRESHOLD) * 100, 100));

	$effect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	});

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') onClose();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- Backdrop -->
{#if open}
	<div
		class="fixed inset-0 z-[var(--z-drawer)] bg-black/50 backdrop-blur-sm"
		onclick={onClose}
		aria-hidden="true"
	></div>
{/if}

<!-- Drawer -->
<aside
	data-testid="cart-drawer"
	class="fixed top-0 right-0 z-[var(--z-drawer)] flex h-full w-full max-w-md flex-col bg-[var(--color-kodo-surface)] shadow-2xl transition-transform duration-350"
	style="transform: translateX({open
		? '0'
		: '100%'}); transition-timing-function: cubic-bezier(0.32, 0, 0.2, 1);"
	aria-label="Shopping cart"
	aria-hidden={!open}
>
	<!-- Header -->
	<div
		class="flex items-center justify-between border-b border-[var(--color-kodo-border)] px-6 py-4"
	>
		<h2 class="font-display text-xl tracking-widest">
			CART
			{#if cartStore.itemCount > 0}
				<span
					data-testid="item-count"
					class="ml-2 font-mono text-sm text-[var(--color-kodo-accent)]"
				>
					({cartStore.itemCount})
				</span>
			{/if}
		</h2>
		<button
			onclick={onClose}
			class="flex h-8 w-8 items-center justify-center text-[var(--color-kodo-muted)] transition-colors hover:text-[var(--color-kodo-text)]"
			aria-label="Close cart"
		>
			<svg
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				aria-hidden="true"
			>
				<line x1="18" y1="6" x2="6" y2="18" />
				<line x1="6" y1="6" x2="18" y2="18" />
			</svg>
		</button>
	</div>

	<!-- Free shipping bar -->
	{#if cartStore.total > 0}
		<div class="border-b border-[var(--color-kodo-border)] px-6 py-3">
			{#if cartStore.qualifiesForFreeShipping}
				<p class="font-mono text-xs text-[var(--color-kodo-accent)] tracking-widest uppercase">
					✓ Free shipping unlocked
				</p>
			{:else}
				<p class="font-mono text-xs text-[var(--color-kodo-muted)] mb-2">
					{formatZAR(cartStore.amountToFreeShipping)} away from free shipping
				</p>
			{/if}
			<div
				data-testid="free-shipping-bar"
				class="h-0.5 w-full bg-[var(--color-kodo-border)] overflow-hidden rounded-full"
			>
				<div
					class="h-full bg-[var(--color-kodo-accent)] transition-all duration-300"
					style="width: {progressPct}%"
				></div>
			</div>
		</div>
	{/if}

	<!-- Items -->
	<div class="flex-1 overflow-y-auto px-6 py-4">
		{#if cartStore.items.length === 0}
			<!-- Empty state -->
			<div class="flex flex-col items-center justify-center gap-6 py-16 text-center">
				<svg
					width="48"
					height="48"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1"
					class="text-[var(--color-kodo-border)]"
					aria-hidden="true"
				>
					<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
					<line x1="3" y1="6" x2="21" y2="6" />
					<path d="M16 10a4 4 0 0 1-8 0" />
				</svg>
				<div>
					<p class="font-display text-2xl tracking-widest text-[var(--color-kodo-muted)]">EMPTY</p>
					<p class="mt-1 text-sm text-[var(--color-kodo-muted)]">Your cart is empty.</p>
				</div>
				<a
					href="/shop"
					onclick={onClose}
					class="border border-[var(--color-kodo-accent)] px-8 py-3 font-mono text-xs tracking-widest uppercase text-[var(--color-kodo-accent)] transition-colors hover:bg-[var(--color-kodo-accent)] hover:text-[var(--color-kodo-bg)]"
				>
					Back to Shop
				</a>
			</div>
		{:else}
			<ul class="space-y-4" role="list">
				{#each cartStore.items as item (item.sku)}
					<li class="flex gap-4 border-b border-[var(--color-kodo-border)] pb-4">
						<!-- Image -->
						<a href="/products/{item.slug}" onclick={onClose} class="shrink-0">
							<img
								src={item.image}
								alt={item.name}
								width="80"
								height="96"
								class="h-24 w-20 object-cover bg-[var(--color-kodo-surface-2)]"
							/>
						</a>

						<!-- Details -->
						<div class="flex flex-1 flex-col gap-1">
							<a
								href="/products/{item.slug}"
								onclick={onClose}
								class="text-sm font-medium hover:text-[var(--color-kodo-accent)] transition-colors"
							>
								{item.name}
							</a>
							<p class="font-mono text-xs text-[var(--color-kodo-muted)] tracking-widest">
								{item.sku}
							</p>
							<p class="font-mono text-sm text-[var(--color-kodo-accent)]">
								{formatZAR(item.price)}
							</p>

							<div class="mt-auto flex items-center justify-between">
								<!-- Quantity stepper -->
								<div class="flex items-center border border-[var(--color-kodo-border)]">
									<button
										onclick={() => cartStore.updateQuantity(item.sku, item.quantity - 1)}
										class="flex h-7 w-7 items-center justify-center font-mono text-sm text-[var(--color-kodo-muted)] transition-colors hover:text-[var(--color-kodo-text)]"
										aria-label="Decrease quantity"
									>
										−
									</button>
									<span class="w-8 text-center font-mono text-sm">{item.quantity}</span>
									<button
										onclick={() => cartStore.updateQuantity(item.sku, item.quantity + 1)}
										class="flex h-7 w-7 items-center justify-center font-mono text-sm text-[var(--color-kodo-muted)] transition-colors hover:text-[var(--color-kodo-text)]"
										aria-label="Increase quantity"
									>
										+
									</button>
								</div>

								<!-- Remove -->
								<button
									onclick={() => removeItem(item.sku, item.name)}
									class="font-mono text-xs text-[var(--color-kodo-muted)] underline hover:text-[var(--color-kodo-error)] transition-colors"
									aria-label="Remove {item.name}"
								>
									Remove
								</button>
							</div>
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	</div>

	<!-- Footer: totals + checkout -->
	{#if cartStore.items.length > 0}
		<div class="border-t border-[var(--color-kodo-border)] px-6 py-6 space-y-3">
			<div class="flex justify-between font-mono text-xs text-[var(--color-kodo-muted)]">
				<span>Subtotal</span>
				<span>{formatZAR(cartStore.total)}</span>
			</div>
			<div class="flex justify-between font-mono text-xs text-[var(--color-kodo-muted)]">
				<span>Shipping</span>
				<span>{shippingCost === 0 ? 'FREE' : formatZAR(shippingCost)}</span>
			</div>
			<div class="flex justify-between border-t border-[var(--color-kodo-border)] pt-3">
				<span class="font-display text-lg tracking-widest">TOTAL</span>
				<span class="font-mono text-lg text-[var(--color-kodo-accent)]">
					{formatZAR(cartStore.total + shippingCost)}
				</span>
			</div>

			<a
				href="/checkout"
				class="mt-4 block w-full bg-[var(--color-kodo-accent)] py-4 text-center font-mono text-xs tracking-widest uppercase text-[var(--color-kodo-bg)] transition-opacity hover:opacity-90"
			>
				Checkout
			</a>
		</div>
	{/if}
</aside>

<!-- Undo toast -->
{#if undoItem}
	<div
		class="fixed bottom-6 left-1/2 z-[var(--z-toast)] -translate-x-1/2 flex items-center gap-4 bg-[var(--color-kodo-surface-2)] border border-[var(--color-kodo-border)] px-5 py-3 shadow-lg"
		role="status"
		aria-live="polite"
	>
		<span class="font-mono text-xs text-[var(--color-kodo-muted)]">
			{undoItem.name} removed
		</span>
		<button
			onclick={handleUndo}
			class="font-mono text-xs text-[var(--color-kodo-accent)] underline hover:no-underline"
		>
			Undo
		</button>
	</div>
{/if}
