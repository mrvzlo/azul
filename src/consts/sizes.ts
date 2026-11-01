export const TILE_SIZE = 32;
export const OUTER_GAP = TILE_SIZE / 2;
export const INNER_GAP = 8;
export const CIRCLE_R = (TILE_SIZE + INNER_GAP) * Math.sqrt(2);
export const PLAYER_BOARD_TOP = CIRCLE_R * 2 + TILE_SIZE * 2 + OUTER_GAP * 3;

export const PLAYER_BOARD_LEFT = OUTER_GAP + TILE_SIZE * 5 + INNER_GAP * 4;
export const PLAYER_BOARD_SIZE = TILE_SIZE * 5 + INNER_GAP * 6;
export const WHOLE_BOARD_W = TILE_SIZE * 10 + INNER_GAP * 11;
