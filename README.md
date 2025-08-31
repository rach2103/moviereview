Setup and Installation Instructions
This project is a modern, build-less React application that runs directly in the browser.
Prerequisites: You only need a modern web browser and a local web server to serve the files. You can use any simple static server. For example, if you have Node.js installed, you can use npx serve . from the project's root directory.
Environment Variables: Create a mechanism to set the process.env.API_KEY environment variable. This is crucial for the application to function. (See the Environment Variables section below).
Installation: There are no package installation steps (like npm install) because all dependencies (react, @google/genai, etc.) are loaded via a CDN using an importmap in index.html.
Running the App:
Start your static file server from the root directory containing index.html.
Open your web browser and navigate to the local server's address (e.g., http://localhost:3000). The application will load and run.
API Documentation
The application does not have its own backend API. Instead, it interacts directly with the Google Gemini API for all dynamic movie data. All API logic is centralized in src/services/geminiService.ts.
Core Functions:
fetchMoviesFromAI(genre?: string, searchTerm?: string): Promise<Movie[]>
Description: Fetches a list of 50 movies from the Gemini API. Uses Google Search grounding to ensure real movie data.
Parameters:
genre (optional): Filters movies by a specific genre.
searchTerm (optional): Searches for movies with titles related to the term.
Returns: A promise that resolves to an array of Movie objects.
fetchMovieDetailsFromAI(movieId: string, movieTitle: string): Promise<{ movie: Movie | null; sources: GroundingChunk[] }>
Description: Fetches detailed information for a single movie, including a trailer URL and a generated list of 5 fictional reviews. It also uses Google Search grounding.
Parameters:
movieId: The unique ID of the movie.
movieTitle: The title of the movie, used to improve the prompt's accuracy.
Returns: A promise that resolves to an object containing the detailed Movie object and an array of web sources used by the AI.
fetchRecommendedMoviesFromAI(favoriteGenres: string[], seenMovies: string[]): Promise<Movie[]>
Description: Generates 6 personalized movie recommendations based on the user's favorite genres, ensuring not to include movies they have already reviewed or have on their watchlist.
Parameters:
favoriteGenres: An array of genre strings.
seenMovies: An array of movie titles to exclude from the results.
Returns: A promise that resolves to an array of recommended Movie objects.
submitReviewToAI(movieId: string, review: Omit<...>): Promise<{ success: boolean; newAverageRating: number }>
Description: Simulates submitting a user review. It sends the review to the AI and asks for an acknowledgment and a plausible new average rating for the movie. This call uses Gemini's JSON mode with a strict responseSchema for a reliable response format.
Returns: A promise that resolves to an object indicating success and the new calculated average rating.
Database Setup Instructions
The data strategy is as follows:
Movie Data: All movie information is ephemeral. It is generated on-demand by the Gemini API and stored in-memory using React Context (MovieContext). This data is lost when the browser tab is closed.
User Data: User profiles and relationships (followers, watchlist) are hardcoded in src/context/UserContext.tsx as mock data. Changes made during a session (e.g., adding to a watchlist, following a user) are managed in the React state but are not persisted and will reset on a page refresh.
Authentication State: The currently logged-in user's session is persisted. The currentUser object is stored in the browser's localStorage via the AuthContext, allowing the user to remain logged in after a refresh.
Environment Variables Required
Only one environment variable is required for the application to function:
API_KEY: Your Google Gemini API key.
The application code in geminiService.ts expects this to be available as process.env.API_KEY. Without it, the application will throw an error on startup and will not be able to fetch any data.
Additional Notes & Design Decisions
AI-First Approach: The core design decision was to make this an "AI-First" application. Instead of relying on a traditional backend and database for movie data, we use the Gemini API as a dynamic, real-time data source. This allows for infinite content variability but relies on the AI's ability to provide accurate, well-structured data.
Stateless Backend: The architecture is entirely client-side. This simplifies deployment (can be hosted on any static site provider) and development, but it means user-generated content isn't truly persistent.
State Management: We opted for React's built-in Context API for global state management (AuthContext, UserContext, MovieContext). This is a lightweight solution perfect for this application's scale, avoiding the need for external libraries like Redux.
Styling: Tailwind CSS is used via a CDN script for rapid, utility-first styling. The configuration is embedded directly in index.html for simplicity, fitting the build-less nature of the project.
User Experience: Significant effort was put into UX. The app features a dark, immersive theme, responsive design, smooth animations, loading states, and clear error handling to create a polished, professional feel. Protected routes ensure a secure experience for logged-in users.


# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1h964XltbRt4PRiAGKXmMMQQNO0kvRYyK

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
