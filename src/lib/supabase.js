const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function assertSupabaseEnv() {
    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Missing Supabase env vars: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY");
    }
}

async function supabaseRequest(path, options = {}) {
    assertSupabaseEnv();
    const { method = "GET", body, headers = {} } = options;
    const restUrl = `${supabaseUrl}/rest/v1`;

    const response = await fetch(`${restUrl}${path}`, {
        method,
        headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`,
            "Content-Type": "application/json",
            ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        let errorMessage = `Supabase request failed (${response.status})`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.details || errorMessage;
        } catch {
            // keep fallback message if response is not JSON
        }
        throw new Error(errorMessage);
    }

    if (response.status === 204) return null;
    return response.json();
}

export async function fetchCitiesFromDb() {
    return supabaseRequest("/cities?select=*&order=visited_at.desc");
}

export async function fetchCityByIdFromDb(id) {
    return supabaseRequest(`/cities?select=*&id=eq.${encodeURIComponent(id)}`, {
        headers: { Accept: "application/vnd.pgrst.object+json" },
    });
}

export async function createCityInDb(cityPayload) {
    const rows = await supabaseRequest("/cities", {
        method: "POST",
        body: cityPayload,
        headers: { Prefer: "return=representation" },
    });

    return rows[0];
}

export async function deleteCityFromDb(id) {
    await supabaseRequest(`/cities?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
}
