(function(){
"use strict";
var root=document.getElementById("viz"),NS="http://www.w3.org/2000/svg";
function el(tag,attrs,parent,text){var n=document.createElementNS(NS,tag);Object.keys(attrs||{}).forEach(function(k){n.setAttribute(k,attrs[k]);});if(text!==undefined&&text!==null)n.textContent=String(text);if(parent)parent.appendChild(n);return n;}
function st(data,id,fb){var s=data.style&&data.style[id]&&data.style[id].value;if(s&&typeof s==="object")return s.color||fb;return s!==undefined?s:fb;}
function chk(data,id,fb){var s=data.style&&data.style[id]&&data.style[id].value;return typeof s==="boolean"?s:fb;}
function num(data,id,fb){var s=data.style&&data.style[id]&&data.style[id].value;return typeof s==="number"&&isFinite(s)?s:fb;}
function draw(data){
root.innerHTML="";var table=data&&data.tables&&data.tables.DEFAULT;
if(!table||!table.headers||!table.rows){root.innerHTML='<div class="empty">Aguardando dados do Looker Studio…</div>';return;}
var headers=table.headers,rows=table.rows;
function ix(id){return headers.findIndex(function(h){return h.configId===id;});}
function cell(row,index){var v=row[index];return v&&typeof v==="object"&&Object.prototype.hasOwnProperty.call(v,"value")?v.value:v;}
var a={resumo:ix("resumo"),pergunta:ix("pergunta"),conforme:ix("conforme"),naoConforme:ix("naoConforme")};
if(Object.keys(a).some(function(k){return a[k]<0;})){root.innerHTML='<div class="empty">Configure os campos Resumo principal, Pergunta original, Conforme e Não conformidade.</div>';return;}
var items=rows.map(function(r){return {label:String(cell(r,a.resumo)==null?"(sem resumo)":cell(r,a.resumo)),question:String(cell(r,a.pergunta)==null?"":cell(r,a.pergunta)),yes:Math.max(0,Number(cell(r,a.conforme))||0),no:Math.max(0,Number(cell(r,a.naoConforme))||0)};});
var width=Math.max(280,root.clientWidth||600),height=Math.max(120,root.clientHeight||320),rowH=Math.max(22,Math.min(64,num(data,"alturaLinha",36)));
var legend=chk(data,"mostrarLegenda",true),values=chk(data,"mostrarValores",true),fontSize=num(data,"tamanhoFonte",12);
var top=legend?34:12,left=Math.min(240,Math.max(105,width*.34)),right=18,bottom=24,plotW=Math.max(60,width-left-right);
var maxTotal=Math.max(1,...items.map(function(d){return d.yes+d.no;})),availableH=Math.max(rowH,height-top-bottom),actualRowH=Math.min(rowH,availableH/Math.max(1,items.length));
var svg=el("svg",{viewBox:"0 0 "+width+" "+height,preserveAspectRatio:"none"},root);
if(legend){var lx=left,ly=17;el("rect",{x:lx,y:ly-8,width:10,height:10,rx:2,fill:st(data,"corConforme","#34A853")},svg);el("text",{x:lx+15,y:ly,"class":"legend-label"},svg,"Conforme");lx+=90;el("rect",{x:lx,y:ly-8,width:10,height:10,rx:2,fill:st(data,"corNaoConforme","#F29900")},svg);el("text",{x:lx+15,y:ly,"class":"legend-label"},svg,"Não conformidade");}
items.forEach(function(d,i){var y=top+i*actualRowH,barY=y+actualRowH*.22,barH=Math.max(8,actualRowH*.56);
el("text",{x:left-10,y:y+actualRowH*.58,"text-anchor":"end","class":"row-label","font-size":fontSize},svg,d.label.length>44?d.label.slice(0,41)+"…":d.label);
var yw=plotW*d.yes/maxTotal,nw=plotW*d.no/maxTotal;
var yes=el("rect",{x:left,y:barY,width:yw,height:barH,rx:2,fill:st(data,"corConforme","#34A853"),"class":"bar-segment"},svg);
el("title",{},yes,"Pergunta: "+d.question+"\nResumo: "+d.label+"\nConforme: "+d.yes+"\nNão conformidade: "+d.no);
var no=el("rect",{x:left+yw,y:barY,width:nw,height:barH,rx:2,fill:st(data,"corNaoConforme","#F29900"),"class":"bar-segment"},svg);
el("title",{},no,"Pergunta: "+d.question+"\nResumo: "+d.label+"\nConforme: "+d.yes+"\nNão conformidade: "+d.no);
if(values){if(yw>28)el("text",{x:left+yw/2,y:barY+barH/2+4,"text-anchor":"middle","class":"value-label"},svg,d.yes);if(nw>28)el("text",{x:left+yw+nw/2,y:barY+barH/2+4,"text-anchor":"middle","class":"value-label"},svg,d.no);}
});
el("text",{x:left,y:height-6,"class":"axis-label"},svg,"0");el("text",{x:left+plotW,y:height-6,"text-anchor":"end","class":"axis-label"},svg,String(maxTotal));
}
if(window.dscc&&window.dscc.subscribeToData){window.dscc.subscribeToData(draw,{transform:window.dscc.tableTransform});}else{root.innerHTML='<div class="empty">Biblioteca dscc não carregada. Abra esta visualização pelo Looker Studio.</div>';}
})();