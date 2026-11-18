/*
 * Quote Pro shared customer theme — prototype.
 * Single same-origin source of truth for homepage and every quote calculator.
 * Production must load brand settings from the business-owned backend, not
 * from each visitor's localStorage.
 */
(function(){
 "use strict";
 const KEY="quotepro-landing-colours-v1";
 const defaults=Object.freeze({
   bg:"#071420",top:"#0b2345",deep:"#081625",text:"#ffffff",
   muted:"#b9cbd9",card:"#17324f",card2:"#0d2258",
   accent:"#73bceb",border:"#35516d",buttontext:"#06243c",
   smallheading:"#73bceb",icon:"#183b5e"
 });
 const previousDefaults=[
  {bg:"#0b2345",top:"#193f69",deep:"#071826",text:"#f7fbff",muted:"#b8cce0",card:"#173b64",card2:"#112c4d",accent:"#58bff0",border:"#3d6087",buttontext:"#061c30",smallheading:"#ffdb61",icon:"#245782"},
  {bg:"#071420",top:"#0b2345",deep:"#081625",text:"#ffffff",muted:"#b9cbd9",card:"#132c47",card2:"#0e2036",accent:"#73bceb",border:"#35516d",buttontext:"#06243c",smallheading:"#73bceb",icon:"#183b5e"}
 ];
 const valid=v=>typeof v==="string"&&/^#[0-9a-fA-F]{6}$/.test(v);
 function normalize(input){
  const result={...defaults};
  if(input&&typeof input==="object"){
   for(const key of Object.keys(defaults))if(valid(input[key]))result[key]=input[key].toLowerCase();
  }
  return result;
 }
 function get(){
  try{
   const saved=JSON.parse(localStorage.getItem(KEY)||"null");
   if(!saved||typeof saved!=="object")return {...defaults};
   if(previousDefaults.some(old=>Object.keys(defaults).every(k=>saved[k]===old[k])))return {...defaults};
   return normalize(saved);
  }catch(e){return {...defaults}}
 }
 function save(input){
  const theme=normalize(input);
  localStorage.setItem(KEY,JSON.stringify(theme));
  return theme;
 }
 function setAll(node,pairs){
  if(!node)return;
  for(const [name,value] of Object.entries(pairs))node.style.setProperty(name,value);
 }
 function applyHomepage(){
  const p=get();
  setAll(document.documentElement,Object.fromEntries(Object.entries(p).map(([k,v])=>["--qp-"+k,v])));
  document.body.style.background=p.bg;
  return p;
 }
 function applyCalculator(element,variant){
  if(!element)return get();
  const p=get();
  document.body.style.background=p.bg;
  if(variant==="window-count"){
   setAll(element,{
    "--qp-background":p.top,"--qp-font":p.text,"--qp-icons":p.text,
    "--qp-box":p.card,"--qp-selector":p.card2,"--qp-selector-border":p.border,
    "--qp-label":p.smallheading,"--qp-secondary":p.muted,
    "--qp-button":p.accent,"--qp-button-text":p.buttontext,
    "--qp-border":p.border,"--qp-estimate":p.card,
    "--qp-accent-text":p.buttontext
   });
  }else if(variant==="pressure"){
   setAll(element,{
    "--bg":p.top,"--text":p.text,"--card":p.card,"--select":p.card2,
    "--outline":p.border,"--accent":p.smallheading,"--secondary":p.muted,
    "--primary":p.accent,"--primary-text":p.buttontext,
    "--panel-border":p.border,"--estimate-bg":p.card,
    "--button-text":p.buttontext
   });
  }else{
   setAll(element,{
    "--c-bg":p.top,"--c-text":p.text,"--c-card":p.card,
    "--c-select":p.card2,"--c-outline":p.border,"--c-accent":p.smallheading,
    "--c-secondary":p.muted,"--c-button":p.accent,"--c-button-text":p.buttontext,
    "--c-border":p.border,"--c-estimate":p.card,"--c-btn-text":p.buttontext
   });
  }
  return p;
 }
 window.QuoteProTheme=Object.freeze({key:KEY,defaults,get,save,applyHomepage,applyCalculator});
})();
