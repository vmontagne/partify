import { useEffect } from "react"

import Grid from "@mui/material/Unstable_Grid2"

import { useAppSelector, useAppDispatch } from "../store"
import { getUuid } from "../store/user"
import { Playlist } from "../home/playlist"
import { Playback } from "../home/playback"
import { Image } from "../common/Image"

export const FullScreen = () => {
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
      <Grid xs={6}>
        <Grid xs={12}>
          <Playback />
        </Grid>
        <Grid xs={12}>
          <Playlist />
        </Grid>
      </Grid>
      <Grid xs={6}>
        <Image src="/qrcode.png" />
      </Grid>
    </Grid>
  )
}
