import { animate, inView, spring } from 'motion';

// Page transition — runs on layout mount
export function pageTransition(node: Element) {
	animate(node, { opacity: [0, 1], y: [8, 0] }, { duration: 0.3, easing: 'ease' });
}

// Hero image slow scale on load
export function heroScale(node: Element) {
	animate(node, { scale: [1.05, 1] }, { duration: 1.2, easing: 'ease-out' });
}

// Staggered word reveal for hero text
export function heroTextReveal(node: Element) {
	const words = Array.from(node.querySelectorAll('[data-word]'));
	words.forEach((word, i) => {
		animate(
			word,
			{ opacity: [0, 1], y: [12, 0] },
			{ duration: 0.5, delay: i * 0.06, easing: 'ease-out' }
		);
	});
}

// Collection grid stagger on scroll enter
export function gridStagger(node: Element) {
	const items = Array.from(node.querySelectorAll('[data-grid-item]'));
	inView(node, () => {
		items.forEach((item, i) => {
			animate(
				item,
				{ opacity: [0, 1], y: [20, 0] },
				{ duration: 0.5, delay: i * 0.08, easing: 'ease-out' }
			);
		});
	});
}

// Cart badge spring bump
export function cartBadgeBump(node: Element) {
	animate(
		node,
		{ scale: [1, 1.35, 1] },
		{ duration: 0.3, easing: spring({ stiffness: 300, damping: 15 }) }
	);
}

// Gallery image crossfade
export function galleryFade(node: Element) {
	animate(node, { opacity: [0, 1] }, { duration: 0.25, easing: 'ease' });
}

// Size guide modal appear
export function modalIn(node: Element) {
	animate(node, { opacity: [0, 1], scale: [0.95, 1] }, { duration: 0.2, easing: 'ease-out' });
}

// Cart drawer: add item slide down
export function itemSlideIn(node: Element) {
	animate(node, { opacity: [0, 1], y: [-12, 0] }, { duration: 0.25, easing: 'ease-out' });
}

// Cart drawer: remove item slide out
export function itemSlideOut(node: Element, done: () => void) {
	animate(node, { opacity: [1, 0], x: [0, -20] }, { duration: 0.2, easing: 'ease-in' }).then(done);
}
