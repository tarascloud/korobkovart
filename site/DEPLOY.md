# Deploy Korobkov Art Studio

## Build & Deploy (on Mini)
```bash
ssh mini 'cd /opt/repos/taras-code/korobkovart/site && git pull origin main && docker build -t korobkov:latest . && cd /opt/docker && docker compose up -d --force-recreate korobkov'
```

## Cloudflare Tunnel
Add to tunnel config (Cloudflare dashboard):
- Hostname: ko.taras.cloud
- Service: http://localhost:8060

## Local dev
```bash
cd korobkovart/site && npm run dev
```
