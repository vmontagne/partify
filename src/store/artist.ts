import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { send } from "../utils/server"
import { messageType } from "../shared/messages"
import { Artist as ArtistBase, Album } from "../shared/spotifyType"

const LIMIT_ALBUM_REQUEST = 20

interface Artist {
  loading: boolean
  currentOffset: number
  id?: string
  albums: Album[]
  name?: string
  image?: string
  allAlbumsLoaded: boolean
}

const initialState: Artist = {
  loading: false,
  id: undefined,
  albums: [],
  name: undefined,
  image: undefined,
  currentOffset: 0,
  allAlbumsLoaded: false,
}

export const artistSlice = createSlice({
  name: "artist",
  initialState,
  reducers: {
    set: (state, action: PayloadAction<ArtistBase>) => {
      state.loading = false
      state.id = action.payload.id
      state.image = action.payload.image
      state.name = action.payload.name
      state.albums = []
      state.currentOffset = 0
      state.allAlbumsLoaded = false
    },
    clean: (state) => {
      state = { ...initialState }
    },
    loadAlbums: (state) => {
      if (state.loading || !state.id) {
        return
      }
      state.loading = true
      //TODO : add an offset
      send({
        type: messageType.GET_ARTIST_ALBUMS_REQUEST,
        artistId: state.id,
      })
    },
    addAlbums: (
      state,
      action: PayloadAction<{
        albums: Album[]
      }>
    ) => {
      action.payload.albums.forEach((album) => {
        if (state.albums.findIndex((item) => item.id === album.id) === -1) {
          state.albums.push(album)
        }
      })
      state.currentOffset += action.payload.albums.length
      state.allAlbumsLoaded = action.payload.albums.length < LIMIT_ALBUM_REQUEST
      state.loading = false
    },
  },
})

export const { set, clean, loadAlbums, addAlbums } = artistSlice.actions

export default artistSlice.reducer
