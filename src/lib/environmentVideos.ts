/**
 * Environment-specific background video mapping.
 * Maps environment slugs to cinematic looping background videos.
 */

import envAirport from '@/assets/env-airport.mp4';
import envCafe from '@/assets/env-cafe.mp4';
import envHospital from '@/assets/env-hospital.mp4';
import envHotel from '@/assets/env-hotel.mp4';
import envJobInterview from '@/assets/env-job-interview.mp4';
import envFlatshare from '@/assets/env-flatshare.mp4';
import envMarketplace from '@/assets/env-marketplace.mp4';

const environmentVideos: Record<string, string> = {
  // Core environments
  airport: envAirport,
  cafe: envCafe,
  café: envCafe,
  hospital: envHospital,
  'medical-clinic': envHospital,
  'medical_clinic': envHospital,
  hotel: envHotel,
  'job-interview': envJobInterview,
  'job_interview': envJobInterview,
  interview: envJobInterview,
  flatshare: envFlatshare,
  flat_share: envFlatshare,
  apartment: envFlatshare,
  marketplace: envMarketplace,
  market: envMarketplace,
  shop: envMarketplace,
  shopping: envMarketplace,
  supermarket: envMarketplace,
  bazaar: envMarketplace,

  // Mission-based aliases (Immergo missions)
  'airport-checkin': envAirport,
  'flight-booking': envAirport,
  'hotel-checkin': envHotel,
  'hotel-reservation': envHotel,
  'restaurant': envCafe,
  'restaurant-booking': envCafe,
  'doctor-appointment': envHospital,
  'emergency': envHospital,
  'pharmacy': envHospital,
  'market-bargaining': envMarketplace,
  'grocery-shopping': envMarketplace,
  'souvenir-shopping': envMarketplace,
};

/**
 * Get the background video URL for a given environment slug.
 * Returns null if no matching video is found.
 */
export function getEnvironmentVideo(slug: string | undefined | null): string | null {
  if (!slug) return null;
  const normalised = slug.toLowerCase().trim();
  return environmentVideos[normalised] ?? null;
}

/**
 * Try to match an environment video from a mission title or description.
 */
export function getVideoForMissionContext(context: string): string | null {
  const lower = context.toLowerCase();
  if (lower.includes('airport') || lower.includes('flight') || lower.includes('check-in') || lower.includes('boarding')) return envAirport;
  if (lower.includes('café') || lower.includes('cafe') || lower.includes('coffee') || lower.includes('restaurant') || lower.includes('food')) return envCafe;
  if (lower.includes('hospital') || lower.includes('doctor') || lower.includes('medical') || lower.includes('clinic') || lower.includes('pharmacy') || lower.includes('emergency')) return envHospital;
  if (lower.includes('hotel') || lower.includes('reservation') || lower.includes('check in') || lower.includes('lobby')) return envHotel;
  if (lower.includes('interview') || lower.includes('job') || lower.includes('office') || lower.includes('company')) return envJobInterview;
  if (lower.includes('flat') || lower.includes('apartment') || lower.includes('roommate') || lower.includes('share') || lower.includes('rent')) return envFlatshare;
  if (lower.includes('market') || lower.includes('shop') || lower.includes('buy') || lower.includes('bargain') || lower.includes('grocery') || lower.includes('souvenir') || lower.includes('stall') || lower.includes('vendor') || lower.includes('supermarket')) return envMarketplace;
  return null;
}
