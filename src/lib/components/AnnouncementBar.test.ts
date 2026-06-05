import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import AnnouncementBar from './AnnouncementBar.svelte';

describe('AnnouncementBar', () => {
	it('renders with default messages', () => {
		render(AnnouncementBar);
		expect(screen.getByRole('marquee')).toBeTruthy();
	});

	it('renders custom messages', () => {
		render(AnnouncementBar, { props: { messages: ['Test message'] } });
		const el = screen.getByRole('marquee');
		expect(el.textContent).toContain('Test message');
	});
});
