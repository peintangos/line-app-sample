interface ParsedResponse {
  content: string;
  suggestions: string[];
}

export function parseSuggestions(response: string): ParsedResponse {
  const separator = "---suggestions---";
  const index = response.indexOf(separator);

  if (index === -1) {
    return { content: response.trim(), suggestions: [] };
  }

  const content = response.slice(0, index).trim();
  const suggestionsBlock = response.slice(index + separator.length).trim();

  const suggestions = suggestionsBlock
    .split("\n")
    .map((line) => line.replace(/^\d+\.\s*/, "").trim())
    .filter((line) => line.length > 0)
    .slice(0, 3);

  return { content, suggestions };
}
