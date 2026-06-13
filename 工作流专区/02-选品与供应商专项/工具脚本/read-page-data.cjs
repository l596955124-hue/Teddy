const http = require("http");
const WebSocket = require("ws");
function getJson(url){return new Promise((resolve,reject)=>http.get(url,res=>{let d="";res.on("data",c=>d+=c);res.on("end",()=>resolve(JSON.parse(d)));}).on("error",reject));}
(async()=>{
 const pages=(await getJson("http://127.0.0.1:9223/json")).filter(t=>t.type==="page");
 const page=pages.find(t=>/yixingfangsc|1688/.test(t.url))||pages[0];
 const ws=new WebSocket(page.webSocketDebuggerUrl); await new Promise((res,rej)=>{ws.on("open",res);ws.on("error",rej);});
 function send(method,params={}){return new Promise(resolve=>{const id=Math.floor(Math.random()*1e9); const on=data=>{const msg=JSON.parse(data); if(msg.id===id){ws.off("message",on); resolve(msg);}}; ws.on("message",on); ws.send(JSON.stringify({id,method,params}));});}
 const expression = `(() => {
   function safe(obj, depth=0) {
     if (depth > 6) return "[depth]";
     if (obj == null || typeof obj !== "object") return obj;
     if (Array.isArray(obj)) return obj.slice(0, 30).map(x => safe(x, depth + 1));
     const out = {};
     for (const [k,v] of Object.entries(obj).slice(0, 100)) {
       if (/offer|item|product|title|price|sale|sold|url|href|link|image|pic|data|list|module|content/i.test(k) || depth < 2) out[k] = safe(v, depth + 1);
     }
     return out;
   }
   const found=[];
   function walk(obj,path="",depth=0){
     if(depth>8 || !obj || typeof obj!=="object") return;
     if(Array.isArray(obj)){
       if(obj.some(x => x && typeof x === "object" && JSON.stringify(x).match(/offer|price|sold|title|subject|detail/i))) found.push({path, sample: safe(obj,0)});
       obj.forEach((v,i)=>walk(v, path+"["+i+"]", depth+1));
     } else {
       const keys=Object.keys(obj);
       const blob=keys.join(" ") + " " + JSON.stringify(obj).slice(0,2000);
       if(/offerId|offer|price|sold|subject|detailUrl|title/i.test(blob) && keys.length<80) found.push({path, sample:safe(obj,0)});
       for(const [k,v] of Object.entries(obj)) walk(v, path?path+"."+k:k, depth+1);
     }
   }
   walk(window.pageData, "pageData");
   return {api: window.shopPageDataApi, found: found.slice(0,40)};
 })()`;
 const msg=await send("Runtime.evaluate",{expression,returnByValue:true,awaitPromise:true});
 console.log(JSON.stringify(msg.result.result.value,null,2));
 ws.close();
})();
