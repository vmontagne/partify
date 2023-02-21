import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { send } from "../utils/server"
import { messageType } from "../shared/messages"
import { Track } from "../shared/spotifyType"
import { PlaylistItem } from "../shared/common"

interface Playlist {
  currrent?: {
    track: Track
  }
  items: PlaylistItem[]
}

const initialState: Playlist = {
  currrent: undefined,
  items: [],
}

export const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {
    addTrack: (state, action: PayloadAction<Track>) => {
      send({
        type: messageType.ADD_SONG_REQUEST,
        track: action.payload,
      })
    },
    setItems: (
      state,
      action: PayloadAction<{
        items: PlaylistItem[]
      }>
    ) => {
      state.items = action.payload.items
    },
    setCurent: (state) => {
      console.log("coco")
    },
  },
})

export const { addTrack, setItems, setCurent } = playlistSlice.actions

export default playlistSlice.reducer
