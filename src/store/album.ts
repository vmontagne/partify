import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { send } from "../utils/server"
import { messageType } from "../shared/messages"
import { Album as AlbumBase, Artist, Track } from "../shared/spotifyType"

const LIMIT_TRACK_REQUEST = 20

interface Album {
  loading: boolean
  currentOffset: number
  id?: string
  tracks: Track[]
  name?: string
  image?: string
  artists?: Artist[]
  allTracksLoaded: boolean
}

const initialState: Album = {
  loading: false,
  id: undefined,
  tracks: [],
  name: undefined,
  image: undefined,
  artists: undefined,
  currentOffset: 0,
  allTracksLoaded: false,
}

export const albumSlice = createSlice({
  name: "album",
  initialState,
  reducers: {
    set: (state, action: PayloadAction<AlbumBase>) => {
      state.loading = false
      state.id = action.payload.id
      state.image = action.payload.image
      state.artists = action.payload.artists
      state.name = action.payload.name
      state.tracks = []
      state.currentOffset = 0
      state.allTracksLoaded = false
    },
    clean: (state) => {
      state = { ...initialState }
    },
    loadTracks: (state) => {
      if (state.loading || !state.id) {
        return
      }
      state.loading = true
      //TODO : add an offset
      send({
        type: messageType.GET_ALBUM_TRACKS_REQUEST,
        albumId: state.id,
      })
    },
    addTracks: (
      state,
      action: PayloadAction<{
        tracks: Track[]
      }>
    ) => {
      action.payload.tracks.forEach((track) => {
        if (state.tracks.findIndex((item) => item.id === track.id) === -1) {
          state.tracks.push(track)
        }
      })
      state.currentOffset += action.payload.tracks.length
      state.allTracksLoaded = action.payload.tracks.length < LIMIT_TRACK_REQUEST
      state.loading = false
    },
  },
})

export const { set, clean, loadTracks, addTracks } = albumSlice.actions

export default albumSlice.reducer
