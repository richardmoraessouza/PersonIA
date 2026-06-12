import { API_URL } from "../../config/api";
import axios from "axios";
import type { Character, CharacterbyId, views, Tag} from "../../types/characters/characters";

// show all characters in the explore page
export const getCharactersPaginated = async (
    limit = 20,
    offset = 0,
    seed = 0.5,
): Promise<Character[]> => {
    try {
        const params = new URLSearchParams({
            limit: String(limit),
            offset: String(offset),
            seed: String(seed),
        });
        const res = await axios.get<Character[]>(`${API_URL}/character/explore?${params}`);
        return res.data;
    } catch (error) {
        console.error('Error fetching paginated characters:', error);
        throw error;
    }
};

// Search for the character data by id
export async function searchCharacterById(personagemId: number): Promise<CharacterbyId> {
    try {
        const res = await axios.get(`${API_URL}/character/data-character-by-id/${personagemId}`);

        return res.data;
    } catch (error) {
        console.error(`Error searching character data for ${personagemId}:`, error);
        throw error;
    }
}

// Increments the chat view count for a character — requires a valid token
export async function incrementChatViews(personagemId: number, token: string): Promise<views> {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const res = await axios.post<views>(`${API_URL}/character/increment-chat-views/${personagemId}`, {}, config);

        return res.data;
    } catch (err: any) {
        console.error('Error incrementing chat views:', err);
        throw err;
    }
}

// update character
export async function updateCharacterService(personagemId: number, payload: any, token: string): Promise<Character> {
    const res = await axios.put(
        `${API_URL}/character/update-character/${personagemId}`, 
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
}

// create character
export async function createCharacterService(usuarioId: number, payload: any, token: string): Promise<Character> {
    try {
        const res = await axios.post(
            `${API_URL}/character/create-character/${usuarioId}`, 
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return res.data;
    } catch (err: any) {
        console.error('[createCharacterService] ❌ Erro ao criar:', err?.response?.data || err?.message);
        throw err;
    }
}

/**
 * Fetches all available categories/tags to render the filter buttons on the UI
 */
export const fetchTagsService = async (): Promise<Tag[]> => {
    try {
        const res = await axios.get<Tag[]>(`${API_URL}/ratings/tags`);
        return res.data;
    } catch (error) {
        console.error('Error fetching system tags:', error);
        throw error;
    }
};

/**
 * Fetches characters for a specific category slug using your global Character type
 */
export const fetchCharactersByCategoryService = async (
    slug: string,
    limit = 20,
    offset = 0
): Promise<Character[]> => {
    try {
        const res = await axios.get<Character[]>(
            `${API_URL}/ratings/characters/${slug}?limit=${limit}&offset=${offset}`
        );
        return res.data;
    } catch (error) {
        console.error(`Error fetching characters for category "${slug}":`, error);
        throw error;
    }
};

export async function getCharactersByUserId(usuarioId: number): Promise<Character[]> {
    try {
        const res = await axios.get(`${API_URL}/character/user-search-by-id/${usuarioId}`);
        const data = res.data;
        return Array.isArray(data) ? data : (data?.personagens || []);
    } catch (error) {
        console.error(`Error fetching characters for user ${usuarioId}:`, error);
        return [];
    }
}

export async function getRecentCharacters(usuarioId: number): Promise<Character[]> {
    try {
        const res = await axios.get(`${API_URL}/character/get-recent-characters/${usuarioId}`);
        const data = res.data;
        return Array.isArray(data) ? data : (data?.personagens || []);
    } catch (error) {
        console.error(`Error fetching recent characters for user ${usuarioId}:`, error);
        return [];
    }
}