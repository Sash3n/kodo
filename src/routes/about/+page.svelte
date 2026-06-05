<script lang="ts">
	const values = [
		{
			label: '01 / Quality',
			title: 'Quality',
			body: 'We source heavyweight cotton, technical weaves, and recycled blends. Every garment is stress-tested before it reaches the drop.',
		},
		{
			label: '02 / Intention',
			title: 'Intention',
			body: 'Nothing goes into a piece without a reason. If a seam is there, it earns its place. If a detail exists, it exists with purpose.',
		},
		{
			label: '03 / Drop Culture',
			title: 'Drop Culture',
			body: "We don't maintain a catalogue. We release chapters. Each drop is a statement, limited in run and designed to be worn, not collected.",
		},
	];
</script>

<svelte:head>
	<title>About — KŌDO</title>
</svelte:head>

<!-- Hero -->
<section
	class="relative flex min-h-[60vh] flex-col items-start justify-end overflow-hidden bg-[var(--color-kodo-surface)] pb-16 pt-32"
>
	<div
		class="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--color-kodo-accent)]/4 to-transparent"
	></div>
	<div class="relative mx-auto w-full max-w-7xl px-[var(--spacing-gutter)]">
		<div class="mb-4 h-px w-16 bg-[var(--color-kodo-accent)]"></div>
		<h1
			class="mb-4 leading-none text-[var(--color-kodo-text)]"
			style="font-family: var(--font-display); font-size: clamp(4rem, 14vw, 11rem);"
		>
			KŌDO
		</h1>
		<p
			class="text-base tracking-[0.3em] text-[var(--color-kodo-text-muted)] uppercase"
			style="font-family: var(--font-mono);"
		>
			Wear the Code
		</p>
	</div>
</section>

<!-- Brand story -->
<section class="bg-[var(--color-kodo-bg)] py-[var(--spacing-section)]">
	<div class="mx-auto max-w-4xl px-[var(--spacing-gutter)]">
		<div class="grid grid-cols-1 gap-16 md:grid-cols-[1fr_2fr]">
			<div>
				<p
					class="text-[10px] tracking-[0.4em] text-[var(--color-kodo-accent)] uppercase"
					style="font-family: var(--font-mono);"
				>
					Our Story
				</p>
			</div>
			<div class="flex flex-col gap-6">
				<p
					class="text-base leading-relaxed text-[var(--color-kodo-text-muted)]"
					style="font-family: var(--font-body);"
				>
					KŌDO was born in Johannesburg — a city of contradictions, energy, and edge. We looked east
					to Tokyo for restraint and east to our own streets for rawness. The result is something
					that shouldn't work on paper but does: South African grit dressed in Japanese silence.
				</p>
				<p
					class="text-base leading-relaxed text-[var(--color-kodo-text-muted)]"
					style="font-family: var(--font-body);"
				>
					Every piece is a signal. We believe clothing should communicate without shouting — a
					philosophy we call "Wear the Code". The code isn't written in logos or graphics. It's in
					the weight of a fabric, the geometry of a seam, the restraint of a colourway.
				</p>
				<p
					class="text-base leading-relaxed text-[var(--color-kodo-text-muted)]"
					style="font-family: var(--font-body);"
				>
					We drop in small quantities, deliberately. Each drop is considered. Nothing is accidental.
					When something sells out, it's gone. We don't restock to create scarcity — we limit to
					maintain integrity.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Values -->
<section
	class="border-t border-[var(--color-kodo-border)] bg-[var(--color-kodo-surface)] py-[var(--spacing-section)]"
>
	<div class="mx-auto max-w-7xl px-[var(--spacing-gutter)]">
		<p
			class="mb-12 text-[10px] tracking-[0.4em] text-[var(--color-kodo-muted)] uppercase"
			style="font-family: var(--font-mono);"
		>
			What We Stand For
		</p>
		<div class="grid grid-cols-1 gap-px bg-[var(--color-kodo-border)] md:grid-cols-3">
			{#each values as v}
				<div class="flex flex-col gap-4 bg-[var(--color-kodo-surface)] p-8">
					<span
						class="text-[10px] tracking-[0.3em] text-[var(--color-kodo-accent)] uppercase"
						style="font-family: var(--font-mono);"
					>
						{v.label}
					</span>
					<h3
						class="text-3xl leading-none text-[var(--color-kodo-text)]"
						style="font-family: var(--font-display);"
					>
						{v.title}
					</h3>
					<p
						class="text-sm leading-relaxed text-[var(--color-kodo-text-muted)]"
						style="font-family: var(--font-body);"
					>
						{v.body}
					</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Instagram CTA -->
<section class="bg-[var(--color-kodo-bg)] py-[var(--spacing-section)]">
	<div class="mx-auto max-w-7xl px-[var(--spacing-gutter)] text-center">
		<p
			class="mb-4 text-[10px] tracking-[0.4em] text-[var(--color-kodo-muted)] uppercase"
			style="font-family: var(--font-mono);"
		>
			Follow the Drop
		</p>
		<a
			href="https://instagram.com/kodoclothing"
			target="_blank"
			rel="noopener noreferrer"
			class="inline-block border border-[var(--color-kodo-accent)] px-10 py-4 text-sm tracking-[0.3em] text-[var(--color-kodo-accent)] uppercase transition-all duration-200 hover:bg-[var(--color-kodo-accent)] hover:text-[var(--color-kodo-bg)]"
			style="font-family: var(--font-mono);"
		>
			@kodoclothing
		</a>
	</div>
</section>
