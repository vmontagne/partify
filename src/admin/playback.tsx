import Stack from "@mui/material/Stack"
import Grid from "@mui/material/Unstable_Grid2"
import { styled } from "@mui/material/styles"
import CircularProgress from "@mui/material/CircularProgress"
import PlayCircleIcon from "@mui/icons-material/PlayCircle"
import PauseCircleIcon from "@mui/icons-material/PauseCircle"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../store"
import { get as getPlayback, togglePlay } from "../store/playback"

const Title = styled("p")(({ theme }) => ({
  fontSize: "20px",
  margin: 0,
  textAlign: "left",
  borderBottom: `1px solid ${theme.palette.text.primary}`,
}))

export const Playback = () => {
  const dispatch = useAppDispatch()
  const { playback } = useAppSelector((state) => state.playback)
  useEffect(() => {
    dispatch(getPlayback())
  }, [])
  const handleTooglePlay = () => {
    dispatch(togglePlay())
  }
  console.log("is_playing", playback?.is_playing)
  return (
    <Stack spacing={2}>
      <Title>Playback</Title>
      {!playback && <CircularProgress />}
      {playback && (
        <Grid
          xs
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={handleTooglePlay}
        >
          {playback.is_playing ? (
            <PauseCircleIcon fontSize="large" />
          ) : (
            <PlayCircleIcon fontSize="large" />
          )}
        </Grid>
      )}
    </Stack>
  )
}
