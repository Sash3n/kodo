<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{$page.status} — KŌDO</title>
</svelte:head>

<main class="min-h-screen flex flex-col items-center justify-center text-center px-4">
	<p class="font-mono text-[var(--color-kodo-muted)] text-sm tracking-widest mb-4">
		ERROR_{$page.status}
	</p>
	<h1 class="font-display text-8xl md:text-[12rem] text-[var(--color-kodo-text)] leading-none mb-6">
		{$page.status}
	</h1>
	<p class="text-[var(--color-kodo-muted)] mb-8 max-w-sm">
		{$page.error?.message ?? 'Something went wrong.'}
	</p>
	<a
		href="/shop"
		class="inline-block border border-[var(--color-kodo-accent)] text-[var(--color-kodo-accent)] px-8 py-3 font-mono text-xs tracking-widest uppercase hover:bg-[var(--color-kodo-accent)] hover:text-[var(--color-kodo-bg)] transition-colors duration-200"
	>
		Back to Shop
	</a>
</main>
