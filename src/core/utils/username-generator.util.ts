export function generateUsernameCandidate(attempt: number): string {
  const prefixes = ['user'];
  const prefix = prefixes[attempt % prefixes.length];

  const suffix = generateSuffix(attempt);

  return `${prefix}_${suffix}`.substring(0, 20);
}

function generateSuffix(attempt: number): string {
  const suffixes = [
    Math.floor(1000 + Math.random() * 9000).toString(),
    Math.random().toString(36).substring(2, 7),
    Date.now().toString(36).slice(-5),
  ];

  return suffixes[attempt % suffixes.length];
}
