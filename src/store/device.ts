import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { send } from "../utils/server"
import { messageType } from "../shared/messages"
import { Device as DeviceBase } from "../shared/spotifyType"

interface State {
  loading: boolean
  devices: DeviceBase[]
  activeDeviceId?: string
}

const initialState: State = {
  loading: false,
  devices: [],
  activeDeviceId: undefined,
}

export const deviceSlice = createSlice({
  name: "device",
  initialState,
  reducers: {
    set: (state, action: PayloadAction<{ deviceId: string }>) => {
      state.activeDeviceId = action.payload.deviceId
      send({
        type: messageType.ADMIN_SET_DEVICE_REQUEST,
        deviceId: action.payload.deviceId,
      })
    },
    getDevices: (state) => {
      if (state.loading) {
        return
      }
      state.loading = true
      send({
        type: messageType.ADMIN_GET_DEVICES_REQUEST,
      })
    },
    addDevices: (
      state,
      action: PayloadAction<{
        devices: DeviceBase[]
      }>
    ) => {
      action.payload.devices.forEach((device) => {
        if (state.devices.findIndex((item) => item.id === device.id) === -1) {
          state.devices.push(device)
        }
      })
      state.loading = false
    },
  },
})

export const { set, getDevices, addDevices } = deviceSlice.actions

export default deviceSlice.reducer
