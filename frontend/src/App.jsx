import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8080";

function App() {
  const [page, setPage] = useState("login");
  const [section, setSection] = useState("home");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [token, setToken] = useState(
    localStorage.getItem("token") || ""
  );

  const [user, setUser] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [publicPhotos, setPublicPhotos] = useState([]);

  const [photoUrl, setPhotoUrl] = useState("");
  const [photoTitle, setPhotoTitle] = useState("");
  const [photoVisible, setPhotoVisible] = useState(false);

  const [editingPhoto, setEditingPhoto] = useState(null);

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (token) {
      loadProfile(token)
        .then(() => {
          loadPhotos(token);
          loadPublicPhotos(token);
          setPage("dashboard");
        })
        .catch(() => {
          handleLogout();
        });
    }
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registrazione non riuscita");
      }

      setMessage("Registrazione completata! Ora puoi accedere.");
      setUsername("");
      setEmail("");
      setPassword("");
      setPage("login");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.text();

      if (!response.ok) {
        throw new Error("Username o password non corretti");
      }

      localStorage.setItem("token", data);
      setToken(data);

      await loadProfile(data);
      await loadPhotos(data);
      await loadPublicPhotos(data);

      setUsername("");
      setPassword("");
      setPage("dashboard");
      setSection("home");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const loadProfile = async (jwt = token) => {
    const response = await fetch(`${API_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!response.ok) {
      throw new Error("Impossibile recuperare il profilo");
    }

    const data = await response.json();
    setUser(data);
  };

  const loadPhotos = async (jwt = token) => {
    const response = await fetch(`${API_URL}/api/photos`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!response.ok) {
      throw new Error("Impossibile recuperare le foto");
    }

    const data = await response.json();
    setPhotos(data);
  };

  const loadPublicPhotos = async (jwt = token) => {
    const response = await fetch(`${API_URL}/api/photos/public`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!response.ok) {
      throw new Error("Impossibile recuperare i post pubblici");
    }

    const data = await response.json();
    setPublicPhotos(data);
  };

  const handleCreatePhoto = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/photos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          url: photoUrl,
          title: photoTitle,
          visible: photoVisible,
        }),
      });

      if (!response.ok) {
        throw new Error("Impossibile aggiungere la foto");
      }

      setPhotoUrl("");
      setPhotoTitle("");
      setPhotoVisible(false);

      setMessage("Foto aggiunta!");

      await loadPhotos();
      await loadPublicPhotos();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const startEdit = (photo) => {
    setEditingPhoto(photo);

    setPhotoUrl(photo.url);
    setPhotoTitle(photo.title);
    setPhotoVisible(photo.visible);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const cancelEdit = () => {
    setEditingPhoto(null);
    setPhotoUrl("");
    setPhotoTitle("");
    setPhotoVisible(false);
    setMessage("");
  };

  const handleUpdatePhoto = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/photos/${editingPhoto.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            url: photoUrl,
            title: photoTitle,
            visible: photoVisible,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Impossibile modificare la foto");
      }

      setMessage("Foto modificata!");

      cancelEdit();

      await loadPhotos();
      await loadPublicPhotos();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleDeletePhoto = async (id) => {
    const confirmed = window.confirm(
      "Vuoi davvero eliminare questa foto?"
    );

    if (!confirmed) {
      return;
    }

    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/photos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Impossibile eliminare la foto");
      }

      setMessage("Foto eliminata!");

      await loadPhotos();
      await loadPublicPhotos();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");

    setToken("");
    setUser(null);
    setPhotos([]);
    setPublicPhotos([]);
    setPage("login");
    setSection("home");
    setMessage("");
  };

  if (page === "login") {
    return (
      <div className="app">
        <div className="auth-layout">
          <div className="intro-panel">
            <span className="brand">MOMENTI</span>

            <h1>
              Le tue storie,
              <br />
              senza rumore.
            </h1>

            <p>
              Uno spazio personale dove raccogliere immagini,
              ricordi e piccoli momenti da conservare.
            </p>

            <div className="decorative-shape shape-one"></div>
            <div className="decorative-shape shape-two"></div>
          </div>

          <div className="form-panel">
            <div className="form-box">
              <span className="eyebrow">BENTORNATO</span>

              <h2>Accedi al tuo spazio</h2>

              <p className="form-description">
                Inserisci le tue credenziali per continuare.
              </p>

              <form onSubmit={handleLogin}>
                <label>Username</label>

                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />

                <label>Password</label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button type="submit" className="primary-button">
                  Accedi
                </button>
              </form>

              {message && <p className="message">{message}</p>}

              <p className="switch-text">
                Non hai ancora un account?

                <button
                  className="text-button"
                  onClick={() => {
                    setPage("register");
                    setMessage("");
                  }}
                >
                  Registrati
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (page === "register") {
    return (
      <div className="app">
        <div className="auth-layout">
          <div className="intro-panel register-intro">
            <span className="brand">MOMENTI</span>

            <h1>
              Comincia
              <br />
              a raccogliere.
            </h1>

            <p>
              Crea il tuo spazio personale e conserva ciò
              che vuoi ricordare.
            </p>
          </div>

          <div className="form-panel">
            <div className="form-box">
              <span className="eyebrow">NUOVO ACCOUNT</span>

              <h2>Crea il tuo spazio</h2>

              <p className="form-description">
                Bastano pochi dati per iniziare.
              </p>

              <form onSubmit={handleRegister}>
                <label>Username</label>

                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />

                <label>Email</label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <label>Password</label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button type="submit" className="primary-button">
                  Crea account
                </button>
              </form>

              {message && <p className="message">{message}</p>}

              <p className="switch-text">
                Hai già un account?

                <button
                  className="text-button"
                  onClick={() => {
                    setPage("login");
                    setMessage("");
                  }}
                >
                  Accedi
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="topbar">
        <div className="brand dark">MOMENTI</div>

        <nav className="main-nav">
          <button
            className={section === "home" ? "nav-active" : ""}
            onClick={() => {
              setSection("home");
              setMessage("");
            }}
          >
            Home
          </button>

          <button
            className={section === "profile" ? "nav-active" : ""}
            onClick={() => {
              setSection("profile");
              setMessage("");
            }}
          >
            Il mio profilo
          </button>
        </nav>

        <div className="topbar-actions">
          <span className="welcome">
            Ciao, {user?.username}
          </span>

          <button onClick={handleLogout} className="logout-button">
            Esci
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        {section === "home" && (
          <>
            <section className="profile-header home-header">
              <div>
                <span className="eyebrow">HOME</span>

                <h1>Momenti da scoprire</h1>

                <p>
                  Guarda le immagini che gli altri hanno scelto
                  di condividere.
                </p>
              </div>
            </section>

            <section className="gallery-section">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">ESPLORA</span>

                  <h2>Post pubblici</h2>
                </div>

                <span className="photo-count">
                  {publicPhotos.length}{" "}
                  {publicPhotos.length === 1 ? "foto" : "foto"}
                </span>
              </div>

              {publicPhotos.length === 0 ? (
                <div className="empty-state">
                  <span>○</span>

                  <h3>Ancora nessun post pubblico</h3>

                  <p>
                    Quando qualcuno condividerà un momento,
                    apparirà qui.
                  </p>
                </div>
              ) : (
                <div className="gallery">
                  {publicPhotos.map((photo) => (
                    <article
                      className="photo-card"
                      key={photo.id}
                    >
                      <img
                        src={photo.url}
                        alt={photo.title}
                      />

                      <div className="photo-info">
                        <h3>{photo.title}</h3>

                        <span>Pubblica</span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {section === "profile" && (
          <>
            <section className="profile-header">
              <div className="profile-avatar">
                {user?.username?.charAt(0).toUpperCase()}
              </div>

              <div>
                <span className="eyebrow">
                  IL TUO SPAZIO
                </span>

                <h1>{user?.username}</h1>

                <p>{user?.email}</p>
              </div>
            </section>

            <section className="add-section">
              <div>
                <span className="eyebrow">
                  {editingPhoto
                    ? "MODIFICA MOMENTO"
                    : "NUOVO RICORDO"}
                </span>

                <h2>
                  {editingPhoto
                    ? "Modifica la foto"
                    : "Aggiungi una foto"}
                </h2>
              </div>

              <form
                onSubmit={
                  editingPhoto
                    ? handleUpdatePhoto
                    : handleCreatePhoto
                }
                className="photo-form"
              >
                <input
                  type="url"
                  placeholder="URL della foto"
                  value={photoUrl}
                  onChange={(e) =>
                    setPhotoUrl(e.target.value)
                  }
                  required
                />

                <input
                  type="text"
                  placeholder="Titolo"
                  value={photoTitle}
                  onChange={(e) =>
                    setPhotoTitle(e.target.value)
                  }
                  required
                />

                <button
                  type="submit"
                  className="primary-button"
                >
                  {editingPhoto
                    ? "Salva modifiche"
                    : "Aggiungi"}
                </button>
              </form>

              <label className="visibility-option">
                <input
                  type="checkbox"
                  checked={photoVisible}
                  onChange={(e) =>
                    setPhotoVisible(e.target.checked)
                  }
                />

                <span>
                  Rendi questo momento pubblico
                </span>
              </label>

              {editingPhoto && (
                <button
                  type="button"
                  className="cancel-button"
                  onClick={cancelEdit}
                >
                  Annulla modifica
                </button>
              )}

              {message && (
                <p className="message">{message}</p>
              )}
            </section>

            <section className="gallery-section">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">
                    RACCOLTA PERSONALE
                  </span>

                  <h2>I tuoi momenti</h2>
                </div>

                <span className="photo-count">
                  {photos.length}{" "}
                  {photos.length === 1 ? "foto" : "foto"}
                </span>
              </div>

              {photos.length === 0 ? (
                <div className="empty-state">
                  <span>○</span>

                  <h3>Ancora nessun momento</h3>

                  <p>
                    Aggiungi la tua prima foto per iniziare
                    la raccolta.
                  </p>
                </div>
              ) : (
                <div className="gallery">
                  {photos.map((photo) => (
                    <article
                      className="photo-card"
                      key={photo.id}
                    >
                      <img
                        src={photo.url}
                        alt={photo.title}
                      />

                      <div className="photo-info">
                        <h3>{photo.title}</h3>

                        <span>
                          {photo.visible
                            ? "Pubblica"
                            : "Privata"}
                        </span>

                        <div className="photo-actions">
                          <button
                            onClick={() =>
                              startEdit(photo)
                            }
                            className="edit-button"
                          >
                            Modifica
                          </button>

                          <button
                            onClick={() =>
                              handleDeletePhoto(photo.id)
                            }
                            className="delete-button"
                          >
                            Elimina
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
