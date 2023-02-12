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
} from "../src/shared/messages"
import { spotify } from "./spotify"

const wss = new WebSocketServer({
  port: process.env.WSS_PORT ? parseInt(process.env.WSS_PORT) : 8080,
  clientTracking: true,
})

const clients: {
  [key: string]: WebSocket
} = {}

const getUuid = (ws: WebSocket, message: GetUuidMessage) => {
  const uuid = uuidv4()
  clients[uuid] = ws
  const data: SetUuidMessage = {
    type: messageType.SET_UUID,
    uuid,
  }
  ws.send(JSON.stringify(data))
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
        image: track.images?.sort((a, b) => b.width - a.width)[0]?.url,
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

wss.on("connection", (ws: WebSocket) => {
  console.log("new client connected")

  //on message from client
  ws.on("message", (data) => {
    const json: Message = JSON.parse(data.toString())
    switch (json.type) {
      case messageType.GET_UUID:
        getUuid(ws, json)
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
