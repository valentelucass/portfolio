'use client'

import { useEffect } from 'react'
import { applyAllFixes, verifyFixes } from '@/lib/css-fixes'

/**
 * Hook para aplicar correções CSS automaticamente
 * 
 * Este hook aplica correções para problemas de cores que voltam ao estado anterior
 * e monitora mudanças para prevenir problemas futuros.
 */
export function useCSSFixes() {
  useEffect(() => {
    // Aplicar correções quando o componente montar
    applyAllFixes()
    
    // Verificar se as correções foram aplicadas após um delay
    const timeoutId = setTimeout(() => {
      verifyFixes()
    }, 2000)
    
    // Cleanup
    return () => {
      clearTimeout(timeoutId)
    }
  }, [])
}

/**
 * Hook para verificar status das correções CSS
 * 
 * Retorna o status atual das correções aplicadas
 */
export function useCSSFixesStatus() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const status = localStorage.getItem('css-fixes-status')
      if (status) {
        console.log('📊 Status das correções CSS:', JSON.parse(status))
      }
    }
  }, [])
  
  return {
    getStatus: () => {
      if (typeof window !== 'undefined') {
        const status = localStorage.getItem('css-fixes-status')
        return status ? JSON.parse(status) : null
      }
      return null
    }
  }
} 