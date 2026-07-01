/**
 * useDefaultsData.js
 * Admin-only hooks for reading data from the defaults_* Firestore collections.
 * Mirrors useData.js but targets defaultsManager.js functions.
 * These hooks are only used inside admin panel components.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getDefaultAboutContent,
  getDefaultTimeline,
  getDefaultTechStack,
  getDefaultContactContent,
  getDefaultSocials,
  getDefaultServices,
  getDefaultProjects,
  getDefaultBlogs,
} from '@/lib/utils/defaultsManager';

// ── Generic hook factory ──────────────────────────────────────────────────────
const makeDefaultsHook = (fetchFn) => () => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchFn();
      setData(result);
      setError(null);
    } catch (err) {
      console.error('[useDefaultsData] Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { data, loading, error, refresh };
};

// ── Per-section hooks ─────────────────────────────────────────────────────────

/** Returns { data: { title, subtitle, description, skills }, loading, error, refresh } */
export const useDefaultAboutData     = makeDefaultsHook(getDefaultAboutContent);

/** Returns { data: timelineArray, loading, error, refresh } */
export const useDefaultTimelineData  = makeDefaultsHook(getDefaultTimeline);

/** Returns { data: techStackArray, loading, error, refresh } */
export const useDefaultTechStackData = makeDefaultsHook(getDefaultTechStack);

/** Returns { data: { email, phone, location, availability }, loading, error, refresh } */
export const useDefaultContactData   = makeDefaultsHook(getDefaultContactContent);

/** Returns { data: socialsArray, loading, error, refresh } */
export const useDefaultSocialsData   = makeDefaultsHook(getDefaultSocials);

/** Returns { data: servicesArray, loading, error, refresh } */
export const useDefaultServicesData  = makeDefaultsHook(getDefaultServices);

/** Returns { data: projectsArray, loading, error, refresh } */
export const useDefaultProjectsData  = makeDefaultsHook(getDefaultProjects);

/** Returns { data: blogsArray, loading, error, refresh } */
export const useDefaultBlogsData     = makeDefaultsHook(getDefaultBlogs);
