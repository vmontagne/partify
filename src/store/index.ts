import { configureStore } from "@reduxjs/toolkit"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"

import userReducer from "./user"
import searchReducer from "./search"
import albumReducer from "./album"
import artistReducer from "./artist"
import playlistReducer from "./playlist"

const store = configureStore({
  reducer: {
    user: userReducer,
    search: searchReducer,
    album: albumReducer,
    artist: artistReducer,
    playlist: playlistReducer,
  },
})

export default store

export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
