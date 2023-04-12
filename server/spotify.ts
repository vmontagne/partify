import { DateTime } from "luxon"

import {
  AlbumTracks,
  ArtistAlbums,
  Device,
  Playback,
  Playlists,
  PlaylistTracks,
  SearchResponse,
} from "../src/shared/spotifyType"

import config from "../env.json"

const client_id = config.spotify.clientId
const client_secret = config.spotify.clientSecret

export const SPOTIFY_API_LAG_MS = 5000

class Spotify {
  private static instance: Spotify | undefined
  private refreshToken: string = config.spotify.refreshToken
  private accessToken: string | undefined
  private tokenCreatedAt: DateTime | undefined = undefined
  TOKEN_DURATION: number = 3600

  constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new Spotify()
      this.instance.refreshAccessToken()
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

    setTimeout(
      () => this.refreshAccessToken(),
      (this.TOKEN_DURATION - 100) * 1000
    )
  }

  async fetch<T>(path: string, params: RequestInit): Promise<T | undefined> {
    await this.initialise()

    if (!params.headers) {
      params.headers = new Headers()
    }

    //@ts-ignore 2339
    params.headers.set("Authorization", `Bearer ${this.accessToken}`)

    console.log("call", path)

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

  async pausePlayback(): Promise<void> {
    await this.fetch<{}>(`/me/player/pause`, {
      method: "PUT",
    })
    return
  }

  async getPlayback(): Promise<Playback | undefined> {
    const data = await this.fetch<Playback>(`/me/player`, {
      method: "GET",
    })
    return data
  }

  async getPlaylists(): Promise<Playlists> {
    const data = await this.fetch<Playlists>(`/me/playlists`, {
      method: "GET",
    })
    if (!data) {
      throw new Error("data not found")
    }
    return data
  }

  async getPlaylistItems(id: string, offset = 0): Promise<PlaylistTracks> {
    const data = await this.fetch<PlaylistTracks>(`/playlists/${id}/tracks`, {
      method: "GET",
    })
    if (!data) {
      throw new Error("data not found")
    }
    return data
  }
}

export const spotify = Spotify.getInstance()
