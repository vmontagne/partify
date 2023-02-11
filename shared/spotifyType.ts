export enum searchType {
    artist="artist",
    album="album",
    track="track",
}

type PaginatedData<T> = {
    offset: number,
    total: number,
    items:T[]
}

export type Artist = {
    name: string
    id: string
}

export type Album = {
    id: string
    name: string
    artists: Artist[]
}

export type Track = {
    album?:Album
    artists:Artist[]
    id: string
    name: string
    duration_ms: number
}

export type SearchResponse = {
    tracks: PaginatedData<Track>
    artists: PaginatedData<Artist>
    albums: PaginatedData<Album>
}

export type ArtistAlbums = PaginatedData<Album>

export type AlbumTracks = PaginatedData<Track>