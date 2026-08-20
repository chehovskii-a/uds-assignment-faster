export function mergeEventHandlers<E>(
  userHandler: ((event: E) => void) | undefined,
  internalHandler: ((event: E) => void) | undefined,
) {
  return (event: E) => {
    userHandler?.(event);
    internalHandler?.(event);
  };
}
