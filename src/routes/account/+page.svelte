<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';

	let { data }: { data: PageData } = $props();

	let magicLinkEmail = $state('');
	let magicLinkSent = $state(false);

	const statusColour: Record<string, string> = {
		paid: 'text-green-400',
		pending: 'text-[var(--color-kodo-accent)]',
		shipped: 'text-blue-400',
		delivered: 'text-green-400',
		cancelled: 'text-red-400',
	};
</script>

<svelte:head>
	<title>Account — KŌDO</title>
</svelte:head>

<section class="min-h-screen bg-[var(--color-kodo-bg)] pt-32">
	<div class="mx-auto max-w-4xl px-[var(--spacing-gutter)] py-16">
		{#if !data.session}
			<!-- Not logged in -->
			<div class="flex flex-col gap-8">
				<div>
					<p
						class="mb-4 text-[10px] tracking-[0.4em] text-[var(--color-kodo-accent)] uppercase"
						style="font-family: var(--font-mono);"
					>
						Authentication
					</p>
					<h1
						class="leading-none text-[var(--color-kodo-text)]"
						style="font-family: var(--font-display); font-size: clamp(3rem, 8vw, 6rem);"
					>
						Sign In
					</h1>
				</div>

				{#if magicLinkSent}
					<div class="border border-[var(--color-kodo-accent)] p-8">
						<p
							class="mb-2 text-3xl leading-none text-[var(--color-kodo-text)]"
							style="font-family: var(--font-display);"
						>
							Check your email.
						</p>
						<p
							class="text-sm text-[var(--color-kodo-text-muted)]"
							style="font-family: var(--font-body);"
						>
							We sent a magic link to <span class="text-[var(--color-kodo-text)]"
								>{magicLinkEmail}</span
							>. Click it to sign in.
						</p>
					</div>
				{:else}
					<form
						method="POST"
						action="?/login"
						use:enhance={({ formData }) => {
							magicLinkEmail = formData.get('email')?.toString() ?? '';
							return async ({ result }) => {
								if (result.type === 'success') magicLinkSent = true;
							};
						}}
						class="flex max-w-md flex-col gap-6"
					>
						<div class="flex flex-col gap-2">
							<label
								for="loginEmail"
								class="text-[10px] tracking-[0.3em] text-[var(--color-kodo-muted)] uppercase"
								style="font-family: var(--font-mono);">Email Address</label
							>
							<input
								id="loginEmail"
								name="email"
								type="email"
								required
								autocomplete="email"
								class="border border-[var(--color-kodo-border)] bg-[var(--color-kodo-surface)] px-4 py-3 text-sm text-[var(--color-kodo-text)] outline-none transition-colors focus:border-[var(--color-kodo-accent)]"
								style="font-family: var(--font-body);"
								placeholder="your@email.com"
							/>
						</div>
						<button
							type="submit"
							class="border border-[var(--color-kodo-accent)] px-8 py-4 text-xs tracking-[0.3em] text-[var(--color-kodo-accent)] uppercase transition-all duration-200 hover:bg-[var(--color-kodo-accent)] hover:text-[var(--color-kodo-bg)]"
							style="font-family: var(--font-mono);"
						>
							Send Magic Link
						</button>
					</form>
				{/if}
			</div>
		{:else}
			<!-- Logged in -->
			<div class="flex flex-col gap-10">
				<div class="flex items-start justify-between">
					<div>
						<p
							class="mb-4 text-[10px] tracking-[0.4em] text-[var(--color-kodo-accent)] uppercase"
							style="font-family: var(--font-mono);"
						>
							Authenticated
						</p>
						<h1
							class="leading-none text-[var(--color-kodo-text)]"
							style="font-family: var(--font-display); font-size: clamp(2.5rem, 7vw, 5rem);"
						>
							My Account
						</h1>
						<p
							class="mt-2 text-sm text-[var(--color-kodo-text-muted)]"
							style="font-family: var(--font-body);"
						>
							{data.session.user?.email}
						</p>
					</div>

					<form method="POST" action="?/logout" use:enhance>
						<button
							type="submit"
							class="border border-[var(--color-kodo-border)] px-5 py-2 text-[10px] tracking-[0.2em] text-[var(--color-kodo-text-muted)] uppercase transition-all duration-150 hover:border-[var(--color-kodo-text-muted)] hover:text-[var(--color-kodo-text)]"
							style="font-family: var(--font-mono);"
						>
							Sign Out
						</button>
					</form>
				</div>

				<!-- Order history -->
				<div>
					<p
						class="mb-6 text-[10px] tracking-[0.3em] text-[var(--color-kodo-muted)] uppercase"
						style="font-family: var(--font-mono);"
					>
						Order History
					</p>

					{#if data.orders && data.orders.length > 0}
						<div class="overflow-x-auto">
							<table class="w-full text-sm">
								<thead>
									<tr class="border-b border-[var(--color-kodo-border)]">
										{#each ['Order', 'Date', 'Total', 'Status'] as col}
											<th
												class="pb-3 text-left text-[10px] tracking-[0.2em] text-[var(--color-kodo-muted)] uppercase font-normal"
												style="font-family: var(--font-mono);">{col}</th
											>
										{/each}
									</tr>
								</thead>
								<tbody>
									{#each data.orders as order}
										<tr class="border-b border-[var(--color-kodo-border)]/50">
											<td
												class="py-3 text-[var(--color-kodo-text)]"
												style="font-family: var(--font-mono);"
											>
												#{order.id}
											</td>
											<td
												class="py-3 text-[var(--color-kodo-text-muted)]"
												style="font-family: var(--font-body);"
											>
												{new Date(order.date).toLocaleDateString('en-ZA')}
											</td>
											<td
												class="py-3 text-[var(--color-kodo-text)]"
												style="font-family: var(--font-mono);"
											>
												{order.total}
											</td>
											<td class="py-3" style="font-family: var(--font-mono);">
												<span
													class="text-xs {statusColour[order.status] ??
														'text-[var(--color-kodo-text-muted)]'}"
												>
													{order.status.toUpperCase()}
												</span>
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					{:else}
						<div class="border border-[var(--color-kodo-border)] p-8 text-center">
							<p
								class="text-sm tracking-[0.2em] text-[var(--color-kodo-text-muted)] uppercase"
								style="font-family: var(--font-mono);"
							>
								No orders yet.
							</p>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</section>
