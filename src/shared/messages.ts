import { AlbumTracks, ArtistAlbums, SearchResponse } from "./spotifyType"

export enum messageType {
  GET_UUID = "GET_UUID",
  SET_UUID = "SET_UUID",
  UP_VOTE = "UP_VOTE",
  SONG_LIST = "SONG_LIST",
  ADD_SONG = "ADD_SONG",
  SEARCH_REQUEST = "SEARCH_REQUEST",
  SEARCH_RESPONSE = "SEARCH_RESPONSE",
  GET_ARTIST_ALBUMS_REQUEST = "GET_ARTIST_ALBUMS_REQUEST",
  GET_ARTIST_ALBUMS_RESPONSE = "GET_ARTIST_ALBUMS_RESPONSE",
  GET_ALBUM_TRACKS_REQUEST = "GET_ALBUM_TRACKS_REQUEST",
  GET_ALBUM_TRACKS_RESPONSE = "GET_ALBUM_TRACKS_RESPONSE",
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

export type Message =
  | GetUuidMessage
  | SetUuidMessage
  | SearchRequestMessage
  | SearchResponseMessage
  | GetArtistAlbumsRequestMessage
  | GetArtistAlbumsResponseMessage
  | GetAlbumTracksRequestMessage
  | GetAlbumTracksResponseMessage
