import { spotify, SPOTIFY_API_LAG_MS } from "./spotify"
import { Playback as PlaybackType, Track } from "../src/shared/spotifyType"
import { DateTime } from "luxon"
import { broadcastPlayback, broadcastPlaylist } from "./server"

import { playlist } from "./playlist"

class Playback {
  private lastRefresh: DateTime
  private static instance?: Playback
  private state?: PlaybackType
  private refreshStateTimeout?: NodeJS.Timeout
  private isLoading?: Promise<PlaybackType | void>
  private playbackTimeout?: NodeJS.Timeout
  TRACK_ADDED_BEFORE_MS = 10000

  constructor() {
    this.lastRefresh = DateTime.now()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Playback()
      this.instance.refreshPlayback()
    }
    return this.instance
  }

  setPlayback = (data: Track) => {
    this.state = {
      timestamp: DateTime.now().toMillis(),
      progress_ms: 0,
      is_playing: true,
      item: data,
    }
    broadcastPlayback()
  }

  refreshPlayback = async (): Promise<PlaybackType | void> => {
    this.isLoading = new Promise<PlaybackType | void>(async (resolve) => {
      const data = await spotify.getPlayback()
      this.lastRefresh = DateTime.now()
      if (!data) {
        return resolve()
      }
      this.state = {
        timestamp: DateTime.now().toMillis(),
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
    if (this.lastRefresh.plus({ seconds: 30 }) < DateTime.now()) {
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

  async startPlayback(): Promise<void> {
    const playlistItem = playlist.shift()
    await spotify.fetch<{}>(`/me/player/play`, {
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
    playback.refreshPlaybackIn(SPOTIFY_API_LAG_MS)
    return
  }

  async addTrack(): Promise<void> {
    // add the track to spotify
    playlist.lockFirstItem()
    const items = playlist.getItems(1)
    if (items.length !== 1) {
      throw new Error("No items in the playlist")
    }
    const newTrack = items[0]
    spotify.fetch<{}>(
      `/me/player/queue?` +
        new URLSearchParams({
          uri: `spotify:track:${newTrack.track.id}`,
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
    if (!currentState) {
      return
    }
    const trackStartedAt = DateTime.fromMillis(
      currentState.timestamp - currentState.progress_ms
    )
    const trackEndInMs =
      currentState.item.duration_ms -
      DateTime.now().diff(trackStartedAt).milliseconds
    currentState.timestamp + currentState.progress_ms
    setTimeout(() => {
      playlist.shift()
      playback.setPlayback(newTrack.track)
      broadcastPlaylist()
    }, trackEndInMs)
    playback.refreshPlaybackIn(trackEndInMs + newTrack.track.duration_ms / 2)
    this.playbackTimeout = setTimeout(
      () => this.addTrack(),
      trackEndInMs + newTrack.track.duration_ms - this.TRACK_ADDED_BEFORE_MS
    )
  }

  async pausePlayback() {
    if (this.playbackTimeout) {
      clearTimeout(this.playbackTimeout)
    }
    spotify.pausePlayback()
  }
}

export const playback = Playback.getInstance()
