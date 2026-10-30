# Social media images (not part of the website)

Finished post images for Instagram and Facebook. Metricool, our scheduling tool, needs a public link for every image, and the internal repo is private, so the approved images live here.

- This folder is **not deployed**: the "Collect site files" step in `.github/workflows/deploy.yml` leaves it out on purpose, so nothing here reaches length.club.
- Only images that are approved for posting go here. The sources (templates, captions, plans) stay in the private repo `aboutali/thelengthclub-internal`, under `social/`.
- Metricool links point to a fixed commit (`raw.githubusercontent.com/aboutali/thelengthclub/<commit>/media/<file>.png`) and Metricool copies each image when the post is scheduled. Don't rename or overwrite files here; add new ones instead.
- Photos come from Unsplash; credits are in `social/instagram/photos/CREDITS.md` in the internal repo.
