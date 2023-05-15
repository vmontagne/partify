import { User, PlaylistItem } from "./common"
import {
  AlbumTracks,
  ArtistAlbums,
  Device,
  Playback,
  SearchResponse,
  Track,
  Playlists,
} from "./spotifyType"

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
  GET_PLAYLIST_DATA = "GET_PLAYLIST_DATA",
  PLAYLIST_DATA = "PLAYLIST_DATA",
  ADMIN_SET_DEVICE_REQUEST = "ADMIN_SET_DEVICE_REQUEST",
  ADMIN_SET_DEVICE_RESPONSE = "ADMIN_SET_DEVICE_RESPONSE",
  ADMIN_GET_DEVICES_REQUEST = "ADMIN_GET_DEVICES_REQUEST",
  ADMIN_GET_DEVICES_RESPONSE = "ADMIN_GET_DEVICES_RESPONSE",
  ADMIN_START_PLAYBACK_REQUEST = "ADMIN_START_PLAYBACK_REQUEST",
  ADMIN_START_PLAYBACK_RESPONSE = "ADMIN_START_PLAYBACK_RESPONSE",
  ADMIN_PAUSE_PLAYBACK_REQUEST = "ADMIN_PAUSE_PLAYBACK_REQUEST",
  ADMIN_PAUSE_PLAYBACK_RESPONSE = "ADMIN_PAUSE_PLAYBACK_RESPONSE",
  GET_PLAYBACK_STATE = "GET_PLAYBACK_STATE",
  PLAYBACK_STATE = "PLAYBACK_STATE",
  ADMIN_GET_PLAYLISTS = "ADMIN_GET_PLAYLISTS",
  ADMIN_PLAYLISTS_RESPONSE = "ADMIN_PLAYLISTS_RESPONSE",
  ADMIN_ADD_PLAYLIST = "ADMIN_ADD_PLAYLIST",
  ADMIN_ADD_PLAYLIST_RESPONSE = "ADMIN_ADD_PLAYLIST_RESPONSE",
  ADMIN_LOGIN = "ADMIN_LOGIN",
  GO_TO_NEXT_MUSIC = "GO_TO_NEXT_MUSIC",
  DELETE_TRACK = "DELETE_TRACK",
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

export interface AdminSetDeviceRequestMessage {
  type: messageType.ADMIN_SET_DEVICE_REQUEST
  deviceId: string
}

export interface AdminSetDeviceResponseMessage {
  type: messageType.ADMIN_SET_DEVICE_RESPONSE
  ok: boolean
  message?: string
}

export interface AdminGetDevicesRequestMessage {
  type: messageType.ADMIN_GET_DEVICES_REQUEST
}

export interface AdminGetDevicesResponseMessage {
  type: messageType.ADMIN_GET_DEVICES_RESPONSE
  devices: Device[]
}

export interface AdminStartPlaybackRequestMessage {
  type: messageType.ADMIN_START_PLAYBACK_REQUEST
}

export interface AdminStartPlaybackResponseMessage {
  type: messageType.ADMIN_START_PLAYBACK_RESPONSE
  ok: boolean
  message?: string
}

export interface AdminPausePlaybackRequestMessage {
  type: messageType.ADMIN_PAUSE_PLAYBACK_REQUEST
}

export interface AdminPausePlaybackResponseMessage {
  type: messageType.ADMIN_PAUSE_PLAYBACK_RESPONSE
  ok: boolean
  message?: string
}

export interface GetPlaybackStateMessage {
  type: messageType.GET_PLAYBACK_STATE
}

export interface PlaybackStateMessage {
  type: messageType.PLAYBACK_STATE
  playback: Playback
}

export interface AdminGetPlaylistsMessage {
  type: messageType.ADMIN_GET_PLAYLISTS
}

export interface AdminPlaylistsResponseMessage {
  type: messageType.ADMIN_PLAYLISTS_RESPONSE
  playlists: Playlists
}

export interface AdminAddPlaylistMessage {
  type: messageType.ADMIN_ADD_PLAYLIST
  playlistId: string
}

export interface AdminAddPlaylistResponseMessage {
  type: messageType.ADMIN_ADD_PLAYLIST_RESPONSE
  ok: boolean
  message?: string
}

export interface AdminLoginMessage {
  type: messageType.ADMIN_LOGIN
  code: string
}

export interface GoToNextMusicMessage {
  type: messageType.GO_TO_NEXT_MUSIC
}

export interface DeleteTrackMessage {
  type: messageType.DELETE_TRACK
  id: string
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
  | GetPlaylistDataMessage
  | PlaylistDataMessage
  | AdminSetDeviceRequestMessage
  | AdminSetDeviceResponseMessage
  | AdminGetDevicesRequestMessage
  | AdminGetDevicesResponseMessage
  | AdminStartPlaybackRequestMessage
  | AdminStartPlaybackResponseMessage
  | AdminPausePlaybackRequestMessage
  | AdminPausePlaybackResponseMessage
  | GetPlaybackStateMessage
  | PlaybackStateMessage
  | AdminGetPlaylistsMessage
  | AdminPlaylistsResponseMessage
  | AdminAddPlaylistMessage
  | AdminAddPlaylistResponseMessage
  | AdminLoginMessage
  | GoToNextMusicMessage
  | DeleteTrackMessage
