# 🎵 Music Directory

Add your MP3 files here!

## How to add music to the Winamp player

1. Place your MP3 files in this directory (`public/music/`)
2. Update the `tracks` array in `src/script.js`:

```javascript
this.tracks = [
  { title: '🎵 My Song 1 - Artist Name', src: 'music/your-file-1.mp3' },
  { title: '🎵 My Song 2 - Artist Name', src: 'music/your-file-2.mp3' },
  // Add more tracks...
];
```

## Notes

- The Winamp player supports standard MP3 files
- Keep file names simple (no special characters or spaces recommended)
- The visualizer will animate when music plays
- Shuffle and repeat features are available

## Demo Tracks

Currently the player has demo track names. Replace them with your own music!
