<script lang="ts">
	interface Props {
		releaseDate: string; // ISO datetime from Sanity
		collectionId: string; // Sanity _id
		collectionTitle: string;
	}

	let { releaseDate, collectionId, collectionTitle }: Props = $props();

	const target = $derived(new Date(releaseDate));
	const isPast = $derived(target <= new Date());

	// Countdown ticker
	let now = $state(new Date());
	$effect(() => {
		if (isPast) return;
		const interval = setInterval(() => (now = new Date()), 1000);
		return () => clearInterval(interval);
	});

	const diff = $derived(Math.max(0, target.getTime() - now.getTime()));
	const days = $derived(Math.floor(diff / 86_400_000));
	const hours = $derived(Math.floor((diff % 86_400_000) / 3_600_000));
	const minutes = $derived(Math.floor((diff % 3_600_000) / 60_000));
	const seconds = $derived(Math.floor((diff % 60_000) / 1_000));

	function pad(n: number) {
		return String(n).padStart(2, '0');
	}

	// Waitlist form
	let email = $state('');
	let waitlistState = $state<'idle' | 'loading' | 'success' | 'error'>('idle');
	let waitlistError = $state('');

	async function joinWaitlist() {
		if (!email.trim()) return;
		waitlistState = 'loading';
		waitlistError = '';

		try {
			const res = await fetch('/api/waitlist', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ email: email.trim(), collectionId }),
			});
			const data = await res.json();
			if (res.ok) {
				waitlistState = 'success';
			} else {
				waitlistState = 'error';
				waitlistError = data.error ?? 'Something went wrong';
			}
		} catch {
			waitlistState = 'error';
			waitlistError = 'Network error. Please try again.';
		}
	}
</script>

{#if !isPast}
	<div class="countdown-wrap">
		<p class="drop-label">
			{collectionTitle} drops in
		</p>

		<div class="countdown">
			<div class="unit">
				<span class="digit">{days}</span>
				<span class="unit-label">days</span>
			</div>
			<span class="sep">:</span>
			<div class="unit">
				<span class="digit">{pad(hours)}</span>
				<span class="unit-label">hrs</span>
			</div>
			<span class="sep">:</span>
			<div class="unit">
				<span class="digit">{pad(minutes)}</span>
				<span class="unit-label">min</span>
			</div>
			<span class="sep">:</span>
			<div class="unit">
				<span class="digit">{pad(seconds)}</span>
				<span class="unit-label">sec</span>
			</div>
		</div>

		<!-- Waitlist -->
		{#if waitlistState === 'success'}
			<p class="waitlist-success">
				You're on the list. We'll notify you when {collectionTitle} drops.
			</p>
		{:else}
			<form
				class="waitlist-form"
				onsubmit={(e) => {
					e.preventDefault();
					joinWaitlist();
				}}
			>
				<input
					type="email"
					bind:value={email}
					required
					placeholder="Email for drop alert"
					class="waitlist-input"
				/>
				<button type="submit" disabled={waitlistState === 'loading'} class="waitlist-btn">
					{waitlistState === 'loading' ? '…' : 'Notify me'}
				</button>
			</form>
			{#if waitlistError}
				<p class="waitlist-error">{waitlistError}</p>
			{/if}
		{/if}
	</div>
{/if}

<style>
	.countdown-wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
		padding: 2rem;
		border: 1px solid var(--color-kodo-border, #2a2a2a);
		background: var(--color-kodo-surface, #111);
	}

	.drop-label {
		font-family: 'Space Mono', monospace;
		font-size: 0.7rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--color-kodo-muted, #888);
	}

	.countdown {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
	}

	.unit {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		min-width: 3.5rem;
	}

	.digit {
		font-family: 'Bebas Neue', sans-serif;
		font-size: clamp(2.5rem, 6vw, 4rem);
		line-height: 1;
		color: var(--color-kodo-text, #f0ede6);
		letter-spacing: 0.02em;
	}

	.unit-label {
		font-family: 'Space Mono', monospace;
		font-size: 0.6rem;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--color-kodo-muted, #888);
	}

	.sep {
		font-family: 'Bebas Neue', sans-serif;
		font-size: clamp(2rem, 5vw, 3.5rem);
		color: var(--color-kodo-accent, #e8b44a);
		line-height: 1;
		margin-top: 0.1rem;
	}

	.waitlist-form {
		display: flex;
		gap: 0.5rem;
		width: 100%;
		max-width: 360px;
	}

	.waitlist-input {
		flex: 1;
		background: transparent;
		border: 1px solid var(--color-kodo-border, #2a2a2a);
		color: var(--color-kodo-text, #f0ede6);
		font-family: 'Space Mono', monospace;
		font-size: 0.75rem;
		padding: 0.6rem 0.85rem;
		outline: none;
		transition: border-color 0.15s;
	}

	.waitlist-input:focus {
		border-color: var(--color-kodo-accent, #e8b44a);
	}

	.waitlist-btn {
		background: var(--color-kodo-accent, #e8b44a);
		color: #0a0a0a;
		border: none;
		font-family: 'Space Mono', monospace;
		font-size: 0.7rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		padding: 0.6rem 1rem;
		cursor: pointer;
		white-space: nowrap;
		transition: opacity 0.15s;
	}

	.waitlist-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.waitlist-success {
		font-family: 'Space Mono', monospace;
		font-size: 0.75rem;
		color: #34d399;
		text-align: center;
	}

	.waitlist-error {
		font-family: 'Space Mono', monospace;
		font-size: 0.7rem;
		color: #f87171;
	}
</style>
