import { useState } from "react";
import "./App.css";
import "leaflet/dist/leaflet.css";
import PostForm from "./components/PostForm";
import LocationPicker from "./components/LocationPicker";

const API_URL = "http://localhost:8080";

const ALLOWED_DOCUMENT_TYPES = ["image/jpeg", "image/png", "image/webp"];

const EMPTY_LOCATION = { latitude: null, longitude: null, address: "" };

function formatLocation(item) {
  if (item.address) {
    return item.address;
  }

  if (item.latitude != null && item.longitude != null) {
    return `${item.latitude.toFixed(4)}, ${item.longitude.toFixed(4)}`;
  }

  return null;
}

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
  const [posts, setPosts] = useState([]);
  const [publicPosts, setPublicPosts] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [documentName, setDocumentName] = useState("");
  const [documentFile, setDocumentFile] = useState(null);

  const [editingPost, setEditingPost] = useState(null);
  const [editCaption, setEditCaption] = useState("");
  const [editVisible, setEditVisible] = useState(false);
  const [editLocation, setEditLocation] = useState(EMPTY_LOCATION);

  const [message, setMessage] = useState("");


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
      await loadPosts(data);
      await loadDocuments(data);
      await loadPublicPosts(data);

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

  const loadPosts = async (jwt = token) => {
    const response = await fetch(`${API_URL}/api/posts`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!response.ok) {
      throw new Error("Impossibile recuperare i post");
    }

    const data = await response.json();
    setPosts(data);
  };

  const loadDocuments = async (jwt = token) => {
    const response = await fetch(`${API_URL}/api/documents`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!response.ok) {
      throw new Error("Impossibile recuperare i documenti");
    }

    const data = await response.json();
    setDocuments(data);
  };

  const loadPublicPosts = async (jwt = token) => {
    const response = await fetch(`${API_URL}/api/posts/public`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!response.ok) {
      throw new Error("Impossibile recuperare i post pubblici");
    }

    const data = await response.json();
    setPublicPosts(data);
  };

  const handleCreatePost = async ({ caption, visible, location, files }) => {
    setMessage("");

    const formData = new FormData();

    formData.append(
      "data",
      new Blob(
        [
          JSON.stringify({
            caption,
            visible,
            latitude: location.latitude,
            longitude: location.longitude,
            address: location.address,
          }),
        ],
        { type: "application/json" }
      )
    );

    files.forEach((file) => formData.append("photos", file));

    const response = await fetch(`${API_URL}/api/posts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Impossibile pubblicare il post");
    }

    setMessage("Post pubblicato!");

    await loadPosts();
    await loadPublicPosts();
  };

  const startEditPost = (post) => {
    setEditingPost(post);
    setEditCaption(post.caption);
    setEditVisible(post.visible);
    setEditLocation({
      latitude: post.latitude,
      longitude: post.longitude,
      address: post.address || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const cancelEditPost = () => {
    setEditingPost(null);
    setMessage("");
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/posts/${editingPost.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            caption: editCaption,
            visible: editVisible,
            latitude: editLocation.latitude,
            longitude: editLocation.longitude,
            address: editLocation.address,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Impossibile modificare il post");
      }

      setMessage("Post modificato!");

      setEditingPost(null);

      await loadPosts();
      await loadPublicPosts();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleDeletePost = async (id) => {
    const confirmed = window.confirm(
      "Vuoi davvero eliminare questo post?"
    );

    if (!confirmed) {
      return;
    }

    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/posts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Impossibile eliminare il post");
      }

      setMessage("Post eliminato!");

      await loadPosts();
      await loadPublicPosts();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleDocumentFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
      setMessage("Formato non supportato: sono ammessi solo JPG, PNG o WEBP");
      setDocumentFile(null);
      return;
    }

    setMessage("");
    setDocumentFile(file);

    if (!documentName) {
      setDocumentName(file.name);
    }
  };

  const handleCreateDocument = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!documentFile) {
      setMessage("Seleziona un file da caricare");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", documentName);
      formData.append("file", documentFile);

      const response = await fetch(`${API_URL}/api/documents`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Impossibile aggiungere il documento");
      }

      setDocumentName("");
      setDocumentFile(null);
      setMessage("Documento aggiunto! Testo estratto tramite OCR.");

      await loadDocuments();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleDeleteDocument = async (id) => {
    const confirmed = window.confirm(
      "Vuoi davvero eliminare questo documento?"
    );

    if (!confirmed) {
      return;
    }

    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/documents/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Impossibile eliminare il documento");
      }

      setMessage("Documento eliminato!");

      await loadDocuments();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");

    setToken("");
    setUser(null);
    setPosts([]);
    setPublicPosts([]);
    setDocuments([]);
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
                  Guarda i post che gli altri hanno scelto
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
                  {publicPosts.length}{" "}
                  {publicPosts.length === 1 ? "post" : "post"}
                </span>
              </div>

              {publicPosts.length === 0 ? (
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
                  {publicPosts.map((post) => (
                    <article className="photo-card" key={post.id}>
                      <div className="post-photos-grid">
                        {post.photoUrls.map((url) => (
                          <img
                            key={url}
                            src={`${API_URL}${url}`}
                            alt={post.caption}
                          />
                        ))}
                      </div>

                      <div className="photo-info">
                        <h3>{post.caption}</h3>

                        <span>@{post.username}</span>

                        {formatLocation(post) && (
                          <p className="post-location">
                            📍 {formatLocation(post)}
                          </p>
                        )}
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
              {editingPost ? (
                <>
                  <div>
                    <span className="eyebrow">MODIFICA POST</span>
                    <h2>Modifica il post</h2>
                  </div>

                  <form onSubmit={handleUpdatePost} className="photo-form post-form">
                    <input
                      type="text"
                      placeholder="Didascalia"
                      value={editCaption}
                      onChange={(e) => setEditCaption(e.target.value)}
                      required
                    />

                    <label className="visibility-option">
                      <input
                        type="checkbox"
                        checked={editVisible}
                        onChange={(e) => setEditVisible(e.target.checked)}
                      />
                      <span>Rendi questo post pubblico</span>
                    </label>

                    <LocationPicker
                      latitude={editLocation.latitude}
                      longitude={editLocation.longitude}
                      address={editLocation.address}
                      onChange={setEditLocation}
                    />

                    <button type="submit" className="primary-button">
                      Salva modifiche
                    </button>

                    <button
                      type="button"
                      className="cancel-button"
                      onClick={cancelEditPost}
                    >
                      Annulla modifica
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <div>
                    <span className="eyebrow">NUOVO RICORDO</span>
                    <h2>Crea un post</h2>
                  </div>

                  <PostForm onSubmit={handleCreatePost} />
                </>
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

                  <h2>I tuoi post</h2>
                </div>

                <span className="photo-count">
                  {posts.length}{" "}
                  {posts.length === 1 ? "post" : "post"}
                </span>
              </div>

              {posts.length === 0 ? (
                <div className="empty-state">
                  <span>○</span>

                  <h3>Ancora nessun post</h3>

                  <p>
                    Crea il tuo primo post per iniziare
                    la raccolta.
                  </p>
                </div>
              ) : (
                <div className="gallery">
                  {posts.map((post) => (
                    <article className="photo-card" key={post.id}>
                      <div className="post-photos-grid">
                        {post.photoUrls.map((url) => (
                          <img
                            key={url}
                            src={`${API_URL}${url}`}
                            alt={post.caption}
                          />
                        ))}
                      </div>

                      <div className="photo-info">
                        <h3>{post.caption}</h3>

                        <span>
                          {post.visible ? "Pubblico" : "Privato"}
                        </span>

                        {formatLocation(post) && (
                          <p className="post-location">
                            📍 {formatLocation(post)}
                          </p>
                        )}

                        <div className="photo-actions">
                          <button
                            onClick={() => startEditPost(post)}
                            className="edit-button"
                          >
                            Modifica
                          </button>

                          <button
                            onClick={() => handleDeletePost(post.id)}
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
            <section className="documents-section">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">ARCHIVIO</span>
                  <h2>I tuoi documenti</h2>
                </div>

                <span className="photo-count">
                  {documents.length}{" "}
                  {documents.length === 1 ? "documento" : "documenti"}
                </span>
              </div>

              <form
                onSubmit={handleCreateDocument}
                className="document-form"
              >
                <input
                  type="text"
                  placeholder="Nome del documento"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  required
                />

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleDocumentFileChange}
                  required
                />

                <button
                  type="submit"
                  className="primary-button"
                >
                  Carica documento
                </button>
              </form>

              {documents.length === 0 ? (
                <div className="empty-state">
                  <span>□</span>
                  <h3>Nessun documento</h3>
                  <p>
                    Carica un documento: il testo verrà estratto
                    automaticamente tramite OCR.
                  </p>
                </div>
              ) : (
                <div className="documents-list">
                  {documents.map((document) => (
                    <article
                      className="document-card"
                      key={document.id}
                    >
                      <div className="document-icon">
                        DOC
                      </div>

                      <div className="document-info">
                        <h3>{document.name}</h3>

                        <a
                          href={`${API_URL}${document.fileUrl}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Apri documento
                        </a>

                        {document.extractedText && (
                          <p className="extracted-text">
                            {document.extractedText}
                          </p>
                        )}

                        <button
                          onClick={() => handleDeleteDocument(document.id)}
                          className="delete-button"
                        >
                          Elimina
                        </button>
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
