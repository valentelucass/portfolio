"use client"
// hooks/use-github-data.ts
import { useEffect, useState, useRef } from "react";
import { fetchGithubSkills } from "../lib/github";
import type { Skill } from "../types/github";

const fallbackSkills: Skill[] = [
  { name: "Java", percentage: 45, color: "#ed8b00" },
  { name: "MySQL", percentage: 25, color: "#336791" },
  { name: "CSS", percentage: 15, color: "#1572b6" },
  { name: "HTML", percentage: 10, color: "#e34f26" },
  { name: "JavaScript", percentage: 5, color: "#f7df1e" },
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