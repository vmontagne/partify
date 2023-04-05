import { spotify } from "./spotify"
import { Playback as PlaybackType } from "../src/shared/spotifyType"
import { DateTime } from "luxon"
import { broadcastPlayback } from "./server"

class Playback {
  private static instance?: Playback
  private state?: PlaybackType
  private refreshStateTimeout?: NodeJS.Timeout
  private isLoading?: Promise<PlaybackType>

  constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new Playback()
    }
    return this.instance
  }

  refreshPlayback = async (): Promise<PlaybackType> => {
    console.log("call refresh")
    this.isLoading = new Promise(async (resolve) => {
      const data = await spotify.getPlayback()
      resolve(data)
    })
    console.log("await data")
    const data = await this.isLoading
    console.log("data received")
    this.isLoading = undefined
    console.log("update state")
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
    console.log("broadcast")
    broadcastPlayback()
    return this.state
  }

  getCurrentPlayback = async (): Promise<PlaybackType | void> => {
    console.log("get current playback")
    if (this.isLoading) {
      console.log("loading -> before")
      await this.isLoading
      console.log("loading -> done")
      return
    }
    console.log("check if need refresh")
    if (
      !this.state ||
      (this.state.is_playing &&
        DateTime.fromMillis(
          this.state.timestamp +
            (this.state.item.duration_ms - this.state.progress_ms)
        ) < DateTime.now())
    ) {
      console.log("refresh")
      await this.refreshPlayback()
    }
    console.log("return state")
    // can't explain to ts after refreshPlayback, playback can't be undefined
    //@ts-ignore 2339
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
