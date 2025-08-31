// Fix: Import `Type` from @google/genai to be used in the response schema.
import { GoogleGenAI, Type } from "@google/genai";
import { Movie, Review, GENRES, GroundingChunk } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const parseJsonResponse = <T,>(jsonString: string, fallback: T): T => {
    try {
        const cleanedJsonString = jsonString.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
        return JSON.parse(cleanedJsonString) as T;
    } catch (error) {
        console.error("Failed to parse JSON response:", error);
        console.error("Original string:", jsonString);
        return fallback;
    }
};

export const fetchMoviesFromAI = async (genre: string, searchTerm: string): Promise<Movie[]> => {
    let prompt = `Generate a JSON array of 50 real, popular, and high-quality movies from a variety of genres. For each movie, create a JSON object with these exact keys: "id" (a unique UUID string), "title" (string), "genre" (string from the list: ${GENRES.join(', ')}), "releaseYear" (integer), "director" (string), "cast" (array of strings), "synopsis" (a 2-3 sentence string), "posterUrl" (a placeholder image URL from https://picsum.photos/500/750), and "averageRating" (a float between 1.0 and 5.0). The output must be only the JSON array, with no other text or markdown.`;

    if (genre) {
        prompt = `Generate a JSON array of 50 real, popular, and high-quality movies in the "${genre}" genre. Each movie object must strictly follow the defined structure above.`;
    }
    if (searchTerm) {
        prompt = `Generate a JSON array of 50 real movies with titles related to "${searchTerm}". Each movie object must strictly follow the defined structure above.`;
    }
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{googleSearch: {}}],
            },
        });

        return parseJsonResponse<Movie[]>(response.text, []);
    } catch (error) {
        console.error("Error fetching movies from AI:", error);
        return [];
    }
};

export const fetchMovieDetailsFromAI = async (movieId: string, movieTitle: string): Promise<{ movie: Movie | null; sources: GroundingChunk[] }> => {
    const prompt = `Generate a detailed JSON object for the real movie titled "${movieTitle}" with id "${movieId}". Find the correct director, cast, release year, synopsis, and genre for this movie. The JSON object must have these exact keys: "id", "title", "genre", "releaseYear", "director", "cast", "synopsis", "posterUrl" (use https://picsum.photos/500/750?random=${Math.floor(Math.random() * 100)}), "averageRating" (a plausible float between 1.0 and 5.0), "trailerUrl" (a valid YouTube embed URL), and "reviews" (an array of 5 realistic but fictional user reviews). Each review object needs: "userId" (unique UUID), "username", "rating" (1-5), "text", and "timestamp" (ISO 8601). The output must be only the JSON object, with no other text or markdown.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{googleSearch: {}}],
            },
        });
        
        const movie = parseJsonResponse<Movie>(response.text, null);
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
        
        return { movie, sources };
    } catch (error) {
        console.error("Error fetching movie details from AI:", error);
        return { movie: null, sources: [] };
    }
};

export const submitReviewToAI = async (movieId: string, review: Omit<Review, 'userId' | 'timestamp' | 'username'>): Promise<{ success: boolean; newAverageRating: number }> => {
    const prompt = `A user submitted a review for movie ID ${movieId}. The review is: rating ${review.rating}, text "${review.text}". Acknowledge this by returning a JSON object with 'success: true' and a plausible new 'newAverageRating' for the movie. The previous average rating was 4.2.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        success: { type: Type.BOOLEAN },
                        newAverageRating: { type: Type.NUMBER },
                    }
                }
            }
        });
        
        return parseJsonResponse(response.text, { success: false, newAverageRating: 0 });
    } catch(error) {
        console.error("Error submitting review to AI:", error);
        return { success: false, newAverageRating: 0 };
    }
};

export const fetchRecommendedMoviesFromAI = async (favoriteGenres: string[], seenMovies: string[]): Promise<Movie[]> => {
    const prompt = `
      Based on a user's favorite movie genres which are [${favoriteGenres.join(', ')}], please recommend 6 unique and interesting real movies they might enjoy.
      Do not include any of the following movies they have already seen or have on their watchlist: [${seenMovies.join(', ')}].
      Return the answer as a JSON array of movie objects. Each object must have these exact keys: "id" (a unique UUID string), "title" (string), "genre" (string), "releaseYear" (integer), "director" (string), "cast" (array of strings), "synopsis" (a 2-3 sentence string), "posterUrl" (a placeholder image URL from https://picsum.photos/500/750), and "averageRating" (a float between 1.0 and 5.0).
      The output must be only the JSON array, with no other text or markdown.
    `;
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
        },
      });
  
      return parseJsonResponse<Movie[]>(response.text, []);
    } catch (error) {
      console.error("Error fetching recommendations from AI:", error);
      return [];
    }
  };