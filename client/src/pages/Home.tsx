import "../css/Home.css";
import businessMan from "../assets/Images/businessman.webp"; // Import your image

export default function Home(): JSX.Element {
  return (
    <div className="overall-container">
      <div className="home-container">
        <div className="text-container">
          <h1 className="h1-heading">
            Unlock your full <br />
            <span className="potential">POTENTIAL</span> <br />
            with E-Z Banking.
          </h1>
          <p className="body-text">
            E-Z Banking is a free, easy-to-use, secure, and reliable online
            banking platform that allows you to manage your finances from the
            comfort of your home.
          </p>
        </div>
        <div className="image-container">
          <img
            src={businessMan}
            alt="Business Man"
            className="business-image"
          />
        </div>
      </div>
    </div>
  );
}
