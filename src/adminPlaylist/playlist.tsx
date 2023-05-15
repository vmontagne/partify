import { Stack } from "@mui/material"
import { styled } from "@mui/material/styles"
import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Unstable_Grid2"
import DeleteIcon from "@mui/icons-material/Delete"
import { Image } from "../common/Image"
import { PlaylistItem as PlaylistItemType } from "../shared/common"
import { useAppDispatch, useAppSelector } from "../store"
import { useEffect } from "react"
import { getItems, deleteItem } from "../store/playlist"

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

const PlaylistItem = ({ item }: { item: PlaylistItemType }) => {
  const dispatch = useAppDispatch()
  const handledelete = () => {
    dispatch(deleteItem({ id: item.track.id }))
  }
  return (
    <Paper>
      <Grid container onClick={handledelete}>
        {item.track.image && (
          <Grid xs={2} display="flex" alignItems="center">
            <Image src={item.track.image} />
          </Grid>
        )}
        <Grid xs>
          <Title>{item.track.name}</Title>
          <Artist>
            {item.track.artists.map((artist) => artist.name).join(", ")}
          </Artist>
        </Grid>
        <Grid xs={2} display="flex" alignItems="center" justifyContent="center">
          <DeleteIcon />
        </Grid>
      </Grid>
    </Paper>
  )
}

export const Playlist = () => {
  const { items } = useAppSelector((state) => state.playlist)
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(getItems())
  }, [])
  return (
    <Stack spacing={2}>
      {items.map((item) => (
        <PlaylistItem item={item} key={item.track.id} />
      ))}
    </Stack>
  )
}
