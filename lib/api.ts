
// Generic API Client to fetch from api.php

// URL provided by user or environment
// If your files are in public_html/episode/, use: https://yourdomain.com/episode/api.php
// If your files are in public_html root, use: https://yourdomain.com/api.php
// You can override this by setting VITE_API_URL in your .env file
const API_BASE = process.env.API_URL || 'https://yellow-salmon-323871.hostingersite.com/episode/api.php'; 

interface ApiResponse<T = any> {
    success?: boolean;
    error?: string;
    data?: T;
    [key: string]: any;
}

const getHeaders = () => {
    const token = localStorage.getItem('skyline_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const handleResponse = async (res: Response) => {
    if (res.status === 401) {
        console.warn('Unauthorized (401). Clearing token and redirecting.');
        localStorage.removeItem('skyline_token');
        // Optionally trigger a page reload or event to show login screen
        // window.location.href = '/admin'; // Uncomment if using full page refresh
        return null; 
    }
    if (!res.ok) {
        const errorText = await res.text();
        let errorData;
        try {
            errorData = JSON.parse(errorText);
        } catch {
            errorData = { error: errorText || `API Error: ${res.status} ${res.statusText}` };
        }
        throw new Error(errorData.error || `API Error: ${res.status} ${res.statusText}`);
    }
    return await res.json();
};

export const api = {
    get: async <T = any>(action: string, params: Record<string, string> = {}): Promise<T | null> => {
        try {
            const query = new URLSearchParams({ action, ...params }).toString();
            const res = await fetch(`${API_BASE}?${query}`, {
                method: 'GET',
                headers: { ...getHeaders() }
            });
            return await handleResponse(res);
        } catch (e) {
            console.error(`GET ${action} failed:`, e);
            return null;
        }
    },

    post: async <T = any>(action: string, body: any): Promise<T | null> => {
        try {
            const url = `${API_BASE}?action=${action}`;
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getHeaders()
                },
                body: JSON.stringify(body)
            });
            return await handleResponse(res);
        } catch (e) {
            const error = e instanceof Error ? e.message : String(e);
            console.error(`POST ${action} failed:`, error);
            // If it's a network error, provide more helpful message
            if (error.includes('Failed to fetch') || error.includes('NetworkError')) {
                console.error(`Network error: Unable to reach API at ${API_BASE}. Check CORS and API URL configuration.`);
            }
            return null;
        }
    },

    upload: async (file: File): Promise<string | null> => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const res = await fetch(`${API_BASE}?action=upload_file`, {
                method: 'POST',
                headers: { ...getHeaders() }, // Content-Type is auto-set by fetch for FormData
                body: formData
            });
            
            const data = await handleResponse(res);
            if (data && data.url) return data.url;
            throw new Error(data?.error || 'Upload failed');
        } catch (e) {
            console.error('Upload failed:', e);
            return null;
        }
    }
};