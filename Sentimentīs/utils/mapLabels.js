export function mapLabelToSwedish(label) {
  switch (label) {
    case "NEGATIVE":
      return "NEGATIV";
    case "NEUTRAL":
      return "NEUTRAL";
    case "POSITIVE":
      return "POSITIV";
    default:
      return label;
  }
}