export const BishopSvg = (fill: string, stroke: string) => baseSvg(bishopPath, fill, stroke);
export const KnightSvg = (fill: string, stroke: string) => baseSvg(knightPath, fill, stroke);
export const RookSvg = (fill: string, stroke: string) => baseSvg(rookPath, fill, stroke);
export const QueenSvg = (fill: string, stroke: string) => baseSvg(queenPath, fill, stroke);
export const PawnSvg = (fill: string, stroke: string) => baseSvg(pawnPath, fill, stroke);
export const KingSvg = (fill: string, stroke: string) => baseSvg(kingPath, fill, stroke);

const baseSvg = (path: string, fill: string, stroke: string) => `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg"><path ${path} fill="${fill}" stroke="${stroke}" stroke-width="4"/></svg>`;

const bishopPath = `d="M100 80C100 80 110 70 80 30 50 70 60 80 60 80L60 100 40 120 40 130 120 130 120 122 100 100Z"`;
const knightPath = `d="M90 30 70 25 45 35 50 40 40 50 40 60 50 60 45 65 60 65 70 55 80 60 80 80 70 100 60 100 40 120 40 130 120 130 120 122 100 100 110 80 110 60 105 40Z"`;
const pawnPath = `d="M100 90C120 70 100 50 80 50 60 50 40 70 60 90L60 100 40 120 40 130 120 130 120 122 100 100Z"`;
const queenPath = `d="M100 80C100 80 110 70 110 30 90 50 100 50 80 30 60 50 70 50 50 30 50 70 60 80 60 80L60 100 40 120 40 130 120 130 120 122 100 100Z"`;
const rookPath = `d="M50 50 60 70 60 100 40 120 40 130 120 130 120 122 100 100 100 70 110 50 110 30 90 30 90 46 70 46 70 30 50 30Z"`;
const kingPath = `d="M100 80C100 80 120 30 110 30 100 20 100 50 84 30L84 56 92 56 92 64 84 64 84 75 80 85 76 75 76 64 68 64 68 56 76 56 76 30C60 50 60 20 50 30 40 30 60 80 60 80L60 100 40 120 40 130 120 130 120 122 100 100Z"`;
