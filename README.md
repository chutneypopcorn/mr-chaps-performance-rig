# Mr Chaps Performance Rig

## Show 3 — Bar Bombay, Sydney

A teleprompter and audio playback system for the "Mr Chaps' Dance Masterclass" live show.

## Adding Your Master Track

To embed your show audio so it plays automatically:

1. Export your pre-mixed show track as an MP3
2. Rename it to `show-mix.mp3`
3. Place it in the `public/` folder at the project root
4. Rebuild and redeploy

```bash
# Example: copy your track into the public folder
cp /path/to/your/track.mp3 public/show-mix.mp3

# Commit and push
git add public/show-mix.mp3
git commit -m "Add embedded master track"
git push origin main
```

The app will auto-detect the track on load. The START SHOW button will be enabled once the track is ready.

## File Size Notes

- GitHub has a 100MB file limit per file
- Netlify free tier has a 300MB total deploy limit
- A 20-25 minute MP3 at 192kbps is roughly 30-45MB — well within limits
- If your file is larger, consider reducing bitrate to 128kbps

## Media Embeds in Script

You can add images or videos to any script line. This is useful for costume references, choreography videos, or prop photos.

In `src/data/showData.ts`, add these optional fields to any script line:

```typescript
{
  speaker: 'NOTE',
  text: 'Costume reference for Kala Chashma',
  style: 'note',
  mediaUrl: 'https://your-image-url.jpg',   // or a local path like '/images/costume.jpg'
  mediaType: 'image',                        // or 'video'
  mediaCaption: 'The sequin jacket + sunglasses'
}
```

For video references:
```typescript
{
  speaker: 'NOTE',
  text: 'Hook step tutorial',
  style: 'note',
  mediaUrl: 'https://your-video-url.mp4',
  mediaType: 'video',
  mediaCaption: 'Practice this 3 times before show'
}
```

Place local media files in the `public/` folder (e.g., `public/images/photo.jpg`), then reference them as `/images/photo.jpg`.

## Editing the Script

All show content is in `src/data/showData.ts`. Edit the `script` arrays to change lines, stage directions, and notes.

| Style | Speaker | Use for |
|-------|---------|---------|
| `dialogue` | `MR CHAPS` | Spoken lines |
| `action` | `STAGE` | Stage directions |
| `music` | `STAGE` | Song cues |
| `note` | `NOTE` | Production notes |

## Locked-In Timestamps

The official section timings are set in `DEFAULT_SECTION_TIMESTAMPS` at the top of `showData.ts`. Update these to match your actual pre-mixed track, then commit and push. Everyone who visits the site will get these defaults.

Users can adjust timestamps locally in the Timeline tab, but those changes are session-only. The **Reset** button restores the official defaults.

## Controls

| Key | Action |
|-----|--------|
| `Space` | Start / Pause / Resume |
| `← →` | Previous / Next section |
| `F` | Fullscreen |
| `Esc` | Pause playback |

Click or tap the progress bar below the title to scrub through the track.

## Development

```bash
npm install
npm run dev     # localhost:3000
npm run build   # outputs to dist/
```
