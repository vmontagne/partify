export enum searchType {
  artist = "artist",
  album = "album",
  track = "track",
}

type PaginatedData<T> = {
  offset: number
  total: number
  items: T[]
}

type Image = {
  url: string
  height: number
  width: number
}

export type Artist = {
  name: string
  id: string
  image?: string
  images?: Image[]
}

export type Album = {
  id: string
  name: string
  image?: string
  images?: Image[]
  artists: Artist[]
}

export type Track = {
  album?: Album
  image?: string
  images?: Image[]
  artists: Artist[]
  id: string
  name: string
  duration_ms: number
}

export type SearchResponse = {
  tracks: PaginatedData<Track>
  artists: PaginatedData<Artist>
  albums: PaginatedData<Album>
}

export type Playlist = {
  id: string
  name: string
}

export type PlaylistTrack = {
  track: Track
}

export type Playlists = PaginatedData<Playlist>

export type ArtistAlbums = PaginatedData<Album>

export type AlbumTracks = PaginatedData<Track>

export type PlaylistTracks = PaginatedData<PlaylistTrack>

export type Device = {
  id: string
  is_active: boolean
  name: string
  type: string
}

export type Playback = {
  timestamp: number
  progress_ms: number
  is_playing: boolean
  item: Track
}
