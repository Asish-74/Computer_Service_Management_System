import "../assets/css/components/loader.css";

export default function Loader({
  size = "md",
  text = "Loading...",
  fullScreen = false,
}) {
  return (
    <div
      className={`loader-wrapper ${
        fullScreen ? "loader-fullscreen" : ""
      }`}
    >
      <div className={`loader-spinner ${size}`}></div>

      {text && <p className="loader-text">{text}</p>}
    </div>
  );
}