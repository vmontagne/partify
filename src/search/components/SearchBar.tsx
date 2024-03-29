import { useState } from "react"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import CircularProgress from "@mui/material/CircularProgress"
import { styled } from "@mui/material/styles"
import { Link } from "react-router-dom"
import Grid from "@mui/material/Unstable_Grid2"
import { useAppDispatch, useAppSelector } from "../../store"
import { searchRequest } from "../../store/search"

const CustomLink = styled(Link)(() => ({
  color: "white",
}))

export const SearchBar = () => {
  const dispatch = useAppDispatch()
  const loading = useAppSelector((state) => state.search.loading)
  const [value, setValue] = useState("")
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }
  const handleClick = () => {
    dispatch(searchRequest({ query: value }))
  }
  return (
    <Grid container>
      <Grid xs={1} display="flex" alignItems="center" justifyContent="center">
        <CustomLink to="/">
          <ArrowBackIcon />
        </CustomLink>
      </Grid>
      <Grid xs display="flex" alignItems="center" justifyContent="center">
        <TextField
          label="Recherche"
          variant="standard"
          fullWidth
          value={value}
          onChange={handleChange}
        />
      </Grid>
      <Grid xs={3} display="flex" alignItems="center" justifyContent="center">
        {loading ? (
          <CircularProgress />
        ) : (
          <Button variant="outlined" onClick={handleClick}>
            Go
          </Button>
        )}
      </Grid>
    </Grid>
  )
}
