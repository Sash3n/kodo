<script lang="ts">
	import { page } from '$app/stores';
	import { cartStore } from '$lib/stores/cart.svelte';

	interface Props {
		onCartOpen: () => void;
	}

	let { onCartOpen }: Props = $props();

	let scrolled = $state(false);

	const navLinks = [
		{ href: '/shop', label: 'Shop' },
		{ href: '/collections/core', label: 'Core' },
		{ href: '/lookbook', label: 'Lookbook' },
		{ href: '/about', label: 'About' },
	];

	$effect(() => {
		const handler = () => {
			scrolled = window.scrollY > 20;
		};
		window.addEventListener('scroll', handler, { passive: true });
		return () => window.removeEventListener('scroll', handler);
	});
</script>

<header
	class="fixed top-0 left-0 right-0 z-[var(--z-nav)] transition-colors duration-200"
	class:bg-[var(--color-kodo-surface)]={scrolled}
	class:border-b={scrolled}
	class:border-[var(--color-kodo-border)]={scrolled}
>
	<nav
		class="mx-auto flex h-[var(--spacing-nav)] max-w-screen-xl items-center justify-between px-[var(--spacing-gutter)]"
		aria-label="Main navigation"
	>
		<!-- Logo -->
		<a
			href="/"
			class="font-display text-2xl tracking-widest text-[var(--color-kodo-text)] transition-colors hover:text-[var(--color-kodo-accent)]"
			aria-label="KŌDO home"
		>
			KŌDO
		</a>

		<!-- Desktop links -->
		<ul class="hidden gap-8 md:flex" role="list">
			{#each navLinks as link}
				<li>
					<a
						href={link.href}
						class="underline-draw font-mono text-xs tracking-widest uppercase transition-colors"
						class:text-[var(--color-kodo-accent)]={$page.url.pathname.startsWith(link.href)}
						class:text-[var(--color-kodo-muted)]={!$page.url.pathname.startsWith(link.href)}
					>
						{link.label}
					</a>
				</li>
			{/each}
		</ul>

		<!-- Cart button -->
		<button
			onclick={onCartOpen}
			class="relative flex h-10 w-10 items-center justify-center text-[var(--color-kodo-text)] transition-colors hover:text-[var(--color-kodo-accent)]"
			aria-label="Open cart{cartStore.itemCount > 0 ? ` (${cartStore.itemCount} items)` : ''}"
		>
			<svg
				width="22"
				height="22"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
				<line x1="3" y1="6" x2="21" y2="6" />
				<path d="M16 10a4 4 0 0 1-8 0" />
			</svg>

			{#if cartStore.itemCount > 0}
				<span
					class="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-kodo-accent)] font-mono text-[10px] font-bold text-[var(--color-kodo-bg)]"
					aria-hidden="true"
				>
					{cartStore.itemCount > 9 ? '9+' : cartStore.itemCount}
				</span>
			{/if}
		</button>
	</nav>
</header>
