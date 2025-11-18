/**
 * @module Coachmark
 * @description Componente de tour guiado (coachmark) com suporte opcional a localStorage
 *
 * @example Uso básico sem persistência
 * ```tsx
 * const steps: CoachmarkStep[] = [
 *   {
 *     target: "#welcome-button",
 *     title: "Bem-vindo!",
 *     description: "Clique aqui para começar",
 *     position: "bottom",
 *   },
 * ];
 *
 * const coachmark = useCoachmark({ steps });
 *
 * return (
 *   <>
 *     <button id="welcome-button">Começar</button>
 *     <Coachmark {...coachmark.props} />
 *   </>
 * );
 * ```
 *
 * @example Uso com localStorage (não exibe novamente)
 * ```tsx
 * const coachmark = useCoachmark({
 *   id: "dashboard-tour", // Define id para habilitar localStorage
 *   steps: dashboardSteps,
 *   autoStart: true, // Inicia automaticamente na primeira vez
 *   autoStartDelay: 1500,
 * });
 *
 * return (
 *   <>
 *     {!coachmark.hasCompleted && (
 *       <Button onClick={coachmark.start}>Iniciar Tour</Button>
 *     )}
 *     <Coachmark {...coachmark.props} />
 *   </>
 * );
 * ```
 *
 * @example Resetar tour (para desenvolvimento/suporte)
 * ```tsx
 * // Resetar um tour específico
 * CoachmarkManager.reset("dashboard-tour");
 *
 * // Resetar todos os tours
 * CoachmarkManager.resetAll();
 *
 * // Verificar se completou
 * if (CoachmarkManager.isCompleted("dashboard-tour")) {
 *   console.log("Usuário já viu este tour");
 * }
 * ```
 */

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import * as React from 'react'

export interface CoachmarkStep {
  target: string | (() => HTMLElement | null)
  title: string
  description: string
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center'
  spotlightPadding?: number
}

export interface CoachmarkProps {
  steps: CoachmarkStep[]
  currentStep: number
  isOpen: boolean
  onNext?: () => void
  onPrev?: () => void
  onClose: () => void
  onComplete?: () => void
  showProgress?: boolean
  showSkip?: boolean
  nextLabel?: string
  prevLabel?: string
  skipLabel?: string
  completeLabel?: string
  overlayColor?: string
  spotlightRadius?: number
}

export const Coachmark: React.FC<CoachmarkProps> = ({
  steps,
  currentStep,
  isOpen,
  onNext,
  onPrev,
  onClose,
  onComplete,
  showProgress = true,
  showSkip = true,
  nextLabel = 'Próximo',
  prevLabel = 'Anterior',
  skipLabel = 'Pular',
  completeLabel = 'Concluir',
  overlayColor = 'rgba(0, 0, 0, 0.7)',
  spotlightRadius = 0,
}) => {
  const [tooltipPosition, setTooltipPosition] = React.useState({
    top: 0,
    left: 0,
  })
  const [spotlightRect, setSpotlightRect] = React.useState<DOMRect | null>(null)
  const tooltipRef = React.useRef<HTMLDivElement>(null)

  const currentStepData = steps[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1

  // Bloquear scroll quando o coachmark estiver ativo
  React.useEffect(() => {
    if (isOpen) {
      // Salvar o estado atual do overflow
      const originalOverflow = document.body.style.overflow
      const originalPaddingRight = document.body.style.paddingRight

      // Calcular a largura da scrollbar para evitar "jump" no layout
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth

      // Aplicar estilos para bloquear o scroll
      document.body.style.overflow = 'hidden'
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`
      }

      // Restaurar os estilos originais ao desmontar
      return () => {
        document.body.style.overflow = originalOverflow
        document.body.style.paddingRight = originalPaddingRight
      }
    }
  }, [isOpen])

  React.useEffect(() => {
    if (!isOpen || !currentStepData) return

    const scrollToElement = (element: Element) => {
      const rect = element.getBoundingClientRect()

      // Adicionar margem de segurança de 100px
      const margin = 100
      const isInViewport =
        rect.top >= margin &&
        rect.left >= margin &&
        rect.bottom <= window.innerHeight - margin &&
        rect.right <= window.innerWidth - margin

      // Se o elemento não está visível ou muito próximo das bordas, fazer scroll
      if (!isInViewport) {
        // Encontrar o container scrollável mais próximo
        const getScrollParent = (node: Element | null): Element | Window => {
          if (!node || node === document.documentElement) {
            return window
          }

          const style = window.getComputedStyle(node)
          const overflowY = style.getPropertyValue('overflow-y')
          const overflow = style.getPropertyValue('overflow')

          if (
            (overflowY === 'auto' ||
              overflowY === 'scroll' ||
              overflow === 'auto' ||
              overflow === 'scroll') &&
            node.scrollHeight > node.clientHeight
          ) {
            return node
          }

          return getScrollParent(node.parentElement)
        }

        const scrollParent = getScrollParent(element.parentElement)

        // Calcular posição de destino para centralizar o elemento
        const elementTop = rect.top + window.pageYOffset
        const elementLeft = rect.left + window.pageXOffset

        // Centralizar o elemento na viewport
        const targetScrollTop =
          elementTop - window.innerHeight / 2 + rect.height / 2
        const targetScrollLeft =
          elementLeft - window.innerWidth / 2 + rect.width / 2

        // Fazer scroll suave SEM mostrar a scrollbar (mantém overflow: hidden)
        const originalScrollBehavior =
          document.documentElement.style.scrollBehavior
        document.documentElement.style.scrollBehavior = 'smooth'

        // Fazer scroll programaticamente (funciona mesmo com overflow: hidden)
        if (scrollParent === window) {
          window.scrollTo({
            top: Math.max(0, targetScrollTop),
            left: Math.max(0, targetScrollLeft),
            behavior: 'smooth',
          })
        } else {
          // Se houver um container scrollável, rolar ele também
          const scrollElement = scrollParent as Element
          scrollElement.scrollTo({
            top: Math.max(0, targetScrollTop - window.pageYOffset),
            left: Math.max(0, targetScrollLeft - window.pageXOffset),
            behavior: 'smooth',
          })
        }

        // Restaurar scroll behavior original após o scroll
        setTimeout(() => {
          document.documentElement.style.scrollBehavior = originalScrollBehavior
        }, 500)
      }
    }

    const updatePosition = () => {
      const targetElement =
        typeof currentStepData.target === 'string'
          ? document.querySelector(currentStepData.target)
          : currentStepData.target()

      if (targetElement) {
        const rect = targetElement.getBoundingClientRect()
        setSpotlightRect(rect)

        const padding = currentStepData.spotlightPadding ?? 8
        const position = currentStepData.position ?? 'bottom'
        const tooltipEl = tooltipRef.current

        if (tooltipEl) {
          const tooltipRect = tooltipEl.getBoundingClientRect()
          let top = 0
          let left = 0

          switch (position) {
            case 'top':
              top = rect.top - tooltipRect.height - padding
              left = rect.left + rect.width / 2 - tooltipRect.width / 2
              break
            case 'bottom':
              top = rect.bottom + padding
              left = rect.left + rect.width / 2 - tooltipRect.width / 2
              break
            case 'left':
              top = rect.top + rect.height / 2 - tooltipRect.height / 2
              left = rect.left - tooltipRect.width - padding
              break
            case 'right':
              top = rect.top + rect.height / 2 - tooltipRect.height / 2
              left = rect.right + padding
              break
            case 'center':
              top = window.innerHeight / 2 - tooltipRect.height / 2
              left = window.innerWidth / 2 - tooltipRect.width / 2
              break
          }

          // Ajustar para manter dentro da viewport
          const maxLeft = window.innerWidth - tooltipRect.width - 16
          const maxTop = window.innerHeight - tooltipRect.height - 16
          left = Math.max(16, Math.min(left, maxLeft))
          top = Math.max(16, Math.min(top, maxTop))

          setTooltipPosition({ top, left })
        }
      }
    }

    // Buscar o elemento alvo
    const targetElement =
      typeof currentStepData.target === 'string'
        ? document.querySelector(currentStepData.target)
        : currentStepData.target()

    if (targetElement) {
      // Fazer scroll para o elemento SEMPRE que mudar de step
      scrollToElement(targetElement)

      // Aguardar o scroll completar antes de atualizar posições
      setTimeout(() => {
        requestAnimationFrame(updatePosition)
      }, 600)
    }

    // Listener de resize
    window.addEventListener('resize', updatePosition)

    // MutationObserver para detectar mudanças no DOM (como accordion abrindo/fechando)
    let observer: MutationObserver | null = null

    if (targetElement) {
      observer = new MutationObserver(() => {
        // Aguardar um pouco para a animação completar
        setTimeout(updatePosition, 100)
      })

      // Observar mudanças no elemento e seus ancestrais (para detectar accordion)
      observer.observe(document.body, {
        attributes: true,
        childList: true,
        subtree: true,
        attributeFilter: ['class', 'style', 'data-state'],
      })
    }

    // Recalcular posição periodicamente durante animações
    const intervalId = setInterval(updatePosition, 150)

    return () => {
      window.removeEventListener('resize', updatePosition)
      if (observer) observer.disconnect()
      clearInterval(intervalId)
    }
  }, [isOpen, currentStep, currentStepData])

  const handleNext = () => {
    if (isLastStep && onComplete) {
      onComplete()
    } else if (onNext) {
      onNext()
    }
  }

  if (!isOpen || !currentStepData) return null

  return (
    <>
      {/* Overlay escuro com recorte para o elemento */}
      {spotlightRect ? (
        <svg
          className="fixed inset-0 z-[9998] pointer-events-none !m-0"
          style={{
            width: '100%',
            height: '100%',
            top: '0 !important',
            left: '0 !important',
            margin: '0 !important',
            padding: '0 !important',
            display: 'block',
          }}
        >
          <defs>
            <mask id="coachmark-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <rect
                x={spotlightRect.left - (currentStepData.spotlightPadding ?? 8)}
                y={spotlightRect.top - (currentStepData.spotlightPadding ?? 8)}
                width={
                  spotlightRect.width +
                  (currentStepData.spotlightPadding ?? 8) * 2
                }
                height={
                  spotlightRect.height +
                  (currentStepData.spotlightPadding ?? 8) * 2
                }
                rx={spotlightRadius}
                fill="black"
              />
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill={overlayColor}
            mask="url(#coachmark-mask)"
            style={{ transition: 'all 0.3s ease' }}
          />
        </svg>
      ) : (
        <div
          className="fixed inset-0 z-[9998] pointer-events-none !m-0"
          style={{
            background: overlayColor,
            transition: 'background 0.3s ease',
            top: '0 !important',
            left: '0 !important',
            margin: '0 !important',
            padding: '0 !important',
          }}
        />
      )}

      {/* Borda destacada no elemento */}
      {spotlightRect && (
        <div
          className="fixed z-[9999] pointer-events-none border-2 border-primary rounded-lg !m-0"
          style={{
            top: `${
              spotlightRect.top - (currentStepData.spotlightPadding ?? 8)
            }px`,
            left: `${
              spotlightRect.left - (currentStepData.spotlightPadding ?? 8)
            }px`,
            width:
              spotlightRect.width + (currentStepData.spotlightPadding ?? 8) * 2,
            height:
              spotlightRect.height +
              (currentStepData.spotlightPadding ?? 8) * 2,
            transition: 'all 0.3s ease',
            borderRadius: spotlightRadius,
            boxShadow:
              '0 0 0 4px rgba(var(--primary), 0.2), 0 0 20px rgba(var(--primary), 0.3)',
            margin: '0 !important',
            padding: '0 !important',
          }}
        />
      )}

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-[10000] animate-in fade-in-0 zoom-in-95 duration-300 !m-0"
        style={{
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`,
          margin: '0 !important',
          padding: '0 !important',
          maxWidth: 'calc(100vw - 32px)',
        }}
      >
        <Card className="min-w-[320px] max-w-[450px] w-max shadow-2xl border-2">
          <CardHeader className="relative pb-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className="text-lg font-semibold leading-none tracking-tight">
                  {currentStepData.title}
                </h3>
                {showProgress && (
                  <p className="text-sm text-muted-foreground mt-1.5">
                    Passo {currentStep + 1} de {steps.length}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="pb-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {currentStepData.description}
            </p>
          </CardContent>

          <CardFooter className="flex items-center justify-between gap-2 pt-0">
            <div className="flex gap-2">
              {!isFirstStep && onPrev && (
                <Button variant="outline" size="sm" onClick={onPrev}>
                  {prevLabel}
                </Button>
              )}
              {showSkip && !isLastStep && (
                <Button variant="ghost" size="sm" onClick={onClose}>
                  {skipLabel}
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {showProgress && (
                <div className="flex gap-1">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={cn(
                        'h-1.5 rounded-full transition-all',
                        index === currentStep
                          ? 'w-6 bg-primary'
                          : index < currentStep
                            ? 'w-1.5 bg-primary/50'
                            : 'w-1.5 bg-muted',
                      )}
                    />
                  ))}
                </div>
              )}

              <Button size="sm" onClick={handleNext}>
                {isLastStep ? completeLabel : nextLabel}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}

export interface UseCoachmarkOptions {
  /**
   * Passos do coachmark
   */
  steps: CoachmarkStep[]
  /**
   * Identificador único para este tour (usado como chave no localStorage)
   * Se não fornecido, o coachmark não terá persistência
   */
  id?: string
  /**
   * Se deve iniciar automaticamente quando o componente montar
   * (apenas se o usuário ainda não completou o tour)
   */
  autoStart?: boolean
  /**
   * Delay em ms antes de iniciar automaticamente
   */
  autoStartDelay?: number
  /**
   * Prefixo para a chave do localStorage
   * @default "coachmark"
   */
  storagePrefix?: string
}

/**
 * Hook para gerenciar Coachmark com persistência opcional no localStorage
 *
 * @example Uso sem persistência
 * ```tsx
 * const coachmark = useCoachmark({
 *   steps: mySteps,
 * });
 *
 * return <Coachmark {...coachmark.props} />;
 * ```
 *
 * @example Uso com persistência (localStorage)
 * ```tsx
 * const coachmark = useCoachmark({
 *   id: "dashboard-tour",
 *   steps: dashboardSteps,
 *   autoStart: true,
 * });
 *
 * return (
 *   <>
 *     {!coachmark.hasCompleted && (
 *       <Button onClick={coachmark.start}>Iniciar Tour</Button>
 *     )}
 *     <Coachmark {...coachmark.props} />
 *   </>
 * );
 * ```
 */
export const useCoachmark = ({
  steps,
  id,
  autoStart = false,
  autoStartDelay = 1000,
  storagePrefix = 'coachmark',
}: UseCoachmarkOptions) => {
  const storageKey = id ? `${storagePrefix}:${id}` : null
  const [currentStep, setCurrentStep] = React.useState(0)
  const [isOpen, setIsOpen] = React.useState(false)
  const [hasCompleted, setHasCompleted] = React.useState(false)

  // Verificar no localStorage se o usuário já completou este tour (apenas se id foi fornecido)
  React.useEffect(() => {
    if (!storageKey) return

    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const data = JSON.parse(stored)
        setHasCompleted(data.completed || false)
      }
    } catch (error) {
      console.error('Erro ao ler coachmark do localStorage:', error)
    }
  }, [storageKey])

  // Auto-start se configurado e usuário ainda não completou
  React.useEffect(() => {
    if (autoStart && !hasCompleted && !isOpen) {
      const timer = setTimeout(() => {
        setCurrentStep(0)
        setIsOpen(true)
      }, autoStartDelay)

      return () => clearTimeout(timer)
    }
  }, [autoStart, hasCompleted, isOpen, autoStartDelay])

  const saveToStorage = (completed: boolean) => {
    if (!storageKey) return

    try {
      const data = {
        completed,
        completedAt: new Date().toISOString(),
        version: 1,
      }
      localStorage.setItem(storageKey, JSON.stringify(data))
      setHasCompleted(completed)
    } catch (error) {
      console.error('Erro ao salvar coachmark no localStorage:', error)
    }
  }

  const start = () => {
    setCurrentStep(0)
    setIsOpen(true)
  }

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const close = () => {
    setIsOpen(false)
    // Marcar como completado quando fechar (apenas se tiver id)
    if (storageKey) {
      saveToStorage(true)
    }
  }

  const complete = () => {
    setIsOpen(false)
    setCurrentStep(0)
    // Marcar como completado (apenas se tiver id)
    if (storageKey) {
      saveToStorage(true)
    }
  }

  const skip = () => {
    setIsOpen(false)
    setCurrentStep(0)
    // Também marcar como completado quando pular (apenas se tiver id)
    if (storageKey) {
      saveToStorage(true)
    }
  }

  const goToStep = (step: number) => {
    if (step >= 0 && step < steps.length) {
      setCurrentStep(step)
    }
  }

  /**
   * Reseta o tour, permitindo que seja exibido novamente
   */
  const reset = () => {
    if (!storageKey) return

    try {
      localStorage.removeItem(storageKey)
      setHasCompleted(false)
      setCurrentStep(0)
      setIsOpen(false)
    } catch (error) {
      console.error('Erro ao resetar coachmark:', error)
    }
  }

  /**
   * Verifica se o usuário já completou este tour
   */
  const isCompleted = () => {
    return hasCompleted
  }

  return {
    // Estado
    currentStep,
    isOpen,
    hasCompleted,

    // Ações
    start,
    next,
    prev,
    close,
    complete,
    skip,
    goToStep,
    reset,
    isCompleted,

    // Props prontas para passar para o componente Coachmark
    props: {
      steps,
      currentStep,
      isOpen,
      onNext: next,
      onPrev: prev,
      onClose: close,
      onComplete: complete,
    },
  }
}

/**
 * Utilitário para gerenciar múltiplos tours
 */
export const CoachmarkManager = {
  /**
   * Verifica se um tour específico foi completado
   */
  isCompleted: (id: string, storagePrefix = 'coachmark'): boolean => {
    try {
      const stored = localStorage.getItem(`${storagePrefix}:${id}`)
      if (stored) {
        const data = JSON.parse(stored)
        return data.completed || false
      }
      return false
    } catch {
      return false
    }
  },

  /**
   * Reseta um tour específico
   */
  reset: (id: string, storagePrefix = 'coachmark'): void => {
    try {
      localStorage.removeItem(`${storagePrefix}:${id}`)
    } catch (error) {
      console.error('Erro ao resetar coachmark:', error)
    }
  },

  /**
   * Reseta todos os tours com o mesmo prefixo
   */
  resetAll: (storagePrefix = 'coachmark'): void => {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach((key) => {
        if (key.startsWith(`${storagePrefix}:`)) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.error('Erro ao resetar todos os coachmarks:', error)
    }
  },

  /**
   * Lista todos os tours completados
   */
  listCompleted: (storagePrefix = 'coachmark'): string[] => {
    try {
      const keys = Object.keys(localStorage)
      const completed: string[] = []

      keys.forEach((key) => {
        if (key.startsWith(`${storagePrefix}:`)) {
          try {
            const data = JSON.parse(localStorage.getItem(key) || '{}')
            if (data.completed) {
              completed.push(key.replace(`${storagePrefix}:`, ''))
            }
          } catch {
            // Ignorar erros de parse
          }
        }
      })

      return completed
    } catch {
      return []
    }
  },
}
