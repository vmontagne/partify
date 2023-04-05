import { spotify } from "./spotify"
import { Playback as PlaybackType } from "../src/shared/spotifyType"
import { DateTime } from "luxon"
import { broadcastPlayback } from "./server"

const SPOTIFY_API_LAG_MS = 5000

class Playback {
  private lastRefresh: DateTime
  private static instance?: Playback
  private state?: PlaybackType
  private refreshStateTimeout?: NodeJS.Timeout
  private isLoading?: Promise<PlaybackType | void>

  constructor() {
    this.lastRefresh = DateTime.now().minus({
      milliseconds: SPOTIFY_API_LAG_MS,
    })
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Playback()
    }
    return this.instance
  }

  refreshPlayback = async (): Promise<PlaybackType | void> => {
    this.isLoading = new Promise<PlaybackType | void>(async (resolve) => {
      const data = await spotify.getPlayback()
      this.lastRefresh = DateTime.now()
      if (!data) {
        return resolve()
      }
      this.state = {
        timestamp: data.timestamp,
        progress_ms: data.progress_ms,
        is_playing: data.is_playing,
        item: {
          id: data.item.id,
          album: data.item.album
            ? {
                id: data.item.album?.id,
                name: data.item.album?.name,
                artists: [],
              }
            : undefined,
          artists: data.item.artists.map((artist) => ({
            id: artist.id,
            name: artist.name,
          })),
          name: data.item.name,
          duration_ms: data.item.duration_ms,
          image: data.item.album?.images?.sort((a, b) => b.width - a.width)[0]
            ?.url,
        },
      }
      resolve(data)
    })
    const data = await this.isLoading
    this.isLoading = undefined
    broadcastPlayback()
    return this.state
  }

  getCurrentPlayback = async (): Promise<PlaybackType | void> => {
    if (this.isLoading) {
      await this.isLoading
      return this.state
    }
    if (
      (this.lastRefresh <
        DateTime.now().plus({ milliseconds: SPOTIFY_API_LAG_MS }) &&
        !this.state) ||
      (this.state &&
        this.state.is_playing &&
        DateTime.fromMillis(
          this.state.timestamp +
            SPOTIFY_API_LAG_MS +
            (this.state.item.duration_ms - this.state.progress_ms)
        ) < DateTime.now())
    ) {
      await this.refreshPlayback()
    }
    return this.state
  }

  refreshPlaybackIn = (millis: number): void => {
    if (this.refreshStateTimeout) {
      clearTimeout(this.refreshStateTimeout)
    }
    this.refreshStateTimeout = setTimeout(this.refreshPlayback, millis)
  }
}

export const playback = Playback.getInstance()
