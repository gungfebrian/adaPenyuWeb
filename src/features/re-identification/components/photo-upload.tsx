export function PhotoUpload() {
  return (
    <section className="panel" aria-labelledby="photo-upload-heading">
      <h2 id="photo-upload-heading">Turtle photo</h2>
      <p id="photo-upload-help">Photo upload will be connected in a later phase.</p>
      <label htmlFor="turtle-photo">Choose a photo</label>
      <input
        id="turtle-photo"
        type="file"
        accept="image/jpeg,image/png"
        aria-describedby="photo-upload-help"
        disabled
      />
    </section>
  );
}
