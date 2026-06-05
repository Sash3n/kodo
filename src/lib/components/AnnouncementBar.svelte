<script lang="ts">
	interface Props {
		messages?: string[];
	}

	let {
		messages = [
			'Free shipping on orders R950+ · Use code KODO10 for 10% off your first order',
			'New drop SS26 — dropping soon · Follow @kodoclothing for the release date',
			'Free shipping on orders R950+ · Standard R85 · Express R150 metro only',
		],
	}: Props = $props();

	const track = $derived([...messages, ...messages].join('  ·  '));
</script>

<div
	class="relative overflow-hidden bg-[var(--color-kodo-accent)] py-2"
	role="marquee"
	aria-label="Announcements"
>
	<div class="flex whitespace-nowrap animate-marquee">
		<span class="font-mono text-xs tracking-widest uppercase text-[var(--color-kodo-bg)] px-8">
			{track}
		</span>
		<span
			class="font-mono text-xs tracking-widest uppercase text-[var(--color-kodo-bg)] px-8"
			aria-hidden="true"
		>
			{track}
		</span>
	</div>
</div>
