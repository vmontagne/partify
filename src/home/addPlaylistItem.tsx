import Paper from "@mui/material/Paper"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import Grid from "@mui/material/Unstable_Grid2"
import { styled } from "@mui/material/styles"
import { useNavigate } from "react-router-dom"

const Item = styled(Paper)(() => ({
  margin: "0 10px",
  padding: "10px",
}))

export const AddPlaylistItem = () => {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate("/search")
  }
  return (
    <Item onClick={handleClick}>
      <Grid display="flex" alignItems="center" justifyContent="space-evenly">
        Ajouter une musique
        <AddCircleOutlineIcon />
      </Grid>
    </Item>
  )
}
