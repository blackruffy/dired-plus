/// <reference types="vite/client" />

declare function acquireVsCodeApi(): Readonly<{
  postMessage: (message: unknown) => void;
}>;
