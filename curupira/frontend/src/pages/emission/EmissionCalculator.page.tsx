import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { Calculator, CheckCircle2, Info, Leaf, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { activitiesApi, activityEmissionApi, type Activity, type EmissionResponse } from '~/apis';

const emissionSchema = z.object({
  activityId: z.string().min(1, 'Atividade é obrigatória'),
  value1: z
    .string()
    .min(1, 'Valor 1 é obrigatório')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: 'Valor 1 deve ser um número maior que zero' }),
  value2: z
    .string()
    .min(1, 'Valor 2 é obrigatório')
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: 'Valor 2 deve ser um número maior ou igual a zero',
    }),
});

type EmissionFormData = z.infer<typeof emissionSchema>;

export const EmissionCalculatorPage = () => {
  const [result, setResult] = useState<EmissionResponse | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const { data: activities = [] } = useQuery<Activity[]>({
    queryKey: ['activities'],
    queryFn: () => activitiesApi.list(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<EmissionFormData>({
    resolver: zodResolver(emissionSchema),
    defaultValues: { activityId: '', value1: '', value2: '' },
  });

  const selectedActivityId = watch('activityId');
  const selectedActivity = activities.find((a) => a.id.toString() === selectedActivityId);

  const onSubmit = async (data: EmissionFormData) => {
    setIsCalculating(true);
    setResult(null);

    try {
      // Converte os valores para números antes de enviar
      const value1Num = parseFloat(data.value1);
      const value2Num = parseFloat(data.value2);

      if (isNaN(value1Num) || isNaN(value2Num)) {
        toast.error('Os valores devem ser números válidos');
        return;
      }

      const response = await activityEmissionApi.get({
        id: data.activityId,
        value1: value1Num.toString(),
        value2: value2Num.toString(),
      });
      setResult(response);
      toast.success('Cálculo realizado com sucesso!');
    } catch (error: any) {
      toast.error(error?.message || 'Erro ao calcular emissão');
      setResult(null);
    } finally {
      setIsCalculating(false);
    }
  };

  const formatNumber = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return 'N/A';
    return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 6 }).format(value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calculadora de Emissão</h1>
        <p className="text-muted-foreground mt-2">Calcule as emissões de carbono para diferentes atividades</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Parâmetros
            </CardTitle>
            <CardDescription>Selecione a atividade e informe os valores obrigatórios</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="activityId">Atividade *</Label>
                <Select value={selectedActivityId} onValueChange={(value) => setValue('activityId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma atividade" />
                  </SelectTrigger>
                  <SelectContent>
                    {activities.map((activity) => (
                      <SelectItem key={activity.id} value={activity.id.toString()}>
                        {activity.name} ({activity.category.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.activityId && <p className="text-sm text-destructive">{errors.activityId.message}</p>}
                {selectedActivity && (
                  <p className="text-xs text-muted-foreground">
                    Unidade: {selectedActivity.unit} | Tipo: {selectedActivity.unitType}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="value1">
                  Valor 1 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="value1"
                  type="number"
                  step="any"
                  min="0"
                  {...register('value1')}
                  placeholder="Ex: 100"
                  required
                />
                {errors.value1 && <p className="text-sm text-destructive">{errors.value1.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="value2">
                  Valor 2 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="value2"
                  type="number"
                  step="any"
                  min="0"
                  {...register('value2')}
                  placeholder="Ex: 200"
                  required
                />
                {errors.value2 && <p className="text-sm text-destructive">{errors.value2.message}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={isCalculating}>
                {isCalculating ? 'Calculando...' : 'Calcular Emissão'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5" />
              Resultado
            </CardTitle>
            <CardDescription>Resultado do cálculo de emissão</CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-6">
                {/* Emissão Principal */}
                <div className="rounded-lg bg-primary/10 p-6 border-2 border-primary/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Emissão de CO₂ Equivalente</h3>
                    </div>
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {formatNumber(result.co2e)} {result.co2e_unit}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Método:</span>
                      <p className="font-medium">{result.co2e_calculation_method.toUpperCase()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Origem:</span>
                      <p className="font-medium capitalize">{result.co2e_calculation_origin}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Fator de Emissão */}
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Fator de Emissão
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nome:</span>
                      <span className="font-medium text-right max-w-[70%]">{result.emission_factor.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Categoria:</span>
                      <Badge variant="outline">{result.emission_factor.category}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fonte:</span>
                      <span className="font-medium">{result.emission_factor.source}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dataset:</span>
                      <span className="font-medium text-right max-w-[70%] text-xs">
                        {result.emission_factor.source_dataset}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ano:</span>
                      <span className="font-medium">{result.emission_factor.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Região:</span>
                      <Badge variant="outline">{result.emission_factor.region}</Badge>
                    </div>
                    {result.emission_factor.data_quality_flags.length > 0 && (
                      <div className="flex justify-between items-start">
                        <span className="text-muted-foreground">Flags de Qualidade:</span>
                        <div className="flex flex-wrap gap-1 max-w-[70%] justify-end">
                          {result.emission_factor.data_quality_flags.map((flag, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {flag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Dados da Atividade */}
                {result.activity_data && (
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Dados da Atividade
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Valor:</span>
                        <p className="font-medium">{formatNumber(result.activity_data.activity_value)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Unidade:</span>
                        <p className="font-medium">{result.activity_data.activity_unit}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Gases Constituintes */}
                {result.constituent_gases && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <h4 className="font-semibold">Gases Constituintes</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">CO₂:</span>
                          <span className="font-medium">{formatNumber(result.constituent_gases.co2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">CH₄:</span>
                          <span className="font-medium">{formatNumber(result.constituent_gases.ch4)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">N₂O:</span>
                          <span className="font-medium">{formatNumber(result.constituent_gases.n2o)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Outros:</span>
                          <span className="font-medium">{formatNumber(result.constituent_gases.co2e_other)}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Informações Adicionais */}
                {result.notices && result.notices.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Avisos</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {result.notices.map((notice, idx) => (
                          <li key={idx}>{notice}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Leaf className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Preencha os parâmetros e clique em "Calcular Emissão"</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
