import React from 'react';

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  file: string;
  image?: string;
}

interface PlaylistProps {
  songs: Song[];
  onSelect: (song: Song) => void | Promise<void>;
}

const Playlist: React.FC<PlaylistProps> = ({ songs, onSelect }) => {
  return (
    <div className="playlist bg-gray-700 text-white p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Playlist</h2>
      <ul>
        {songs.map((song) => (
          <li key={song.id} className="mb-2 cursor-pointer hover:text-green-400" onClick={() => onSelect(song)}>
            {song.title} <span className="text-sm text-gray-400">({song.genre})</span>
            <div className="text-xs text-gray-400">{song.artist}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Playlist; 