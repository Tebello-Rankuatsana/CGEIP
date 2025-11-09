import app from './index.js';
import { VercelRequest, VercelResponse } from '@vercel/node';

// Wrap Express app as Vercel serverless function
export default async function handler(req, res) {
  return app(req, res);
}
