import { describe, it, expect, vi, beforeEach } from "vitest";

describe("r2 helper", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("returns original path when R2_PUBLIC_URL is not set", async () => {
    delete process.env.R2_PUBLIC_URL;
    const { getImageUrl } = await import("../r2");
    expect(getImageUrl("/artworks/mural-1.jpg")).toBe("/artworks/mural-1.jpg");
  });

  it("returns R2 URL when R2_PUBLIC_URL is set", async () => {
    process.env.R2_PUBLIC_URL = "https://images.korobkovart.com";
    const { getImageUrl } = await import("../r2");
    expect(getImageUrl("/artworks/mural-1.jpg")).toBe(
      "https://images.korobkovart.com/artworks/mural-1.jpg",
    );
  });

  it("handles trailing slash in R2_PUBLIC_URL", async () => {
    process.env.R2_PUBLIC_URL = "https://images.korobkovart.com/";
    const { getImageUrl } = await import("../r2");
    expect(getImageUrl("/artworks/mural-1.jpg")).toBe(
      "https://images.korobkovart.com/artworks/mural-1.jpg",
    );
  });

  it("handles path without leading slash", async () => {
    process.env.R2_PUBLIC_URL = "https://images.korobkovart.com";
    const { getImageUrl } = await import("../r2");
    expect(getImageUrl("artworks/mural-1.jpg")).toBe(
      "https://images.korobkovart.com/artworks/mural-1.jpg",
    );
  });

  it("getAbsoluteImageUrl falls back to site URL without R2", async () => {
    delete process.env.R2_PUBLIC_URL;
    const { getAbsoluteImageUrl } = await import("../r2");
    expect(getAbsoluteImageUrl("/artworks/mural-1.jpg")).toBe(
      "https://ko.taras.cloud/artworks/mural-1.jpg",
    );
  });

  it("getAbsoluteImageUrl uses R2 URL when set", async () => {
    process.env.R2_PUBLIC_URL = "https://images.korobkovart.com";
    const { getAbsoluteImageUrl } = await import("../r2");
    expect(getAbsoluteImageUrl("/artworks/mural-1.jpg")).toBe(
      "https://images.korobkovart.com/artworks/mural-1.jpg",
    );
  });
});
