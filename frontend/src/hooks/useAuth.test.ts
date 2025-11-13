/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useAuth } from "./useAuth";

const mockFetch = vi.fn();
(globalThis as any).fetch = mockFetch;

describe("useAuth Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("should return null user when no token is stored", async () => {
    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
  });

  it("should fetch and set user when valid token exists", async () => {
    localStorage.setItem("accessToken", "valid-token");

    const mockUser = {
      _id: "123",
      email: "test@example.com",
      firstName: "John",
      lastName: "Doe",
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ok: true, user: mockUser }),
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/auth/me",
      expect.objectContaining({
        headers: {
          Authorization: "Bearer valid-token",
        },
        credentials: "include",
      })
    );
  });

  it("should remove token and set user to null on failed auth", async () => {
    localStorage.setItem("accessToken", "invalid-token");

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(localStorage.getItem("accessToken")).toBeNull();
  });
});
