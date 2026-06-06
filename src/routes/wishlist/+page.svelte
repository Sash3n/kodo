<script lang="ts">
	import { wishlistStore } from '$lib/stores/wishlist.svelte';
	import { formatZAR } from '$lib/utils/format';
	import WishlistButton from '$lib/components/WishlistButton.svelte';

	$effect(() => {
		wishlistStore.loadFromStorage();
	});
</script>

<svelte:head><title>Wishlist — KŌDO</title></svelte:head>

<div class="min-h-screen bg-[var(--color-kodo-bg)] pt-24">
	<div class="mx-auto max-w-4xl px-[var(--spacing-gutter)] py-12">
		<p class="mb-2 font-mono text-[10px] tracking-[0.3em] text-[var(--color-kodo-muted)] uppercase">
			My Wishlist
		</p>
		<h1
			class="mb-10 font-display text-5xl leading-none tracking-widest text-[var(--color-kodo-text)]"
		>
			SAVED
		</h1>

		{#if wishlistStore.items.length === 0}
			<div class="py-16 text-center">
				<p class="mb-6 font-mono text-sm text-[var(--color-kodo-muted)]">Nothing saved yet.</p>
				<a
					href="/shop"
					class="inline-block border border-[var(--color-kodo-accent)] px-8 py-3 font-mono text-xs tracking-widest uppercase text-[var(--color-kodo-accent)] transition-colors hover:bg-[var(--color-kodo-accent)] hover:text-[var(--color-kodo-bg)]"
				>
					Shop All
				</a>
			</div>
		{:else}
			<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
				{#each wishlistStore.items as item (item.productId)}
					<div
						class="group relative border border-[var(--color-kodo-border)] bg-[var(--color-kodo-surface)]"
					>
						<a href="/products/{item.slug}" class="block">
							<div class="aspect-[3/4] overflow-hidden bg-[var(--color-kodo-surface-2)]">
								{#if item.image}
									<img
										src={item.image}
										alt={item.title}
										class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
									/>
								{:else}
									<div class="flex h-full w-full items-center justify-center">
										<span class="font-display text-4xl text-[var(--color-kodo-border)]">K</span>
									</div>
								{/if}
							</div>
							<div class="p-3">
								<p class="truncate text-sm text-[var(--color-kodo-text)]">{item.title}</p>
								<p class="font-mono text-xs text-[var(--color-kodo-accent)]">
									{formatZAR(item.price)}
								</p>
							</div>
						</a>
						<div class="absolute right-2 top-2">
							<WishlistButton
								productId={item.productId}
								slug={item.slug}
								title={item.title}
								price={item.price}
								image={item.image}
							/>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
