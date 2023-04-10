import { DateTime } from "luxon"
import { User, PlaylistItem } from "../src/shared/common"
import { Track } from "../src/shared/spotifyType"

class Playlist {
  private static instance: Playlist | undefined
  private playlistItems: PlaylistItem[]

  constructor() {
    this.playlistItems = []
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Playlist()
    }
    return this.instance
  }

  private sortItems() {
    this.playlistItems.sort((a, b) => {
      if (a.locked) {
        return -1
      }
      if (b.locked) {
        return 1
      }
      if (a.addedBy.length - b.addedBy.length !== 0) {
        return b.addedBy.length - a.addedBy.length
      }
      return a.lastAdd < b.lastAdd ? -1 : 1
    })
  }

  public addTrack(track: Track, user: User) {
    const trackIndex = this.playlistItems.findIndex(
      (item) => item.track.id == track.id
    )
    if (trackIndex !== -1) {
      const item = this.playlistItems[trackIndex]
      if (item.addedBy.findIndex((adder) => adder.uuid === user.uuid) !== -1) {
        // this user already add this track so nothing happen ....
        return
      }
      item.addedBy.push(user)
      item.lastAdd = DateTime.now()
      this.sortItems()
      return
    }

    this.playlistItems.push({
      track,
      addedBy: [user],
      lastAdd: DateTime.now(),
    })
    this.sortItems()
  }

  public getItems(limit: number): PlaylistItem[] {
    return this.playlistItems.slice(0, limit)
  }

  public shift(): PlaylistItem {
    const item = this.playlistItems.shift()
    if (!item) {
      throw new Error("Can't shift an empty playlist")
    }
    return item
  }

  public lockFirstItem(): void {
    if (!this.playlistItems[0]) {
      return
    }
    this.playlistItems[0].locked = true
  }
}

export const playlist = Playlist.getInstance()
