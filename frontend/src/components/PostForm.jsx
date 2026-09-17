import { useState } from "react";
import LocationPicker from "./LocationPicker";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const EMPTY_LOCATION = { latitude: null, longitude: null, address: "" };

function PostForm({ onSubmit }) {
  const [mode, setMode] = useState("upload");
  const [files, setFiles] = useState([]);
  const [caption, setCaption] = useState("");
  const [visible, setVisible] = useState(false);
  const [location, setLocation] = useState(EMPTY_LOCATION);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleFiles = (fileList) => {
    const selected = Array.from(fileList);
    const invalid = selected.find((file) => !ALLOWED_TYPES.includes(file.type));

    if (invalid) {
      setError(
        `Formato non supportato per "${invalid.name}": sono ammessi solo JPG, PNG o WEBP`
      );
      setFiles([]);
      return;
    }

    setError("");
    setFiles(selected);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setFiles([]);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      setError("Allega almeno una foto");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await onSubmit({ caption, visible, location, files });

      setFiles([]);
      setCaption("");
      setVisible(false);
      setLocation(EMPTY_LOCATION);
    } catch (err) {
      setError(err.message || "Impossibile pubblicare il post");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="photo-form post-form" onSubmit={handleSubmit}>
      <div className="mode-toggle">
        <button
          type="button"
          className={mode === "upload" ? "nav-active" : ""}
          onClick={() => switchMode("upload")}
        >
          Carica foto
        </button>

        <button
          type="button"
          className={mode === "camera" ? "nav-active" : ""}
          onClick={() => switchMode("camera")}
        >
          Scatta foto
        </button>
      </div>

      {mode === "upload" ? (
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
        />
      ) : (
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => handleFiles(e.target.files)}
        />
      )}

      {files.length > 0 && (
        <div className="file-previews">
          {files.map((file, index) => (
            <img key={index} src={URL.createObjectURL(file)} alt={file.name} />
          ))}
        </div>
      )}

      <input
        type="text"
        placeholder="Didascalia"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        required
      />

      <label className="visibility-option">
        <input
          type="checkbox"
          checked={visible}
          onChange={(e) => setVisible(e.target.checked)}
        />
        <span>Rendi questo post pubblico</span>
      </label>

      <LocationPicker
        latitude={location.latitude}
        longitude={location.longitude}
        address={location.address}
        onChange={setLocation}
      />

      {error && <p className="message">{error}</p>}

      <button type="submit" className="primary-button" disabled={submitting}>
        {submitting ? "Pubblicazione..." : "Pubblica"}
      </button>
    </form>
  );
}

export default PostForm;
