import { useState } from 'react'

interface Step {
  label: string
  component: () => JSX.Element
}

interface UseStepperProps {
  initialStep: number
  steps: Step[]
}

interface UseStepperReturn {
  step: number
  nextStep: () => void
  prevStep: () => void
  toStep: (targetStep: number) => void
}

export const useStepper = ({
  initialStep,
  steps,
}: UseStepperProps): UseStepperReturn => {
  const [step, setStep] = useState<number>(initialStep)

  const nextStep = (): void => {
    setStep((prevStep) => Math.min(prevStep + 1, steps.length - 1))
  }

  const prevStep = (): void => {
    setStep((prevStep) => Math.max(prevStep - 1, 0))
  }

  const toStep = (targetStep: number): void => {
    setStep(targetStep)
  }

  return {
    step,
    nextStep,
    prevStep,
    toStep,
  }
}
