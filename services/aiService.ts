import { AIItineraryResponse, TripPlanRequest, DestinationInsight } from "../types";
import { api } from '../lib/api';

type AIProvider = 'gemini' | 'openai';

export const generateTripPlan = async (
  request: TripPlanRequest,
  provider: AIProvider = 'gemini'
): Promise<AIItineraryResponse> => {
  try {
    const response = await api.post<AIItineraryResponse>('generate_trip_plan', {
      provider,
      request
    });

    if (!response) {
      throw new Error('No response from server');
    }

    // Check if response has error
    if ('error' in response) {
      throw new Error(response.error);
    }

    return response as AIItineraryResponse;
  } catch (error) {
    console.error("Error generating trip plan:", error);
    const errorMessage = (error instanceof Error) ? error.message : "An unknown error occurred.";
    return {
      tripTitle: "AI Planner Offline",
      summary: errorMessage,
      estimatedCost: "N/A",
      itinerary: [{ day: 1, title: "Configuration Error", activities: ["Could not connect to the AI service."] }]
    };
  }
};

export const getDestinationInsights = async (
  destinationName: string,
  provider: AIProvider = 'gemini'
): Promise<DestinationInsight> => {
  try {
    const response = await api.post<DestinationInsight>('get_destination_insights', {
      provider,
      destination: destinationName
    });

    if (!response) {
      throw new Error('No response from server');
    }

    // Check if response has error
    if ('error' in response) {
      throw new Error(response.error);
    }

    return response as DestinationInsight;
  } catch (error) {
    console.error("Error fetching destination insights:", error);
    return {
      content: "## Error\nWe could not fetch live details at this moment. Please contact us directly for information.",
      sources: []
    };
  }
};