import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const llmRules = [
  {
    name: 'claude',
    description: 'Especializado en código, programación, algoritmos y desarrollo de software.',
    keywords: ['código', 'programación', 'algoritmo', 'depuración', 'función', 'clase', 'variable', 'compilación', 'runtime', 'framework']
  },
  {
    name: 'gpt',
    description: 'Experto en explicaciones detalladas y razonamientos lógicos complejos.',
    keywords: ['explica', 'por qué', 'cómo funciona', 'analiza', 'compara', 'contrasta', 'evalúa', 'razona', 'argumenta', 'justifica']
  },
  {
    name: 'gemini',
    description: 'Asistente de propósito general para cualquier otra consulta.',
    keywords: []  // Gemini es el default, no necesita keywords específicas
  }
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  console.log('Received prompt:', prompt);

  try {
    const lowercasePrompt = prompt.toLowerCase();
    
    // Primero, buscamos coincidencias exactas con keywords
    for (const llm of llmRules) {
      if (llm.keywords.some(keyword => lowercasePrompt.includes(keyword))) {
        console.log(`Selected LLM based on keyword match: ${llm.name}`);
        return res.status(200).json({ selectedLLM: llm.name });
      }
    }

    // Si no hay coincidencias exactas, usamos GPT-3.5 para analizar el contenido
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: `Eres un asistente que selecciona el LLM más adecuado para una pregunta dada. 
          Tienes tres opciones:
          1. Claude: ${llmRules[0].description}
          2. GPT: ${llmRules[1].description}
          3. Gemini: ${llmRules[2].description}
          
          Basándote en la pregunta del usuario, selecciona el LLM más apropiado según estas reglas:
          1. Si la consulta está relacionada con código, programación o algoritmos, selecciona Claude.
          2. Si la consulta requiere explicaciones detalladas o involucra razonamientos lógicos complejos, selecciona GPT.
          3. Para cualquier otra consulta o si no está claro a cuál categoría pertenece, selecciona Gemini.
          
          Responde solo con el nombre del LLM seleccionado en minúsculas, sin explicaciones adicionales.`
        },
        { role: "user", content: prompt }
      ],
      max_tokens: 10,
    });

    const selectedLLM = completion.choices[0].message.content?.trim().toLowerCase();
    
    if (!selectedLLM || !['claude', 'gpt', 'gemini'].includes(selectedLLM)) {
      console.log('Invalid LLM selection, defaulting to Gemini');
      return res.status(200).json({ selectedLLM: 'gemini' });
    }

    console.log(`Selected LLM: ${selectedLLM}`);
    res.status(200).json({ selectedLLM });
  } catch (error) {
    console.error('Error selecting LLM:', error);
    res.status(500).json({ error: 'Failed to select LLM', details: error instanceof Error ? error.message : String(error) });
  }
}