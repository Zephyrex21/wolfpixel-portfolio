/// <reference types="vite/client" />

// View Transitions API — not yet in all TS DOM lib versions, so we
// declare the minimal shape we actually use.
interface ViewTransition {
  ready: Promise<void>;
  finished: Promise<void>;
  updateCallbackDone: Promise<void>;
  skipTransition: () => void;
}

interface Document {
  startViewTransition?: (
    callback: () => void | Promise<void>,
  ) => ViewTransition;
}
