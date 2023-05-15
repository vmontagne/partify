import { useEffect } from "react"
import { Message, messageType } from "../shared/messages"
import { useAppDispatch } from "../store"
import { addTracks } from "../store/album"
import { addAlbums } from "../store/artist"
import { addDevices } from "../store/device"
import { set as setPlayback } from "../store/playback"
import { setItems } from "../store/playlist"
import { searchResponse } from "../store/search"
import { setUuid } from "../store/user"
import config from "../shared/config/server.json"
import { addPlaylists } from "../store/adminPlaylist"

let ws = new WebSocket(config.url)

const reload = () => {
  if (
    window.confirm(
      "Vous avez étez déconnecté, cliquez sur un bouton pour recharger la page"
    )
  ) {
    window.location.reload()
  } else {
    window.location.reload()
  }
}

ws.addEventListener("error", reload)
ws.addEventListener("close", reload)

export const isReady = () => ws.readyState === WebSocket.OPEN

const waitUntilIsReady = new Promise<void>((resolve) => {
  if (isReady()) {
    return resolve()
  }
  ws.addEventListener("open", () => {
    resolve()
  })
})

export const send = async (message: Message) => {
  await waitUntilIsReady
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
        case messageType.GET_ALBUM_TRACKS_RESPONSE:
          dispatch(
            addTracks({
              tracks: data.tracks.items,
            })
          )
          break
        case messageType.GET_ARTIST_ALBUMS_RESPONSE:
          dispatch(
            addAlbums({
              albums: data.albums.items,
            })
          )
          break
        case messageType.PLAYLIST_DATA:
          dispatch(
            setItems({
              items: data.items,
            })
          )
          break
        case messageType.ADMIN_GET_DEVICES_RESPONSE:
          dispatch(
            addDevices({
              devices: data.devices,
            })
          )
          break
        case messageType.ADMIN_SET_DEVICE_RESPONSE:
          break
        case messageType.PLAYBACK_STATE:
          dispatch(
            setPlayback({
              playback: data.playback,
            })
          )
          break
        case messageType.ADMIN_PLAYLISTS_RESPONSE:
          dispatch(
            addPlaylists({
              playlists: data.playlists.items,
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
  }, [dispatch])
}
