import { useEffect } from "react"

import Grid from "@mui/material/Unstable_Grid2"

import { useAppSelector, useAppDispatch } from "../store"
import { getUuid } from "../store/user"
import { NameDialog } from "./nameDialog"
import { AddPlaylistItem } from "./addPlaylistItem"
import { Playlist } from "./playlist"
import { Playback } from "./playback"

export const Home = () => {
  const { uuid, loading } = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (uuid || loading) {
      return
    }
    dispatch(getUuid())
  }, [uuid, loading, dispatch])
  return (
    <Grid container spacing={2}>
      <Grid xs={12}>{/* <NameDialog /> */}</Grid>
      <Grid xs={12}>
        <AddPlaylistItem />
      </Grid>
      <Grid xs={12}>
        <Playback />
      </Grid>
      <Grid xs={12}>
        <Playlist />
      </Grid>
    </Grid>
  )
}
