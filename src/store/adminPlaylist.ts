import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { send } from "../utils/server"
import { messageType } from "../shared/messages"
import { Playlist as PlaylistBase } from "../shared/spotifyType"

interface State {
  loading: boolean
  playlists: PlaylistBase[]
}

const initialState: State = {
  loading: false,
  playlists: [],
}

export const adminPlaylistsSlice = createSlice({
  name: "adminPlaylists",
  initialState,
  reducers: {
    use: (state, action: PayloadAction<{ playlistId: string }>) => {
      send({
        type: messageType.ADMIN_ADD_PLAYLIST,
        playlistId: action.payload.playlistId,
      })
    },
    getPlaylists: (state) => {
      if (state.loading) {
        return
      }
      state.loading = true
      send({
        type: messageType.ADMIN_GET_PLAYLISTS,
      })
    },
    addPlaylists: (
      state,
      action: PayloadAction<{
        playlists: PlaylistBase[]
      }>
    ) => {
      action.payload.playlists.forEach((playlist) => {
        if (
          state.playlists.findIndex((item) => item.id === playlist.id) === -1
        ) {
          state.playlists.push(playlist)
        }
      })
      state.loading = false
    },
  },
})

export const { use, getPlaylists, addPlaylists } = adminPlaylistsSlice.actions

export default adminPlaylistsSlice.reducer
