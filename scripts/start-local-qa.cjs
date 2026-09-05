const http = require('node:http');
const fs = require('node:fs');
const {spawn} = require('node:child_process');
const path = require('node:path');
const dir = path.resolve('.tmp/website-qa'); fs.mkdirSync(dir,{recursive:true});
const storePath = path.join(dir,'accepted.json');
const rows = new Map();
const counts = {requests:0, accepted:0, duplicate:0};
if(fs.existsSync(storePath)) for(const row of JSON.parse(fs.readFileSync(storePath))) rows.set(row.id,row);
const fixture = http.createServer(async(req,res)=>{
  const json=(status,value)=>{res.writeHead(status,{'content-type':'application/json'});res.end(JSON.stringify(value));};
  if(req.url==='/status') return json(200,{...counts,rows:[...rows.values()].map(r=>({id:r.id,payload:r.payload}))});
  if(req.url!=='/rest/v1/rpc/website_accept_lead_outbox' && req.url!=='/rest/v1/rpc/website_claim_lead_outbox') return json(404,{});
  const chunks=[];for await(const chunk of req) chunks.push(chunk);
  let body;try{body=JSON.parse(Buffer.concat(chunks));}catch{return json(400,{})}
  if(req.url.endsWith('website_claim_lead_outbox')) return json(200,[]);
  counts.requests++;
  const mode=fs.existsSync(path.join(dir,'failure'));
  if(mode) return json(503,{message:'Fixture simulated outage'});
  if(!body.p_payload?.contact?.fullName?.startsWith('QA ') || !body.p_payload.contact.email?.endsWith('@example.com')) return json(400,{message:'Synthetic test data only'});
  const id=body.p_external_submission_id; const old=rows.get(id);
  if(old&&old.hash!==body.p_payload_hash) return json(409,{message:'idempotency_conflict'});
  if(!old){rows.set(id,{id,hash:body.p_payload_hash,payload:body.p_payload});fs.writeFileSync(storePath,JSON.stringify([...rows.values()],null,2));counts.accepted++;}else counts.duplicate++;
  return json(200,[{submission_id:id,submission_status:'ACCEPTED',duplicate:!!old}]);
});
fixture.listen(3222,'127.0.0.1',()=>{
  console.log('LOCAL SYNTHETIC RPC FIXTURE http://127.0.0.1:3222; does not contact RCI or production');
  const next=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3100'],{windowsHide:true,stdio:'inherit',env:{...process.env,WEBSITE_OUTBOX_SUPABASE_URL:'http://127.0.0.1:3222',WEBSITE_OUTBOX_SUPABASE_KEY:'local-qa-only',WEBSITE_INTEGRATION_ID:'local-qa-only',WEBSITE_INTEGRATION_ACCEPT_SECRET:'local-qa-only',LEAD_INTAKE_HASH_SALT:'local-qa-only'}});
  process.on('SIGINT',()=>{next.kill();fixture.close();});
  next.on('exit',()=>fixture.close());
});
