"use client"

import { useEffect, useState } from 'react'
import { fetchGithubSkills } from '@/lib/github'
import { Skill } from '@/types/github'
import { motion } from 'framer-motion'

interface GitHubSkillsProps {
  username: string
  fallbackSkills?: Skill[]
}

export default function GitHubSkills({ username, fallbackSkills = [] }: GitHubSkillsProps) {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string[]>([])

  useEffect(() => {
    const loadSkills = async () => {
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

        console.log('[DEBUG] Iniciando busca de skills para:', username)
        
        const githubSkills = await fetchGithubSkills(username)
        setSkills(githubSkills)
        
        // Restaura console.log original
        console.log = originalLog
        
        // Filtra apenas logs de debug relevantes
        const relevantLogs = debugLogs.filter(log => 
          log.includes('[DEBUG]') || 
          log.includes('Erro') || 
          log.includes('Status') ||
          log.includes('Token')
        )
        setDebugInfo(relevantLogs)
        
      } catch (err) {
        console.error('Erro ao carregar skills:', err)
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
        setSkills(fallbackSkills)
      } finally {
        setLoading(false)
      }
    }

    loadSkills()
  }, [username, fallbackSkills])

  if (loading) {
    return (
      <div className="space-y-4 mt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-400 mt-2">Carregando skills do GitHub...</p>
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
      <div className="space-y-4 mt-16">
        <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4">
          <h3 className="text-red-400 font-semibold mb-2">Erro ao carregar skills</h3>
          <p className="text-red-300 text-sm">{error}</p>
          <p className="text-gray-400 text-xs mt-2">
            Usando skills padrão como fallback
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

        {/* Fallback Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-16">
          {fallbackSkills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="h-32 bg-zinc-800/50 rounded-2xl shadow-lg backdrop-blur-md border border-zinc-700/50 p-6 flex flex-col justify-between transition-all duration-300 hover:border-cyan-500/70 hover:shadow-2xl relative overflow-hidden group"
            >
              {/* Gradiente de fundo no hover */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-700 pointer-events-none" />
              <div className="font-bold text-lg text-white z-10 relative">{skill.name}</div>
              <div className="w-full h-2.5 bg-zinc-700 rounded-full overflow-hidden mb-2 z-10 relative">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-700"
                  style={{ width: `${skill.percentage}%` }}
                />
              </div>
              <div className="text-right text-sm text-zinc-300 z-10 relative">{skill.percentage}%</div>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-16">
      {skills.map((skill, index) => (
        <motion.div
          key={skill.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="h-32 bg-zinc-800/50 rounded-2xl shadow-lg backdrop-blur-md border border-zinc-700/50 p-6 flex flex-col justify-between transition-all duration-300 hover:border-cyan-500/70 hover:shadow-2xl relative overflow-hidden group"
        >
          {/* Gradiente de fundo no hover */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-700 pointer-events-none" />
          <div className="font-bold text-lg text-white z-10 relative">{skill.name}</div>
          <div className="w-full h-2.5 bg-zinc-700 rounded-full overflow-hidden mb-2 z-10 relative">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-700"
              style={{ width: `${skill.percentage}%` }}
            />
          </div>
          <div className="text-right text-sm text-zinc-300 z-10 relative">{skill.percentage}%</div>
        </motion.div>
      ))}
    </div>
  )
} 