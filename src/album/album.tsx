import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Grid from "@mui/material/Unstable_Grid2"
import IconButton from "@mui/material/IconButton"
import CircularProgress from "@mui/material/CircularProgress"
import { styled } from "@mui/material/styles"
import Stack from "@mui/material/Stack"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { useAppDispatch, useAppSelector } from "../store"
import { loadTracks } from "../store/album"
import { Image } from "../common/Image"
import { Track } from "../home/components/Track"

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

export const Album = () => {
  const dispatch = useAppDispatch()
  const { id, name, artists, image, tracks, loading } = useAppSelector(
    (state) => state.album
  )
  const navigate = useNavigate()
  useEffect(() => {
    dispatch(loadTracks())
  }, [id])

  const handleClick = () => {
    // TODO : clean store
    navigate(-1)
  }

  return (
    <Grid container spacing={2}>
      <Grid xs={12}>
        <Grid container spacing={1}>
          <Grid xs={2} display="flex" alignItems="center">
            <IconButton onClick={handleClick} size="small">
              <ArrowBackIcon />
            </IconButton>
          </Grid>
          <Grid xs={2} display="flex" alignItems="center">
            <Image src={image} />
          </Grid>
          <Grid xs>
            <Title>{name}</Title>
            <Artist>{artists?.map((artist) => artist.name).join()}</Artist>
          </Grid>
        </Grid>
      </Grid>
      <Grid xs={12}>
        {tracks.length > 0 && (
          <Stack spacing={2}>
            {tracks.map((track) => (
              <Track track={track} key={track.id} />
            ))}
          </Stack>
        )}
        {loading && (
          <Grid
            xs={12}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <CircularProgress />
          </Grid>
        )}
      </Grid>
    </Grid>
  )
}
