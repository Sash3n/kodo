import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import CartDrawer from './CartDrawer.svelte';
import { cartStore } from '$lib/stores/cart.svelte';

describe('CartDrawer', () => {
	beforeEach(() => cartStore.clear());

	it('renders hidden when open=false', () => {
		render(CartDrawer, { props: { open: false, onClose: () => {} } });
		const drawer = screen.getByTestId('cart-drawer');
		expect(drawer.getAttribute('aria-hidden')).toBe('true');
	});

	it('renders visible when open=true', () => {
		render(CartDrawer, { props: { open: true, onClose: () => {} } });
		const drawer = screen.getByTestId('cart-drawer');
		expect(drawer.getAttribute('aria-hidden')).toBe('false');
	});

	it('shows empty state when cart is empty', () => {
		render(CartDrawer, { props: { open: true, onClose: () => {} } });
		expect(screen.getByText('EMPTY')).toBeTruthy();
	});

	it('calls onClose when close button clicked', async () => {
		let closed = false;
		render(CartDrawer, {
			props: {
				open: true,
				onClose: () => {
					closed = true;
				},
			},
		});
		await fireEvent.click(screen.getByLabelText('Close cart'));
		expect(closed).toBe(true);
	});
});
