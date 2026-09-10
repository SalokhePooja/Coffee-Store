export function hasDuplicateName(
  names: string[],
  candidate: string | undefined,
): boolean {
  return names.some(
    (name) => name.toLowerCase() === candidate?.trim().toLowerCase(),
  );
}
