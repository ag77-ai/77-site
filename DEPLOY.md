# 77 Performance OS — how this is deployed

## Architecture
- **Page**: this repo (`ag77-ai/77-site`, public) served by GitHub Pages at
  https://ag77-ai.github.io/77-site/ — no login, PWA, opens today's card automatically.
- **State**: `ag77-ai/77-state` (private), file `state.json` = `{ticks, items, updated}`.
  The page reads/writes it with the GitHub Contents API straight from the browser
  (api.github.com sends `Access-Control-Allow-Origin: *`, so no server is needed).
- **Token**: fine-grained PAT, Contents read+write on these two repos only. Lives in each
  browser's localStorage (`77gh`). Entered once per device. Never in the page source.

## Source of truth
`~/Documents/77-performance-os/77-days1-14.html` — the plan. Edit ONLY that.
`index.html` here is GENERATED. Never hand-edit it.

## Redeploy
```sh
python3 ~/build77.py                 # reads the plan, writes this folder (~/site)
cd ~/site && git add -A && git commit -m "…" && git push
```
Pages redeploys in ~30s.

## Gotchas learned the hard way
- Claude's cloud sandbox CANNOT push here (git proxy blocks it) and cannot reach
  `/repos/...` on the API. Deploys must run on the Mac, which has unrestricted access.
- git cannot run inside `~/Documents/...` — the file bridge forbids unlinking, so git's
  lock files break it. Clone into `$HOME` (`~/site`, `~/state`) instead.
- Enabling Pages needs `Pages: write` on the token; Contents alone is not enough.

## Do not
Run this and the old claude.ai artifact at the same time — they write to different stores
and will drift. The artifact is retired.
