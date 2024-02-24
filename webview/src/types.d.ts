declare function acquireVsCodeApi(): Readonly<{
  postMessage: (message: unknown) => void;
}>;
