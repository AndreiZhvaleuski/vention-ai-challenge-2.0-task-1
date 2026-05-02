# Vention AI Challenge — Company Leaderboard

[![Deploy to GitHub Pages](https://github.com/AndreiZhvaleuski/vention-ai-challenge-2.0-task-1/actions/workflows/deploy.yml/badge.svg)](https://github.com/AndreiZhvaleuski/vention-ai-challenge-2.0-task-1/actions/workflows/deploy.yml)

**Live demo:** https://andreizhvaleuski.github.io/vention-ai-challenge-2.0-task-1/

A company leaderboard app built with React, Vite, TypeScript, and MUI v9.

## Features

- **Leaderboard** — ranked list of employees by total activity points with filtering by quarter and category
- **Podium** — top 3 employees displayed on a visual podium
- **Activity breakdown** — expandable per-employee cards showing individual activity history
- **Deterministic avatars** — unique illustrated avatars generated via the [DiceBear Avataaars](https://www.dicebear.com/styles/avataaars/) HTTP API, seeded by each employee's ID so the same person always gets the same avatar
- **Seeded data generation** — employee and activity data is procedurally generated with a deterministic PRNG (mulberry32), so the dataset is stable across reloads

## Tech Stack

| Tool | Purpose |
|---|---|
| [React 19](https://react.dev/) | UI framework |
| [Vite](https://vitejs.dev/) | Build tool |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [MUI v9](https://mui.com/) | Component library |
| [DiceBear](https://www.dicebear.com/) | Deterministic avatar generation |

## Getting Started

```bash
npm install
npm run dev
```

## Avatars

Employee avatars are generated using the DiceBear HTTP API:

```
https://api.dicebear.com/9.x/avataaars/svg?seed=<employee-id>
```

The `seed` is each employee's stable UUID, guaranteeing the same illustrated avatar is shown every time. No real photos are used.

