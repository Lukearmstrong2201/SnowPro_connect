export default function ObjectiveCard({ title, image, text, className }) {
  return (
    <div className={`objective-box ${className}`}>
      <div className="content-wrapper">
        <h3>{title}</h3>
        <img src={image} alt={title} />
        <div className="text-container">
          <p>{text}</p>
        </div>
      </div>
    </div>
  );
}
