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
      if (a.addedBy.length - b.addedBy.length !== 0) {
        return a.addedBy.length - b.addedBy.length
      }
      return a.lastAdd > b.lastAdd ? 1 : -1
    })
  }

  public addTrack(track: Track, user: User) {
    this.playlistItems.forEach((item) => {
      if (item.track.id == track.id) {
        if (
          item.addedBy.findIndex((adder) => adder.uuid === user.uuid) !== -1
        ) {
          // this user already add this track so nothing happen ....
          return
        }
        item.addedBy.push(user)
        item.lastAdd = DateTime.now()
        this.sortItems()
        return
      }
    })

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
}

export const playlist = Playlist.getInstance()
