import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { send } from "../utils/server"
import { messageType } from "../shared/messages"
import { Playback } from "../shared/spotifyType"

interface State {
  is_loaded: boolean
  playback?: Playback
}

const initialState: State = {
  is_loaded: false,
  playback: undefined,
}

export const playbackSlice = createSlice({
  name: "playback",
  initialState,
  reducers: {
    get: (state) => {
      send({
        type: messageType.GET_PLAYBACK_STATE,
      })
    },
    set: (state, action: PayloadAction<{ playback: Playback }>) => {
      state.is_loaded = true
      state.playback = action.payload.playback
    },
    startPlay: (state) => {
      send({
        type: messageType.ADMIN_START_PLAYBACK_REQUEST,
      })
    },
    goToNextTrack: (state) => {
      send({
        type: messageType.GO_TO_NEXT_MUSIC,
      })
    },
  },
})

export const { set, get, startPlay, goToNextTrack } = playbackSlice.actions

export default playbackSlice.reducer
