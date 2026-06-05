<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Lookbook — KŌDO</title>
</svelte:head>

<!-- Header -->
<section
	class="relative overflow-hidden border-b border-[var(--color-kodo-border)] bg-[var(--color-kodo-surface)] pb-16 pt-32"
>
	<div
		class="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--color-kodo-accent)]/3 to-transparent"
	></div>
	<div class="relative mx-auto max-w-7xl px-[var(--spacing-gutter)]">
		<p
			class="mb-4 text-[10px] tracking-[0.4em] text-[var(--color-kodo-accent)] uppercase"
			style="font-family: var(--font-mono);"
		>
			Editorial / Visual
		</p>
		<h1
			class="mb-4 leading-none text-[var(--color-kodo-text)]"
			style="font-family: var(--font-display); font-size: clamp(3rem, 10vw, 9rem);"
		>
			Lookbook
		</h1>
		<p
			class="max-w-md text-base leading-relaxed text-[var(--color-kodo-text-muted)]"
			style="font-family: var(--font-body);"
		>
			Signal over noise. Captured in Johannesburg.
		</p>
	</div>
</section>

<!-- Masonry grid -->
<section class="bg-[var(--color-kodo-bg)] py-[var(--spacing-section)]">
	<div class="mx-auto max-w-7xl px-[var(--spacing-gutter)]">
		{#if data.images && data.images.length > 0}
			<div class="columns-2 gap-4 md:columns-3">
				{#each data.images as image}
					<div class="group relative mb-4 break-inside-avoid overflow-hidden">
						<img
							src={image.url}
							alt={image.caption ?? 'KŌDO Lookbook'}
							class="block w-full object-cover"
						/>
						{#if image.caption}
							<div
								class="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
							>
								<p
									class="text-xs tracking-[0.15em] text-[var(--color-kodo-text)] uppercase"
									style="font-family: var(--font-mono);"
								>
									{image.caption}
								</p>
							</div>
						{/if}
					</div>
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
					Lookbook coming soon.
				</p>
			</div>
		{/if}
	</div>
</section>
