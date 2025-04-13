/* prettier-ignore */

/* eslint-disable */

export interface PartySong {
    spotify_id: string;
    name: string;
    album: {
        spotify_id: string;
        name: string;
        image_url: string;
        [k: string]: unknown;
    };
    /**
     * @minItems 1
     */
    artists: [
        {
            spotify_id: string;
            name: string;
            [k: string]: unknown;
        },
        ...{
            spotify_id: string;
            name: string;
            [k: string]: unknown;
        }[]
    ];
    length: number;
    score?: number;
    rating?: number;
    user?: string;

    [k: string]: unknown;
}

export interface PartyData {
  data: {
    code: string
    name: string
    status: {
      code: string
      name: string
      backup_playlist_id: string
      status: {
        device: {
          id: string
          name: string
          type: string
          volume: number
          [k: string]: unknown
        }
        repeat: string
        shuffle: boolean
        active: boolean
        isPlaying: boolean
        progress: number
        length: number
        updatedAt: string
        [k: string]: unknown
      }
      now?: PartySong
      current?: PartySong
      next?: PartySong
      show_qrcode: number
      created_at: string
      updated_at: string
      [k: string]: unknown
    }
    [k: string]: unknown
  }

  [k: string]: unknown
}
