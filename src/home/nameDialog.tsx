import { useState, useEffect, ChangeEvent } from "react"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"

import { useAppSelector, useAppDispatch } from "../store"
import { reassignUuid } from "../store/user"

export const NameDialog = () => {
  const [open, setOpen] = useState(false)
  const [newName, setNewName] = useState("")
  const { name } = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()
  const nameIsSet = !!name
  useEffect(() => {
    if (nameIsSet) {
      return
    }
    setOpen(true)
  }, [nameIsSet])

  const handleSetName = () => {
    dispatch(reassignUuid({ name: newName }))
    setOpen(false)
  }
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value)
  }

  return (
    <div>
      <p>{name}</p>
      <Dialog open={open}>
        <DialogTitle>Entrez votre nom :</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Nom"
            type="text"
            fullWidth
            variant="standard"
            value={newName}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSetName}>OK</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
