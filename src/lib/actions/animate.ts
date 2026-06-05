import { animate, inView } from 'motion';

// Svelte action: fade + Y translate on scroll entry
export function fadeInUp(node: Element, params?: { delay?: number; duration?: number }) {
	const { delay = 0, duration = 0.5 } = params ?? {};

	// Start hidden
	(node as HTMLElement).style.opacity = '0';

	inView(node, () => {
		animate(node, { opacity: [0, 1], y: [16, 0] }, { duration, delay, easing: 'ease-out' });
	});
}

// Svelte action: stagger children on scroll entry
export function staggerChildren(
	node: Element,
	params?: { selector?: string; stagger?: number; duration?: number }
) {
	const { selector = '[data-stagger]', stagger = 0.08, duration = 0.5 } = params ?? {};

	const children = Array.from(node.querySelectorAll(selector));
	children.forEach((child) => {
		(child as HTMLElement).style.opacity = '0';
	});

	inView(node, () => {
		children.forEach((child, i) => {
			animate(
				child,
				{ opacity: [0, 1], y: [20, 0] },
				{ duration, delay: i * stagger, easing: 'ease-out' }
			);
		});
	});
}

// Svelte action: nav background on scroll
export function navScroll(node: Element) {
	const handler = () => {
		if (window.scrollY > 20) {
			animate(node, { backgroundColor: 'var(--color-kodo-surface)' }, { duration: 0.2 });
		} else {
			animate(node, { backgroundColor: 'transparent' }, { duration: 0.2 });
		}
	};

	window.addEventListener('scroll', handler, { passive: true });
	return {
		destroy() {
			window.removeEventListener('scroll', handler);
		},
	};
}
