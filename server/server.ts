import { WebSocketServer, WebSocket } from "ws"
import { v4 as uuidv4 } from "uuid"
import {
  Message,
  messageType,
  GetUuidMessage,
  SetUuidMessage,
  SearchResponseMessage,
  GetArtistAlbumsResponseMessage,
  GetAlbumTracksResponseMessage,
  ReassignUuidRequestMessage,
  ReassignUuidResponseMessage,
  PlaylistDataMessage,
  AdminGetDevicesResponseMessage,
  AdminSetDeviceResponseMessage,
  AdminStartPlaybackResponseMessage,
  AdminPausePlaybackResponseMessage,
} from "../src/shared/messages"
import { spotify } from "./spotify"
import { playlist } from "./playlist"
import { Track } from "../src/shared/spotifyType"

const wss = new WebSocketServer({
  port: process.env.WSS_PORT ? parseInt(process.env.WSS_PORT) : 8080,
  clientTracking: true,
})

const clients: {
  [key: string]: {
    ws: WebSocket
    name: string
  }
} = {}

const getUuid = (ws: WebSocket, message: GetUuidMessage) => {
  const uuid = uuidv4()
  clients[uuid] = { ws, name: uuid }
  const data: SetUuidMessage = {
    type: messageType.SET_UUID,
    uuid,
  }
  ws.send(JSON.stringify(data))
}

const reassingUuid = (ws: WebSocket, message: ReassignUuidRequestMessage) => {
  if (!(message.uuid in clients)) {
    clients[message.uuid] = {
      ws: ws,
      name: message.name,
    }
  } else {
    clients[message.uuid].ws = ws
    clients[message.uuid].name = message.name
  }
  const response: ReassignUuidResponseMessage = {
    type: messageType.REASSIGN_UUID_RESPONSE,
    user: {
      uuid: message.uuid,
      name: message.name,
    },
  }
  ws.send(JSON.stringify(response))
}

const searchRequest = async (ws: WebSocket, query: string) => {
  const data = await spotify.search(query)

  const response: SearchResponseMessage = {
    type: messageType.SEARCH_RESPONSE,
    albums: {
      offset: data.albums.offset,
      total: data.albums.total,
      items: data.albums.items.map((album) => ({
        id: album.id,
        name: album.name,
        image: album.images?.sort((a, b) => b.width - a.width)[0]?.url,
        artists: album.artists.map((artist) => ({
          name: artist.name,
          id: artist.id,
        })),
      })),
    },
    artists: {
      offset: data.artists.offset,
      total: data.artists.total,
      items: data.artists.items.map((artist) => ({
        id: artist.id,
        name: artist.name,
        image: artist.images?.sort((a, b) => b.width - a.width)[0]?.url,
      })),
    },
    tracks: {
      offset: data.tracks.offset,
      total: data.tracks.total,
      items: data.tracks.items.map((track) => ({
        id: track.id,
        album: track.album
          ? {
              id: track.album?.id,
              name: track.album?.name,
              artists: [],
            }
          : undefined,
        artists: track.artists.map((artist) => ({
          id: artist.id,
          name: artist.name,
        })),
        name: track.name,
        duration_ms: track.duration_ms,
        image: track.album?.images?.sort((a, b) => b.width - a.width)[0]?.url,
      })),
    },
  }
  ws.send(JSON.stringify(response))
}

const getArtistAlbums = async (ws: WebSocket, artistId: string) => {
  const data = await spotify.getArtistAlbums(artistId)

  const response: GetArtistAlbumsResponseMessage = {
    type: messageType.GET_ARTIST_ALBUMS_RESPONSE,
    albums: {
      offset: data.offset,
      total: data.total,
      items: data.items.map((album) => ({
        id: album.id,
        name: album.name,
        image: album.images?.sort((a, b) => a.width - b.width)[0].url,
        artists: album.artists.map((artist) => ({
          id: artist.id,
          name: artist.name,
        })),
      })),
    },
  }

  ws.send(JSON.stringify(response))
}

const getAlbumTracks = async (ws: WebSocket, albumId: string) => {
  const data = await spotify.getAlbumTracks(albumId)

  const response: GetAlbumTracksResponseMessage = {
    type: messageType.GET_ALBUM_TRACKS_RESPONSE,
    tracks: {
      offset: data.offset,
      total: data.total,
      items: data.items.map((track) => ({
        id: track.id,
        name: track.name,
        duration_ms: track.duration_ms,
        artists: track.artists.map((artist) => ({
          id: artist.id,
          name: artist.name,
        })),
      })),
    },
  }

  ws.send(JSON.stringify(response))
}
const addTrack = (ws: WebSocket, track: Track) => {
  const uuids = Object.keys(clients)
  uuids.forEach((uuid) => {
    if (ws === clients[uuid].ws) {
      playlist.addTrack(track, { uuid, name: clients[uuid].name })
      broadcastPlaylist()
      return
    }
  })
}

const broadcastPlaylist = () => {
  const items = playlist.getItems(10)
  const data: PlaylistDataMessage = {
    type: messageType.PLAYLIST_DATA,
    items,
  }
  const encodedData = JSON.stringify(data)
  wss.clients.forEach((client) => {
    if (client.readyState !== WebSocket.OPEN) {
      return
    }
    client.send(encodedData)
  })
}

const getDevices = async (ws: WebSocket) => {
  const { devices } = await spotify.getDevices()
  const data: AdminGetDevicesResponseMessage = {
    type: messageType.ADMIN_GET_DEVICES_RESPONSE,
    devices,
  }
  ws.send(JSON.stringify(data))
}

const setDevices = async (ws: WebSocket, deviceId: string) => {
  await spotify.setDevice(deviceId)
  const data: AdminSetDeviceResponseMessage = {
    type: messageType.ADMIN_SET_DEVICE_RESPONSE,
    ok: true,
  }
  ws.send(JSON.stringify(data))
}

const startPlayback = async (ws: WebSocket) => {
  // TODO get current playlist status to start the playback
  await spotify.startPlayback()
  const data: AdminStartPlaybackResponseMessage = {
    type: messageType.ADMIN_START_PLAYBACK_RESPONSE,
    ok: true,
  }
  ws.send(JSON.stringify(data))
}

const pausePlayback = async (ws: WebSocket) => {
  await spotify.pausePlayback()
  const data: AdminPausePlaybackResponseMessage = {
    type: messageType.ADMIN_PAUSE_PLAYBACK_RESPONSE,
    ok: true,
  }
  ws.send(JSON.stringify(data))
}

wss.on("connection", (ws: WebSocket) => {
  console.log("new client connected")

  //on message from client
  ws.on("message", (data) => {
    const json: Message = JSON.parse(data.toString())
    switch (json.type) {
      case messageType.GET_UUID:
        getUuid(ws, json)
        break
      case messageType.REASSIGN_UUID_REQUEST:
        reassingUuid(ws, json)
        break
      case messageType.SEARCH_REQUEST:
        searchRequest(ws, json.query)
        break
      case messageType.GET_ARTIST_ALBUMS_REQUEST:
        getArtistAlbums(ws, json.artistId)
        break
      case messageType.GET_ALBUM_TRACKS_REQUEST:
        getAlbumTracks(ws, json.albumId)
        break
      case messageType.GET_ALBUM_TRACKS_REQUEST:
        getAlbumTracks(ws, json.albumId)
        break
      case messageType.ADD_SONG_REQUEST:
        addTrack(ws, json.track)
        break
      case messageType.ADMIN_GET_DEVICES_REQUEST:
        getDevices(ws)
        break
      case messageType.ADMIN_SET_DEVICE_REQUEST:
        setDevices(ws, json.deviceId)
        break
      case messageType.ADMIN_START_PLAYBACK_REQUEST:
        startPlayback(ws)
        break
      case messageType.ADMIN_PAUSE_PLAYBACK_REQUEST:
        pausePlayback(ws)
        break
      default:
        console.log("message unknown", json)
    }
  })

  // handling what to do when clients disconnects from server
  ws.on("close", () => {
    console.log("the client has disconnected")
  })
  // handling client connection error
  ws.onerror = function () {
    console.log("Some Error occurred")
  }
})
