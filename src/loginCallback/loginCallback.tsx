import Grid from "@mui/material/Unstable_Grid2"
import { useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { messageType } from "../shared/messages"
import { send } from "../utils/server"

export const LoginCallback = () => {
  const [queryParameters] = useSearchParams()
  const code = queryParameters.get("code")
  useEffect(() => {
    if (!code) {
      return
    }
    send({
      type: messageType.ADMIN_LOGIN,
      code: code,
    })
  }, [code])
  return (
    <Grid container spacing={2}>
      <Grid xs={12}>Vous avez été connecté avec succès</Grid>
      <Grid xs={12}>
        <Link to="/">Retourner à l'acceuil</Link>
      </Grid>
    </Grid>
  )
}
