import Stack from "@mui/material/Stack"
import Grid from "@mui/material/Unstable_Grid2"
import Paper from "@mui/material/Paper"
import { styled } from "@mui/material/styles"
import CircularProgress from "@mui/material/CircularProgress"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../store"
import { getPlaylists, use } from "../store/adminPlaylist"
import { Playlist as PlaylistType } from "../shared/spotifyType"

const Title = styled("p")(({ theme }) => ({
  fontSize: "20px",
  margin: 0,
  textAlign: "left",
  borderBottom: `1px solid ${theme.palette.text.primary}`,
}))

export const Playlists = () => {
  const dispatch = useAppDispatch()
  const { playlists } = useAppSelector((state) => state.adminPlaylist)
  useEffect(() => {
    dispatch(getPlaylists())
  }, [])
  return (
    <Stack spacing={2}>
      <Title>Playlists</Title>
      {!playlists && <CircularProgress />}
      {playlists &&
        playlists.map((playlist) => <Playlist playlist={playlist} />)}
    </Stack>
  )
}

const Wrapper = styled(Paper)(() => ({
  padding: "5px",
  cursor: "pointer",
}))

const Playlist = ({ playlist }: { playlist: PlaylistType }) => {
  const dispatch = useAppDispatch()
  const handleUsePlaylist = () => {
    dispatch(use({ playlistId: playlist.id }))
  }
  return (
    <Wrapper onClick={handleUsePlaylist}>
      <Grid container alignItems="center">
        <Grid xs={12} display="flex">
          <span>{playlist.name}</span>
        </Grid>
      </Grid>
    </Wrapper>
  )
}
