"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight, Github } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ProjectCardProps {
  title: string
  description: string
  tags: string[]
  image: string
  demoUrl: string
  repoUrl: string
}

export function ProjectCard({ title, description, tags, image, demoUrl, repoUrl }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <div
        className="relative h-full overflow-hidden rounded-xl bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 transition-all duration-300 group-hover:border-cyan-500/50 shadow-lg shadow-cyan-500/5 group-hover:shadow-cyan-500/20"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Efeito de gradiente na borda */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
        
        {/* Efeito de brilho no canto superior */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-700"></div>

        <div className="relative h-full flex flex-col">
          {/* Imagem com overlay */}
          <div className="relative overflow-hidden h-52">
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent z-10"></div>
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              width={800}
              height={400}
              className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? "scale-110" : "scale-100"}`}
            />
            
            {/* Badge de categoria removido conforme solicitado */}
          </div>

          <div className="p-6 flex-grow">
            {/* Título com efeito de hover */}
            <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors duration-300">{title}</h3>
            
            {/* Descrição */}
            <p className="text-sm md:text-base text-muted-foreground mb-4 text-justify">{description}</p>

            {/* Tags com efeito de hover */}
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="inverted"
                  className="bg-zinc-800/80 hover:bg-zinc-700/80 transition-colors duration-300"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Botões com efeito de hover melhorado - ajustados para mesma linha com mais largura */}
            <div className="flex justify-center gap-4 mt-auto pt-4 border-t border-zinc-700/50">
              <Button
                size="sm"
                variant={repoUrl ? "outline" : "secondary"}
                disabled={!repoUrl}
                className={repoUrl ? "flex-1 border-zinc-700 hover:border-cyan-500/50 hover:text-cyan-400 transition-all duration-300" : "flex-1"}
                asChild
              >
                <Link href={repoUrl || '#'} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-2" />
                  Código
                </Link>
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-blue-500 hover:to-cyan-500 border-0 transition-all duration-300 shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/40"
                asChild
              >
                <Link href={demoUrl} target="_blank" rel="noopener noreferrer">
                  Demo
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
