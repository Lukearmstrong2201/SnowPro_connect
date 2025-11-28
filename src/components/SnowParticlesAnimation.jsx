export default function SnowParticlesAnimation() {
  return (
    <div className="snow-container">
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className="snowflake"
          style={{
            "--x": Math.random(),
            "--duration": `${6 + Math.random() * 6}s`,
          }}
        />
      ))}
    </div>
  );
}
