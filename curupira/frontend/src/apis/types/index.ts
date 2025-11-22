/**
 * Tipos TypeScript baseados no schema OpenAPI da Curupira API
 */

/**
 * Categoria de atividade
 */
export interface Category {
  id: number
  name: string
}

/**
 * Atividade
 */
export interface Activity {
  id: number
  name: string
  category: Category
  unitType: string
  unit: string
  source?: string
  region?: string
  notes?: string
}

/**
 * Dados parciais para atualização de atividade
 */
export interface PatchedActivity {
  id?: number
  name?: string
  category?: Category
  unitType?: string
  unit?: string
  source?: string
  region?: string
  notes?: string
}

/**
 * Dados parciais para atualização de categoria
 */
export interface PatchedCategory {
  id?: number
  name?: string
}

/**
 * Parâmetros para obter dados de emissão de atividade
 */
export interface ActivityEmissionParams {
  id: string | number
  value1?: string
  value2?: string
}

/**
 * Fator de emissão retornado pela API
 */
export interface EmissionFactor {
  name: string
  activity_id: string
  id: string
  access_type: string
  source: string
  source_dataset: string
  year: number
  region: string
  category: string
  source_lca_activity: string
  data_quality_flags: string[]
}

/**
 * Gases constituintes
 */
export interface ConstituentGases {
  co2e_total: number
  co2e_other: number | null
  co2: number | null
  ch4: number | null
  n2o: number | null
}

/**
 * Dados da atividade
 */
export interface ActivityData {
  activity_value: number
  activity_unit: string
}

/**
 * Resposta completa do cálculo de emissão
 */
export interface EmissionResponse {
  co2e: number
  co2e_unit: string
  co2e_calculation_method: string
  co2e_calculation_origin: string
  emission_factor: EmissionFactor
  constituent_gases: ConstituentGases
  activity_data: ActivityData
  audit_trail: string
  notices: string[]
}
