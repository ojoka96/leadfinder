declare const process: any;

export default async function handler(req: any, res: any) {
  const { query, city } = req.query;
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Chave da API do Google Maps não configurada." });
  }

  if (!query || !city) {
    return res.status(400).json({ error: "Parâmetros 'query' e 'city' são obrigatórios." });
  }

  try {
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      `${query} em ${city}`
    )}&language=pt-BR&key=${apiKey}`;

    const response = await fetch(searchUrl);
    const data = await response.json();

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      return res.status(400).json({ error: data.error_message || data.status });
    }

    const leads = (data.results || []).map((place: any, index: number) => ({
      id: place.place_id || String(index + 1),
      business_name: place.name,
      address: place.formatted_address,
      rating: place.rating || 0,
      user_ratings_total: place.user_ratings_total || 0,
      has_website: Boolean(place.website),
      website: place.website || null,
      status: "Novo"
    }));

    return res.status(200).json({ results: leads });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Erro ao consultar a API" });
  }
}