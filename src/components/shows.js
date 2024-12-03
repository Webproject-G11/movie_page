import { useEffect, useState } from "react";
import './shows.css';
import { Link, useNavigate, useLocation } from "react-router-dom"; 

function Shows() {
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [showings, setShowings] = useState([]);
  const [logoutMessage, setLogoutMessage] = useState("");  // Viestin tila

  const navigate = useNavigate();
  const location = useLocation(); // Käytämme locationia viestin näyttämiseen
  
  const handleLogout = () => {
    // Poistetaan tarvittavat tiedot localStorage ja sessionStorage:sta
    localStorage.removeItem("authToken");
    sessionStorage.clear();
  
    // Navigoidaan etusivulle ja välitetään state parametreina
    navigate("/", { state: { fromLogout: true } });
  };

  const getFinnkinoTheaters = (xml) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "application/xml");
    const root = xmlDoc.children;
    const theatres = root[0].children;
    const tempAreas = [];

    for (let i = 0; i < theatres.length; i++) {
      tempAreas.push({
        id: theatres[i].children[0].innerHTML,
        name: theatres[i].children[1].innerHTML,
      });
    }

    setAreas(tempAreas);
  };

  const getShowings = (areaId) => {
    if (!areaId) return;

    fetch(`https://www.finnkino.fi/xml/Schedule/?area=${areaId}`)
      .then((response) => response.text())
      .then((xml) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, "application/xml");
        const showingsList = xmlDoc.getElementsByTagName("Show");

        const showingsArray = [];
        for (let i = 0; i < showingsList.length; i++) {
          const startTime = showingsList[i].getElementsByTagName("dttmShowStart")[0].textContent;

          // Muunna ISO-aika (UTC) suomalaiseen muotoon
          const formattedTime = formatDateTime(startTime);

          showingsArray.push({
            movieTitle: showingsList[i].getElementsByTagName("Title")[0].textContent,
            startTime: formattedTime,
          });
        }

        setShowings(showingsArray);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('fi-FI', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date).replace(' ', ' klo ');  // Muotoillaan aika
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (location.state && location.state.fromLogout) {
      setLogoutMessage("You have successfully logged out.");
    } else {
      setLogoutMessage(""); // Tyhjennetään viesti, jos ei ole uloskirjautunut
    }
  }, [location]);

  // Varmistetaan, että viesti poistuu 5 sekunnin kuluttua
  useEffect(() => {
    if (logoutMessage) {
      const timer = setTimeout(() => {
        setLogoutMessage(""); // Tyhjennetään viesti
      }, 5000);
      return () => clearTimeout(timer); // Puhdistetaan timer
    }
  }, [logoutMessage]);

  useEffect(() => {
    fetch("https://www.finnkino.fi/xml/TheatreAreas/")
      .then((response) => response.text())
      .then((xml) => {
        getFinnkinoTheaters(xml);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (selectedArea) {
      getShowings(selectedArea);
    } else {
      setShowings([]);
    }
  }, [selectedArea]);

  return (
    <div>
      {/* Näytetään uloskirjautumisviesti */}
      {logoutMessage && <div className="logout-message">{logoutMessage}</div>}

      <header className="Profile-header">
        <h1>The best movie page</h1>
      </header>

      <nav className="Profile-nav">
        <Link to="/search">
          <button className="nav-button">Search movies</button>
        </Link>
        <Link to="/profile">
          <button className="nav-button">Profile</button>
        </Link>
        <button className="nav-button" onClick={handleLogout}>
          Log out
        </button>
      </nav>

      <h3>Select a Theatre Area</h3>
      <select onChange={(e) => setSelectedArea(e.target.value)} value={selectedArea}>
        <option value="">-- Select Theatre Area --</option>
        {areas.map((area) => (
          <option key={area.id} value={area.id}>
            {area.name}
          </option>
        ))}
      </select>

      {selectedArea && showings.length > 0 && (
        <div>
          <section className="ajat">
            <h3>Showings in selected theatre:</h3>
            <ul>
              {showings.map((show, index) => (
                <li key={index}>
                  {show.movieTitle} - {show.startTime}
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}

      {selectedArea && showings.length === 0 && (
        <p>No showings available for this area.</p>
      )}
    </div>
  );
}

export default Shows;