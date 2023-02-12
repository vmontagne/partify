import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { send } from "../utils/server"
import { messageType } from "../shared/messages"
import { Album, Artist, Track } from "../shared/spotifyType"

interface Search {
  loading: boolean
  albums: Album[]
  tracks: Track[]
  artists: Artist[]
}

const initialState: Search = {
  loading: false,
  albums: [],
  tracks: [],
  artists: [],
}

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    searchRequest: (state, action: PayloadAction<{ query: string }>) => {
      if (state.loading) {
        return
      }
      state.loading = true
      send({
        type: messageType.SEARCH_REQUEST,
        query: action.payload.query,
      })
    },
    searchResponse: (
      state,
      action: PayloadAction<{
        tracks: Track[]
        albums: Album[]
        artists: Artist[]
      }>
    ) => {
      state.loading = false
      state.tracks = action.payload.tracks
      state.albums = action.payload.albums
      state.artists = action.payload.artists
    },
  },
})

export const { searchRequest, searchResponse } = searchSlice.actions

export default searchSlice.reducer
