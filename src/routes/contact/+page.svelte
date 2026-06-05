<script lang="ts">
	let name = $state('');
	let email = $state('');
	let message = $state('');
	let submitted = $state(false);

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (!name.trim() || !email.trim() || !message.trim()) return;
		submitted = true;
	}
</script>

<svelte:head>
	<title>Contact — KŌDO</title>
</svelte:head>

<section class="min-h-screen bg-[var(--color-kodo-bg)] pt-32">
	<div class="mx-auto max-w-4xl px-[var(--spacing-gutter)] py-16">
		<!-- Header -->
		<div class="mb-16">
			<p
				class="mb-4 text-[10px] tracking-[0.4em] text-[var(--color-kodo-accent)] uppercase"
				style="font-family: var(--font-mono);"
			>
				Get in Touch
			</p>
			<h1
				class="leading-none text-[var(--color-kodo-text)]"
				style="font-family: var(--font-display); font-size: clamp(3rem, 10vw, 8rem);"
			>
				Contact
			</h1>
		</div>

		<div class="grid grid-cols-1 gap-16 md:grid-cols-[1fr_2fr]">
			<!-- Contact info -->
			<div class="flex flex-col gap-8">
				<div>
					<p
						class="mb-2 text-[10px] tracking-[0.3em] text-[var(--color-kodo-muted)] uppercase"
						style="font-family: var(--font-mono);"
					>
						Email
					</p>
					<a
						href="mailto:hello@kodo.co.za"
						class="text-sm text-[var(--color-kodo-text)] underline-draw"
						style="font-family: var(--font-body);"
					>
						hello@kodo.co.za
					</a>
				</div>
				<div>
					<p
						class="mb-2 text-[10px] tracking-[0.3em] text-[var(--color-kodo-muted)] uppercase"
						style="font-family: var(--font-mono);"
					>
						Instagram
					</p>
					<a
						href="https://instagram.com/kodoclothing"
						target="_blank"
						rel="noopener noreferrer"
						class="text-sm text-[var(--color-kodo-text)] underline-draw"
						style="font-family: var(--font-body);"
					>
						@kodoclothing
					</a>
				</div>
				<div>
					<p
						class="mb-2 text-[10px] tracking-[0.3em] text-[var(--color-kodo-muted)] uppercase"
						style="font-family: var(--font-mono);"
					>
						Response time
					</p>
					<p
						class="text-sm text-[var(--color-kodo-text-muted)]"
						style="font-family: var(--font-body);"
					>
						1–3 business days
					</p>
				</div>
			</div>

			<!-- Form -->
			{#if submitted}
				<div
					class="flex flex-col items-start justify-center gap-4 border border-[var(--color-kodo-accent)] p-8"
				>
					<span
						class="text-xs tracking-[0.3em] text-[var(--color-kodo-accent)] uppercase"
						style="font-family: var(--font-mono);">Transmitted</span
					>
					<p
						class="text-3xl leading-none text-[var(--color-kodo-text)]"
						style="font-family: var(--font-display);"
					>
						Message sent.
					</p>
					<p
						class="text-sm text-[var(--color-kodo-text-muted)]"
						style="font-family: var(--font-body);"
					>
						We'll get back to you at {email} within 1–3 business days.
					</p>
				</div>
			{:else}
				<form onsubmit={handleSubmit} class="flex flex-col gap-6" novalidate>
					<div class="flex flex-col gap-2">
						<label
							for="name"
							class="text-[10px] tracking-[0.3em] text-[var(--color-kodo-muted)] uppercase"
							style="font-family: var(--font-mono);">Name</label
						>
						<input
							id="name"
							type="text"
							bind:value={name}
							required
							autocomplete="name"
							class="border border-[var(--color-kodo-border)] bg-[var(--color-kodo-surface)] px-4 py-3 text-sm text-[var(--color-kodo-text)] outline-none transition-colors focus:border-[var(--color-kodo-accent)]"
							style="font-family: var(--font-body);"
							placeholder="Your name"
						/>
					</div>

					<div class="flex flex-col gap-2">
						<label
							for="email"
							class="text-[10px] tracking-[0.3em] text-[var(--color-kodo-muted)] uppercase"
							style="font-family: var(--font-mono);">Email</label
						>
						<input
							id="email"
							type="email"
							bind:value={email}
							required
							autocomplete="email"
							class="border border-[var(--color-kodo-border)] bg-[var(--color-kodo-surface)] px-4 py-3 text-sm text-[var(--color-kodo-text)] outline-none transition-colors focus:border-[var(--color-kodo-accent)]"
							style="font-family: var(--font-body);"
							placeholder="your@email.com"
						/>
					</div>

					<div class="flex flex-col gap-2">
						<label
							for="message"
							class="text-[10px] tracking-[0.3em] text-[var(--color-kodo-muted)] uppercase"
							style="font-family: var(--font-mono);">Message</label
						>
						<textarea
							id="message"
							bind:value={message}
							required
							rows={5}
							class="resize-none border border-[var(--color-kodo-border)] bg-[var(--color-kodo-surface)] px-4 py-3 text-sm text-[var(--color-kodo-text)] outline-none transition-colors focus:border-[var(--color-kodo-accent)]"
							style="font-family: var(--font-body);"
							placeholder="What's on your mind?"
						></textarea>
					</div>

					<button
						type="submit"
						class="border border-[var(--color-kodo-accent)] px-8 py-4 text-xs tracking-[0.3em] text-[var(--color-kodo-accent)] uppercase transition-all duration-200 hover:bg-[var(--color-kodo-accent)] hover:text-[var(--color-kodo-bg)]"
						style="font-family: var(--font-mono);"
					>
						Send Message
					</button>
				</form>
			{/if}
		</div>
	</div>
</section>
