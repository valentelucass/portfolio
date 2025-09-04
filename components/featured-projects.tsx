"use client"

import { useEffect, useState, useMemo } from 'react'
import { getFeaturedProjects } from '@/lib/github'
import { FeaturedProject } from '@/types/github'
import { motion } from 'framer-motion'
import { ExternalLink, Github, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { badgeClass, badgeClassInverted } from "@/components/ui/badge"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

interface FeaturedProjectsProps {
  username: string
}

// Definição das categorias de projetos
const PROJECT_CATEGORIES = {
  WEB: 'Desenvolvimento Web',
  MOBILE: 'Aplicativos Móveis',
  DESKTOP: 'Aplicações Desktop',
  DATA: 'Ciência de Dados',
  TOOLS: 'Ferramentas e Utilitários',
  GAMES: 'Jogos',
  OTHER: 'Outros Projetos'
}

// Função para determinar a categoria com base nas tecnologias
function determineCategory(project: FeaturedProject): string {
  const techs = project.technologies.map(t => t.toLowerCase())
  
  if (techs.some(t => ['react native', 'flutter', 'android', 'ios', 'swift', 'kotlin'].includes(t))) {
    return PROJECT_CATEGORIES.MOBILE
  }
  
  if (techs.some(t => ['electron', 'java', 'swing', 'javafx', '.net', 'wpf', 'winforms'].includes(t))) {
    return PROJECT_CATEGORIES.DESKTOP
  }
  
  if (techs.some(t => ['python', 'pandas', 'numpy', 'tensorflow', 'pytorch', 'scikit-learn', 'r'].includes(t)) && 
      !techs.some(t => ['react', 'vue', 'angular', 'next.js'].includes(t))) {
    return PROJECT_CATEGORIES.DATA
  }
  
  if (techs.some(t => ['unity', 'unreal', 'godot', 'phaser', 'game'].includes(t))) {
    return PROJECT_CATEGORIES.GAMES
  }
  
  if (techs.some(t => ['cli', 'bash', 'powershell', 'automation'].includes(t)) && 
      !techs.some(t => ['react', 'vue', 'angular', 'next.js'].includes(t))) {
    return PROJECT_CATEGORIES.TOOLS
  }
  
  // Default para desenvolvimento web
  if (techs.some(t => ['react', 'vue', 'angular', 'next.js', 'html5', 'css3', 'javascript', 'typescript', 'node.js', 'express.js', 'php', 'laravel', 'django', 'flask', 'ruby', 'rails'].includes(t))) {
    return PROJECT_CATEGORIES.WEB
  }
  
  return PROJECT_CATEGORIES.OTHER
}

export default function FeaturedProjects({ username }: FeaturedProjectsProps) {
  const [projects, setProjects] = useState<FeaturedProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const [categoryPages, setCategoryPages] = useState<Record<string, number>>({})
  const [showAllProjects, setShowAllProjects] = useState<Record<string, boolean>>({});

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
        
        // Atribuir categorias aos projetos
        const projectsWithCategories = featuredProjects.map(project => ({
          ...project,
          category: project.category || determineCategory(project)
        }))
        
        setProjects(projectsWithCategories)
        
        // Inicializar páginas das categorias
        const initialCategoryPages: Record<string, number> = {}
        projectsWithCategories.forEach(project => {
          if (!initialCategoryPages[project.category]) {
            initialCategoryPages[project.category] = 0
          }
        })
        setCategoryPages(initialCategoryPages)
        
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

  // Agrupar projetos por categoria
  const projectsByCategory = useMemo(() => {
    const grouped: Record<string, FeaturedProject[]> = {}
    
    projects.forEach(project => {
      const category = project.category || PROJECT_CATEGORIES.OTHER
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(project)
    })
    
    return grouped
  }, [projects])
  
  // Função para navegar entre páginas de uma categoria
  const navigateCategory = (category: string, direction: 'next' | 'prev') => {
    setCategoryPages(prev => {
      const currentPage = prev[category] || 0
      const totalProjects = projectsByCategory[category]?.length || 0
      const totalPages = Math.ceil(totalProjects / 3)
      
      let newPage = currentPage
      if (direction === 'next') {
        newPage = (currentPage + 1) % totalPages
      } else {
        newPage = (currentPage - 1 + totalPages) % totalPages
      }
      
      return { ...prev, [category]: newPage }
    })
  }

  // Função para alternar entre mostrar todos os projetos ou apenas a página atual
  const toggleShowAll = (category: string) => {
    setShowAllProjects(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
    
    // Quando voltar para a visualização de página, garantir que estamos na página correta
    if (showAllProjects[category]) {
      setCategoryPages(prev => ({ ...prev, [category]: 0 }));
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
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
      <div className="space-y-8">
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
      <div className="space-y-8">
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
  
  // Renderizar um projeto individual
  const renderProject = (project: FeaturedProject, index: number) => (
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
        <p className="text-sm md:text-base text-zinc-400 mb-4 text-justify">
          {project.description}
        </p>

        {/* Fallback visual para README ausente com tooltip animado */}
        {(!project.readmeContent || project.readmeContent.trim() === "") && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 mb-4 animate-pulse group/readme-fallback cursor-help">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className="text-yellow-300 text-xs md:text-sm">
                    README.md não encontrado ou não pôde ser carregado.
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-zinc-900 text-yellow-200 border-yellow-400 animate-fade-in">
                Adicione um <b>README.md</b> ao repositório para exibir detalhes completos do projeto aqui.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* Tecnologias */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies?.map((tech, techIndex) => (
            <span
              key={techIndex}
              className={badgeClassInverted}
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
              className="flex-1 border-zinc-600 text-zinc-300 btn-text hover:bg-zinc-700"
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
  )

  return (
    <div className="space-y-12">
      <SectionHeading title="Projetos em Destaque" subtitle="Alguns dos meus trabalhos recentes" />
      
      {/* Renderizar projetos por categoria */}
      {Object.entries(projectsByCategory).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(projectsByCategory).map(([category, categoryProjects]) => {
            // Calcular projetos a exibir na página atual
            const projectsPerPage = 3
            const currentPage = categoryPages[category] || 0
            const startIndex = currentPage * projectsPerPage
            const isShowingAll = showAllProjects[category] || false
            const visibleProjects = isShowingAll 
              ? categoryProjects 
              : categoryProjects.slice(startIndex, startIndex + projectsPerPage)
            const hasMultiplePages = categoryProjects.length > projectsPerPage
            const totalPages = Math.ceil(categoryProjects.length / projectsPerPage)
            
            return (
              <div key={category} className="space-y-6">
                {/* Título da categoria */}
                <div className="flex flex-col items-center justify-center mb-6">
                  <h3 className="text-base font-medium text-zinc-300 mb-1">
                    {category}
                  </h3>
                  <span className="text-xs font-normal text-zinc-400">
                    {categoryProjects.length} {categoryProjects.length === 1 ? 'projeto' : 'projetos'}
                  </span>
                  
                  <div className="flex items-center gap-2 mt-2">
                    {/* Botão para mostrar todos/menos */}
                    {hasMultiplePages && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs border-zinc-700/50 bg-zinc-800/30 text-zinc-300 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors px-3 py-1 h-7"
                        onClick={() => toggleShowAll(category)}
                      >
                        {isShowingAll ? 'Mostrar menos' : 'Ver todos os projetos'}
                      </Button>
                    )}
                    
                    {/* Navegação entre páginas */}
                    {hasMultiplePages && !isShowingAll && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="p-1 h-8 w-8 rounded-full hover:bg-zinc-700/50 hover:text-cyan-400 transition-colors"
                          onClick={() => navigateCategory(category, 'prev')}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        
                        <span className="text-xs text-zinc-400 min-w-[40px] text-center">
                          {currentPage + 1}/{totalPages}
                        </span>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          className="p-1 h-8 w-8 rounded-full hover:bg-zinc-700/50 hover:text-cyan-400 transition-colors"
                          onClick={() => navigateCategory(category, 'next')}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Grade de projetos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {visibleProjects.map((project, index) => renderProject(project, index))}
                </div>
                
                {/* Navegação entre seções quando mostrando todos os projetos */}
                {isShowingAll && hasMultiplePages && (
                  <div className="flex justify-center gap-4 mt-6">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-2 border-zinc-700/50 bg-zinc-800/30 text-zinc-300 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors"
                      onClick={() => {
                        // Voltar para visualização de página
                        toggleShowAll(category);
                      }}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Voltar para visualização em carrossel
                    </Button>
                  </div>
                )}
                
                {/* Indicadores de página */}
                {hasMultiplePages && !isShowingAll && (
                  <div className="flex justify-center gap-2 mt-3">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === currentPage ? 'bg-cyan-500 w-4' : 'bg-zinc-600/30 w-2 hover:bg-zinc-500/50'}`}
                        onClick={() => setCategoryPages(prev => ({ ...prev, [category]: i }))}
                        aria-label={`Página ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum projeto em destaque encontrado.</p>
        </div>
      )}
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