import Stack from "@mui/material/Stack"
import Grid from "@mui/material/Unstable_Grid2"
import Paper from "@mui/material/Paper"
import { styled } from "@mui/material/styles"
import CircularProgress from "@mui/material/CircularProgress"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../store"
import { getPlaylists, use } from "../store/adminPlaylist"
import { Playlist as PlaylistType } from "../shared/spotifyType"
import { Link } from "react-router-dom"

const CLIENT_ID = "892edf800c0743f4b02251b03bfeee90"
const REDIRECT_URI = "https://partify.clemence-et-valentin.fr/login_callback"
const SCOPE =
  "user-modify-playback-state user-read-playback-state playlist-read-private"

const Title = styled("p")(({ theme }) => ({
  fontSize: "20px",
  margin: 0,
  textAlign: "left",
  borderBottom: `1px solid ${theme.palette.text.primary}`,
}))

export const Connect = () => {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    scope: SCOPE,
    redirect_uri: REDIRECT_URI,
    state: "yolo",
  })
  return (
    <Stack spacing={2}>
      <Title>Se connecter à un compte</Title>
      <Link to={`https://accounts.spotify.com/authorize?${params.toString()}`}>
        Se connecter
      </Link>
    </Stack>
  )
}
