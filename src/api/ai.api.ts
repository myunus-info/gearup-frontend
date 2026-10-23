import apiClient from '@/lib/apiClient';
import type { IApiResponse } from '@/types';

export interface AiChatPayload {
  message: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface AiChatResult {
  reply: string;
  recommendedGearIds: string[];
  recommendedGears?: Array<{
    id: string;
    name: string;
    pricePerDay: number;
    category?: string;
  }>;
  model: string;
}

export function postAiChat(payload: AiChatPayload) {
  return apiClient<IApiResponse<AiChatResult>>('/ai/chat', {
    method: 'POST',
    body: payload,
  });
}

export interface AiSearchSuggestionsResult {
  query: string;
  suggestions: Array<{
    term: string;
    label: string;
    category: string;
  }>;
  matchingGears: Array<{
    id: string;
    name: string;
    brand?: string;
    pricePerDay: number;
    images: string[];
    category?: string;
  }>;
}

export function getAiSearchSuggestions(query = '') {
  return apiClient<IApiResponse<AiSearchSuggestionsResult>>('/ai/search-suggestions', {
    query: query ? { q: query } : undefined,
  });
}
