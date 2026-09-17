interface SparklineProps {
  data: { date: string; value: number }[];
  width?: number;
  height?: number;
  color?: string;
}

export function Sparkline({ data, width = 240, height = 48, color = 'var(--color-accent)' }: SparklineProps) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const len = data.length;

  const points = data.map((d, i) => {
    const x = (i / (len - 1)) * width;
    const y = height - ((d.value - min) / (max - min || 1)) * height;
    return `${x},${y}`;
  });

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth={2}
        points={points.join(' ')}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default Sparkline;
