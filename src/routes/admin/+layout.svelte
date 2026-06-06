<script lang="ts">
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: import('svelte').Snippet } = $props();

	const navLinks = [
		{ href: '/admin', label: 'Dashboard', icon: '◈' },
		{ href: '/admin/orders', label: 'Orders', icon: '◎' },
		{ href: '/admin/products', label: 'Products', icon: '▦' },
		{ href: '/admin/reviews', label: 'Reviews', icon: '◇' },
		{ href: '/admin/discounts', label: 'Discounts', icon: '%' },
		{ href: '/admin/waitlist', label: 'Waitlist', icon: '◉' },
		{ href: '/admin/config', label: 'Config', icon: '⚙' },
	];

	let currentPath = $state('');
	$effect(() => {
		currentPath = window.location.pathname;
	});
</script>

<div class="admin-shell">
	<aside class="admin-sidebar">
		<div class="sidebar-brand">
			<a href="/" class="brand-link">KŌDO</a>
			<span class="admin-badge">ADMIN</span>
		</div>

		<nav class="sidebar-nav">
			{#each navLinks as link}
				<a
					href={link.href}
					class="nav-item"
					class:active={currentPath === link.href ||
						(link.href !== '/admin' && currentPath.startsWith(link.href))}
				>
					<span class="nav-icon">{link.icon}</span>
					<span>{link.label}</span>
				</a>
			{/each}
		</nav>

		<div class="sidebar-footer">
			<span class="user-email">{data.adminUser.email}</span>
			<a href="/" class="view-site">← View site</a>
		</div>
	</aside>

	<main class="admin-main">
		{@render children()}
	</main>
</div>

<style>
	.admin-shell {
		display: flex;
		min-height: 100vh;
		background: #0a0a0a;
		color: #e8e8e8;
		font-family: 'DM Sans', sans-serif;
	}

	.admin-sidebar {
		width: 220px;
		flex-shrink: 0;
		background: #111;
		border-right: 1px solid #222;
		display: flex;
		flex-direction: column;
		padding: 1.5rem 0;
	}

	.sidebar-brand {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0 1.25rem 1.5rem;
		border-bottom: 1px solid #222;
		margin-bottom: 1rem;
	}

	.brand-link {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 1.4rem;
		color: #e8b44a;
		text-decoration: none;
		letter-spacing: 0.1em;
	}

	.admin-badge {
		font-size: 0.6rem;
		font-family: 'Space Mono', monospace;
		background: #e8b44a22;
		color: #e8b44a;
		border: 1px solid #e8b44a44;
		padding: 2px 6px;
		border-radius: 3px;
		letter-spacing: 0.1em;
	}

	.sidebar-nav {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 0 0.75rem;
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.6rem 0.75rem;
		border-radius: 6px;
		color: #888;
		text-decoration: none;
		font-size: 0.875rem;
		transition:
			background 0.15s,
			color 0.15s;
	}

	.nav-item:hover {
		background: #1a1a1a;
		color: #e8e8e8;
	}

	.nav-item.active {
		background: #e8b44a18;
		color: #e8b44a;
	}

	.nav-icon {
		font-size: 1rem;
		width: 1.25rem;
		text-align: center;
	}

	.sidebar-footer {
		padding: 1rem 1.25rem 0;
		border-top: 1px solid #222;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.user-email {
		font-size: 0.75rem;
		color: #555;
		font-family: 'Space Mono', monospace;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.view-site {
		font-size: 0.75rem;
		color: #666;
		text-decoration: none;
	}

	.view-site:hover {
		color: #e8b44a;
	}

	.admin-main {
		flex: 1;
		overflow: auto;
		padding: 2rem;
	}
</style>
