import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Unstable_Grid2"
import { styled } from "@mui/material/styles"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import { Image } from "../../common/Image"
import { Track as TrackType } from "../../shared/spotifyType"
import { useAppDispatch } from "../../store"
import { addTrack } from "../../store/playlist"
import { useNavigate } from "react-router-dom"
import { clean } from "../../store/search"

type Props = {
  track: TrackType
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

export const Track = ({ track }: Props) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const handleClick = () => {
    dispatch(addTrack(track))
    dispatch(clean())
    navigate("/", { replace: true })
  }
  return (
    <Paper onClick={handleClick}>
      <Grid container>
        {track.image && (
          <Grid xs={2} display="flex" alignItems="center">
            <Image src={track.image} />
          </Grid>
        )}
        <Grid xs>
          <Title>{track.name}</Title>
          <Artist>{track.artists.map((artist) => artist.name).join()}</Artist>
        </Grid>
        <Grid xs={2} display="flex" alignItems="center" justifyContent="center">
          <AddCircleOutlineIcon />
        </Grid>
      </Grid>
    </Paper>
  )
}
