"use client";

import { useId, type ReactNode } from "react";
import { Chip, labelLight, selectLight } from "@/components/ui/form";
import { formatEuro, formatKm } from "@/lib/format";
import {
  CAIXAS,
  CAIXA_LABEL,
  CATEGORIAS,
  CATEGORIA_LABEL,
  COMBUSTIVEIS,
  COMBUSTIVEL_LABEL,
  type TipoCarro,
} from "@/lib/models";
import type { CatalogParams, FilterKey } from "./catalog-params";

const PRECOS_VENDA = [5000, 10000, 15000, 20000, 30000, 40000, 50000, 75000, 100000];
const PRECOS_DIA = [30, 40, 50, 75, 100];
const ANOS = [2010, 2012, 2014, 2016, 2018, 2020, 2022, 2024];
const KMS = [25000, 50000, 100000, 150000, 200000];
const LUGARES = [2, 4, 5, 7];

function Group({ title, children, htmlFor }: { title: string; children: ReactNode; htmlFor?: string }) {
  return (
    <fieldset className="border-b border-line-ink pb-5 last:border-b-0 last:pb-0">
      {htmlFor ? (
        <label htmlFor={htmlFor} className={labelLight}>
          {title}
        </label>
      ) : (
        <legend className={`${labelLight} float-left w-full`}>{title}</legend>
      )}
      <div className="clear-both">{children}</div>
    </fieldset>
  );
}

export function FilterPanel({
  tipo,
  params,
  marcas,
  onChange,
}: {
  tipo: TipoCarro;
  params: CatalogParams;
  marcas: string[];
  onChange: <K extends FilterKey>(key: K, value: CatalogParams[K] | undefined) => void;
}) {
  const id = useId();
  const toggle = <K extends FilterKey>(key: K, value: CatalogParams[K]) =>
    onChange(key, params[key] === value ? undefined : value);
  const num = (v: string) => (v ? Number(v) : undefined);

  return (
    <div className="space-y-5">
      {tipo === "venda" && (
        <Group title="Marca" htmlFor={`${id}-marca`}>
          <select
            id={`${id}-marca`}
            className={selectLight}
            value={params.marca ?? ""}
            onChange={(e) => onChange("marca", e.target.value || undefined)}
          >
            <option value="">Todas as marcas</option>
            {marcas.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </Group>
      )}

      <Group title="Tipo de viatura">
        <div className="flex flex-wrap gap-2">
          {CATEGORIAS.map((c) => (
            <Chip key={c} active={params.categoria === c} onClick={() => toggle("categoria", c)}>
              {CATEGORIA_LABEL[c]}
            </Chip>
          ))}
        </div>
      </Group>

      {tipo === "venda" ? (
        <>
          <Group title="Preço">
            <div className="grid grid-cols-2 gap-2">
              <select
                aria-label="Preço mínimo"
                className={selectLight}
                value={params.precoMin ?? ""}
                onChange={(e) => onChange("precoMin", num(e.target.value))}
              >
                <option value="">Mínimo</option>
                {PRECOS_VENDA.map((p) => (
                  <option key={p} value={p}>
                    {formatEuro(p)}
                  </option>
                ))}
              </select>
              <select
                aria-label="Preço máximo"
                className={selectLight}
                value={params.precoMax ?? ""}
                onChange={(e) => onChange("precoMax", num(e.target.value))}
              >
                <option value="">Máximo</option>
                {PRECOS_VENDA.map((p) => (
                  <option key={p} value={p}>
                    {formatEuro(p)}
                  </option>
                ))}
              </select>
            </div>
          </Group>

          <Group title="Ano mínimo" htmlFor={`${id}-ano`}>
            <select
              id={`${id}-ano`}
              className={selectLight}
              value={params.anoMin ?? ""}
              onChange={(e) => onChange("anoMin", num(e.target.value))}
            >
              <option value="">Qualquer ano</option>
              {ANOS.map((a) => (
                <option key={a} value={a}>
                  Desde {a}
                </option>
              ))}
            </select>
          </Group>

          <Group title="Quilómetros máximos" htmlFor={`${id}-km`}>
            <select
              id={`${id}-km`}
              className={selectLight}
              value={params.kmMax ?? ""}
              onChange={(e) => onChange("kmMax", num(e.target.value))}
            >
              <option value="">Sem limite</option>
              {KMS.map((k) => (
                <option key={k} value={k}>
                  Até {formatKm(k)}
                </option>
              ))}
            </select>
          </Group>

          <Group title="Combustível">
            <div className="flex flex-wrap gap-2">
              {COMBUSTIVEIS.map((c) => (
                <Chip key={c} active={params.combustivel === c} onClick={() => toggle("combustivel", c)}>
                  {COMBUSTIVEL_LABEL[c]}
                </Chip>
              ))}
            </div>
          </Group>
        </>
      ) : (
        <>
          <Group title="Lugares">
            <div className="flex flex-wrap gap-2">
              {LUGARES.map((l) => (
                <Chip key={l} active={params.lugaresMin === l} onClick={() => toggle("lugaresMin", l)}>
                  {l}+ lugares
                </Chip>
              ))}
            </div>
          </Group>

          <Group title="Preço por dia" htmlFor={`${id}-dia`}>
            <select
              id={`${id}-dia`}
              className={selectLight}
              value={params.precoMax ?? ""}
              onChange={(e) => onChange("precoMax", num(e.target.value))}
            >
              <option value="">Sem limite</option>
              {PRECOS_DIA.map((p) => (
                <option key={p} value={p}>
                  Até {formatEuro(p)}/dia
                </option>
              ))}
            </select>
          </Group>
        </>
      )}

      <Group title="Caixa">
        <div className="flex flex-wrap gap-2">
          {CAIXAS.map((c) => (
            <Chip key={c} active={params.caixa === c} onClick={() => toggle("caixa", c)}>
              {CAIXA_LABEL[c]}
            </Chip>
          ))}
        </div>
      </Group>
    </div>
  );
}
