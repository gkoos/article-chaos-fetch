import React from 'react';
import { render, screen } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import LikeButton from './LikeButton';
import { describe, test, expect, beforeAll, afterAll, afterEach } from 'vitest';

const server = setupServer(
  http.post('/api/posts/:id/like', async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return HttpResponse.json({ likes: 43 });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('LikeButton', () => {
  test('like button disables during request and updates to backend value', async () => {
    const user = userEvent.setup();
    render(<LikeButton initialLikes={42} postId="abc" />);

    // Check initial value is 42
    expect(screen.getByText(/42\s*likes/)).toBeInTheDocument();

    const button = screen.getByRole('button', { name: /like/i });
    await user.click(button);

  // Wait for button to be disabled after click
  await waitFor(() => expect(button).toBeDisabled());

    // Wait for API response and UI update
    await screen.findByText(/43\s*likes/);

  // Button should be enabled again
  await waitFor(() => expect(button).not.toBeDisabled());
  });
});
