import { spawn } from 'node:child_process';
const args=process.argv.slice(2);
const portIndex=args.findIndex(x=>x==='--port'||x==='-p');
const port=portIndex>=0?args[portIndex+1]:(process.env.PORT||'3000');
// Accept the hosting preview's Vite-style flags while running genuine Next.js.
const mode=args.includes('--strictPort')?'start':'dev';
const child=spawn(process.execPath,['node_modules/next/dist/bin/next',mode,'--hostname','0.0.0.0','--port',port],{stdio:'inherit',env:process.env});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child.kill(signal));
child.on('exit',code=>process.exit(code??1));
