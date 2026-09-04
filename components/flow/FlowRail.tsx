export function FlowRail({active=0, decision}:{active?:number;decision?:string}){
 const nodes=['INTENT','PLAN','SIM','POLICY',decision||'DECISION','EXECUTE / HUMAN','LEDGER'];
 return <div className="overflow-x-auto border-y border-line py-5"><div className="flex min-w-max items-center gap-2">{nodes.map((n,i)=><div key={n} className="flex items-center gap-2"><div className={`rounded-full border px-3 py-2 font-mono text-[9px] tracking-[.14em] ${i<=active?'border-violet bg-violet/10 text-bone':'border-line text-mist'}`}>{String(i+1).padStart(2,'0')} {n}</div>{i<nodes.length-1&&<span className="text-line">→</span>}</div>)}</div></div>
}
