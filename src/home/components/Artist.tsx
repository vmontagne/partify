import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Unstable_Grid2"
import { styled } from "@mui/material/styles"
import { Image } from "../../common/Image"
import { Artist as ArtistType } from "../../shared/spotifyType"

type Props = {
  artist: ArtistType
}

const Title = styled("p")(() => ({
  fontSize: "14px",
  margin: 0,
  textAlign: "left",
}))

export const Artist = ({ artist }: Props) => {
  return (
    <Paper>
      <Grid container>
        <Grid xs={2} display="flex" alignItems="center">
          <Image src={artist.image} />
        </Grid>
        <Grid xs={10}>
          <Title>{artist.name}</Title>
        </Grid>
      </Grid>
    </Paper>
  )
}
