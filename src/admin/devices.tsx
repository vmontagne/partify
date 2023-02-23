import { useEffect } from "react"

import Stack from "@mui/material/Stack"
import { styled } from "@mui/material/styles"

import { useAppSelector, useAppDispatch } from "../store"
import { getDevices } from "../store/device"
import { Device } from "./device"

const Title = styled("p")(({ theme }) => ({
  fontSize: "20px",
  margin: 0,
  textAlign: "left",
  borderBottom: `1px solid ${theme.palette.text.primary}`,
}))

export const Devices = () => {
  const { devices } = useAppSelector((state) => state.device)
  const dispatch = useAppDispatch()
  useEffect(() => {
    console.log("devices", devices, !devices.length)
    if (!devices.length) {
      dispatch(getDevices())
    }
  }, [devices])
  return (
    <Stack spacing={2}>
      <Title>Devices</Title>
      {devices.map((device) => (
        <Device device={device} key={device.id} />
      ))}
    </Stack>
  )
}
