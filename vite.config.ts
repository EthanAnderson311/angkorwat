import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';
import {GoogleGenAI} from '@google/genai';

function expressApiPlugin(): Plugin {
  return {
    name: 'api-chat-plugin',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method Not Allowed');
          return;
        }

        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          try {
            const { prompt, history } = JSON.parse(body || '{}');
            const apiKey = process.env.GEMINI_API_KEY;

            if (!apiKey) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ 
                reply: "Angkor Wat stands as the supreme architectural zenith of King Suryavarman II." 
              }));
              return;
            }

            const ai = new GoogleGenAI({ apiKey });
            const systemInstruction = `You are the Royal Chief Historian & Scholar of Angkor Wat, deeply knowledgeable in 12th century Khmer history, Hindu cosmology (Vishnu, Mount Meru, Samudra Manthan), King Suryavarman II, mortarless sandstone engineering, and modern LiDAR archaeology. Provide concise, accurate, inspiring answers about Angkor Wat's history and architecture.`;

            const contents = [
              { role: 'user', parts: [{ text: systemInstruction }] },
              ...(history || []).map((h: { role: string; text: string }) => ({
                role: h.role === 'user' ? 'user' : 'model',
                parts: [{ text: h.text }],
              })),
              { role: 'user', parts: [{ text: prompt }] },
            ];

            const result = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents,
            });

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ reply: result.text }));
          } catch (err: unknown) {
            console.error('Gemini API Error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            res.end(JSON.stringify({ error: errorMessage }));
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), expressApiPlugin()],
    base: '/angkorwat/',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
