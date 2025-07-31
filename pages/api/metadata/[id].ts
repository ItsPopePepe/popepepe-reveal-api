import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const tokenId = parseInt(id as string);

  if (isNaN(tokenId) || tokenId < 0 || tokenId >= 10000) {
    return res.status(400).json({ error: "Invalid token ID" });
  }

  const tier = getTierFromTokenId(tokenId);

  try {
    const basePath = path.join(process.cwd(), 'pages', 'api', '_data');
    const revealConfig = JSON.parse(fs.readFileSync(path.join(basePath, 'reveal.json'), 'utf8'));
    const revealedMetadata = JSON.parse(fs.readFileSync(path.join(basePath, 'revealedMetadata.json'), 'utf8'));
    const placeholder = JSON.parse(fs.readFileSync(path.join(basePath, 'placeholder.json'), 'utf8'));

    const isRevealed = revealConfig[tier.toString()];
    const metadata = revealedMetadata[tokenId];

    if (!isRevealed || !metadata) {
      return res.status(200).json(placeholder);
    }

    return res.status(200).json(metadata);
  } catch (err) {
    return res.status(500).json({ error: 'Metadata loading failed', detail: err });
  }
}

function getTierFromTokenId(tokenId: number): number {
  if (tokenId < 1000) return 0;
  if (tokenId < 3000) return 1;
  if (tokenId < 5000) return 2;
  if (tokenId < 7000) return 3;
  return 4;
}
