import React from "react";
import { render, screen } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  createClient,
  replaceGlobalFetch,
  restoreGlobalFetch,
} from "@fetchkit/chaos-fetch";

import LikeButton from "./LikeButton";
import { describe, test, expect, afterEach } from "vitest";

describe("LikeButton", () => {
  afterEach(() => {
    restoreGlobalFetch();
  });

  test("like button disables during request and updates to backend value", async () => {
    // Mock fetch to return success
    const client = createClient(
      {
        global: [
          { latency: { ms: 300 } },
        ],
        routes: {
          "POST /api/posts/:id/like": [
            { latency: { ms: 300 } },
            { mock: { body: '{ "likes": 43 }' } },
          ],
        },
      },
      window.fetch
    );
    // Replace global fetch with mock client
    replaceGlobalFetch(client);

    const user = userEvent.setup();
    render(<LikeButton initialLikes={42} postId="abc" />);

    // Check initial value is 42
    expect(screen.getByText(/42\s*likes/)).toBeInTheDocument();

    const button = screen.getByRole("button", { name: /like/i });
    await user.click(button);

    // Wait for button to be disabled after click
    await waitFor(() => expect(button).toBeDisabled());

    // Wait for API response and UI update
    await screen.findByText(/43\s*likes/);

    // Button should be enabled again
    await waitFor(() => expect(button).not.toBeDisabled());
  });

  test("like button disables during request and rolls back on backend error", async () => {
    // Mock fetch to return success
    const client = createClient(
      {
        global: [],
        routes: {
          "POST /api/posts/:id/like": [
            { latency: { ms: 300 } },
            { mock: { status: 500, body: '{ "error": "Internal Server Error" }' } },
          ],
        },
      },
      window.fetch
    );
    // Replace global fetch with mock client
    replaceGlobalFetch(client);

    const user = userEvent.setup();
    render(<LikeButton initialLikes={42} postId="abc" />);

    // Check initial value is 42
    expect(screen.getByText(/42\s*likes/)).toBeInTheDocument();

    const button = screen.getByRole("button", { name: /like/i });
    await user.click(button);

    // Wait for button to be disabled after click
    await waitFor(() => expect(button).toBeDisabled());

    // Wait for rollback: like count should return to 42
    await screen.findByText(/42\s*likes/);

    // Button should be enabled again
    await waitFor(() => expect(button).not.toBeDisabled());
  });
});
