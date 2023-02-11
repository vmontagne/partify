import { DateTime } from "luxon"

import {
  AlbumTracks,
  ArtistAlbums,
  SearchResponse,
} from "../shared/spotifyType"

import config from "../env.json"

const client_id = config.spotify.clientId
const client_secret = config.spotify.clientSecret

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

  private async fetch<T>(path: string, params: RequestInit): Promise<T> {
    await this.initialise()

    if (!params.headers) {
      params.headers = new Headers()
    }

    //@ts-ignore 2339
    params.headers.set("Authorization", `Bearer ${this.accessToken}`)

    const response = await fetch("https://api.spotify.com/v1" + path, params)

    if (response.status !== 200) {
      throw new Error("Can't query spotify data")
    }

    const data = await response.json()

    return data
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
    return data
  }

  async getArtistAlbums(artistId: string): Promise<ArtistAlbums> {
    const data = await this.fetch<ArtistAlbums>(`/artists/${artistId}/albums`, {
      method: "GET",
    })
    return data
  }

  async getAlbumTracks(albumId: string): Promise<AlbumTracks> {
    const data = await this.fetch<AlbumTracks>(`/albums/${albumId}/tracks`, {
      method: "GET",
    })
    return data
  }
}

export const spotify = Spotify.getInstance()
