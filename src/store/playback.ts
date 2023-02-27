import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { send } from "../utils/server"
import { messageType } from "../shared/messages"
import { Device as DeviceBase, Playback } from "../shared/spotifyType"

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
    togglePlay: (state) => {
      if (!state.playback) {
        return
      }
      send({
        type: state.playback.is_playing
          ? messageType.ADMIN_PAUSE_PLAYBACK_REQUEST
          : messageType.ADMIN_START_PLAYBACK_REQUEST,
      })
    },
  },
})

export const { set, get, togglePlay } = playbackSlice.actions

export default playbackSlice.reducer
