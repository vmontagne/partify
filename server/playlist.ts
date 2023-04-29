import { DateTime } from "luxon"
import { User, PlaylistItem } from "../src/shared/common"
import { Track } from "../src/shared/spotifyType"
import fs from "fs/promises"

const FILE_STORAGE = "./playlist.json"

class Playlist {
  private static instance: Playlist | undefined
  private playlistItems: PlaylistItem[]

  constructor() {
    this.playlistItems = []
  }

  private async storePlaylist() {
    const data = JSON.stringify(this.playlistItems)
    await fs.writeFile(FILE_STORAGE, data)
    JSON.parse(data)
  }

  private async loadPlaylist() {
    let loadedData: string | undefined = undefined
    try {
      loadedData = await fs.readFile(FILE_STORAGE, "utf-8")
    } catch (e) {
      return
    }
    if (!loadedData) {
      return
    }
    this.playlistItems = JSON.parse(loadedData)
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Playlist()
      this.instance.loadPlaylist()
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

  public async addTrack(track: Track, user?: User, sync?: boolean) {
    const trackIndex = this.playlistItems.findIndex(
      (item) => item.track.id == track.id
    )
    if (trackIndex !== -1) {
      const item = this.playlistItems[trackIndex]
      if (
        user &&
        item.addedBy.findIndex((adder) => adder.uuid === user.uuid) !== -1
      ) {
        // this user already add this track so nothing happen ....
        return
      }
      if (user) {
        item.addedBy.push(user)
      }
      item.lastAdd = DateTime.now()
      this.sortItems()
      if (sync) {
        await this.storePlaylist()
      } else {
        this.storePlaylist()
      }
      return
    }

    const item: PlaylistItem = {
      track,
      addedBy: [],
      lastAdd: DateTime.now(),
    }

    if (user) {
      item.addedBy.push(user)
    }

    this.playlistItems.push(item)
    this.sortItems()
    if (sync) {
      await this.storePlaylist()
    } else {
      this.storePlaylist()
    }
  }

  public getItems(limit: number): PlaylistItem[] {
    return this.playlistItems.slice(0, limit)
  }

  public shift(): PlaylistItem {
    const item = this.playlistItems.shift()
    if (!item) {
      throw new Error("Can't shift an empty playlist")
    }
    this.storePlaylist()
    return item
  }

  public lockFirstItem(): void {
    if (!this.playlistItems[0]) {
      return
    }
    this.storePlaylist()
    this.playlistItems[0].locked = true
  }
}

export const playlist = Playlist.getInstance()
