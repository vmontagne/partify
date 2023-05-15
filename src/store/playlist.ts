import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { send } from "../utils/server"
import { messageType } from "../shared/messages"
import { Track } from "../shared/spotifyType"
import { PlaylistItem } from "../shared/common"

interface Playlist {
  loading: boolean
  items: PlaylistItem[]
}

const initialState: Playlist = {
  loading: false,
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
    getItems: (state) => {
      state.loading = true
      send({ type: messageType.GET_PLAYLIST_DATA })
    },
    setItems: (
      state,
      action: PayloadAction<{
        items: PlaylistItem[]
      }>
    ) => {
      state.loading = false
      state.items = action.payload.items
    },
    deleteItem: (state, action: PayloadAction<{ id: string }>) => {
      send({ type: messageType.DELETE_TRACK, id: action.payload.id })
    },
  },
})

export const { addTrack, setItems, getItems, deleteItem } =
  playlistSlice.actions

export default playlistSlice.reducer
