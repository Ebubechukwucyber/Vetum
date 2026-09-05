# Agent OS

Official MCP:

```text
https://agent.binance.com/mcp/agentic
```

Do not paste that URL into a chat and ask the model to install it. Add it as a connector.

## ChatGPT (worked path)

1. chatgpt.com desktop → Settings → Developer mode  
2. Plugins / Apps → Create → that URL  
3. Binance login → market data + account ON, futures OFF  
4. Project `VetumAgent` → upload `agent/SYSTEM.md`, `skills/vetum/SKILL.md`, `lib/policy.ts`  
5. Custom instructions = `agent/SYSTEM.md`

Prove:

```text
Use Binance MCP. BTCUSDT price and Agentic balances. No order.
Propose: Open 10x BTC perpetual. DENY. No write tools.
```

## Claude Code

```bash
claude mcp add binance-mcp-server --transport http https://agent.binance.com/mcp/agentic
```

`/mcp` → Authenticate.

## Cursor

Official OAuth does not support dynamic client registration. Do not use Cursor for live pairing.

## After ALLOW

Only the host may call MCP writes. Chamber stays a viewer unless `VETUM_LIVE=1` and `policy.mode` is `live`. No keys in git.
