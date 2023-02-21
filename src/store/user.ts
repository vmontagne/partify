import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { send } from "../utils/server"
import { messageType } from "../shared/messages"

interface User {
  uuid: string | undefined
  loading: boolean
  name: string | undefined
}

const initialState: User = {
  uuid: undefined,
  loading: false,
  name: undefined,
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getUuid: (state) => {
      if (state.loading) {
        return
      }
      state.loading = true
      send({
        type: messageType.GET_UUID,
      })
    },
    setUuid: (state, action: PayloadAction<{ uuid: string }>) => {
      state.loading = false
      state.uuid = action.payload.uuid
    },
    reassignUuid: (state, action: PayloadAction<{ name: string }>) => {
      state.name = action.payload.name
      console.log(state.uuid)
      if (!state.uuid) {
        return
      }
      send({
        type: messageType.REASSIGN_UUID_REQUEST,
        name: action.payload.name,
        uuid: state.uuid,
      })
    },
  },
})

export const { getUuid, setUuid, reassignUuid } = userSlice.actions

export default userSlice.reducer
