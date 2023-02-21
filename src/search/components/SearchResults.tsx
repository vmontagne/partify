import Grid from "@mui/material/Unstable_Grid2"
import Stack from "@mui/material/Stack"
import { styled } from "@mui/material/styles"
import { useAppSelector } from "../../store"
import { Album } from "./Album"
import { Artist } from "./Artist"
import { Track } from "./Track"

const Title = styled("p")(({ theme }) => ({
  fontSize: "20px",
  margin: 0,
  textAlign: "left",
  borderBottom: `1px solid ${theme.palette.text.primary}`,
}))

export const SearchResults = () => {
  const { albums, tracks, artists } = useAppSelector((state) => state.search)
  return (
    <Grid container>
      {tracks.length > 0 && (
        <Grid xs={12}>
          <Stack spacing={2}>
            <Title>Musiques</Title>
            {tracks.map((track) => (
              <Track track={track} key={track.id} />
            ))}
          </Stack>
        </Grid>
      )}
      {albums.length > 0 && (
        <Grid xs={12}>
          <Stack spacing={2}>
            <Title>Albums</Title>
            {albums.map((album) => (
              <Album album={album} key={album.id} />
            ))}
          </Stack>
        </Grid>
      )}
      {artists.length > 0 && (
        <Grid xs={12}>
          <Stack spacing={2}>
            <Title>Artistes</Title>
            {artists.map((artist) => (
              <Artist artist={artist} key={artist.id} />
            ))}
          </Stack>
        </Grid>
      )}
    </Grid>
  )
}
