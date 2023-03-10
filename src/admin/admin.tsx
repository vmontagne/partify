import Grid from "@mui/material/Unstable_Grid2"

import { Devices } from "./devices"
import { Playback } from "./playback"

export const Admin = () => {
  return (
    <Grid container spacing={2}>
      <Grid xs={12}>Admin</Grid>
      <Grid xs={12}>
        <Devices />
      </Grid>
      <Grid xs={12}>
        <Playback />
      </Grid>
    </Grid>
  )
}
