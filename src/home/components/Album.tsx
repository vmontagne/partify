import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Unstable_Grid2"
import { styled } from "@mui/material/styles"
import { Image } from "../../common/Image"
import { Album as AlbumType } from "../../shared/spotifyType"

type Props = {
  album: AlbumType
}

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

export const Album = ({ album }: Props) => {
  return (
    <Paper>
      <Grid container>
        {album.image && (
          <Grid xs={2} display="flex" alignItems="center">
            <Image src={album.image} />
          </Grid>
        )}
        <Grid xs>
          <Title>{album.name}</Title>
          <Artist>{album.artists.map((artist) => artist.name).join()}</Artist>
        </Grid>
      </Grid>
    </Paper>
  )
}
