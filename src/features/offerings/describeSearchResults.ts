const pluralRules = new Intl.PluralRules("en-IN");

export function describeSearchResults(matchCount: number, searchTerm: string): string {
  if (matchCount === 0) {
    return `No offerings match "${searchTerm.trim()}".`;
  }
  const noun = pluralRules.select(matchCount) === "one" ? "offering" : "offerings";
  return `${matchCount} ${noun} available.`;
}
