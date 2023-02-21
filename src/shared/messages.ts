import { User, PlaylistItem } from "./common"
import { AlbumTracks, ArtistAlbums, SearchResponse, Track } from "./spotifyType"

export enum messageType {
  GET_UUID = "GET_UUID",
  SET_UUID = "SET_UUID",
  REASSIGN_UUID_REQUEST = "REASSIGN_UUID_REQUEST",
  REASSIGN_UUID_RESPONSE = "REASSIGN_UUID_RESPONSE",
  GET_SONG_LIST_REQUEST = "GET_SONG_LIST_REQUEST",
  GET_SONG_LIST_RESPONSE = "GET_SONG_LIST_RESPONSE",
  ADD_SONG_REQUEST = "ADD_SONG_REQUEST",
  SEARCH_REQUEST = "SEARCH_REQUEST",
  SEARCH_RESPONSE = "SEARCH_RESPONSE",
  GET_ARTIST_ALBUMS_REQUEST = "GET_ARTIST_ALBUMS_REQUEST",
  GET_ARTIST_ALBUMS_RESPONSE = "GET_ARTIST_ALBUMS_RESPONSE",
  GET_ALBUM_TRACKS_REQUEST = "GET_ALBUM_TRACKS_REQUEST",
  GET_ALBUM_TRACKS_RESPONSE = "GET_ALBUM_TRACKS_RESPONSE",
  GET_PLAYLIST_DATA = "PLAYLIST_DATA",
  PLAYLIST_DATA = "PLAYLIST_DATA",
  ADMIN_SET_DEVICE = "ADMIN_SET_DEVICE",
  ADMIN_DEVICE = "ADMIN_DEVICE",
}

export interface GetUuidMessage {
  type: messageType.GET_UUID
}

export interface SetUuidMessage {
  type: messageType.SET_UUID
  uuid: string
}

export interface ReassignUuidRequestMessage {
  type: messageType.REASSIGN_UUID_REQUEST
  uuid: string
  name: string
}

export interface ReassignUuidResponseMessage {
  type: messageType.REASSIGN_UUID_RESPONSE
  user: User
}

export interface SearchRequestMessage {
  type: messageType.SEARCH_REQUEST
  query: string
}

export interface SearchResponseMessage {
  type: messageType.SEARCH_RESPONSE
  tracks: SearchResponse["tracks"]
  albums: SearchResponse["albums"]
  artists: SearchResponse["artists"]
}

export interface GetArtistAlbumsRequestMessage {
  type: messageType.GET_ARTIST_ALBUMS_REQUEST
  artistId: string
}

export interface GetArtistAlbumsResponseMessage {
  type: messageType.GET_ARTIST_ALBUMS_RESPONSE
  albums: ArtistAlbums
}

export interface GetAlbumTracksRequestMessage {
  type: messageType.GET_ALBUM_TRACKS_REQUEST
  albumId: string
}

export interface GetAlbumTracksResponseMessage {
  type: messageType.GET_ALBUM_TRACKS_RESPONSE
  tracks: AlbumTracks
}

export interface AddSongRequestMessage {
  type: messageType.ADD_SONG_REQUEST
  track: Track
}

export interface GetPlaylistDataMessage {
  type: messageType.GET_PLAYLIST_DATA
}

export interface PlaylistDataMessage {
  type: messageType.PLAYLIST_DATA
  items: PlaylistItem[]
}

export type Message =
  | GetUuidMessage
  | SetUuidMessage
  | ReassignUuidRequestMessage
  | ReassignUuidResponseMessage
  | SearchRequestMessage
  | SearchResponseMessage
  | GetArtistAlbumsRequestMessage
  | GetArtistAlbumsResponseMessage
  | GetAlbumTracksRequestMessage
  | GetAlbumTracksResponseMessage
  | AddSongRequestMessage
  | PlaylistDataMessage
