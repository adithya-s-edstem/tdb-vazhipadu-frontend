import { useRef } from "react";

export interface IdempotencyKey {
  keyFor: (contents: unknown) => string;
  release: () => void;
}

interface Attempt {
  idempotencyKey: string;
  contents: string;
}

export function useIdempotencyKey(): IdempotencyKey {
  const attempt = useRef<Attempt | undefined>(undefined);

  function keyFor(contents: unknown): string {
    const serialisedContents = JSON.stringify(contents);
    if (attempt.current?.contents !== serialisedContents) {
      attempt.current = { idempotencyKey: crypto.randomUUID(), contents: serialisedContents };
    }
    return attempt.current.idempotencyKey;
  }

  function release(): void {
    attempt.current = undefined;
  }

  return { keyFor, release };
}
