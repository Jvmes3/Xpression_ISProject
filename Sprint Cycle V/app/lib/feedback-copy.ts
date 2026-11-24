export function feedbackParts(strengths: string, improvements: string, recommendation: string) {
  const parts = [
    { label: "Strengths", text: strengths.trim() },
    { label: "Improvements", text: improvements.trim() },
    { label: "Recommendation", text: recommendation.trim() },
  ].filter((part) => part.text);
  if (parts.length > 1 && parts.every((part) => part.text === parts[0].text)) {
    return [{ label: "", text: parts[0].text }];
  }
  return parts;
}
