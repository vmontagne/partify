import { useState } from "react"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress"
import { useAppDispatch, useAppSelector } from "../../store"
import { searchRequest } from "../../store/search"

export const Search = () => {
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
    <>
      <TextField
        label="Recherche"
        variant="standard"
        value={value}
        onChange={handleChange}
      />
      {loading ? (
        <CircularProgress />
      ) : (
        <Button variant="outlined" onClick={handleClick}>
          Go
        </Button>
      )}
    </>
  )
}
