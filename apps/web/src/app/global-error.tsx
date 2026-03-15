'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100dvh',
          fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
          background: '#f8f9fa',
          color: '#111827',
          display: 'grid',
          placeItems: 'center',
          padding: '24px',
        }}
      >
        <main
          style={{
            maxWidth: 560,
            width: '100%',
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 12,
            padding: 20,
          }}
        >
          <h1 style={{ marginTop: 0, marginBottom: 8 }}>Something went wrong</h1>
          <p style={{ marginTop: 0, marginBottom: 16, color: '#4b5563' }}>
            An unexpected error occurred while loading this page.
          </p>
          {error?.digest ? (
            <p
              style={{
                marginTop: 0,
                marginBottom: 16,
                fontSize: 12,
                color: '#6b7280',
              }}
            >
              Error ID: {error.digest}
            </p>
          ) : null}
          <button
            type="button"
            onClick={reset}
            style={{
              border: 0,
              borderRadius: 8,
              background: '#111827',
              color: '#ffffff',
              padding: '10px 14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
