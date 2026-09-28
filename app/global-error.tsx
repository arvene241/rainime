"use client";

/** Last-resort boundary: replaces the root layout, so it carries its own styles. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#16191f",
          color: "#eef0f4",
          fontFamily: "system-ui, sans-serif",
          padding: "1.5rem",
        }}
      >
        <div style={{ maxWidth: "32rem" }}>
          <h1 style={{ fontSize: "2rem", margin: "0 0 0.75rem" }}>rainime couldn’t load</h1>
          <p style={{ color: "#b3b9c4", lineHeight: 1.6, margin: "0 0 1.5rem" }}>
            An unexpected error stopped the page. Try again, and if it persists come back in a few
            minutes.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              background: "#f07152",
              color: "#1d110d",
              border: 0,
              borderRadius: 3,
              padding: "0.8rem 1.2rem",
              font: "inherit",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
