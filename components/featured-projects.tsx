"use client"

import { useEffect, useState } from 'react'
import { getFeaturedProjects } from '@/lib/github'
import { FeaturedProject } from '@/types/github'
import { motion } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { badgeClass } from "@/components/ui/badge"

interface FeaturedProjectsProps {
  username: string
}

export default function FeaturedProjects({ username }: FeaturedProjectsProps) {
  const [projects, setProjects] = useState<FeaturedProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string[]>([])

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true)
        setError(null)
        setDebugInfo([])
        
        // Adiciona logs de debug
        const originalLog = console.log
        const debugLogs: string[] = []
        console.log = (...args) => {
          debugLogs.push(args.join(' '))
          originalLog.apply(console, args)
        }

        console.log('[DEBUG] Iniciando busca de projetos em destaque para:', username)
        
        const featuredProjects = await getFeaturedProjects(username)
        setProjects(featuredProjects)
        
        // Restaura console.log original
        console.log = originalLog
        
        // Filtra apenas logs de debug relevantes
        const relevantLogs = debugLogs.filter(log => 
          log.includes('[DEBUG]') || 
          log.includes('Erro') || 
          log.includes('Status') ||
          log.includes('Token') ||
          log.includes('repo') ||
          log.includes('README') ||
          log.includes('PORTFOLIO-FEATURED')
        )
        setDebugInfo(relevantLogs)
        
      } catch (err) {
        console.error('Erro ao carregar projetos em destaque:', err)
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [username])

  if (loading) {
    return (
      <div className="space-y-4">
        <SectionHeading title="Projetos em Destaque" subtitle="Alguns dos meus trabalhos recentes" />
        
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-400 mt-2">Carregando projetos do GitHub...</p>
        </div>
        
        {/* Debug Info */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-400 mb-2">Debug Info:</h4>
          <div className="text-xs text-gray-300 space-y-1">
            {debugInfo.map((log, index) => (
              <div key={index} className="font-mono">{log}</div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <SectionHeading title="Projetos em Destaque" subtitle="Alguns dos meus trabalhos recentes" />
        
        <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4">
          <h3 className="text-red-400 font-semibold mb-2">Erro ao carregar projetos</h3>
          <p className="text-red-300 text-sm">{error}</p>
        </div>
        
        {/* Debug Info */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-400 mb-2">Debug Info:</h4>
          <div className="text-xs text-gray-300 space-y-1">
            {debugInfo.map((log, index) => (
              <div key={index} className="font-mono">{log}</div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="space-y-4">
        <SectionHeading title="Projetos em Destaque" subtitle="Alguns dos meus trabalhos recentes" />
        
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Nenhum projeto em destaque encontrado.</p>
          <p className="text-muted-foreground text-sm">
            Adicione <code className="bg-gray-800 px-2 py-1 rounded">{"<!-- PORTFOLIO-FEATURED -->"}</code> no README dos seus projetos para destacá-los aqui.
          </p>
        </div>
        
        {/* Debug Info */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-400 mb-2">Debug Info:</h4>
          <div className="text-xs text-gray-300 space-y-1">
            {debugInfo.map((log, index) => (
              <div key={index} className="font-mono">{log}</div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <SectionHeading title="Projetos em Destaque" subtitle="Alguns dos meus trabalhos recentes" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={project.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300"
          >
            {/* Imagem do projeto */}
            {project.imageUrl && (
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.imageUrl}
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            )}

            <div className="p-6">
              {/* Título e descrição */}
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                {project.name}
              </h3>
              <p className="text-sm md:text-base text-zinc-400 mb-4 text-justify">{project.description}</p>

              {/* Tecnologias */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies?.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className={badgeClass}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Botões */}
              <div className="flex gap-3">
                {project.demoUrl && (
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                    onClick={() => window.open(project.demoUrl, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Demo
                  </Button>
                )}
                {project.githubUrl && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-zinc-600 text-zinc-300 hover:bg-zinc-700"
                    onClick={() => window.open(project.githubUrl, '_blank')}
                  >
                    <Github className="w-4 h-4 mr-2" />
                    Código
                  </Button>
                )}
                {!project.githubUrl && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:bg-zinc-700 disabled:text-zinc-400 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-zinc-800 hover:text-accent-foreground h-9 rounded-md px-3 flex-1 border-zinc-600 text-zinc-300 hover:bg-zinc-700"
                    disabled
                  >
                    <Github className="w-4 h-4 mr-2" />
                    Código
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center space-y-4">
      <div className="inline-block">
        <div className="relative px-3 py-1 text-sm font-medium rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
          <span className="relative z-10">{subtitle}</span>
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 animate-pulse"></span>
        </div>
      </div>
      <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
        {title}
      </h2>
      <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full"></div>
    </div>
  )
} 