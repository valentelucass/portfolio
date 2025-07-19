"use client"

import { useState, useEffect } from 'react'
import { FeaturedProject } from '@/types/github'
import { getFeaturedProjects } from '@/lib/github'

export function useFeaturedProjects(username: string) {
  const [projects, setProjects] = useState<FeaturedProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFeaturedProjects = async () => {
    try {
      setLoading(true);
      console.log('🔍 Buscando projetos em destaque...');
      
      const projects = await getFeaturedProjects(username);
      console.log('📋 Projetos encontrados:', projects);
      
      setProjects(projects);
    } catch (error) {
      console.error('❌ Erro ao buscar projetos:', error);
      setError(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedProjects()
  }, [username])

  return { projects, loading, error }
} 