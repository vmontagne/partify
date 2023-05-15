import { Stack } from "@mui/material"
import { styled } from "@mui/material/styles"
import CircularProgress from "@mui/material/CircularProgress"
import LinearProgress from "@mui/material/LinearProgress"
import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Unstable_Grid2"
import { Image } from "../common/Image"
import { PlaylistItem as PlaylistItemType } from "../shared/common"
import { useAppDispatch, useAppSelector } from "../store"
import { useEffect, useState } from "react"
import { getItems } from "../store/playlist"
import { get } from "../store/playback"
import { DateTime } from "luxon"

const Title = styled("p")(() => ({
  fontSize: "14px",
  margin: 0,
  textAlign: "left",
}))

const Artist = styled("p")(() => ({
  fontSize: "11px",
  margin: 0,
  textAlign: "left",
}))

export const Playback = () => {
  const [progress, setProgress] = useState(0)
  const { playback } = useAppSelector((state) => state.playback)
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(get())
  }, [])
  useEffect(() => {
    if (!playback?.item) {
      return
    }
    const total = playback.item.duration_ms
    const startedAt = playback.timestamp - playback.progress_ms
    const timer = setInterval(() => {
      const now = DateTime.now().toMillis()
      const result = ((now - startedAt) * 100) / total
      if (result > 100) {
        setProgress(100)
        clearInterval(timer)
      }
      setProgress(result)
    }, 500)

    return () => {
      clearInterval(timer)
    }
  }, [playback?.progress_ms, playback?.timestamp, playback?.item.duration_ms])
  if (!playback) {
    return null
  }
  return (
    <Paper>
      <Grid container>
        {playback.item.image && (
          <Grid xs={2} display="flex" alignItems="center">
            <Image src={playback.item.image} />
          </Grid>
        )}
        <Grid xs>
          <Title>{playback.item.name}</Title>
          <Artist>
            {playback.item.artists.map((artist) => artist.name).join()}
          </Artist>
        </Grid>
        <Grid
          xs={2}
          display="flex"
          alignItems="center"
          justifyContent="center"
        ></Grid>
        <Grid xs={12}>
          <LinearProgress
            variant="determinate"
            value={progress}
            color="success"
          />
        </Grid>
      </Grid>
    </Paper>
  )
}
