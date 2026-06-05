<script lang="ts">
	let orderNumber = $state('');
	let email = $state('');
	let itemDescription = $state('');
	let reason = $state('');
	let resolution = $state('');
	let submitted = $state(false);

	const reasons = [
		{ value: 'wrong-size', label: 'Wrong Size' },
		{ value: 'defective', label: 'Defective' },
		{ value: 'changed-mind', label: 'Changed Mind' },
		{ value: 'other', label: 'Other' },
	];

	const resolutions = [
		{ value: 'refund', label: 'Refund' },
		{ value: 'exchange', label: 'Exchange' },
	];

	const policyPoints = [
		'14-day return window from date of delivery',
		'Items must be unworn, unwashed, with original tags attached',
		'Final Sale items are not eligible for returns',
		'Exchanges subject to stock availability',
		'Refunds processed within 5–7 business days of receipt',
	];

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (!orderNumber || !email || !itemDescription || !reason || !resolution) return;
		submitted = true;
	}
</script>

<svelte:head>
	<title>Returns — KŌDO</title>
</svelte:head>

<section class="min-h-screen bg-[var(--color-kodo-bg)] pt-32">
	<div class="mx-auto max-w-4xl px-[var(--spacing-gutter)] py-16">
		<!-- Header -->
		<div class="mb-16">
			<p
				class="mb-4 text-[10px] tracking-[0.4em] text-[var(--color-kodo-accent)] uppercase"
				style="font-family: var(--font-mono);"
			>
				Self-Service
			</p>
			<h1
				class="mb-6 leading-none text-[var(--color-kodo-text)]"
				style="font-family: var(--font-display); font-size: clamp(3rem, 10vw, 8rem);"
			>
				Returns
			</h1>
		</div>

		<!-- Policy summary -->
		<div class="mb-12 border border-[var(--color-kodo-border)] bg-[var(--color-kodo-surface)] p-6">
			<p
				class="mb-3 text-[10px] tracking-[0.3em] text-[var(--color-kodo-accent)] uppercase"
				style="font-family: var(--font-mono);"
			>
				Policy Summary
			</p>
			<ul class="flex flex-col gap-2">
				{#each policyPoints as point}
					<li
						class="flex items-start gap-3 text-sm text-[var(--color-kodo-text-muted)]"
						style="font-family: var(--font-body);"
					>
						<span class="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--color-kodo-accent)]"
						></span>
						{point}
					</li>
				{/each}
			</ul>
		</div>

		<!-- Form or confirmation -->
		{#if submitted}
			<div class="flex flex-col gap-4 border border-[var(--color-kodo-accent)] p-8">
				<span
					class="text-[10px] tracking-[0.3em] text-[var(--color-kodo-accent)] uppercase"
					style="font-family: var(--font-mono);">Received</span
				>
				<p
					class="text-4xl leading-none text-[var(--color-kodo-text)]"
					style="font-family: var(--font-display);"
				>
					Return Initiated.
				</p>
				<p
					class="text-sm text-[var(--color-kodo-text-muted)]"
					style="font-family: var(--font-body);"
				>
					We've received your request for order <span class="text-[var(--color-kodo-text)]"
						>{orderNumber}</span
					>. Check {email} for next steps within 1–2 business days.
				</p>
			</div>
		{:else}
			<form onsubmit={handleSubmit} class="flex flex-col gap-6" novalidate>
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					<!-- Order number -->
					<div class="flex flex-col gap-2">
						<label
							for="orderNumber"
							class="text-[10px] tracking-[0.3em] text-[var(--color-kodo-muted)] uppercase"
							style="font-family: var(--font-mono);">Order Number</label
						>
						<input
							id="orderNumber"
							type="text"
							bind:value={orderNumber}
							required
							class="border border-[var(--color-kodo-border)] bg-[var(--color-kodo-surface)] px-4 py-3 text-sm text-[var(--color-kodo-text)] outline-none transition-colors focus:border-[var(--color-kodo-accent)]"
							style="font-family: var(--font-body);"
							placeholder="#KODO0001"
						/>
					</div>

					<!-- Email -->
					<div class="flex flex-col gap-2">
						<label
							for="returnEmail"
							class="text-[10px] tracking-[0.3em] text-[var(--color-kodo-muted)] uppercase"
							style="font-family: var(--font-mono);">Email on Order</label
						>
						<input
							id="returnEmail"
							type="email"
							bind:value={email}
							required
							autocomplete="email"
							class="border border-[var(--color-kodo-border)] bg-[var(--color-kodo-surface)] px-4 py-3 text-sm text-[var(--color-kodo-text)] outline-none transition-colors focus:border-[var(--color-kodo-accent)]"
							style="font-family: var(--font-body);"
							placeholder="your@email.com"
						/>
					</div>
				</div>

				<!-- Item description -->
				<div class="flex flex-col gap-2">
					<label
						for="itemDescription"
						class="text-[10px] tracking-[0.3em] text-[var(--color-kodo-muted)] uppercase"
						style="font-family: var(--font-mono);">Item(s) to Return</label
					>
					<textarea
						id="itemDescription"
						bind:value={itemDescription}
						required
						rows={3}
						class="resize-none border border-[var(--color-kodo-border)] bg-[var(--color-kodo-surface)] px-4 py-3 text-sm text-[var(--color-kodo-text)] outline-none transition-colors focus:border-[var(--color-kodo-accent)]"
						style="font-family: var(--font-body);"
						placeholder="e.g. Core Oversized Tee, Size L, Black"
					></textarea>
				</div>

				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					<!-- Reason -->
					<div class="flex flex-col gap-2">
						<label
							for="reason"
							class="text-[10px] tracking-[0.3em] text-[var(--color-kodo-muted)] uppercase"
							style="font-family: var(--font-mono);">Reason</label
						>
						<select
							id="reason"
							bind:value={reason}
							required
							class="border border-[var(--color-kodo-border)] bg-[var(--color-kodo-surface)] px-4 py-3 text-sm text-[var(--color-kodo-text)] outline-none transition-colors focus:border-[var(--color-kodo-accent)]"
							style="font-family: var(--font-body);"
						>
							<option value="" disabled>Select reason</option>
							{#each reasons as r}
								<option value={r.value}>{r.label}</option>
							{/each}
						</select>
					</div>

					<!-- Resolution -->
					<div class="flex flex-col gap-2">
						<label
							for="resolution"
							class="text-[10px] tracking-[0.3em] text-[var(--color-kodo-muted)] uppercase"
							style="font-family: var(--font-mono);">Preferred Resolution</label
						>
						<select
							id="resolution"
							bind:value={resolution}
							required
							class="border border-[var(--color-kodo-border)] bg-[var(--color-kodo-surface)] px-4 py-3 text-sm text-[var(--color-kodo-text)] outline-none transition-colors focus:border-[var(--color-kodo-accent)]"
							style="font-family: var(--font-body);"
						>
							<option value="" disabled>Select resolution</option>
							{#each resolutions as r}
								<option value={r.value}>{r.label}</option>
							{/each}
						</select>
					</div>
				</div>

				<button
					type="submit"
					class="border border-[var(--color-kodo-accent)] px-8 py-4 text-xs tracking-[0.3em] text-[var(--color-kodo-accent)] uppercase transition-all duration-200 hover:bg-[var(--color-kodo-accent)] hover:text-[var(--color-kodo-bg)]"
					style="font-family: var(--font-mono);"
				>
					Submit Return Request
				</button>
			</form>
		{/if}
	</div>
</section>
