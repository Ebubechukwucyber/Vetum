# Binance Agent OS — how Vetum uses it

Endpoint: `https://agent.binance.com/mcp/agentic`

Official scopes (user-granted on an Agentic sub-account):

- Read market data
- Check balances / positions
- Trade spot / convert (and other venues if the user enables them)

Vetum’s constitution **narrows** that. Default demo policy:

- spot only
- no futures, no margin
- no withdrawals
- paper unless `VETUM_LIVE=1` and `policy.mode === "live"`
- max notional and confirm threshold from `lib/demoPolicy.ts`

Live path:

```
plan → check_policy → ALLOW → only then MCP write
```

DENY and CONFIRM never call write tools.

Do not commit API keys. Auth is the Binance account pairing flow, not a `.env` dump in git.
