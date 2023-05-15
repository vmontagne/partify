import Grid from "@mui/material/Unstable_Grid2"

import { Skip } from "./skip"
import { Playlist } from "./playlist"

export const AdminPlaylist = () => {
  return (
    <Grid container spacing={2}>
      <Grid xs={12}>Playlist admin</Grid>
      <Grid xs={12}>
        <Skip />
      </Grid>
      <Grid xs={12}>
        <Playlist />
      </Grid>
    </Grid>
  )
}
