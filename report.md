# Report: Vention AI Challenge 2.0 — Task 1

## Overview

My goal was to recreate Vention's internal company leaderboard using AI-assisted development tools — generating all code with AI rather than writing it manually, and using no real corporate data. The result is a React + Material UI application deployed to GitHub Pages that recreates the main UI, filtering, sorting, and core interactions of the original.

## How I Approached It

**1. Requirement analysis**
I started by carefully studying the original leaderboard and writing down everything I could observe: the layout, the podium section for top performers, the employee list with expandable activity cards, the filter controls (year, quarter, category), the search bar, and the responsive behavior. I captured all of this in a structured notes file before generating any code.

**2. Initial scaffolding**
With that spec in hand, I switched to Plan mode in GitHub Copilot (using Claude Sonnet) to draft the overall architecture and generate the initial implementation. Plan mode — Copilot's structured reasoning step before generating code — was useful throughout: I used Plan mode at key decision points such as choosing a virtual scrolling strategy for large lists and working out the responsive layout breakpoints, so I could think through trade-offs before acting.

**3. CI/CD pipeline**
I prompted Copilot to set up a GitHub Actions workflow that lints, builds, runs end-to-end tests, and deploys to GitHub Pages automatically on every push to `main`.

**4. Data generation tuning**
I used Claude Haiku to iteratively refine the synthetic dataset — adjusting the distribution of activity points, the variety of job titles and departments, and the spread of dates across quarters — until the data felt realistic and representative of an internal leaderboard.

**5. Cloud agent iteration**
When I identified specific visual discrepancies between my implementation and the original, I created GitHub Issues describing each one and assigned them to the GitHub Copilot cloud agent. The agent opened pull requests with fixes, which I reviewed and merged.

**6. Local debugging**
I compared the running app side-by-side with the original dashboard and worked through remaining visual and behavioral differences with Copilot's in-editor assistance.

## Tools & Techniques

- **GitHub Copilot** (VS Code) with **Claude Sonnet** — planning, architecture, code generation
- **Claude Haiku** — data generation tuning
- **GitHub Copilot cloud agent** — autonomous issue-to-PR fixing
- **Playwright** — end-to-end test suite
- **GitHub Actions + GitHub Pages** — CI/CD and deployment

**MCP servers:**
- **GitHub MCP** — enabled Copilot to read and create GitHub Issues and pull requests directly from the editor
- **Playwright MCP** — gave Copilot browser control for live UI inspection and debugging
- **MUI MCP** — gave Copilot access to Material UI documentation while generating and debugging components

## Data Replacement

No real employee data was used at any point. The entire dataset is generated at runtime by a seeded pseudo-random number generator, which keeps the data stable across page reloads without storing anything externally. All names, job titles, and department names are drawn from curated pools of fictional values. Activity titles are fictional, grouped into the same categories required by the challenge (Education, Public Speaking, University Partnerships), but generated synthetically. Avatars are generated deterministically via the DiceBear API, seeded by a fictional employee ID, so each person gets a consistent but synthetic avatar.

## Live Demo

[https://andreizhvaleuski.github.io/vention-ai-challenge-2.0-task-1/](https://andreizhvaleuski.github.io/vention-ai-challenge-2.0-task-1/)
