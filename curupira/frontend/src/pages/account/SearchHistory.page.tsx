import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { useEffect, useState } from 'react';
import type { EmissionResponse, SearchHistoryItem, SearchHistoryResponse } from '~/apis';
import { accountApi } from '~/apis';

const formatNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return 'N/A';
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(value);
};

const formatSearchTime = (value: string): string => {
  // Espera algo como "2025-11-29 18:10:22"
  const [datePart, timePart] = value.split(' ');
  if (!datePart || !timePart) return value;

  const [year, month, day] = datePart.split('-');
  const [hours, minutes] = timePart.split(':');

  if (!year || !month || !day) return value;

  // Formato brasileiro: 29/11/2025 18:10
  return `${day}/${month}/${year} ${hours ?? '00'}:${minutes ?? '00'}`;
};

export function SearchHistoryPage() {
  const [data, setData] = useState<SearchHistoryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchHistory = async (page: number) => {
    setLoading(true);
    try {
      const response = await accountApi.getSearchHistory({
        page,
        page_size: 10,
      });
      setData(response);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar histórico',
        description: error?.detail || 'Verifique se você está autenticado.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNext = () => {
    if (data?.next_page) {
      fetchHistory(data.next_page);
    }
  };

  const handlePrev = () => {
    if (data?.previous_page) {
      fetchHistory(data.previous_page);
    }
  };

  const renderItem = (item: SearchHistoryItem) => {
    const emission = item.response && typeof item.response === 'object' ? (item.response as EmissionResponse) : null;

    return (
      <Card key={item.id} className="p-4 flex flex-col gap-3">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>ID #{item.id}</span>
          <span>{formatSearchTime(item.search_time)}</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <div>
            <p className="font-medium">Atividade #{item.activity_id}</p>
            <p>
              <strong>Valor 1:</strong> {item.value1 ?? '-'}{' '}
              {item.value2 != null && (
                <>
                  | <strong>Valor 2:</strong> {item.value2}
                </>
              )}
            </p>
          </div>

          {emission && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground">CO₂e total</p>
              <Badge variant="secondary" className="mt-1">
                {formatNumber(emission.co2e)} {emission.co2e_unit}
              </Badge>
            </div>
          )}
        </div>

        {emission && (
          <Collapsible>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground">Detalhes completos da consulta</span>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm">
                  Ver detalhes
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent className="mt-3 space-y-3 text-xs md:text-sm">
              <Separator />

              {/* Emissão principal */}
              <div>
                <p className="font-semibold mb-1">Emissão de CO₂ equivalente</p>
                <p>
                  <strong>Valor:</strong> {formatNumber(emission.co2e)} {emission.co2e_unit}
                </p>
                <p>
                  <strong>Método:</strong> {emission.co2e_calculation_method.toUpperCase()}
                </p>
                <p>
                  <strong>Origem:</strong> {emission.co2e_calculation_origin}
                </p>
              </div>

              {/* Dados da atividade */}
              {emission.activity_data && (
                <>
                  <Separator />
                  <div>
                    <p className="font-semibold mb-1">Dados da atividade</p>
                    <p>
                      <strong>Valor:</strong> {formatNumber(emission.activity_data.activity_value)}
                    </p>
                    <p>
                      <strong>Unidade:</strong> {emission.activity_data.activity_unit}
                    </p>
                  </div>
                </>
              )}

              {/* Fator de emissão */}
              {emission.emission_factor && (
                <>
                  <Separator />
                  <div className="space-y-1">
                    <p className="font-semibold">Fator de emissão</p>
                    <p>
                      <strong>Nome:</strong> {emission.emission_factor.name}
                    </p>
                    <p>
                      <strong>Categoria:</strong> {emission.emission_factor.category}
                    </p>
                    <p>
                      <strong>Fonte:</strong> {emission.emission_factor.source}
                    </p>
                    <p>
                      <strong>Dataset:</strong> {emission.emission_factor.source_dataset}
                    </p>
                    <p>
                      <strong>Ano:</strong> {emission.emission_factor.year}
                    </p>
                    <p>
                      <strong>Região:</strong> {emission.emission_factor.region}
                    </p>
                  </div>
                </>
              )}

              {/* Gases constituintes */}
              {emission.constituent_gases && (
                <>
                  <Separator />
                  <div className="space-y-1">
                    <p className="font-semibold">Gases constituintes</p>
                    <p>
                      <strong>CO₂:</strong> {formatNumber(emission.constituent_gases.co2)}
                    </p>
                    <p>
                      <strong>CH₄:</strong> {formatNumber(emission.constituent_gases.ch4)}
                    </p>
                    <p>
                      <strong>N₂O:</strong> {formatNumber(emission.constituent_gases.n2o)}
                    </p>
                    <p>
                      <strong>Outros:</strong> {formatNumber(emission.constituent_gases.co2e_other)}
                    </p>
                  </div>
                </>
              )}

              {/* Avisos */}
              {emission.notices && emission.notices.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="font-semibold text-xs md:text-sm mb-1">Avisos</p>
                    <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                      {emission.notices.map((notice, idx) => (
                        <li key={idx}>{notice}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </CollapsibleContent>
          </Collapsible>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Histórico de emissões</h1>
        <p className="text-sm text-muted-foreground">
          Consulte as emissões calculadas enquanto você estava autenticado.
        </p>
      </div>

      {loading && !data && <p>Carregando histórico...</p>}

      {data && (
        <>
          <div className="grid gap-3">
            {data.results.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum registro encontrado.</p>
            ) : (
              data.results.map(renderItem)
            )}
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-muted-foreground">
              Página {data.current_page} de {data.total_pages} — {data.count} registros
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrev} disabled={!data.previous_page || loading}>
                Anterior
              </Button>
              <Button variant="outline" size="sm" onClick={handleNext} disabled={!data.next_page || loading}>
                Próxima
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
