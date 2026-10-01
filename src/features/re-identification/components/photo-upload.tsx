export function PhotoUpload() {
  return (
    <section className="rounded-lg border border-foreground/20 bg-background p-5" aria-labelledby="photo-upload-heading">
      <h2 id="photo-upload-heading">Turtle photo</h2>
      <p id="photo-upload-help">Photo upload will be connected in a later phase.</p>
      <label htmlFor="turtle-photo">Choose a photo</label>
      <input
        className="mt-3 block max-w-full focus-visible:outline-solid focus-visible:outline-3 focus-visible:outline-current focus-visible:outline-offset-4"
        id="turtle-photo"
        type="file"
        accept="image/jpeg,image/png"
        aria-describedby="photo-upload-help"
        disabled
      />
    </section>
  );
}
