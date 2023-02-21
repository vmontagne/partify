import { DateTime } from "luxon"
import { Track } from "./spotifyType"

export type User = {
  uuid: string
  name: string
}

export type PlaylistItem = {
  track: Track
  addedBy: User[]
  lastAdd: DateTime
}
