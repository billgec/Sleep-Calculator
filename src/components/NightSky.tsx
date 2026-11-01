export function NightSky() {
  return (
    <div className="night-sky" aria-hidden="true">
      <div className="aurora" />
      <div className="stars stars-far" />
      <div className="stars stars-near" />
      <div className="shooting-star" />
      <svg
        className="horizon"
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
      >
        <path
          className="horizon-back"
          d="M0 120 C160 70 280 95 420 80 S700 30 860 70 S1180 110 1300 72 S1400 60 1440 66 V220 H0Z"
        />
        <path
          className="horizon-front"
          d="M0 170 C140 140 300 150 460 130 S760 110 920 140 S1240 170 1440 128 V220 H0Z"
        />
      </svg>
    </div>
  )
}
