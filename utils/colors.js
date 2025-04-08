const BASE_COLORS = {
  NEGATIVE: [255, 99, 132], // Red
  NEUTRAL: [54, 162, 235], // Blue
  POSITIVE: [75, 192, 132]  // Green
};

export function getBaseColor(label) {
  return BASE_COLORS[label] || [128, 128, 128];
}

export function getColor(label, alpha = 1) {
  console.log('transparency', alpha);
  const [r, g, b] = getBaseColor(label);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
