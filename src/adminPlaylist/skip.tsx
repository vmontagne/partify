import React from "react"
import Grid from "@mui/material/Unstable_Grid2"
import PlayCircleIcon from "@mui/icons-material/PlayCircle"
import SkipNextIcon from "@mui/icons-material/SkipNext"
import { useAppDispatch } from "../store"
import { goToNextTrack } from "../store/playback"

export const Skip = () => {
  const dispatch = useAppDispatch()
  const handleGoToNextTrack = () => {
    dispatch(goToNextTrack())
  }
  return (
    <Grid
      xs
      display="flex"
      alignItems="center"
      justifyContent="center"
      onClick={handleGoToNextTrack}
    >
      <SkipNextIcon fontSize="large" />
    </Grid>
  )
}
