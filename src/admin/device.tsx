import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Unstable_Grid2"
import { styled } from "@mui/material/styles"
import CircleIcon from "@mui/icons-material/Circle"

import { Device as DeviceType } from "../shared/spotifyType"
import { useAppDispatch } from "../store"
import { set } from "../store/device"

const Wrapper = styled(Paper)(() => ({
  padding: "5px",
  cursor: "pointer",
}))
export const Device = ({ device }: { device: DeviceType }) => {
  const dispatch = useAppDispatch()
  const handleClick = () => {
    dispatch(set({ deviceId: device.id }))
  }
  return (
    <Wrapper onClick={handleClick}>
      <Grid container alignItems="center">
        <Grid xs={10} display="flex">
          <span>{device.name}</span>
        </Grid>
        <Grid xs={2} display="flex" alignItems="center" justifyContent="center">
          <CircleIcon color={device.is_active ? "success" : "disabled"} />
        </Grid>
      </Grid>
    </Wrapper>
  )
}
