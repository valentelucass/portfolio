"use client"
// hooks/use-github-data.ts
import { useEffect, useState, useRef } from "react";
import { fetchGithubSkills } from "../lib/github";
import type { Skill } from "../types/github";

const fallbackSkills: Skill[] = [
  { name: "Java", percent: 45 },
  { name: "MySQL", percent: 25 },
  { name: "CSS", percent: 15 },
  { name: "HTML", percent: 10 },
  { name: "JavaScript", percent: 5 },
];

export function useGithubData(username: string) {
  const [skills, setSkills] = useState<Skill[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    // Só busca se ainda não foi buscado
    if (hasFetched.current) return;
    
    hasFetched.current = true;
    setLoading(true);
    
    fetchGithubSkills(username)
      .then(setSkills)
      .catch((err) => {
        console.log("Usando fallback skills:", err.message);
        setSkills(fallbackSkills);
        setError("Rate limit da API do GitHub. Exibindo skills padrão.");
      })
      .finally(() => setLoading(false));
  }, [username]);

  return { skills: skills ?? fallbackSkills, loading, error };
} 