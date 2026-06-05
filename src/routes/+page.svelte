<script lang="ts">
	const collections = [
		{
			href: '/collections/core',
			label: 'Core',
			mono: 'Essentials / Permanent',
		},
		{
			href: '/collections/drop_01',
			label: 'DROP_01 SS26',
			mono: 'Limited / SS26',
		},
		{
			href: '/lookbook',
			label: 'Lookbook',
			mono: 'Editorial / Visual',
		},
	];
</script>

<svelte:head>
	<title>KŌDO — Wear the Code</title>
</svelte:head>

<!-- Hero -->
<section
	class="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-[var(--color-kodo-surface)]"
>
	<!-- Amber gradient overlay -->
	<div
		class="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[var(--color-kodo-accent)]/5"
	></div>
	<div
		class="pointer-events-none absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[var(--color-kodo-bg)]/80 to-transparent"
	></div>

	<div
		class="relative z-10 flex flex-col items-center gap-6 px-[var(--spacing-gutter)] text-center animate-page-in"
	>
		<p
			class="font-mono text-xs tracking-[0.4em] text-[var(--color-kodo-accent)] uppercase"
			style="font-family: var(--font-mono);"
		>
			South African × Japanese Minimalism
		</p>
		<h1
			class="leading-none tracking-tight text-[var(--color-kodo-text)]"
			style="font-family: var(--font-display); font-size: clamp(5rem, 18vw, 14rem);"
		>
			KŌDO
		</h1>
		<p
			class="text-lg tracking-[0.3em] text-[var(--color-kodo-text-muted)] uppercase"
			style="font-family: var(--font-mono);"
		>
			Wear the Code
		</p>
		<div class="mt-4 flex flex-wrap items-center justify-center gap-4">
			<a
				href="/collections/drop_01"
				class="border border-[var(--color-kodo-accent)] bg-[var(--color-kodo-accent)] px-8 py-3 text-xs tracking-[0.25em] text-[var(--color-kodo-bg)] uppercase transition-all duration-200 hover:bg-transparent hover:text-[var(--color-kodo-accent)]"
				style="font-family: var(--font-mono);"
			>
				Shop New Drop
			</a>
			<a
				href="/collections/core"
				class="border border-[var(--color-kodo-border)] px-8 py-3 text-xs tracking-[0.25em] text-[var(--color-kodo-text-muted)] uppercase transition-all duration-200 hover:border-[var(--color-kodo-text-muted)] hover:text-[var(--color-kodo-text)]"
				style="font-family: var(--font-mono);"
			>
				Shop Core
			</a>
		</div>
	</div>

	<!-- Scroll indicator -->
	<div class="absolute bottom-8 flex flex-col items-center gap-2 text-[var(--color-kodo-muted)]">
		<span class="text-[10px] tracking-[0.3em] uppercase" style="font-family: var(--font-mono);"
			>Scroll</span
		>
		<div class="h-10 w-px bg-gradient-to-b from-[var(--color-kodo-muted)] to-transparent"></div>
	</div>
</section>

<!-- Featured Collections -->
<section class="bg-[var(--color-kodo-bg)] py-[var(--spacing-section)]">
	<div class="mx-auto max-w-7xl px-[var(--spacing-gutter)]">
		<div class="mb-12 flex items-end justify-between">
			<h2
				class="leading-none text-[var(--color-kodo-text)]"
				style="font-family: var(--font-display); font-size: clamp(2rem, 5vw, 4rem);"
			>
				Collections
			</h2>
			<a
				href="/shop"
				class="text-xs tracking-[0.25em] text-[var(--color-kodo-accent)] uppercase underline-draw"
				style="font-family: var(--font-mono);"
			>
				View All →
			</a>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
			{#each collections as col}
				<a
					href={col.href}
					class="group block border border-[var(--color-kodo-border)] transition-all duration-300 hover:border-[var(--color-kodo-accent)]"
				>
					<!-- Image placeholder 16:9 -->
					<div class="aspect-video w-full overflow-hidden bg-[var(--color-kodo-surface-2)]">
						<div
							class="flex h-full w-full items-center justify-center transition-transform duration-500 group-hover:scale-105"
						>
							<span
								class="select-none text-5xl text-[var(--color-kodo-border)]"
								style="font-family: var(--font-display);"
							>
								{col.label[0]}
							</span>
						</div>
					</div>
					<div class="p-5">
						<p
							class="mb-1 text-[10px] tracking-[0.35em] text-[var(--color-kodo-accent)] uppercase"
							style="font-family: var(--font-mono);"
						>
							{col.mono}
						</p>
						<h3
							class="text-2xl leading-none text-[var(--color-kodo-text)]"
							style="font-family: var(--font-display);"
						>
							{col.label}
						</h3>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- Editorial pull-quote -->
<section class="bg-[var(--color-kodo-surface)] py-[var(--spacing-section)]">
	<div class="mx-auto max-w-5xl px-[var(--spacing-gutter)]">
		<div class="border-l-2 border-[var(--color-kodo-accent)] pl-8">
			<blockquote
				class="mb-8 leading-none text-[var(--color-kodo-text)]"
				style="font-family: var(--font-display); font-size: clamp(2.5rem, 7vw, 6rem);"
			>
				Signal over noise.
			</blockquote>
			<p
				class="max-w-2xl text-base leading-relaxed text-[var(--color-kodo-text-muted)]"
				style="font-family: var(--font-body);"
			>
				KŌDO was built at the intersection of Johannesburg streetwear and Tokyo restraint. Each
				piece is engineered for silence — the kind that speaks louder than logos. Limited drops.
				Considered fabrics. Worn by those who move without explanation.
			</p>
		</div>
	</div>
</section>
