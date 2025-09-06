"use client"

import { useEffect, useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getFeaturedProjects } from '@/lib/github'
import { FeaturedProject } from '@/types/github'
import { motion } from 'framer-motion'
import { ExternalLink, Github, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { badgeClass, badgeClassInverted } from "@/components/ui/badge"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

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
      // Captura informações para debug sem usar console.log
      const debugLogs: string[] = []
      
      try {
        setLoading(true)
        setError(null)
        setDebugInfo([])
        
        debugLogs.push(`[DEBUG] Iniciando busca de projetos em destaque para: ${username}`)
        
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
        
        // Define logs relevantes para debug
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
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
        debugLogs.push(`Erro ao carregar projetos em destaque: ${err instanceof Error ? err.message : 'Erro desconhecido'}`)
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
      whileHover={{ y: -5 }}
      className="group"
      style={{ position: 'relative' }}
    >
      <div className="relative h-full overflow-hidden rounded-xl bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 transition-all duration-300 group-hover:border-cyan-500/50 shadow-lg shadow-cyan-500/5 group-hover:shadow-cyan-500/20 flex flex-col justify-between" style={{ pointerEvents: 'auto', position: 'static', minHeight: '100%' }}>
        {/* Efeito de gradiente na borda */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
        
        {/* Efeito de brilho no canto superior */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-700"></div>

        {/* Imagem do projeto */}
        {project.imageUrl && (
          <div className="relative overflow-hidden h-52" style={{ pointerEvents: 'none' }}>
            {/* Overlay gradiente ao passar o mouse */}
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
            {/* Overlay gradiente permanente para legibilidade do texto */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent z-10"></div>
            
            <Image
              src={project.imageUrl}
              alt={project.name}
              width={800}
              height={400}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            
            {/* Badge de categoria removido conforme solicitado */}
          </div>
        )}

        <div className="p-6 flex-grow" style={{ position: 'relative', zIndex: 1 }}>
          {/* Título com efeito de hover */}
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">
            {project.name}
          </h3>
          
          {/* Descrição - limitada a 3 linhas */}
          <p className="text-sm md:text-base text-zinc-400 mb-4 text-justify line-clamp-3 overflow-hidden">
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

          {/* Tecnologias com efeito de hover - em carrossel */}
          <div className="relative mb-6 px-7"> {/* Adicionado padding para as setas não sobreporem */}
            <Carousel
              opts={{
                align: "start",
                loop: project.technologies?.length > 3,
                dragFree: true
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2">
                {project.technologies?.map((tech, techIndex) => (
                  <CarouselItem key={techIndex} className="pl-2 basis-auto">
                    <span
                      className="inline-flex items-center rounded-md border border-zinc-700/50 bg-zinc-800/80 px-2 py-1 text-xs font-medium text-zinc-300 hover:bg-zinc-700/80 hover:text-cyan-400 transition-colors duration-300 whitespace-nowrap"
                    >
                      {tech}
                    </span>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {project.technologies?.length > 3 && (
                <>
                  <CarouselPrevious 
                    className="absolute -left-8 top-1/2 -translate-y-1/2 h-6 w-6 bg-zinc-800/80 hover:bg-zinc-700/80"
                    variant="ghost"
                  />
                  <CarouselNext 
                    className="absolute -right-8 top-1/2 -translate-y-1/2 h-6 w-6 bg-zinc-800/80 hover:bg-zinc-700/80"
                    variant="ghost"
                  />
                </>
              )}
            </Carousel>
          </div>

          {/* Botões com efeito de hover melhorado - ajustados para mesma linha com mais largura */}
          <div className="flex justify-center gap-4 mt-auto pt-4 border-t border-zinc-700/50 relative z-50 h-[60px]" style={{ pointerEvents: 'auto', position: 'relative', marginTop: 'auto' }}>
            {project.githubUrl ? (
              <a 
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 w-full h-10 rounded-md px-3 inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium border border-zinc-700 bg-background hover:bg-accent hover:text-accent-foreground hover:border-cyan-500/50 hover:text-cyan-400 transition-all duration-300 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(project.githubUrl, '_blank', 'noopener,noreferrer');
                }}
              >
                <Github className="w-4 h-4 mr-2" />
                Código
              </a>
            ) : (
              <button
                className="flex-1 h-10 rounded-md px-3 inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium border border-zinc-700 text-zinc-400 opacity-50 cursor-not-allowed"
                disabled
              >
                <Github className="w-4 h-4 mr-2" />
                Código
              </button>
            )}
            
            {project.demoUrl && (
              <a 
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 w-full h-10 rounded-md px-3 inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-blue-500 hover:to-cyan-500 border-0 transition-all duration-300 shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/40 text-white cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(project.demoUrl, '_blank', 'noopener,noreferrer');
                }}
              >
                Demo
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            )}
          </div>
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