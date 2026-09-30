const BUBBLES = Array.from({ length: 16 }, (_, i) => ({
  left: (i * 137) % 100,
  size: 6 + ((i * 53) % 22),
  delay: (i * 1.7) % 14,
  dur: 14 + ((i * 7) % 12),
}));

export default function Background() {
  return (
    <div className="bg" aria-hidden="true">
      <div className="bg__grid" />
      <div className="bg__glow bg__glow--a" />
      <div className="bg__glow bg__glow--b" />
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          className="bubble"
          style={{ left: `${b.left}%`, width: b.size, height: b.size, animationDelay: `-${b.delay}s`, animationDuration: `${b.dur}s` }}
        />
      ))}
    </div>
  );
}
