import React from "react";
import { render, screen } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { test, expect } from "vitest";
import PostView from "./PostView";

import { createClient, replaceGlobalFetch, restoreGlobalFetch } from '@fetchkit/chaos-fetch';
window.location.href = "http://localhost:3000/posts/1";

// Assumes backend is running and seeded with post id 1

test("integration: like button disables during request and re-enables after fetch (real backend)", async () => {
  replaceGlobalFetch(createClient({}));

  render(<PostView postId={1} />);


  // Wait for post to load (like count should be present)
  const likeCountText = await screen.findByText(/\d+\s*likes/);
  const initialCount = Number(likeCountText.textContent.match(/(\d+)/)?.[1] ?? 0);

  const button = await screen.findByRole("button", { name: /like/i });
  const user = userEvent.setup();
  await user.click(button);

  // Button should be disabled during request
  expect(button).toBeDisabled();

  // Wait for fetch to complete and UI to update
  await waitFor(() => expect(button).not.toBeDisabled());

  // Check updated like count
  await waitFor(() => {
    const updatedLikeCountText = screen.getByText(/\d+\s*likes/);
    const updatedCount = Number(updatedLikeCountText.textContent.match(/(\d+)/)?.[1] ?? 0);
    expect(updatedCount).toBe(initialCount + 1);
  });

  restoreGlobalFetch();
});

test("integration: like button disables during request and rolls back on backend error (fail middleware)", async () => {
  // Configure chaos-fetch to fail the like endpoint
  replaceGlobalFetch(createClient({
    routes: {
      "POST /api/posts/:id/like": [
        { latency: { ms: 300 } },
        { fail: { status: 500, body: '{ "error": "fail middleware" }' } },
      ],
    },
  }));

  render(<PostView postId={1} />);

  // Wait for post to load (like count should be present)
  const likeCountText = await screen.findByText(/\d+\s*likes/);
  const initialCount = Number(likeCountText.textContent.match(/(\d+)/)?.[1] ?? 0);

  const button = await screen.findByRole("button", { name: /like/i });
  const user = userEvent.setup();
  await user.click(button);

  // Button should be disabled during request
  expect(button).toBeDisabled();

  // Wait for fetch to complete and UI to update
  await waitFor(() => expect(button).not.toBeDisabled());

  // Check that like count rolls back to original value
  await waitFor(() => {
    const rolledBackLikeCountText = screen.getByText(/\d+\s*likes/);
    const rolledBackCount = Number(rolledBackLikeCountText.textContent.match(/(\d+)/)?.[1] ?? 0);
    expect(rolledBackCount).toBe(initialCount);
  });

  restoreGlobalFetch();
});