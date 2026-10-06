# AutoDemo: demonstração de site para stands

Modelo de site de **venda e aluguer de viaturas**, com painel de gestão para o dono, para mostrar a potenciais clientes.
A marca **AutoDemo** e todos os contactos são **fictícios**: não pertencem a nenhuma empresa ou pessoa real.

Esta é uma **versão de demonstração**: não tem servidor nem base de dados, e os dados ficam guardados no navegador de quem abre o site (IndexedDB).

- **Site público:** Início, Comprar, Alugar, página de cada viatura, Sobre, Contactos e Favoritos.
- **Painel:** `/admin`, com o login de demonstração `demo@example.com` / `demo1234`.

Tecnologia: Next.js (App Router), TypeScript, Tailwind CSS, `idb-keyval`, `zod` e `react-hook-form`.

---

## Como correr

Requisitos: Node.js 20 ou mais recente.

```bash
npm install
npm run dev      # desenvolvimento em http://localhost:3000
npm run build    # compilação de produção (verifica tipos)
npm run start    # serve a compilação de produção
npm run lint     # verificação de código
```

---

## Personalizar para um cliente

1. **Contactos e textos:** em `src/config/site.ts` → `defaults`, mude o nome, o telefone, o WhatsApp, o e-mail, a morada, o horário, as redes sociais e os textos.
2. **Logótipo:** copie o logo do cliente para `public/` e aponte `logo` para ele; troque também `src/app/icon.svg`.
3. **Cores:** ajuste `cores` em `src/config/site.ts` (o dourado é `gold`).
4. **Números da página "Sobre":** substitua `numeros` em `src/config/site.ts`, que são valores de exemplo.
5. **Endereço do site:** publique na Vercel com um nome de projeto genérico ou do cliente (ver [Publicar na Vercel](#publicar-na-vercel)).

Para voltar a usar a demo com outro cliente, basta repetir estes passos. Os dados reais de um cliente nunca devem ficar no modelo genérico.

## Onde mudar o quê

| Quero mudar…                                                   | Onde                                                                 |
| -------------------------------------------------------------- | -------------------------------------------------------------------- |
| Telefone, WhatsApp, e-mail, morada, horário, redes sociais     | `src/config/site.ts` → `defaults` (ou no painel, em **Definições**)  |
| Textos do topo da página inicial e da página "Sobre"           | `src/config/site.ts` → `defaults` (ou no painel, em **Definições**)  |
| Taxa de juro de exemplo do simulador                           | `src/config/site.ts` → `defaults.simuladorTaxa` (ou no painel)       |
| Cores da marca                                                 | `src/config/site.ts` → `cores`                                       |
| Logótipo                                                       | Pôr o ficheiro em `public/` e mudar `logo` em `src/config/site.ts`   |
| Fotografias do topo, do banner de aluguer e da página "Sobre"  | `src/config/site.ts` → `imagens`                                     |
| Vantagens (barra superior, faixa de ícones, banner de aluguer) | `src/config/site.ts` → `vantagensTopo`, `vantagens`, `vantagensAluguer` |
| Números e valores da página "Sobre"                            | `src/config/site.ts` → `numeros`, `valores`                          |
| Viaturas de exemplo                                            | `src/data/seed.ts`                                                   |
| Login de demonstração e limite do plano (20 viaturas)          | `src/config/site.ts` → `demoLogin`, `limiteViaturas`                 |

Notas:

- **Logótipo:** o atual (`public/logo.svg`) é **genérico**. Para usar o do cliente, copie-o para `public/logo.png` e mude `logo: "/logo.png"` em `src/config/site.ts`. Para o ícone do separador do navegador, substitua também `src/app/icon.svg`, ou apague-o e ponha um `src/app/icon.png`.
- **Cores:** são aplicadas a todo o site através de variáveis CSS, por isso basta mudar os valores hexadecimais.
- **Dados fictícios:** telefone `+351 900 000 000`, e-mail `geral@example.com` (`example.com` é um domínio reservado para exemplos) e morada "Rua do Exemplo, 1 · 1000-001 Lisboa". Os números da página "Sobre" também são de exemplo. A rua e número da morada são opcionais.
- **Imagens externas:** as fotografias externas têm de vir de `images.unsplash.com`. Para usar outro domínio, acrescente-o em `next.config.ts` → `images.remotePatterns`.

### Alterações feitas no painel

O que o dono altera no painel (viaturas, pedidos, definições) fica **guardado só nesse navegador**. Por isso:

- Os valores em `src/config/site.ts` são os **valores iniciais**. As alterações feitas em **Definições** sobrepõem-se a eles nesse navegador.
- **Definições → Repor dados de exemplo** volta ao estado inicial. **Definições → Exportar dados (JSON)** descarrega uma cópia de segurança.

---

## Publicar na Vercel

1. Coloque o projeto num repositório Git (GitHub, GitLab ou Bitbucket).
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório. A Vercel deteta o Next.js automaticamente, por isso não é preciso configurar nada.
3. Carregue em **Deploy**.

Em alternativa, pela linha de comandos: `npx vercel` (pré-visualização) e `npx vercel --prod` (produção).

**Domínio próprio:** o endereço do site (usado no SEO, no sitemap e nos links enviados pelo WhatsApp) é detetado automaticamente na Vercel. Se usar um domínio próprio, defina a variável de ambiente `NEXT_PUBLIC_SITE_URL` no projeto da Vercel, por exemplo `https://www.o-meu-stand.pt`.

**Nome do projeto na Vercel:** o endereço gratuito (`<nome-do-projeto>.vercel.app`) é público. Para a demo genérica, use um nome neutro, como `autodemo-stand`.

---

## Estrutura do código

```
src/
  app/                 Páginas (rotas). (site)/ = site público, admin/ = painel
  config/site.ts       Configuração do negócio (contactos, cores, textos, imagens)
  data/seed.ts         Viaturas de exemplo
  features/            Código organizado por domínio
    catalogo/          Catálogo, cartões, página da viatura, favoritos, simulador
    aluguer/           Pedido de reserva
    pedidos/           Pedidos (reserva, contacto, "vender o meu carro")
    definicoes/        Definições, páginas Sobre e Contactos
    admin/             Painel: login, visão geral, viaturas
    home/              Secções da página inicial
  components/          Componentes de interface reutilizáveis (ui/) e layout
  lib/
    models.ts          Modelos de dados (Car, Pedido, Settings)
    repository/        Camada de dados (interfaces + implementação local)
```

### Passar para Supabase (versão final)

Os componentes **nunca** acedem diretamente ao armazenamento: usam hooks (`useCars`, `usePedidos`, `useSettings`…) que falam com as interfaces de `src/lib/repository/types.ts` (`CarRepository`, `RequestRepository`, `SettingsRepository`, `MaintenanceRepository`).

Para usar Supabase:

1. Criar `src/lib/repository/supabase/` com classes que implementam essas mesmas interfaces.
2. Devolvê-las em `createRepositories()` (`src/lib/repository/index.ts`).
3. Trocar a autenticação de demonstração (`src/features/admin/auth.ts`) pela autenticação do Supabase, mantendo `useAdminSession`, `login` e `logout`.
4. Gerar a lista inicial dos catálogos (`src/features/catalogo/catalog-initial.ts`), a página de cada viatura e o `sitemap.ts` a partir da base de dados, em vez dos dados de exemplo.
5. Guardar as fotografias no Supabase Storage em vez de as guardar no navegador (hoje são reduzidas para 1600 px e guardadas como JPEG em `data:` URL), e acrescentar o domínio do Storage em `next.config.ts`.

Não é preciso alterar os componentes do site nem do painel.
