import { useEffect } from "react"
import { Message, messageType } from "../shared/messages"
import { useAppDispatch } from "../store"
import { searchResponse } from "../store/search"
import { setUuid } from "../store/user"
import { hasOwnProperty } from "./generics"

const ws = new WebSocket("ws://localhost:8080")

export const isReady = () => ws.readyState === WebSocket.OPEN

export const send = (message: Message) => {
  ws.send(JSON.stringify(message))
}

export const useServer = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    const listener = (event: MessageEvent) => {
      const data: Message = JSON.parse(event.data)
      switch (data.type) {
        case messageType.SET_UUID:
          dispatch(setUuid({ uuid: data.uuid }))
          break
        case messageType.SEARCH_RESPONSE:
          dispatch(
            searchResponse({
              albums: data.albums.items,
              tracks: data.tracks.items,
              artists: data.artists.items,
            })
          )
          break
        default:
          console.log("message untreated", data)
      }
    }
    ws.addEventListener("message", listener)
    return () => {
      ws.removeEventListener("message", listener)
    }
  }, [])
}