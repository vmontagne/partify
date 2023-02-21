import { useEffect } from "react"

import Grid from "@mui/material/Unstable_Grid2"

import { useAppSelector, useAppDispatch } from "../store"
import { getUuid } from "../store/user"
import { SearchBar } from "./components/SearchBar"
import { SearchResults } from "./components/SearchResults"

export const Search = ({ ...props }) => {
  const { uuid, loading } = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (uuid || loading) {
      return
    }
    dispatch(getUuid())
  }, [uuid, loading, dispatch])
  return (
    <Grid container spacing={2}>
      <Grid xs={12}>
        <SearchBar />
      </Grid>
      <Grid xs={12}>
        <SearchResults />
      </Grid>
    </Grid>
  )
}
