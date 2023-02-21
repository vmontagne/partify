import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Unstable_Grid2"
import ManageSearchIcon from "@mui/icons-material/ManageSearch"
import { styled } from "@mui/material/styles"
import { Image } from "../../common/Image"
import { Artist as ArtistType } from "../../shared/spotifyType"
import { useAppDispatch } from "../../store"
import { set } from "../../store/artist"
import { useNavigate } from "react-router-dom"

type Props = {
  artist: ArtistType
}

const Title = styled("p")(() => ({
  fontSize: "14px",
  margin: 0,
  textAlign: "left",
}))

export const Artist = ({ artist }: Props) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const handleClick = () => {
    dispatch(set(artist))
    navigate("/artist")
  }
  return (
    <Paper onClick={handleClick}>
      <Grid container>
        <Grid xs={2} display="flex" alignItems="center">
          <Image src={artist.image} />
        </Grid>
        <Grid xs>
          <Title>{artist.name}</Title>
        </Grid>
        <Grid xs={2} display="flex" alignItems="center" justifyContent="center">
          <ManageSearchIcon />
        </Grid>
      </Grid>
    </Paper>
  )
}
