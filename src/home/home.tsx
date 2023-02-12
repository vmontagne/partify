import { useEffect } from "react"

import Grid from "@mui/material/Unstable_Grid2"

import { useAppSelector, useAppDispatch } from "../store"
import { getUuid } from "../store/user"
import { Search } from "./components/Search"
import { SearchResults } from "./components/SearchResults"

export const Home = ({ ...props }) => {
  const { uuid, loading } = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (uuid || loading) {
      return
    }
    dispatch(getUuid())
  }, [])
  return (
    <Grid container spacing={2}>
      <Grid>
        <Search />
      </Grid>
      <Grid>
        <SearchResults />
      </Grid>
    </Grid>
  )
}
