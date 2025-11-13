/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  signUp,
  signIn,
  signOut,
  submitLoanApplication,
  getUserApplication,
  deleteUserApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationApproval,
} from "./api";

// Mock fetch globally
const mockFetch = vi.fn();
(globalThis as any).fetch = mockFetch;

describe("API Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe("signUp", () => {
    it("should successfully sign up a user", async () => {
      const mockResponse = {
        ok: true,
        user: { id: "123", email: "test@example.com" },
        accessToken: "mock-token",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await signUp({
        firstName: "John",
        lastName: "Doe",
        email: "test@example.com",
        password: "password123",
      });

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/auth/signup",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        })
      );
    });

    it("should throw error on failed sign up", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 409,
        json: async () => ({ message: "Email already in use" }),
      });

      await expect(
        signUp({
          firstName: "John",
          lastName: "Doe",
          email: "test@example.com",
          password: "password123",
        })
      ).rejects.toThrow("Email already in use");
    });
  });

  describe("signIn", () => {
    it("should successfully sign in a user and store token", async () => {
      const mockResponse = {
        ok: true,
        user: { id: "123", email: "test@example.com" },
        accessToken: "mock-token",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await signIn({
        email: "test@example.com",
        password: "password123",
      });

      expect(result).toEqual(mockResponse);
      expect(localStorage.getItem("accessToken")).toBe("mock-token");
    });

    it("should throw error on invalid credentials", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: "Invalid credentials" }),
      });

      await expect(
        signIn({
          email: "test@example.com",
          password: "wrong-password",
        })
      ).rejects.toThrow("Invalid credentials");
    });
  });

  describe("signOut", () => {
    it("should successfully sign out and remove token", async () => {
      localStorage.setItem("accessToken", "mock-token");

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ok: true }),
      });

      const result = await signOut();

      expect(result).toBe(true);
      expect(localStorage.getItem("accessToken")).toBeNull();
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/auth/logout",
        expect.objectContaining({
          method: "POST",
          credentials: "include",
        })
      );
    });
  });

  describe("submitLoanApplication", () => {
    it("should submit loan application with valid token", async () => {
      localStorage.setItem("accessToken", "mock-token");

      const mockData: any = {
        personalInfo: { firstName: "John", lastName: "Doe" },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ok: true, applicationId: "456" }),
      });

      const result = await submitLoanApplication(mockData);

      expect(result).toEqual({ ok: true, applicationId: "456" });
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/submit-application",
        expect.objectContaining({
          method: "POST",
          credentials: "include",
        })
      );
    });

    it("should throw error when not authenticated", async () => {
      await expect(submitLoanApplication({} as any)).rejects.toThrow(
        "Not authenticated"
      );
    });
  });

  describe("getUserApplication", () => {
    it("should get user application with valid token", async () => {
      localStorage.setItem("accessToken", "mock-token");

      const mockApplication = { id: "789", status: "submitted" };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ application: mockApplication }),
      });

      const result = await getUserApplication();

      expect(result).toEqual(mockApplication);
    });

    it("should return null when application not found", async () => {
      localStorage.setItem("accessToken", "mock-token");

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await getUserApplication();

      expect(result).toBeNull();
    });
  });

  describe("deleteUserApplication", () => {
    it("should delete user application", async () => {
      localStorage.setItem("accessToken", "mock-token");

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ok: true, deleted: true }),
      });

      const result = await deleteUserApplication();

      expect(result).toEqual({ ok: true, deleted: true });
    });
  });

  describe("getAllApplications", () => {
    it("should fetch all applications for admin", async () => {
      localStorage.setItem("accessToken", "admin-token");

      const mockApplications = [
        { id: "1", status: "submitted" },
        { id: "2", status: "approved" },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApplications,
      });

      const result = await getAllApplications();

      expect(result).toEqual(mockApplications);
    });
  });

  describe("getApplicationById", () => {
    it("should fetch application by id", async () => {
      localStorage.setItem("accessToken", "admin-token");

      const mockApplication = { id: "123", status: "submitted" };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ application: mockApplication }),
      });

      const result = await getApplicationById("123");

      expect(result).toEqual(mockApplication);
    });
  });

  describe("updateApplicationApproval", () => {
    it("should update application approval status", async () => {
      localStorage.setItem("accessToken", "admin-token");

      const mockResponse = {
        ok: true,
        applicationId: "123",
        approval: "approved" as const,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await updateApplicationApproval("123", "approved");

      expect(result).toEqual(mockResponse);
    });
  });
});
