// Checks whether a new name collides with an existing one, ignoring casing and whitespace.
export function hasDuplicateName(
  names: string[],
  candidate: string | undefined,
): boolean {
  return names.some(
    (name) => name.toLowerCase() === candidate?.trim().toLowerCase(),
  );
}
