import { DateTime } from "luxon"

import {
  AlbumTracks,
  ArtistAlbums,
  Device,
  Playback,
  SearchResponse,
} from "../src/shared/spotifyType"

import config from "../env.json"
import { playlist } from "./playlist"
import { playback } from "./playback"
import { broadcastPlaylist } from "./server"

const client_id = config.spotify.clientId
const client_secret = config.spotify.clientSecret

class Spotify {
  private static instance: Spotify | undefined
  private refreshToken: string = config.spotify.refreshToken
  private accessToken: string | undefined
  private tokenCreatedAt: DateTime | undefined = undefined
  TOKEN_DURATION: number = 3600
  TRACK_ADDED_BEFORE_MS = 120000
  private playbackTimeout?: NodeJS.Timeout

  constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new Spotify()
    }
    return this.instance
  }

  private tokenIsValid() {
    return (
      this.accessToken &&
      this.tokenCreatedAt &&
      this.tokenCreatedAt.plus({ seconds: this.TOKEN_DURATION - 10 }) >
        DateTime.now()
    )
  }

  async initialise() {
    if (!this.tokenIsValid()) {
      await this.refreshAccessToken()
    }
  }

  async refreshAccessToken() {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(client_id + ":" + client_secret).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: this.refreshToken,
      }),
    })

    if (response.status !== 200) {
      throw new Error("Can't refresh spotify token")
    }

    const data = await response.json()

    this.accessToken = data.access_token
    this.tokenCreatedAt = DateTime.now()

    //TODO : re-call this function in 3500 sec -> TOKEN_DURATION - 100
  }

  private async fetch<T>(
    path: string,
    params: RequestInit
  ): Promise<T | undefined> {
    await this.initialise()

    if (!params.headers) {
      params.headers = new Headers()
    }

    //@ts-ignore 2339
    params.headers.set("Authorization", `Bearer ${this.accessToken}`)

    const response = await fetch("https://api.spotify.com/v1" + path, params)

    if (!response.ok) {
      const content = await response.text()
      throw new Error(
        `Can't query spotify data for ${path} | ${response.status} | ${content}`
      )
    }

    const contentType = response.headers.get("content-type")
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const data = await response.json()
      return data
    }

    return
  }

  async search(query: string): Promise<SearchResponse> {
    const data = await this.fetch<SearchResponse>(
      "/search?" +
        new URLSearchParams({
          q: query,
          type: ["artist", "album", "track"].join(),
        }),
      { method: "GET" }
    )
    if (!data) {
      throw new Error("data not found")
    }
    return data
  }

  async getArtistAlbums(artistId: string): Promise<ArtistAlbums> {
    const data = await this.fetch<ArtistAlbums>(`/artists/${artistId}/albums`, {
      method: "GET",
    })
    if (!data) {
      throw new Error("data not found")
    }
    return data
  }

  async getAlbumTracks(albumId: string): Promise<AlbumTracks> {
    const data = await this.fetch<AlbumTracks>(`/albums/${albumId}/tracks`, {
      method: "GET",
    })
    if (!data) {
      throw new Error("data not found")
    }
    return data
  }

  async getDevices(): Promise<{ devices: Device[] }> {
    const data = await this.fetch<{ devices: Device[] }>(`/me/player/devices`, {
      method: "GET",
    })
    if (!data) {
      throw new Error("data not found")
    }
    return data
  }

  async setDevice(deviceId: string): Promise<void> {
    await this.fetch<{}>(`/me/player`, {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({ device_ids: [deviceId], play: false }),
    })
    return
  }

  async startPlayback(): Promise<void> {
    const playlistItem = playlist.shift()
    await this.fetch<{}>(`/me/player/play`, {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        uris: [`spotify:track:${playlistItem.track.id}`],
        position_ms: 0,
      }),
    })
    this.playbackTimeout = setTimeout(
      () => this.addTrack(),
      playlistItem.track.duration_ms - this.TRACK_ADDED_BEFORE_MS
    )
    broadcastPlaylist()
    playback.refreshPlaybackIn(1000)
    return
  }

  async pausePlayback(): Promise<void> {
    if (this.playbackTimeout) {
      clearTimeout(this.playbackTimeout)
    }
    await this.fetch<{}>(`/me/player/pause`, {
      method: "PUT",
    })
    return
  }

  async getPlayback(): Promise<Playback> {
    const data = await this.fetch<Playback>(`/me/player`, {
      method: "GET",
    })
    if (!data) {
      throw new Error("data not found")
    }
    return data
  }

  async addTrack(): Promise<void> {
    // add the track to spotify
    playlist.lockFirstItem()
    const items = playlist.getItems(1)
    if (items.length !== 1) {
      throw new Error("No items in the playlist")
    }
    this.fetch<{}>(
      `/me/player/queue?` +
        new URLSearchParams({
          uri: `spotify:track:${items[0].track.id}`,
        }),
      {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      }
    )
    // set a timeout to shift the playlist in x MS
    const currentState = await playback.getCurrentPlayback()
    const trackStartedAt = DateTime.fromMillis(
      currentState.timestamp - currentState.progress_ms
    )
    const trackEndInMs =
      currentState.item.duration_ms -
      DateTime.now().diff(trackStartedAt).milliseconds
    currentState.timestamp + currentState.progress_ms
    setTimeout(() => {
      playlist.shift()
      broadcastPlaylist()
    }, trackEndInMs)
    playback.refreshPlaybackIn(trackEndInMs + 1000)
    this.playbackTimeout = setTimeout(
      () => this.addTrack(),
      trackEndInMs + items[0].track.duration_ms - this.TRACK_ADDED_BEFORE_MS
    )
  }
}

export const spotify = Spotify.getInstance()
