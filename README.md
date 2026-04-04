# Connect Tickets - Arena Pernambuco

Frontend da plataforma de gestao de eventos **Arena Pernambuco**, desenvolvido como projeto da disciplina de POO no CESAR School.

## Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router + Turbopack)
- **Linguagem**: TypeScript 5
- **UI**: React 19 + [Tailwind CSS 4](https://tailwindcss.com/) + [Shadcn/UI](https://ui.shadcn.com/)
- **Icones**: [Lucide React](https://lucide.dev/)
- **Toasts**: [Sonner](https://sonner.emilkowal.dev/)
- **Package Manager**: pnpm

## Estrutura do projeto

```
src/
  app/
    page.tsx              # Pagina de login (tabs Usuario/Admin)
    layout.tsx            # Layout raiz (fonte, Toaster)
    globals.css           # Estilos globais + Tailwind
    esqueci-senha/
      page.tsx            # Pagina de recuperacao de senha
    cadastro/
      page.tsx            # Pagina de cadastro de usuario
  components/
    ui/                   # Componentes Shadcn/UI (Button, Card, Input, Label, etc.)
  lib/
    utils.ts              # Utilitarios (cn)
```

## Como rodar

### Pre-requisitos

- Node.js 18+
- pnpm (`npm install -g pnpm`)

### Instalacao

```bash
pnpm install
```

### Desenvolvimento

```bash
pnpm dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### Build de producao

```bash
pnpm build
pnpm start
```

## Scripts disponiveis

| Script       | Comando        | Descricao                        |
| ------------ | -------------- | -------------------------------- |
| `pnpm dev`   | `next dev`     | Servidor de desenvolvimento      |
| `pnpm build` | `next build`   | Build otimizado para producao    |
| `pnpm start` | `next start`   | Servidor de producao             |

## Paginas

| Rota             | Descricao                                      |
| ---------------- | ---------------------------------------------- |
| `/`              | Login com abas Usuario/Admin                   |
| `/cadastro`      | Cadastro de novo usuario                       |
| `/esqueci-senha` | Recuperacao de senha via email                  |

## Componentes Shadcn/UI utilizados

- Button, Card, CardContent, Input, Label, Sonner (Toaster)

Para adicionar novos componentes:

```bash
npx shadcn@latest add <componente>
```
