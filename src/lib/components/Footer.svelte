<script lang="ts">
	const year = new Date().getFullYear();

	const links = {
		shop: [
			{ href: '/shop', label: 'Shop All' },
			{ href: '/collections/core', label: 'Core' },
			{ href: '/lookbook', label: 'Lookbook' },
		],
		info: [
			{ href: '/about', label: 'About' },
			{ href: '/contact', label: 'Contact' },
			{ href: '/returns', label: 'Returns' },
		],
		policies: [
			{ href: '/policies/shipping', label: 'Shipping' },
			{ href: '/policies/returns', label: 'Returns Policy' },
			{ href: '/policies/privacy', label: 'Privacy' },
			{ href: '/policies/terms', label: 'Terms' },
			{ href: '/policies/size-guide', label: 'Size Guide' },
		],
	};
</script>

<footer class="border-t border-[var(--color-kodo-border)] bg-[var(--color-kodo-surface)] mt-24">
	<div class="mx-auto max-w-screen-xl px-[var(--spacing-gutter)] py-16">
		<div class="grid grid-cols-2 gap-12 md:grid-cols-4">
			<!-- Brand -->
			<div class="col-span-2 md:col-span-1">
				<a
					href="/"
					class="font-display text-3xl tracking-widest text-[var(--color-kodo-text)] hover:text-[var(--color-kodo-accent)] transition-colors"
				>
					KŌDO
				</a>
				<p class="mt-3 font-mono text-xs text-[var(--color-kodo-muted)] tracking-widest uppercase">
					Wear the Code
				</p>
				<a
					href="https://instagram.com/kodoclothing"
					target="_blank"
					rel="noopener noreferrer"
					class="mt-4 inline-flex items-center gap-2 font-mono text-xs text-[var(--color-kodo-muted)] hover:text-[var(--color-kodo-accent)] transition-colors"
					aria-label="KŌDO on Instagram"
				>
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						aria-hidden="true"
					>
						<rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
						<circle cx="12" cy="12" r="4" />
						<circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
					</svg>
					@kodoclothing
				</a>
			</div>

			<!-- Shop -->
			<div>
				<h3 class="font-mono text-xs tracking-widest uppercase text-[var(--color-kodo-muted)] mb-4">
					Shop
				</h3>
				<ul class="space-y-2" role="list">
					{#each links.shop as link}
						<li>
							<a
								href={link.href}
								class="text-sm text-[var(--color-kodo-text-muted)] hover:text-[var(--color-kodo-text)] transition-colors"
							>
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Info -->
			<div>
				<h3 class="font-mono text-xs tracking-widest uppercase text-[var(--color-kodo-muted)] mb-4">
					Info
				</h3>
				<ul class="space-y-2" role="list">
					{#each links.info as link}
						<li>
							<a
								href={link.href}
								class="text-sm text-[var(--color-kodo-text-muted)] hover:text-[var(--color-kodo-text)] transition-colors"
							>
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Policies -->
			<div>
				<h3 class="font-mono text-xs tracking-widest uppercase text-[var(--color-kodo-muted)] mb-4">
					Policies
				</h3>
				<ul class="space-y-2" role="list">
					{#each links.policies as link}
						<li>
							<a
								href={link.href}
								class="text-sm text-[var(--color-kodo-text-muted)] hover:text-[var(--color-kodo-text)] transition-colors"
							>
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<div
			class="mt-16 flex flex-col gap-2 border-t border-[var(--color-kodo-border)] pt-6 md:flex-row md:items-center md:justify-between"
		>
			<p class="font-mono text-xs text-[var(--color-kodo-muted)]">
				© {year} KŌDO. South Africa.
			</p>
			<p class="font-mono text-xs text-[var(--color-kodo-muted)]">
				<a
					href="mailto:hello@kodo.co.za"
					class="hover:text-[var(--color-kodo-accent)] transition-colors"
				>
					hello@kodo.co.za
				</a>
			</p>
		</div>
	</div>
</footer>
