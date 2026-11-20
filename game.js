/* AFTERFALL — game logic, lessons, interactions, and navigation */
const prologueScenes=[
  {day:"DAY 0",title:"It started with six students.",body:`<p>They collapsed within hours of one another on North Campus. Fever. Confusion. Then violent neurological symptoms no one could explain.</p><p>By midnight, the university hospital had sealed its doors. Within days, NVC-11 cases were appearing beyond the campus.</p>`},
  {day:"THE FIRST WEEKS",title:"Nobody knew what made a place dangerous.",body:`<p>Early evidence was fragmentary. Contact. Water. Shared air. Environmental exposure. Each new cluster seemed to clarify the pattern until the next one complicated it.</p><p>No cure followed. Survival depended on something more immediate: predicting where exposure was likely and keeping people away from it.</p>`},
  {day:"THE RECOVERY",title:"They drew a map and rebuilt around it.",body:`<p>The Recovery Authority divided surviving territory into <b>safe zones</b>, <b>restricted zones</b>, and <b>exclusion zones</b> using the best exposure model available at the time.</p><p>The classifications became more than guidance. They determined where people could live, where food could be grown, which roads stayed open, where clinics operated, and which communities received fuel, medicine, and rebuilding support.</p>`},
  {day:"YEAR 4 AFTER THE FALL",title:"The map became the shape of ordinary life.",body:`<p>Whole communities had moved. Supply corridors, farms, housing, monitoring systems, remediation contracts, and the remaining economy had been rebuilt around the zone system.</p><p>Most people no longer thought about the model underneath it. They thought about whether the road home was green, amber, or red.</p>`},
  {day:"CAMPUS NETWORK HUB",title:"The university found a second life.",body:`<p>The clinic took over the health sciences building. The old dining hall became a kitchen. Residence halls became shelter space. Workshops, generators, storage rooms, and radios turned the campus into one of the region's most stable hubs.</p><p>And Hale Library became something the Network could not easily replace: organized access to knowledge.</p>`},
  {day:"HALE LIBRARY",title:"Some things are too expensive to learn twice.",body:`<p>The library still holds books, journals, government records, maps, technical manuals, archived web material, and locally preserved research. People come here to answer questions about medicines, machinery, water, crops, routes, and exposure.</p><p>Amina, the university librarian who coordinates Network research, puts it more simply: <em>the clinic keeps people alive today; the library helps keep them from having to rediscover everything tomorrow.</em></p>`},
  {day:"THE NETWORK",title:"Nobody survives alone.",body:`<p>The campus is one hub in a loose web of shelters, clinics, farms, kitchens, relay stations, repair crews, and supply teams. There is no headquarters and no formal membership list. The Network grew because no community had enough of everything on its own.</p><p>It runs on food, fuel, routes, favors—and information. A bad report can close a safe road. An old map can send people into danger. A misunderstood study can change an evacuation.</p>`}
 ];
 let proIndex=0;
 function renderPrologue(){
  const s=prologueScenes[proIndex];
  document.querySelector("#proDay").textContent=s.day;
  document.querySelector("#proTitle").textContent=s.title;
  document.querySelector("#proBody").innerHTML=s.body;
  document.querySelector("#progDots").innerHTML=prologueScenes.map((_,i)=>`<span class="${i===proIndex?"on":""}">●</span>`).join(" ");
  document.querySelector("#proNext").textContent=proIndex===prologueScenes.length-1?"Choose your survivor →":"Continue →";
 }
 document.querySelector("#proNext").onclick=()=>{
  if(proIndex<prologueScenes.length-1){proIndex++;renderPrologue()}
  else{document.querySelector("#prologue").classList.add("hidden");openCharacterSelect()}
 };
 renderPrologue();
 const q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];
 let S={met:false,inLab:false,paper:"vale",stage:0,valeDone:false,routeDone:false,chenDone:false,intel:[],choices:[],px:43,py:72,keys:{},playerChar:null,playerName:"",playerPronouns:"",fpNode:"courtyard",currentSection:"Abstract",annexEscapeActive:false,annexEscaped:false,fieldKit:[],backpack:[],playerBriefStep:null};

/* === CORE NPC CANON · V2 ===
   These are people first. Their identities do not confer research abilities.
   Amina: university librarian / Network research coordinator; tough, practical, curious, hard to push around.
   Rosie: queer woman; Communications lead; methodical, social, stubborn; partner of Dr. Mireille Okafor.
   Iona: field operations coordinator; exuberant, inventive, affectionate, impatient; action is strength and blind spot.
   Dr. Jo Running Bear: they/them; Oglala Lakota, Oglala Sioux Tribe (Pine Ridge); exposure researcher; ambitious, competitive, dryly funny; Mireille's equal research partner.
   Dr. Mireille Okafor: she/her; Nigerian American epidemiologist; Rosie's partner and Running Bear's equal research partner; missing after Kestrel.
*/
const npcCanon={
  mira:{name:"Amina",pronouns:"she/her",role:"University librarian · Network research coordinator"},
  rosie:{name:"Rosie",pronouns:"she/her",role:"Network Communications lead",partner:"Dr. Mireille Okafor"},
  iona:{name:"Iona",pronouns:"she/her",role:"Network field operations coordinator"},
  runningBear:{name:"Dr. Jo Running Bear",pronouns:"they/them",identity:"Oglala Lakota · Oglala Sioux Tribe (Pine Ridge)",role:"Exposure researcher"},
  lena:{name:"Dr. Mireille Okafor",pronouns:"she/her",identity:"Nigerian American",role:"Epidemiologist",partner:"Rosie"}
};

 
 
 /* === PLAYABLE CHARACTER SELECTION === */
 function openCharacterSelect(){
   q("#characterSelect").classList.remove("hidden");
   q("#confirmCharacter").disabled=!S.playerChar;
 }
 
 function renderCharacterBackstory(id){
   const p=characterProfiles[id];
   if(!p)return;
 
   const panel=q("#backstoryPanel");
   if(!panel)return;
 
   panel.className="show";
   panel.innerHTML=`<h3>${p.name.toUpperCase()}</h3><p>${p.story}</p>`;
 }
 
 function chooseCharacter(id){
   const p=characterProfiles[id];
   if(!p)return;
 
   S.playerChar=id;
   S.playerName=p.name;
   S.playerPronouns=p.pronouns;
 
   qa(".survivor-card").forEach(card=>{
     card.classList.toggle("selected",card.dataset.char===id);
   });
 
   q("#playerName").value=p.name;
   q("#playerPronouns").value=p.pronouns;
   q("#confirmCharacter").disabled=false;
 
   /* Character text follows the selected portrait/card automatically. */
   renderCharacterBackstory(id);
 }
 
 q("#characterSelect").onclick=e=>{
   const backstory=e.target.closest("[data-backstory]");
   if(backstory){
     e.preventDefault();
     e.stopPropagation();
 
     const id=backstory.dataset.backstory;
     if(!characterProfiles[id])return;
 
     chooseCharacter(id);
     renderCharacterBackstory(id);
     return;
   }
 
   const card=e.target.closest(".survivor-card");
   if(card){
     chooseCharacter(card.dataset.char);
   }
 };
 
 q("#playerName").oninput=e=>{
   if(!S.playerChar)return;
   S.playerName=e.target.value.trim()||characterProfiles[S.playerChar].name;
 };
 
 q("#playerPronouns").onchange=e=>{
   S.playerPronouns=e.target.value;
 };
 
 function playerBriefingScenes(){
  return [
   {kicker:"NETWORK FIELD SUPPORT",title:`${pcName()}, you go where the question is.`,body:`<p>You work in Network Field Support. You move between the campus hub and the sites beyond it—retrieving records, checking reports, carrying equipment, documenting conditions, talking to witnesses, and bringing questions back to the people who can help answer them.</p><p>You are not expected to be the Network's expert on everything. Your job is to recognize when an answer matters, find the evidence the situation needs, and get something usable back to the people who have to act.</p>`},
   {kicker:"TONIGHT · 21:17",title:"A safe shelter just stopped being safe.",body:`<p>Several people became ill inside <b>Westbridge</b>, a Network shelter the Recovery Authority still classifies as safe. Iona is evacuating forty-three people toward the campus clinic.</p><p>The fastest route is the <b>South Transit Underpass</b>. Government maps mark it safe. A recent field reading does not. The longer route keeps injured evacuees outside much longer.</p><div class="broadcast">IONA // RADIO: “I'm twenty minutes out. I need to know whether I can take them through the underpass.”</div>`}
  ];
 }
 function renderPlayerBriefing(){
  const scenes=playerBriefingScenes();
  const step=Math.max(0,Math.min(Number(S.playerBriefStep||0),scenes.length-1));
  S.playerBriefStep=step;
  const x=scenes[step],story=q("#story");
  story.innerHTML=`<div class="story-beat post-character-briefing"><div class="kicker">${x.kicker}</div><h2>${x.title}</h2>${x.body}<button class="primary" data-player-brief-next>${step===scenes.length-1?"ENTER CAMPUS →":"CONTINUE →"}</button></div>`;
  story.classList.remove("hidden");
 }
 function startPlayerBriefing(){S.playerBriefStep=0;renderPlayerBriefing();}
 function finishPlayerBriefing(){
  S.playerBriefStep=null;
  q("#story").classList.add("hidden");
  S.fpNode="courtyard";renderFirstPerson();
  next("Talk to Amina","mira");
  pathStep(1);
  obj("Meet Amina. Iona is twenty minutes from the South Transit Underpass.");
 }
 document.addEventListener("click",e=>{
  const btn=e.target.closest("[data-player-brief-next]");
  if(!btn)return;
  const scenes=playerBriefingScenes();
  const step=Number(S.playerBriefStep||0);
  if(step<scenes.length-1){S.playerBriefStep=step+1;renderPlayerBriefing();}
  else finishPlayerBriefing();
 });

 q("#confirmCharacter").onclick=()=>{
   if(!S.playerChar)return;
 
   S.playerName=q("#playerName").value.trim()||characterProfiles[S.playerChar].name;
   S.playerPronouns=q("#playerPronouns").value;
 
   q("#characterSelect").classList.add("hidden");
   q("#player").className=`char-${S.playerChar}`;
   startPlayerBriefing();
 };
 
 
 /* =========================================================
    FIELD KIT + BACKPACK
    FIELD KIT = learned research tools
    BACKPACK = recovered evidence / sources
    ========================================================= */
 const fieldToolDefs={
  articleMap:{
    name:"ARTICLE MAP",
    subtitle:"STRUCTURE · Anatomy of a Scholarly Article",
    desc:"Understand how scholarly articles are organized and what kind of information each section contains.",
    use:"Use the map to know where different kinds of information tend to live."
  },
  quickRead:{
    name:"QUICK-READ STRATEGY",
    subtitle:"SELECTION · Decide which source deserves your attention",
    desc:"Triage several possible sources without trying to understand every detail.",
    use:"Use title, abstract, headings, and key findings to decide which article is most likely to answer your question."
  },
  strategicRead:{
    name:"STRATEGIC READING",
    subtitle:"EVIDENCE · Extract what answers your question",
    desc:"Once you have the right source, read selectively and closely to find the evidence that matters.",
    use:"Start with your question → locate the relevant Results → check Methods → read Discussion and limitations."
  },
  claimTrace:{
    name:"CLAIM TRACE",
    subtitle:"PROVENANCE · Follow a claim toward the evidence underneath it",
    desc:"Reconstruct how information moved from observation to record, analysis, summary, public message, and action.",
    use:"Check timestamps, citations, document history, audience, purpose, and changes in certainty or causal language."
  }
 };
 
 const backpackDefs={
  vale:{
    name:"Okafor & Running Bear — Westbridge Exposure Pattern Study",
    type:"Scholarly article",
    desc:"Joint Okafor–Running Bear study used to assess risk at the South Transit Underpass."
  },
  chen:{
    name:"Running Bear & Okafor — Transmission Timing Study",
    type:"Scholarly article",
    desc:"Running Bear and Okafor reconstruct probable transmission windows in early cases."
  },
  rios:{
    name:"Rios — VX-17 Rapid Review",
    type:"Scholarly review",
    desc:"Review cited by the public claim that VX-17 is 'proven effective.'"
  }
 };
 
 function addFieldTool(id,announce=true){
  if(!fieldToolDefs[id])return;
  S.fieldKit=S.fieldKit||[];
  if(S.fieldKit.includes(id))return;
  S.fieldKit.push(id);
  renderInventoryCounts();
  if(announce)showAcquired("TOOL ACQUIRED",fieldToolDefs[id].name,fieldToolDefs[id].desc,"Added to Field Kit");
  if(typeof scheduleAutosave==="function")scheduleAutosave();
 }
 
 function addBackpackSource(id,announce=true){
  if(!backpackDefs[id])return;
  S.backpack=S.backpack||[];
  if(S.backpack.includes(id))return;
  S.backpack.push(id);
  renderInventoryCounts();
  if(announce)showAcquired("SOURCE ACQUIRED",backpackDefs[id].name,backpackDefs[id].desc,"Added to Backpack");
  if(typeof scheduleAutosave==="function")scheduleAutosave();
 }
 
 function renderInventoryCounts(){
  if(q("#fieldKitBtn"))q("#fieldKitBtn").innerHTML=`FIELD KIT <span>${(S.fieldKit||[]).length}</span>`;
  if(q("#backpackBtn"))q("#backpackBtn").innerHTML=`BACKPACK <span>${(S.backpack||[]).length}</span>`;
 }
 
 function showAcquired(kicker,title,desc,footer){
  let el=q("#acquiredToast");
  if(!el){
    el=document.createElement("div");
    el.id="acquiredToast";
    document.body.appendChild(el);
  }
  el.innerHTML=`<div class="acq-kicker">${kicker}</div><b>${title}</b><p>${desc}</p><small>${footer}</small>`;
  el.classList.add("show");
  clearTimeout(el._hide);
  el._hide=setTimeout(()=>el.classList.remove("show"),3200);
 }
 
 
 /* === FIELD KIT EMAIL / TAKEAWAY === */
 function articleMapEmailText(){
  return [
   "AFTERFALL FIELD KIT — ARTICLE MAP",
   "Anatomy of a Scholarly Article",
   "",
   "Use the structure of a scholarly article to go directly to the kind of information you need.",
   "",
   ...anatomyGuide.flatMap(item=>[
     `${item.label} — ${item.role}`,
     item.note,
     `What to look for: ${item.look}`,
     `Why you'd use it: ${item.use}`,
     ""
   ]),
   "Adapted in concept from NCSU Libraries, “Anatomy of a Scholarly Article”:",
   "https://www.lib.ncsu.edu/tutorials/scholarly-articles/archive/",
   "",
   "Original NCSU learning object shared under CC BY-NC-SA 3.0 US."
  ].join("\n");
 }
 
 function quickReadEmailText(){
  return [
   "AFTERFALL FIELD KIT — QUICK-READ STRATEGY",
   "",
   "Quick reading helps you decide where your attention is worth spending. It does not replace close reading.",
   "",
   "1 · ABSTRACT",
   "Preview the question, approach, and major finding. Decide whether the paper is relevant enough to keep going.",
   "",
   "2 · INTRODUCTION + ENDING",
   "Skim the problem, context, contribution, and the authors' take-away.",
   "",
   "3 · RESULTS / DATA",
   "Go to tables, figures, findings, or other evidence that directly bears on your question.",
   "",
   "4 · DEEP READ",
   "Only after the paper earns your attention should you decide which parts need careful reading.",
   "",
   "Question → relevance → evidence → decide where to read deeply."
  ].join("\n");
 }
 
 
 function strategicReadEmailText(){
  return [
   "AFTERFALL FIELD KIT — STRATEGIC READING",
   "",
   "Strategic Reading begins after you have chosen the right source.",
   "Its purpose is to extract the evidence that answers your question.",
   "",
   "1 · START WITH YOUR QUESTION",
   "Define exactly what you need the article to tell you.",
   "",
   "2 · RESULTS",
   "Find the observation, measurement, table, figure, or result that bears directly on the question.",
   "",
   "3 · METHODS",
   "Check how that evidence was produced and what the method can actually support.",
   "",
   "4 · DISCUSSION + LIMITATIONS",
   "Read the authors' interpretation, then separate it from the finding and note important limitations.",
   "",
   "Strategic Reading is question-driven attention, not simply faster reading."
  ].join("\n");
 }
 
 function fieldToolEmailText(id){
  if(id==="articleMap")return articleMapEmailText();
  if(id==="quickRead")return quickReadEmailText();
  if(id==="strategicRead")return strategicReadEmailText();
  const x=fieldToolDefs[id];
  return x ? `AFTERFALL FIELD KIT — ${x.name}\n\n${x.subtitle}\n${x.desc}\n\n${x.use}` : "";
 }
 
 function allFieldKitEmailText(){
  const ids=S.fieldKit||[];
  return [
    "AFTERFALL — MY FIELD KIT",
    "Research tools collected during the investigation",
    "",
    ...ids.flatMap(id=>[fieldToolEmailText(id),"\n----------------------------------------\n"]),
    "Keep these resources for future coursework and research."
  ].join("\n");
 }
 
 function fieldKitEmailAddress(){
  return (q("#fieldKitEmailTo")?.value||"").trim();
 }
 
 function openFieldKitEmail({toolId=null}={}){
  const to=fieldKitEmailAddress();
  if(to && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)){
    showSaveToast("Enter a valid email address, or leave the field blank.");
    return;
  }
  const subject=toolId
    ? `AFTERFALL Field Kit — ${fieldToolDefs[toolId]?.name||"Research Tool"}`
    : "AFTERFALL — My Field Kit";
  const body=toolId ? fieldToolEmailText(toolId) : allFieldKitEmailText();
 
  /* mailto intentionally hands control to the user's own email client.
     AFTERFALL never stores or transmits the address. */
  const href=`mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href=href;
 }
 
 function openFieldKit(){
  const modal=q("#inventoryModal");
  const body=q("#inventoryBody");
  q("#inventoryTitle").textContent="FIELD KIT";
  q("#inventorySubtitle").textContent="Tools you have learned and can reuse.";
  const ids=S.fieldKit||[];
  const emailPanel=`<div class="fieldkit-email-panel">
    <div>
      <b>KEEP THESE RESOURCES</b>
      <span>Email your Field Kit to yourself for use in school or future research.</span>
    </div>
    <label for="fieldKitEmailTo">Email to <span>(optional)</span></label>
    <input id="fieldKitEmailTo" type="email" inputmode="email" autocomplete="email" placeholder="you@example.edu">
    <button type="button" data-email-all-fieldkit ${ids.length?"":"disabled"}>Email all Field Kit resources</button>
    <small>Opens your email app with the resources prepared. AFTERFALL does not store or send your email address.</small>
  </div>`;
  body.innerHTML=emailPanel+(ids.length?ids.map(id=>{
    const x=fieldToolDefs[id];
    return `<article class="inventory-card tool-card"><div class="inventory-type">RESEARCH TOOL</div><h3>${x.name}</h3><h4>${x.subtitle}</h4><p>${x.desc}</p><div class="inventory-use">${x.use}</div><div class="inventory-card-actions"><button class="inventory-view-item" data-tool="${id}">View tool</button><button class="inventory-email-item" data-email-tool="${id}">Email this tool</button></div></article>`;
  }).join(""):`<div class="inventory-empty">Complete research lessons to add tools to your Field Kit.</div>`);
  modal.classList.remove("hidden");
 }
 
 function openBackpack(){
  const modal=q("#inventoryModal");
  const body=q("#inventoryBody");
  q("#inventoryTitle").textContent="BACKPACK";
  q("#inventorySubtitle").textContent="Sources and evidence recovered during the investigation.";
  const ids=S.backpack||[];
  body.innerHTML=ids.length?ids.map(id=>{
    const x=backpackDefs[id];
    return `<article class="inventory-card source-card"><div class="inventory-type">${x.type.toUpperCase()}</div><h3>${x.name}</h3><p>${x.desc}</p><button class="inventory-view-item" data-source="${id}">View source</button></article>`;
  }).join(""):`<div class="inventory-empty">Sources you recover will appear here.</div>`;
  modal.classList.remove("hidden");
 }
 
 
 /* === READ-ONLY INVENTORY RESOURCE VIEWER === */
 function inventoryArticleSectionHTML(id,section){
  const p=papers[id];
  if(!p||!p.sections[section])return "";
  return `<div class="inventory-source-title">${p.title}</div>
    <div class="inventory-source-authors">${p.authors}</div>
    <div class="inventory-source-paper">${p.sections[section]}</div>`;
 }
 
 function viewBackpackSource(id,section="Abstract"){
  const def=backpackDefs[id],p=papers[id];
  if(!def||!p)return;
 
  q("#inventoryTitle").textContent=def.name;
  q("#inventorySubtitle").textContent=`${def.type} · Read-only copy from your Backpack`;
  q("#inventoryBody").innerHTML=`
    <div class="inventory-resource-view">
      <button class="inventory-return" type="button" data-return-backpack>← Back to Backpack</button>
      <div class="inventory-source-tabs">
        ${Object.keys(p.sections).map(s=>`<button type="button" data-inventory-source="${id}" data-inventory-section="${s}" class="${s===section?"active":""}">${s}</button>`).join("")}
      </div>
      <div id="inventorySourceContent">${inventoryArticleSectionHTML(id,section)}</div>
    </div>`;
 }
 
 function articleMapReviewHTML(){
  return `<div class="tool-review article-map-review">
    <div class="tool-review-kicker">FIELD KIT // ARTICLE MAP</div>
    <h3>Anatomy of a Scholarly Article</h3>
    <p class="tool-review-intro">Use the structure of a scholarly article to go directly to the kind of information you need.</p>
    <div class="tool-map-list">
      ${anatomyGuide.map(item=>`<div class="tool-map-row">
        <div><b>${item.label}</b><span>${item.role}</span></div>
        <p>${item.note}</p>
        <small><strong>Look for:</strong> ${item.look}</small>
      </div>`).join("")}
    </div>
    <p class="tool-source-note">Adapted in concept from <a href="https://www.lib.ncsu.edu/tutorials/scholarly-articles/archive/" target="_blank" rel="noopener noreferrer">NCSU Libraries, “Anatomy of a Scholarly Article”</a>.</p>
  </div>`;
 }
 
 function quickReadReviewHTML(){
  return `<div class="tool-review quick-read-review">
    <div class="tool-review-kicker">FIELD KIT // QUICK-READ STRATEGY</div>
    <h3>Quick Reading</h3>
    <p class="tool-review-intro">Quick Reading is a source-selection strategy. Use it when you have multiple possible sources and need to decide which one deserves closer attention.</p>
    <div class="quick-review-step"><b>1 · ABSTRACT</b><p>Preview the question, approach, and major finding. Decide whether the paper is relevant enough to keep going.</p></div>
    <div class="quick-review-step"><b>2 · INTRODUCTION + ENDING</b><p>Skim the problem, context, contribution, and the authors' take-away.</p></div>
    <div class="quick-review-step"><b>3 · RESULTS / DATA</b><p>Go to tables, figures, findings, or other evidence that directly bears on your question.</p></div>
    <div class="quick-review-step"><b>4 · SELECT</b><p>Choose the source that is most likely to answer your question. Then switch to Strategic Reading.</p></div>
    <div class="inventory-use">Question → scan → compare → select.</div>
  </div>`;
 }
 
 
 function strategicReadReviewHTML(){
  return `<div class="tool-review strategic-read-review">
    <div class="tool-review-kicker">FIELD KIT // STRATEGIC READING</div>
    <h3>Strategic Reading</h3>
    <p class="tool-review-intro">Use this after you've selected the right source. The goal is to extract the evidence that answers your question.</p>
    <div class="quick-review-step"><b>1 · QUESTION</b><p>Define exactly what you need the article to tell you.</p></div>
    <div class="quick-review-step"><b>2 · RESULTS</b><p>Find the result, figure, table, or observation that bears directly on the question.</p></div>
    <div class="quick-review-step"><b>3 · METHODS</b><p>Check how that evidence was produced and whether the method can support the claim you're considering.</p></div>
    <div class="quick-review-step"><b>4 · DISCUSSION + LIMITATIONS</b><p>Read the authors' interpretation, then separate it from the finding and notice the limits.</p></div>
    <div class="inventory-use">Question → finding → how they know → what it means.</div>
  </div>`;
 }
 
 function viewFieldTool(id){
  const def=fieldToolDefs[id];
  if(!def)return;
 
  q("#inventoryTitle").textContent=def.name;
  q("#inventorySubtitle").textContent=`${def.subtitle} · Read-only copy from your Field Kit`;
 
  let html="";
  if(id==="articleMap")html=articleMapReviewHTML();
  else if(id==="quickRead")html=quickReadReviewHTML();
  else if(id==="strategicRead")html=strategicReadReviewHTML();
  else html=`<div class="tool-review"><h3>${def.name}</h3><p>${def.desc}</p><div class="inventory-use">${def.use}</div></div>`;
 
  q("#inventoryBody").innerHTML=`
    <div class="inventory-resource-view">
      <div class="inventory-resource-actions">
        <button class="inventory-return" type="button" data-return-fieldkit>← Back to Field Kit</button>
        <button class="inventory-email-item" type="button" data-email-tool="${id}">Email this tool</button>
      </div>
      ${html}
    </div>`;
 }
 
 function installInventoryUI(){
  if(q("#inventoryControls"))return;
  const controls=document.createElement("div");
  controls.id="inventoryControls";
  controls.innerHTML=`<button id="fieldKitBtn" type="button">FIELD KIT <span>0</span></button><button id="backpackBtn" type="button">BACKPACK <span>0</span></button>`;
  document.body.appendChild(controls);
 
  const modal=document.createElement("section");
  modal.id="inventoryModal";
  modal.className="hidden";
  modal.innerHTML=`<div class="inventory-shell">
    <button id="closeInventory" type="button" aria-label="Close inventory">×</button>
    <div class="inventory-kicker">AFTERFALL // YOUR RESOURCES</div>
    <h2 id="inventoryTitle">FIELD KIT</h2>
    <p id="inventorySubtitle"></p>
    <div id="inventoryBody"></div>
  </div>`;
  document.body.appendChild(modal);
 
  q("#fieldKitBtn").onclick=openFieldKit;
  q("#backpackBtn").onclick=openBackpack;
  q("#closeInventory").onclick=()=>q("#inventoryModal").classList.add("hidden");
  q("#inventoryModal").onclick=e=>{
    if(e.target===q("#inventoryModal")){
      q("#inventoryModal").classList.add("hidden");
      return;
    }
 
    const emailAll=e.target.closest("[data-email-all-fieldkit]");
    if(emailAll){
      openFieldKitEmail();
      return;
    }
 
    const emailTool=e.target.closest("[data-email-tool]");
    if(emailTool){
      openFieldKitEmail({toolId:emailTool.dataset.emailTool});
      return;
    }
 
    const source=e.target.closest("[data-source]");
    if(source){
      viewBackpackSource(source.dataset.source,"Abstract");
      return;
    }
 
    const tool=e.target.closest("[data-tool]");
    if(tool){
      viewFieldTool(tool.dataset.tool);
      return;
    }
 
    const sourceTab=e.target.closest("[data-inventory-source][data-inventory-section]");
    if(sourceTab){
      const id=sourceTab.dataset.inventorySource;
      const section=sourceTab.dataset.inventorySection;
      qa("#inventoryModal .inventory-source-tabs button").forEach(btn=>btn.classList.toggle("active",btn===sourceTab));
      if(q("#inventorySourceContent"))q("#inventorySourceContent").innerHTML=inventoryArticleSectionHTML(id,section);
      return;
    }
 
    if(e.target.closest("[data-return-backpack]")){
      openBackpack();
      return;
    }
    if(e.target.closest("[data-return-fieldkit]")){
      openFieldKit();
      return;
    }
  };
  renderInventoryCounts();
 }
 
 
 
 
 /* === DIEGETIC ARTICLE MAP LESSON — GUIDED LEARNING OBJECT === */
 const anatomyGuide=[
  {
    section:"Abstract",
    label:"ABSTRACT",
    role:"ORIENT",
    note:"A compact overview of the study question, approach, and major finding.",
    look:"Usually a short paragraph near the beginning. It often names the problem, briefly describes the study, and summarizes major findings or conclusions.",
    use:"Use it to decide quickly whether the article is relevant enough to keep reading.",
    mira:"Start here when you need to know what kind of paper you're looking at and whether it might matter."
  },
  {
    section:"Introduction",
    label:"INTRODUCTION",
    role:"CONTEXT",
    note:"Why the researchers asked this question and what earlier work led to it.",
    look:"Look for the research problem, the study's purpose or question, and discussion of earlier research. A literature review may be folded into this section or appear separately.",
    use:"Use it when you need context: what is already known, what remains uncertain, and why this study was undertaken.",
    mira:"This is where the paper tells you why the problem matters and what conversation the study is entering."
  },
  {
    section:"Methods",
    label:"METHODS",
    role:"EVIDENCE",
    note:"How the study produced its evidence: participants, measurements, procedures, and analysis.",
    look:"Look for who or what was studied, how observations or measurements were made, what procedures were followed, and how the evidence was analyzed.",
    use:"Use it to judge how the authors know what they claim to know—and whether the method can actually support the conclusion.",
    mira:"Methods answers: how do they know? If the evidence was gathered badly, everything downstream is weaker."
  },
  {
    section:"Results",
    label:"RESULTS",
    role:"FINDINGS",
    note:"What the researchers actually found before interpretation.",
    look:"Look for reported observations, measurements, statistical results, tables, figures, and other direct outcomes of the study.",
    use:"Use it when you need the evidence itself rather than somebody's summary of what the evidence means.",
    mira:"Results is where you separate the finding from the story people later tell about the finding."
  },
  {
    section:"Discussion",
    label:"DISCUSSION",
    role:"INTERPRET",
    note:"What the authors think the findings mean, plus limitations and implications.",
    look:"Look for explanations of the results, comparisons with earlier research, limitations, alternative explanations, and implications.",
    use:"Use it to understand the authors' reasoning—but keep their interpretation distinct from the results themselves.",
    mira:"Discussion is interpretation. Useful, but don't confuse it with the raw finding."
  },
  {
    section:"Conclusion",
    label:"CONCLUSION",
    role:"TAKEAWAY",
    note:"The authors' final synthesis of what the study contributes.",
    look:"Look for a concise restatement of the major findings and why the authors believe they matter. Some articles combine this with the Discussion.",
    use:"Use it for the take-away, then verify important claims against the Results and Methods.",
    mira:"Good for the take-away. Not a substitute for checking what the evidence underneath it actually showed."
  },
  {
    section:"References",
    label:"REFERENCES",
    role:"TRACE",
    note:"The earlier evidence and conversations this paper builds on.",
    look:"Look for the full list of works cited in the article. Individual citations in the text point to entries here.",
    use:"Use references to trace a claim backward, find related scholarship, and see what evidence the authors relied on.",
    mira:"References let you move backward through the evidence trail when a claim needs checking."
  }
 ];
 
 
 const anatomyGuideBySection=Object.fromEntries(anatomyGuide.map((item,index)=>[item.section,{...item,index}]));
 
 function anatomyExploreProgress(){
  const count=anatomyGuide.filter(item=>anatomySeen.has(item.section)).length;
  return `<div class="explore-progress" aria-label="${count} of ${anatomyGuide.length} sections explored">
    ${anatomyGuide.map(item=>`<span class="${anatomySeen.has(item.section)?"done":""}" title="${item.label}"></span>`).join("")}
    <b>${count}/${anatomyGuide.length} explored</b>
  </div>`;
 }
 
 function pulseArticleGuide(){
  const pane=q("#articleAnatomy .guide-sticky-pane");
  if(!pane)return;
  pane.classList.remove("guide-updated");
  void pane.offsetWidth;
  pane.classList.add("guide-updated");
 }
 
 function showArticleGuideSection(sectionName,{fromClick=false}={}){
  const item=anatomyGuideBySection[sectionName];
  if(!item)return;
 
  qa("#articleAnatomy .paper-section").forEach(x=>x.classList.remove("active","wrong","correct"));
  const sec=q(`#articleAnatomy .paper-section[data-section="${sectionName}"]`);
  if(sec)sec.classList.add("active");
  qa("#articleAnatomy .anatomy-legend button").forEach(btn=>{
    btn.classList.toggle("selected",btn.dataset.guideSection===sectionName);
  });
 
  q("#anatomyPrompt").innerHTML=`
    <div class="guide-current">
      <span>YOU'RE HERE</span>
      <strong>${item.label}</strong>
      <em>${item.role}</em>
    </div>
    ${anatomyExploreProgress()}
    <div class="guide-purpose">
      <span>WHAT THIS SECTION DOES</span>
      <p>${item.note}</p>
    </div>
    <div class="guide-info-block"><b>WHAT TO LOOK FOR</b><p>${item.look}</p></div>
    <div class="guide-info-block guide-use"><b>USE IT WHEN...</b><p>${item.use}</p></div>`;
 
  q("#anatomyFeedback").innerHTML=`<span class="mira-inline"><b>AMINA</b> ${item.mira}</span>`;
 
  if(fromClick){
    q("#anatomyProgress").textContent=`EXPLORING · ${item.label}`;
    pulseArticleGuide();
  }
 }
 
 function anatomyLearningComplete(){
  return anatomyGuide.every(item=>anatomySeen.has(item.section));
 }
 
 function finishAnatomyStudyIfReady(){
  if(anatomyMode!=="learn" || !anatomyLearningComplete())return false;
 
  anatomyMode="transition";
  anatomyStep=0;
  renderArticleAnatomy();
  return true;
 }
 
 function markAnatomySectionSeen(sectionName){
  anatomySeen.add(sectionName);
  const paperBtn=q(`#articleAnatomy .paper-section[data-section="${sectionName}"]`);
  const navBtn=q(`#articleAnatomy .anatomy-legend button[data-guide-section="${sectionName}"]`);
  if(paperBtn)paperBtn.classList.add("seen");
  if(navBtn)navBtn.classList.add("seen");
 }
 
 
 function applyAnatomyAnswerReveals(){
  qa("#articleAnatomy .quiz-answer-evidence").forEach(el=>{
    el.classList.toggle("revealed",anatomyRevealed.has(el.dataset.answerFor));
  });
 }
 
 function clearAnatomyAnswerReveals(){
  anatomyRevealed=new Set();
  applyAnatomyAnswerReveals();
 }
 
 function revealAnatomyAnswer(sectionName){
  anatomyRevealed.add(sectionName);
  applyAnatomyAnswerReveals();
  const evidence=q(`#articleAnatomy .quiz-answer-evidence[data-answer-for="${sectionName}"]`);
  if(evidence)setTimeout(()=>evidence.scrollIntoView({block:"center",behavior:"smooth"}),80);
 }
 
 function evaluateAnatomyAnswer(sectionName){
  const step=anatomyChecks[anatomyStep];
  if(!step)return;
 
  const paperBtn=q(`#articleAnatomy .paper-section[data-section="${sectionName}"]`);
  const navBtn=q(`#articleAnatomy .anatomy-legend button[data-guide-section="${sectionName}"]`);
 
  qa("#articleAnatomy .paper-section").forEach(x=>x.classList.remove("correct","wrong"));
  qa("#articleAnatomy .anatomy-legend button").forEach(x=>x.classList.remove("correct","wrong"));
 
  if(sectionName===step.target){
    if(paperBtn)paperBtn.classList.add("correct");
    if(navBtn)navBtn.classList.add("correct");
    markAnatomySectionSeen(sectionName);
    revealAnatomyAnswer(sectionName);
    q("#anatomyFeedback").innerHTML=`<span class="mira-inline"><b>AMINA</b> ${step.feedback} I've marked the passage that shows you why.</span>`;
    anatomyStep++;
    setTimeout(()=>{
      renderArticleAnatomy();
      applyAnatomyAnswerReveals();
    },1500);
    return;
  }
 
  /* Wrong answers never replace the active quiz prompt or earlier evidence reveals. */
  if(paperBtn)paperBtn.classList.add("wrong");
  if(navBtn)navBtn.classList.add("wrong");
 
  const info=anatomyGuideBySection[sectionName];
  q("#anatomyFeedback").innerHTML=`
    <span class="mira-inline"><b>AMINA</b> Not quite. <b>${info?.label||sectionName}</b> is used to ${info?.note ? info.note.charAt(0).toLowerCase()+info.note.slice(1) : "do a different job in the article"}.</span>
    <span class="practice-nudge"><b>TRY AGAIN</b> ${step.prompt}</span>`;
 
  q("#anatomyProgress").textContent=`USE THE MAP ${anatomyStep+1} / ${anatomyChecks.length} · TRY AGAIN`;
 
  setTimeout(()=>{
    paperBtn?.classList.remove("wrong");
    navBtn?.classList.remove("wrong");
  },650);
 }
 
 function interactWithArticleSection(sectionName,{scroll=true}={}){
  if(!anatomyGuideBySection[sectionName])return;
 
  markAnatomySectionSeen(sectionName);
 
  const paperBtn=q(`#articleAnatomy .paper-section[data-section="${sectionName}"]`);
  if(scroll && paperBtn)paperBtn.scrollIntoView({block:"center",behavior:"smooth"});
 
  if(anatomyMode==="practice"){
    evaluateAnatomyAnswer(sectionName);
    return;
  }
 
  showArticleGuideSection(sectionName,{fromClick:true});
 
  /* Direct exploration is a valid alternative to NEXT SECTION.
     Once all seven sections have been visited, begin practice. */
  if(anatomyMode==="learn"){
    const count=anatomySeen.size;
    q("#anatomyProgress").textContent=`EXPLORED ${count} / ${anatomyGuide.length}`;
    finishAnatomyStudyIfReady();
  }
 }
 
 const anatomyChecks=[
  {target:"Methods",prompt:"If you need to know <b>how Okafor and Running Bear produced their evidence</b>, which section would you use?",feedback:"Methods. That's where the evidence-producing process lives."},
  {target:"Results",prompt:"If you need <b>the finding itself before interpretation</b>, where do you go?",feedback:"Results. Finding first; interpretation later."},
  {target:"Discussion",prompt:"If you want <b>the authors' explanation of what the finding may mean</b>, which section?",feedback:"Discussion. That's where interpretation and limitations live."}
 ];
 
 let anatomyStep=0;
 let anatomyMode="learn";
 let anatomyContinue=null;
 let anatomySeen=new Set();
 let anatomyRevealed=new Set();
 
 function openArticleAnatomy(nextGo){
  anatomyStep=0;
  anatomyMode="learn";
  anatomySeen=new Set();
  anatomyRevealed=new Set();
  anatomyContinue=nextGo;
  q("#articleAnatomy").classList.remove("hidden");
  document.body.classList.add("article-map-open");
  renderArticleAnatomy();
 }
 
 function renderArticleAnatomy(){
  const feedback=q("#anatomyFeedback");
  const prompt=q("#anatomyPrompt");
  const progress=q("#anatomyProgress");
  const continueBtn=q("#anatomyContinue");
 
  qa("#articleAnatomy .paper-section").forEach(x=>x.classList.remove("active","wrong","correct"));
 
  if(anatomyMode==="learn"){
    const item=anatomyGuide[anatomyStep];
    if(!item){
      anatomyMode="practice";
      anatomyStep=0;
      renderArticleAnatomy();
      return;
    }
 
    const sec=q(`#articleAnatomy .paper-section[data-section="${item.section}"]`);
    if(sec)sec.scrollIntoView({block:"center",behavior:"smooth"});
    markAnatomySectionSeen(item.section);
 
    progress.textContent=`EXPLORE · ${anatomySeen.size} / ${anatomyGuide.length}`;
    showArticleGuideSection(item.section);
    continueBtn.textContent=anatomyLearningComplete() ? "I KNOW THE MAP — TEST ME →" : "EXPLORE NEXT SECTION →";
    continueBtn.classList.remove("hidden");
    continueBtn.dataset.mode="learn";
    return;
  }
 
  if(anatomyMode==="transition"){
    qa("#articleAnatomy .paper-section").forEach(x=>x.classList.remove("active","wrong","correct"));
    progress.textContent="MAP EXPLORED · 7 / 7";
    prompt.innerHTML=`<div class="quiz-transition-card"><div class="quiz-transition-kicker">THE MODE HAS CHANGED</div><h3>You've explored the map. Now use it.</h3><p>Amina will give you an information need. Instead of reading from page one, choose the section where that kind of information should live.</p><div class="quiz-transition-rule"><b>YOUR MOVE:</b> select the answer in the article or in the section map below.</div></div>`;
    feedback.innerHTML=`<span class="mira-inline"><b>AMINA</b> Good. That's the map. Now let's see if you can use it when you know what information you need.</span>`;
    continueBtn.textContent="BEGIN · USE THE MAP →";
    continueBtn.classList.remove("hidden");
    continueBtn.dataset.mode="transition";
    applyAnatomyAnswerReveals();
    return;
  }
 
  if(anatomyMode==="practice"){
    applyAnatomyAnswerReveals();
    const step=anatomyChecks[anatomyStep];
    if(step){
      progress.textContent=`USE THE MAP ${anatomyStep+1} / ${anatomyChecks.length}`;
      prompt.innerHTML=step.prompt;
      feedback.innerHTML=`<span class="mira-inline"><b>AMINA</b> Now use the map you just learned. Click the section that does the job you need.</span>`;
      continueBtn.classList.add("hidden");
    }else{
      anatomyMode="complete";
      renderArticleAnatomy();
    }
    return;
  }
 
  progress.textContent="COMPLETE";
  prompt.innerHTML=`<h3>ARTICLE MAP ACQUIRED</h3><p>You can now navigate scholarly articles by purpose instead of reading them like novels.</p>`;
  feedback.innerHTML=`<span class="mira-inline"><b>AMINA</b> That's the point. Know what you need, then go where that information lives.</span>`;
  continueBtn.textContent="ADD ARTICLE MAP TO FIELD KIT →";
  continueBtn.classList.remove("hidden");
  continueBtn.dataset.mode="complete";
 }
 
 function advanceArticleAnatomy(){
  if(anatomyMode==="learn"){
    /* The currently displayed guided section counts as explored. */
    const current=anatomyGuide[anatomyStep];
    if(current)markAnatomySectionSeen(current.section);
 
    if(finishAnatomyStudyIfReady())return;
 
    /* If the player has already explored ahead using the section buttons,
       NEXT SECTION jumps to the next section they have not yet visited. */
    const nextUnseen=anatomyGuide.findIndex(item=>!anatomySeen.has(item.section));
    anatomyStep=nextUnseen>=0?nextUnseen:anatomyStep+1;
    renderArticleAnatomy();
    return;
  }
  if(anatomyMode==="transition"){
    anatomyMode="practice";
    anatomyStep=0;
    renderArticleAnatomy();
    return;
  }
  if(anatomyMode==="complete"){
    finishArticleAnatomy();
  }
 }
 
 function finishArticleAnatomy(){
  q("#articleAnatomy").classList.add("hidden");
  document.body.classList.remove("article-map-open");
  addFieldTool("articleMap",true);
  if(anatomyContinue)anatomyContinue();
 }
 
 function installArticleAnatomy(){
  if(q("#articleAnatomy"))return;
 
  const panel=document.createElement("section");
  panel.id="articleAnatomy";
  panel.className="hidden";
  panel.innerHTML=`<div class="anatomy-shell diegetic-v3">
    <header class="anatomy-topbar">
      <div>
        <div class="anatomy-kicker">HALE LIBRARY // FIELD COPY</div>
        <h2>Environmental Persistence of Viral Particles on Common Laboratory Surfaces</h2>
        <p>Okafor, Mercer & Toma · Journal of Applied Environmental Virology · Vol. 18</p>
      </div>
      <div class="paper-status">REFERENCE COPY</div>
    </header>
 
    <div class="anatomy-layout">
      <article class="diegetic-paper article-training-copy" aria-label="Sample scholarly article">
        <div class="paper-header">
          <h1>Environmental Persistence of Viral Particles on Common Laboratory Surfaces</h1>
          <p class="paper-authors">L. Okafor, J. Mercer, L. Toma</p>
          <p class="paper-affiliations">Department of Epidemiology and Environmental Health · North Campus Research University</p>
        </div>
 
        <button class="paper-section section-abstract" type="button" data-section="Abstract">
          <span class="section-tag"><b>ABSTRACT</b><em>ORIENT</em></span>
          <p>Environmental persistence is frequently invoked when explaining transmission during infectious disease outbreaks, yet laboratory detection does not necessarily establish a meaningful route of human exposure. We measured recovery of replication-competent enveloped viral particles from stainless steel, glass, polymer desktop laminate, cotton fabric, and nitrile-coated surfaces under controlled temperature and humidity conditions. Samples were collected at 15 minutes, 1 hour, 4 hours, 8 hours, and 24 hours after deposition.</p>
          <p>Recovery declined rapidly on cotton and more gradually on nonporous surfaces. Detectable particles remained on steel and glass at 8 hours in a minority of trials, although recovered quantities were substantially lower than initial inoculum. These experiments demonstrate persistence under controlled laboratory conditions but do not establish the probability that ordinary contact with environmental surfaces produces infection in real-world settings.</p>
        </button>
 
        <button class="paper-section section-introduction" type="button" data-section="Introduction">
          <span class="section-tag"><b>INTRODUCTION</b><em>CONTEXT</em></span>
          <p>During emerging outbreaks, contaminated objects often receive intense public attention because surfaces are visible, familiar, and comparatively easy to clean. Earlier investigations of respiratory and enteric viruses have demonstrated that infectious material may remain recoverable from nonporous surfaces for periods ranging from minutes to days. The epidemiological importance of that persistence, however, varies considerably by organism, environmental conditions, inoculum, and human behavior.</p>
          <p>Laboratory persistence studies answer a narrow question: whether viable material can be recovered after a defined interval under specified conditions. They do not by themselves determine how frequently people encounter infectious quantities, how efficiently material transfers to hands or mucous membranes, or whether surface contact contributes substantially to transmission compared with other exposure routes.</p>
        </button>
 
        <button class="paper-section section-methods" type="button" data-section="Methods">
          <span class="section-tag"><b>METHODS</b><em>EVIDENCE</em></span>
          <p><span class="quiz-answer-evidence" data-answer-for="Methods">Five surface materials commonly present in university laboratories and instructional buildings were cut into standardized coupons and sterilized before each trial. Viral suspension was deposited in 10-microliter droplets at a fixed starting concentration. Coupons were maintained at 21°C and 40% relative humidity. At each sampling interval, surfaces were eluted in transport medium and cultured using a plaque assay. Three independent experimental runs were completed for every material and time point.</span></p>
          <p>Recovery was expressed as a percentage of the initial inoculum. Investigators processing plaque assays were blinded to surface type. Temperature and humidity were continuously logged. The study did not test transfer from surfaces to human skin, did not measure behavior in occupied buildings, and did not expose human or animal participants.</p>
        </button>
 
        <button class="paper-section section-results" type="button" data-section="Results">
          <span class="section-tag"><b>RESULTS</b><em>FINDINGS</em></span>
          <p><span class="quiz-answer-evidence" data-answer-for="Results">Mean recovery declined on every tested material over time. Cotton showed the steepest reduction, with replication-competent particles rarely recovered after 1 hour. Polymer laminate and nitrile-coated surfaces produced intermediate recovery. Steel and glass retained measurable material for the longest period, although median recovered concentration at 8 hours was below 2% of starting inoculum. No surface yielded detectable replication-competent particles in all replicates at 24 hours.</span></p>
          <p>Differences between porous and nonporous materials were largest during the first four hours. Variability increased at later sampling intervals as recovered quantities approached the assay's detection threshold. The data therefore support material-dependent persistence under the experimental conditions.</p>
        </button>
 
        <button class="paper-section section-discussion" type="button" data-section="Discussion">
          <span class="section-tag"><b>DISCUSSION</b><em>INTERPRET</em></span>
          <p><span class="quiz-answer-evidence" data-answer-for="Discussion">Our findings confirm that viable viral particles can persist for several hours on some nonporous materials under controlled indoor conditions. This result is biologically relevant because it establishes that immediate loss of viability cannot be assumed. At the same time, persistence should not be treated as synonymous with an important transmission pathway.</span></p>
          <p>Accordingly, these results should be integrated with epidemiological evidence before being used to prioritize outbreak controls. Cleaning high-touch surfaces may be prudent, particularly when the transmission route is uncertain, but the present study cannot establish the proportion of infections attributable to contaminated surfaces.</p>
        </button>
 
        <button class="paper-section section-conclusion" type="button" data-section="Conclusion">
          <span class="section-tag"><b>CONCLUSION</b><em>TAKEAWAY</em></span>
          <p>Replication-competent particles persisted longer on steel and glass than on cotton under controlled laboratory conditions. The study establishes environmental persistence, not the real-world probability of surface-mediated infection. Decisions about outbreak control should therefore distinguish what was directly measured from broader claims about transmission.</p>
        </button>
 
        <button class="paper-section section-references" type="button" data-section="References">
          <span class="section-tag"><b>REFERENCES</b><em>TRACE</em></span>
          <p>Selected literature includes experimental studies of viral stability, environmental sampling, transfer efficiency, surface disinfection, and epidemiological investigations of transmission in shared indoor environments.</p>
        </button>
      </article>
 
      <aside class="anatomy-mission">
        <div class="anatomy-mission-head">
          <div><span class="anatomy-task-label">ARTICLE GUIDE</span><small>CHANGES AS YOU EXPLORE</small></div>
          <span id="anatomyProgress">EXPLORE · 1 / 7</span>
        </div>
        <div class="anatomy-guide-body">
          <div class="guide-sticky-pane">
            <div class="guide-instruction"><b>Don't read from page one.</b> Select any marked section of the paper. This guide will change to show you what that part does and when you'd use it.</div>
            <div id="anatomyPrompt" aria-live="polite"></div>
            <div id="anatomyFeedback" aria-live="polite"></div>
          </div>
          <div class="guide-controls-pane">
            <div class="section-map-label"><span>JUMP TO SECTION</span><small>Each click updates the guide above</small></div>
            <div class="anatomy-legend" aria-label="Article section map">
          <button type="button" class="legend-orient" data-guide-section="Abstract">ABSTRACT</button>
          <button type="button" class="legend-context" data-guide-section="Introduction">INTRODUCTION</button>
          <button type="button" class="legend-evidence" data-guide-section="Methods">METHODS</button>
          <button type="button" class="legend-findings" data-guide-section="Results">RESULTS</button>
          <button type="button" class="legend-interpret" data-guide-section="Discussion">DISCUSSION</button>
          <button type="button" class="legend-takeaway" data-guide-section="Conclusion">CONCLUSION</button>
          <button type="button" class="legend-trace" data-guide-section="References">REFERENCES</button>
            </div>
          </div>
        </div>
        <div class="anatomy-attribution">
          Adapted in concept from <a href="https://www.lib.ncsu.edu/tutorials/scholarly-articles/archive/" target="_blank" rel="noopener noreferrer"><b>NCSU Libraries, “Anatomy of a Scholarly Article.”</b></a>
          Original learning object shared under CC BY-NC-SA 3.0 US. AFTERFALL uses original article text, annotations, interaction design, and visual treatment.
        </div>
        <button id="anatomyContinue" type="button">NEXT SECTION →</button>
      </aside>
    </div>
  </div>`;
  document.body.appendChild(panel);
 
  panel.addEventListener("click",e=>{
    const guideBtn=e.target.closest("button[data-guide-section]");
    if(guideBtn){
      interactWithArticleSection(guideBtn.dataset.guideSection,{scroll:true});
      return;
    }
 
    const paperBtn=e.target.closest("button.paper-section[data-section]");
    if(paperBtn){
      interactWithArticleSection(paperBtn.dataset.section,{scroll:false});
      return;
    }
  });
  q("#anatomyContinue").onclick=advanceArticleAnatomy;
 }
 
 const purposes={Abstract:"Study at a glance",Introduction:"Why this question matters",Methods:"How evidence was produced",Results:"What researchers found",Discussion:"What the findings may mean",References:"Earlier evidence"};
 const papers={
 vale:{title:"Enclosed Co-Presence and Illness Patterns Across Early Network Clusters",authors:"Okafor, Running Bear, Chen & Park · Emergency Epidemiology Reports · Day 8",question:"Which exposure pattern best predicts illness, and what can the study establish?",sections:{
 Abstract:`<h2>Abstract</h2><p>We reconstructed likely exposure patterns among 126 cases and 304 non-cases. Illness was strongly associated with <mark>prolonged indoor co-presence</mark>. Physical contact alone was not independently associated after accounting for shared indoor time.</p><p>The pattern is consistent with short-range airborne or aerosol transmission, but does not distinguish aerosol exposure from unrecorded close contact.</p>`,
 Introduction:`<h2>Introduction</h2><p>Initial emergency guidance emphasized contaminated surfaces and direct physical contact. Several early cases had no documented physical contact with known cases. We asked whether illness was more strongly associated with direct contact, shared indoor air, or broad building-level co-presence.</p>`,
 Methods:`<h2>Methods</h2><p>Exposure was reconstructed using access-card logs, room schedules, interviews, and Bluetooth proximity records where available. <mark>Researchers did not directly measure airborne particles or pathogen concentration.</mark></p><p>Prolonged indoor co-presence meant at least 30 minutes in the same enclosed room.</p>`,
 Results:`<h2>Results</h2><table><tr><th>Exposure</th><th>Cases</th><th>Non-cases</th></tr><tr><td>Same enclosed room ≥30 min</td><td>71%</td><td>18%</td></tr><tr><td>Physical contact without room overlap</td><td>19%</td><td>16%</td></tr><tr><td>Same building, different room</td><td>21%</td><td>19%</td></tr><tr><td>Outdoor-only co-presence</td><td>3%</td><td>4%</td></tr></table><p><mark>Prolonged indoor co-presence remained strongly associated with illness after adjustment for documented physical contact.</mark></p>`,
 Discussion:`<h2>Discussion</h2><p>The pattern is consistent with short-range airborne transmission and argues against physical contact as the sole or dominant route. However, the study does not prove aerosol transmission. A prudent interim response is to reduce prolonged indoor co-presence while additional evidence is collected.</p>`,
 References:`<h2>References</h2><p>Rios et al. Day 5 cluster report.</p><p>Running Bear et al. Symptom Onset and Probable Transmission Windows.</p>`}},
 chen:{title:"Symptom Onset and Probable Transmission Windows in Early Network Cases",authors:"Running Bear, Okafor, Alvarez & Singh · Emergency Epidemiology Reports · Day 9",question:"Can transmission occur before recognizable symptoms?",sections:{
 Abstract:`<h2>Abstract</h2><p>We reconstructed symptom onset and likely transmission links for 47 probable pairs. In 14 pairs, the recipient's only documented exposure occurred <mark>before the source reported neurological symptoms</mark>.</p>`,
 Introduction:`<h2>Introduction</h2><p>Current quarantine guidance assumes infectiousness begins with recognizable symptoms. Several cases cannot be explained by exposure after symptom onset.</p>`,
 Methods:`<h2>Methods</h2><p>Contact windows were reconstructed from interviews, access records, messages, and symptom diaries. Probable pairs had no other documented exposure. <mark>Exact transmission events cannot be observed directly from these records.</mark></p>`,
 Results:`<h2>Results</h2><p>Fourteen of 47 probable transmission pairs had exposure windows ending before recognizable symptoms. Nine occurred within 24 hours before onset; five occurred 24–48 hours before onset.</p><p><mark>No probable pair in this dataset required exposure more than 48 hours before symptom onset.</mark></p>`,
 Discussion:`<h2>Discussion</h2><p>The reconstructed pairs are consistent with presymptomatic transmission, particularly during the 48 hours before symptoms. Alternative unidentified exposures remain possible, so the precise beginning of infectiousness remains uncertain.</p><p>Quarantine policies beginning only after symptom onset may miss some transmission risk.</p>`,
 References:`<h2>References</h2><p>Okafor & Running Bear et al. Exposure Pattern Study.</p><p>Rios et al. Day 5 cluster report.</p>`}},
 rios:{title:"Emergency Therapeutic Options for Neuroinvasive NVC-11: A Rapid Evidence Review",authors:"Rios & Malik · Clinical Response Review · Day 10",question:"Does this article provide direct evidence that VX-17 treats the outbreak?",sections:{
 Abstract:`<h2>Abstract</h2><p>With no established therapy for NVC-11, we rapidly reviewed laboratory, animal, and early clinical evidence for candidate interventions. <mark>VX-17 shows antiviral activity in cell culture</mark> and has been proposed for emergency use. No completed controlled clinical trial in NVC-11 patients was identified.</p>`,
 Introduction:`<h2>Introduction</h2><p>Clinicians urgently need treatment guidance. VX-17 is already licensed for another viral illness, making it an attractive candidate for repurposing. This review asks what existing evidence supports its use against NVC-11.</p>`,
 Methods:`<h2>Methods</h2><p>We searched emergency reports, preprints, laboratory studies, animal studies, and registered trials. Evidence was summarized by study type. <mark>This article reports no new patient experiment of its own.</mark></p>`,
 Results:`<h2>Results</h2><p>Two laboratory studies found reduced viral replication in cultured cells exposed to VX-17. One small animal study reported lower viral load. A hospital case series described five treated patients, but had no untreated comparison group. <mark>No randomized or controlled clinical outcome study was available.</mark></p>`,
 Discussion:`<h2>Discussion</h2><p>VX-17 is biologically plausible and merits clinical investigation, but current evidence is insufficient to conclude that it improves patient outcomes. Emergency use should not be described as an established treatment.</p>`,
 References:`<h2>References</h2><p>Malik et al. VX-17 inhibition of NVC-11 replication in vitro.</p><p>Ortega et al. Compassionate VX-17 use: five cases.</p>`
 }}
 };
 function obj(t){q("#objective").textContent=t}function model(t){q("#model").textContent=t}
 const fpNodes={
  courtyard:{label:"North Campus Courtyard",hint:"Choose where to go."},
  annex:{label:"Research Annex",hint:"Amina is waiting near the entrance."},
  library:{label:"Hale Library · Network Research Hub",hint:"Amina coordinates research here; Iona is waiting with a new field question."},
  comms:{label:"Network Communications",hint:"Rosie is reconstructing the Westbridge report trail."}
 };
 const fpTargetNode={mira:"annex",lab:"annex",library:"library",comms:"comms"};
 
 function renderFirstPerson(){
  const world=q("#world");
  ["fp-courtyard","fp-annex","fp-library","fp-comms"].forEach(c=>world.classList.remove(c));
  world.classList.add(`fp-${S.fpNode}`);
  const info=fpNodes[S.fpNode]||fpNodes.courtyard;
  if(q("#fpLocation"))q("#fpLocation").textContent=info.label;
  if(q("#fpHint"))q("#fpHint").textContent=info.hint;
 
  qa("#fpDestinations [data-node]").forEach(btn=>{
    const node=btn.dataset.node;
    btn.classList.toggle("current-node",node===S.fpNode);
    const hotspotId=node==="annex"?"mira":node==="library"?"library":"comms";
    const hot=q("#"+hotspotId);
    const available=node==="annex" || (hot && !hot.classList.contains("locked"));
    btn.classList.toggle("locked-node",!available);
    btn.disabled=node===S.fpNode;
  });
 }
 
 function travelFirstPerson(node){
  if(!fpNodes[node] || node===S.fpNode)return;
  const navBtn=q(`#fpDestinations [data-node="${node}"]`);
  if(navBtn && navBtn.classList.contains("locked-node"))return;
  const world=q("#world");
  world.classList.add("fp-travelling");
  setTimeout(()=>{
    S.fpNode=node;
    renderFirstPerson();
    setTimeout(()=>world.classList.remove("fp-travelling"),420);
  },220);
 }
 
 q("#fpDestinations").onclick=e=>{
  const btn=e.target.closest("[data-node]");
  if(btn)travelFirstPerson(btn.dataset.node);
 };
 
 let nextTarget="mira";function next(t,target){q("#nextLabel").textContent=t.replace(/[.]$/,"");if(target!==undefined)nextTarget=target;qa(".hot").forEach(x=>x.classList.remove("current"));if(nextTarget&&q("#"+nextTarget))q("#"+nextTarget).classList.add("current");renderFirstPerson();const node=fpTargetNode[nextTarget];if(node&&q("#fpHint")&&S.fpNode!==node)q("#fpHint").textContent=`Next objective: ${fpNodes[node].label}.`}function pathStep(n,labels){if(labels)for(let i=1;i<=4;i++)q("#path"+i).textContent=(i===n?"● ":"○ ")+labels[i-1];for(let i=1;i<=4;i++)q("#path"+i).classList.toggle("now",i===n)}q("#nextGo").onclick=()=>{const node=fpTargetNode[nextTarget];if(node&&node!==S.fpNode){travelFirstPerson(node);return}if(nextTarget&&q("#"+nextTarget)){let el=q("#"+nextTarget);el.classList.add("current");el.animate([{transform:"scale(1)"},{transform:"scale(1.08)"},{transform:"scale(1)"}],{duration:500,iterations:2})}};
 function addIntel(a,b){if(S.intel.some(x=>x.a===a))return;S.intel.push({a,b});q("#intelBtn").textContent=`INTEL (${S.intel.length})`;q("#intelList").innerHTML=S.intel.map(x=>`<div class="intel"><b>${x.a}</b><p>${x.b}</p></div>`).join("")}
 
 function pcName(){return S.playerName||characterProfiles[S.playerChar]?.name||"you"}
 
 /* CHARACTER VOICE SYSTEM
    Personality changes flavor, relationship chemistry, and how a player phrases
    a thought. It NEVER changes evidence, lesson difficulty, available tools,
    correct-answer logic, or the player's ability to succeed.
 
    No character is an information-literacy "class." Their dominant tendencies
    sometimes help, sometimes mislead, and occasionally reverse.
 */
 const playerVoiceLines={
  rowan:{strategicAsk:"We have enough to start. How do we read it without missing what matters?",whereFirst:"Wait. Where would the evidence itself be?",mapAsk:"Okay. So what's the structure we're overlooking?",showMap:"Thanks. Show me the map.",mapTime:"I see it. But seven sections across three papers... do we have time?",miraArrival:"That is a deeply comforting image.",paperCount:"Three papers. Okay. Which one can actually answer us?",ionaProblem:"What happened?",ionaInference:"So the timing matters more than the symptom check.",ionaTask:"What, specifically, do you need us to know?",ionaPractice:"All right. Let me work it out.",rosieOminous:"You said that like the door is part of the problem.",rosieSame:"Did the evidence change too?",rosieCertainty:"Wait. Where did the extra certainty come from?",rosieIntro:"Rosie?",rosieChanged:"What changed between versions?",finalTease:"You were waiting for me to say airborne, weren't you?",finalLearn:"I'm getting better at not filling in the gap."},
  june:{strategicAsk:"I'm not going to pretend I've seen this before. What's the best way to read it?",whereFirst:"What do we actually need first?",mapAsk:"All right. Give me the structure.",showMap:"Good. Show me the map.",mapTime:"Useful. Also, we have three papers and approximately no time.",miraArrival:"Wonderful. I was hoping for a new way to die.",paperCount:"Three papers. Fine. Which one actually earns our time?",ionaProblem:"All right. What's gone wrong?",ionaInference:"So symptom screening may be solving yesterday's problem.",ionaTask:"What decision does shelter command actually need from us?",ionaPractice:"Fair. Give me the study.",rosieOminous:"Excellent opening. What's on fire?",rosieSame:"Same citation the whole way?",rosieCertainty:"So somebody upgraded the certainty without upgrading the evidence.",rosieIntro:"And you are...?",rosieChanged:"All right. What changed?",finalTease:"You had the airborne speech ready, didn't you?",finalLearn:"Experience suggests I should enjoy this moment."},
  eli:{
  strategicAsk:"Okay. Question first, then we hunt for the part that answers it?",
  whereFirst:"Results. Unless I'm about to learn an embarrassing lesson.",
  mapAsk:"All right. Show me how the paper is built.",
  showMap:"Got it. Show me the map.",
  mapTime:"Seven sections, three papers, active emergency. I have won trivia rounds under worse conditions.",
  miraArrival:"Good. I was worried this situation might become relaxing.",
  paperCount:"Three papers. Excellent. I love a competition nobody agreed was a competition.",
  ionaProblem:"What's going on?",
  ionaInference:"So symptom screening might be late. That's worth taking seriously.",
  ionaTask:"What decision do you need from us?",
  ionaPractice:"All right. Give me the study. I'll make the call from the evidence.",
  rosieOminous:"Okay. Door shut. I'm listening.",
  rosieSame:"Same citation the whole time?",
  rosieCertainty:"There it is. 'Promising' became 'proven.' Where did that happen?",
  rosieIntro:"You must be Rosie.",
  rosieChanged:"Show me the versions.",
  finalTease:"For the record, I considered saying airborne and exercised remarkable restraint.",
  finalLearn:"Fine. That was satisfying."
 },
  chiara:{strategicAsk:"Okay. I want to move—but tell me how to read this before I do something stupid.",whereFirst:"Where do I look first?",mapAsk:"Okay, so what's the structure?",showMap:"Thanks. Show me the map.",mapTime:"Yeah, but it will take forever to apply it to three different articles. We're running out of time!",miraArrival:"Now, that's a comforting image.",paperCount:"Three papers. Minutes to spare. Great.",ionaProblem:"What happened?",ionaInference:"So symptom screening might not be enough.",ionaTask:"What am I looking for?",ionaPractice:"Fair enough. Give me the study.",rosieOminous:"That sounds ominous.",rosieSame:"Same evidence?",rosieCertainty:"So where did the extra certainty come from?",rosieIntro:"Rosie?",rosieChanged:"What changed?",finalTease:"You thought I was going to say airborne, didn't you?",finalLearn:"I'm learning."},
  micah:{strategicAsk:"One question. No side quests. How do we read for just that?",whereFirst:"Results first? Or—sorry. Where do we start?",mapAsk:"Wait. Show me how the pieces connect.",showMap:"Okay, yes. Show me the map.",mapTime:"This is useful. There are also three papers, which means there are about forty possible rabbit holes.",miraArrival:"That image raises several questions I don't think we have time for.",paperCount:"Three papers. Okay. Which question eliminates two of them fastest?",ionaProblem:"Wait—what changed?",ionaInference:"So there are at least two possibilities: screening is late, or the reconstruction is misleading.",ionaTask:"What would distinguish those possibilities?",ionaPractice:"Right. One question. Give me the study.",rosieOminous:"Okay, this might be a bad time to ask why the door matters.",rosieSame:"Same citation? That's interesting.",rosieCertainty:"Wait. If the evidence stayed fixed, where exactly did the confidence jump?",rosieIntro:"Rosie? Sorry—Amina gave me the short version.",rosieChanged:"What changed first: the wording, the source, or the interpretation?",finalTease:"I had three mechanism theories ready. I am choosing restraint.",finalLearn:"Question first. Possibilities second. I can do that."}
 };
 function pcVoice(key,fallback){return playerVoiceLines[S.playerChar]?.[key]||fallback;}
 
 const npcVoiceReactions={
  miraArrival:{rowan:"There you are. I was starting to think the checkpoint swallowed you. You okay?",june:"There you are. I was starting to think the checkpoint swallowed you. Please tell me you didn't stop for coffee.",eli:"There you are. I was starting to think the checkpoint swallowed you. And no, this is not a competition.",chiara:"There you are. I was starting to think the checkpoint swallowed you.",micah:"There you are. I was starting to think the checkpoint swallowed you. Walk and talk—we're late."},
  ionaArrival:{rowan:"You must be ${pcName()}. Amina said you were coming. Good—I was hoping she hadn't sent you back into the rain.",june:"You must be ${pcName()}. Amina said you were coming. She described you as 'alarmingly calm about trespassing.'",eli:"You must be ${pcName()}. Amina said you were coming. She also said not to let you turn this into a wager.",chiara:"You must be ${pcName()}. Amina said you were coming. Good timing—we've got a problem.",micah:"You must be ${pcName()}. Amina said you were coming. She also said you somehow know a surprising amount about ferry disasters. I did not ask why."},
  rosieArrival:{rowan:"You made it. Good. Shut the door. Sorry about the lighting. Communications was not designed for human eyes.",june:"You made it. Good. Shut the door. I was promised you appreciate a well-documented disaster.",eli:"You made it. Good. Shut the door. Amina says you like trivia. I have a terrible category for you: things people added to a sentence.",chiara:"You made it. Good. Shut the door.",micah:"You made it. Good. Shut the door. I have three versions of one claim and, regrettably, no maritime component."}
 };
 function npcVoice(key,fallback){const line=npcVoiceReactions[key]?.[S.playerChar];return line?line.replace("${pcName()}",pcName()):fallback;}
 
 function selectedPlayerPortrait(){
  if(!S.playerChar)return "";
  return playerPortraitAssets[S.playerChar]||"";
 }
 function talk(name,line,choices){
  S.choices=choices;
  const d=q("#dialogue");
  const lower=name.toLowerCase();
  d.classList.toggle("mira-dialogue",lower==="mira"||lower==="amina");
  d.classList.toggle("iona-dialogue",lower==="iona");
  d.classList.toggle("rosie-dialogue",lower==="rosie");
  d.classList.toggle("player-present",!!S.playerChar);
 
  const playerBg=selectedPlayerPortrait();
  const playerCard=S.playerChar?`
    <aside class="player-dialogue-card" aria-label="Your character">
      <div class="player-dialogue-portrait" style="background-image:url('${playerBg}')"></div>
      <div class="player-dialogue-id">
        <div class="player-dialogue-name">${S.playerName||characterProfiles[S.playerChar]?.name||"YOU"}</div>
        <div class="player-dialogue-pronouns">${S.playerPronouns||characterProfiles[S.playerChar]?.pronouns||""}</div>
      </div>
    </aside>`:"";
 
  d.innerHTML=`<div class="portrait">${name[0]}</div>
    <div class="dialogue-copy">
      <div class="speaker">${name.toUpperCase()}</div>
      <div class="line">${line}</div>
      <div class="player-response-label"><b>${(S.playerName||characterProfiles[S.playerChar]?.name||"YOU").toUpperCase()}</b><span>YOUR RESPONSE</span></div>
      <div class="choices">${choices.map((x,i)=>`<button data-choice="${i}">${x.label}</button>`).join("")}</div>
    </div>
    ${playerCard}`;
  d.classList.remove("hidden");
 }
 q("#dialogue").onclick=e=>{let b=e.target.closest("[data-choice]");if(!b)return;let c=S.choices[+b.dataset.choice];q("#dialogue").classList.add("hidden");c.go()};
 function showIonaUnderpassCutaway(onReturn){
  const story=q("#story"); let beat=0;
  function renderBeat(){
    story.classList.remove("hidden"); story.classList.add("cinematic-story");
    if(beat===0){
      story.innerHTML=`<div class="underpass-cinematic"><div class="underpass-frame">
        <img src="./assets/environments/underpass.png" alt="Westbridge evacuees shelter in heavy rain at the South Transit Underpass while a medic tends to a patient on a stretcher.">
        <div class="underpass-vignette"></div>
        <div class="underpass-location"><span>SOUTH TRANSIT UNDERPASS</span><strong>19 MINUTES OUT</strong></div>
        <div class="underpass-field-lines">
          <div class="field-line"><b>MEDIC</b><span>Iona. Her pressure's dropping.</span></div>
          <div class="field-line radio"><b>FIELD RADIO</b><span>East approach is taking water.</span></div>
        </div>
        <div class="underpass-next-overlay"><button class="primary" data-iona-cutaway-next>OPEN CHANNEL →</button></div>
      </div></div>`;
      return;
    }
    story.innerHTML=`<div class="radio-scene">
      <div class="kicker">FIELD CHANNEL // SOUTH TRANSIT UNDERPASS ↔ HALE LIBRARY</div>
      <div class="radio-portraits">
        <div class="radio-person iona"><div class="radio-portrait"></div><div class="radio-name">IONA <span>FIELD</span></div></div>
        <div class="radio-signal" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
        <div class="radio-person amina"><div class="radio-portrait"></div><div class="radio-name">AMINA <span>HALE LIBRARY</span></div></div>
      </div>
      <div class="radio-transcript">
        <div class="radio-line iona-line"><b>IONA</b><p>Amina. I can give you a few more minutes. After that, I need a route.</p></div>
        <div class="radio-line amina-line"><b>AMINA</b><p>We're working on it.</p></div>
        <div class="radio-line iona-line"><b>IONA</b><p>I know. Just make sure you're answering the question I actually have.</p></div>
      </div>
      <div class="cinematic-action radio-sticky-action"><button class="primary" data-iona-cutaway-return>BACK TO HALE LIBRARY →</button></div>
    </div>`;
  }
  const handleCutawayClick=e=>{
    if(e.target.closest("[data-iona-cutaway-next]")){
      beat=1;
      renderBeat();
      return;
    }
    if(e.target.closest("[data-iona-cutaway-return]")){
      story.removeEventListener("click",handleCutawayClick);
      story.classList.add("hidden");
      story.classList.remove("cinematic-story");
      onReturn();
    }
  };
  story.addEventListener("click",handleCutawayClick);
  renderBeat();
 }
 function miraReadingCoach(nextGo){
  talk("Amina",`Yes, but we have to read it <b>strategically</b>. Westbridge is at the <b>South Transit Underpass</b> now. Forty-three people will be enclosed together for almost half an hour. If the risk signal is real, Iona needs an answer before they go in.`,[
   {label:pcVoice("strategicAsk","So how do I read it strategically?"),go:()=>showIonaUnderpassCutaway(()=>talk("Amina",`That's the decision we're reading for. You start with your question. Don't ask, “What does this whole paper say?” Ask, “What evidence in this paper answers the evacuation question?”`,[
    {label:pcVoice("whereFirst","Where do I look first?"),go:()=>talk("Amina",`Start with the <b>Results</b> for the finding. Then check <b>Methods</b> for how they produced that evidence. Then read the relevant <b>Discussion</b> and limitations to see how far the finding can reasonably take us.`,[
     {label:"Finding → how they know → what it means.",go:()=>talk("Amina",`That's Strategic Reading. Sometimes you'll skim. Sometimes you'll read a paragraph very closely. The point isn't speed anymore. The point is <b>question-driven attention</b>.`,[
      {label:"Open the article.",go:()=>{addFieldTool("strategicRead",true);nextGo()}}
     ])}
    ])}
   ]))}
  ])
 }
 
 function setCampaignLesson(activeNumber){
  for(let i=1;i<=6;i++){
    const el=q("#lesson"+i);
    if(!el)continue;
    el.classList.remove("active","complete");
    if(i<activeNumber){
      el.classList.remove("locked");
      el.classList.add("complete");
    }else if(i===activeNumber){
      el.classList.remove("locked");
      el.classList.add("active");
    }else{
      el.classList.add("locked");
    }
  }
  if(q("#campaignProgress")){
    const pct=Math.max(0,Math.min(100,((activeNumber-1)/5)*100));
    q("#campaignProgress").style.setProperty("--campaign-pct",pct+"%");
  }
 }
 
 function startChapter2FollowingClaims(){
  setCampaignLesson(2);
  q("#comms").classList.remove("locked");
  renderFirstPerson();
  q("#chapter").textContent="CHAPTER 02 · THE OFFICIAL STORY";
  obj("Reach Communications. The Recovery Authority has already blamed Westbridge for the exposure event. Rosie wants to know how they reached that conclusion so fast.");
  next("Go to Communications — Rosie has the document trail","comms");
  pathStep(1,["See the official claim","Rebuild the lifecycle","Compare what changed","Trace the evidence"]);
 }
 let quickReadStage=0;
 function openQuickRead(){
  quickReadStage=0;
  renderQuickRead();
  q("#quickRead").classList.remove("hidden");
  next("Use Quick Reading to triage the three papers and decide which one deserves your attention",null);
 }
 q("#qrBackFixed").onclick=()=>{if(quickReadStage>0){quickReadStage--;renderQuickRead()}};
 q("#qrNextFixed").onclick=()=>{if(quickReadStage<4){quickReadStage++;renderQuickRead()}};
 function quickMap(active){
  const items=[
   ["1","TITLE + ABSTRACT","Is this paper even about your question?"],
   ["2","HEADINGS + ENDING","What problem does it address, and what is its take-away?"],
   ["3","KEY FINDINGS","Does the evidence look relevant enough to justify more time?"],
   ["4","SELECT","Choose which source deserves a deeper read."]
  ];
  return `<div class="qr-map">${items.map((x,i)=>`<div class="qr-card ${i===active?"active":""}"><b>${x[0]} · ${x[1]}</b><p>${x[2]}</p></div>`).join("")}</div>`;
 }
 function renderQuickRead(){
  const body=q("#qrBody");
  q("#qrStep").textContent=`STEP ${quickReadStage+1} / 5`;
  if(q("#qrNavCount"))q("#qrNavCount").textContent=`${quickReadStage+1} of 5`;
  if(q("#qrBackFixed"))q("#qrBackFixed").disabled=quickReadStage===0;
  if(q("#qrNextFixed"))q("#qrNextFixed").disabled=quickReadStage===4;
  if(quickReadStage===0){
   body.innerHTML=`${quickMap(0)}
    <div class="qr-coach">AMINA: “This is <b>triage</b>. You are not trying to understand the paper yet. Start with the title and abstract and ask one question: <b>could this source answer what we need to know?</b>”</div>
    <div class="qr-demo">
     <div class="mini-paper"><div class="hotsec"><b>ABSTRACT</b><br>We reconstructed likely exposure patterns among 126 cases and 304 non-cases...</div><div class="dim">INTRODUCTION...</div><div class="dim">METHODS...</div><div class="dim">RESULTS...</div></div>
     <div><h3 style="margin-top:0">Quick question</h3><p style="color:#b6c0bd">What are you trying to learn from the abstract?</p>
      <div class="qr-choice">
       <button data-qr="right"><strong>Whether the article is relevant</strong>What is it about, what did they study, and what did they broadly find?</button>
       <button data-qr="wrong"><strong>Every methodological detail</strong>I should understand the whole study before moving on.</button>
      </div><div id="qrFB"></div></div>
    </div>`;
  }
  if(quickReadStage===1){
   body.innerHTML=`${quickMap(1)}
    <div class="qr-coach">AMINA: “Next, skim the headings and the ending. You're looking for scope: <b>what problem is this paper actually about?</b> Don't get pulled into detail unless it helps you decide whether this source deserves more time.”</div>
    <div class="qr-demo">
     <div class="mini-paper"><div class="dim">ABSTRACT...</div><div class="hotsec"><b>INTRODUCTION</b><br>Initial guidance emphasized physical contact...</div><div class="dim">METHODS...</div><div class="dim">RESULTS...</div><div class="hotsec"><b>DISCUSSION / CONCLUSION</b><br>The pattern is consistent with...</div></div>
     <div><h3 style="margin-top:0">What this gives you</h3><p style="color:#b6c0bd">A fast sense of the <b>problem</b>, the <b>research question</b>, and the authors' <b>main interpretation</b>.</p>
     <button class="primary" data-qr-next>Continue →</button></div>
    </div>`;
  }
  if(quickReadStage===2){
   body.innerHTML=`${quickMap(2)}
    <div class="qr-coach">AMINA: “Then look at the <b>results and the data themselves</b>. In science, that may mean tables, graphs, or figures. In humanities work, it could be images, texts, documents, or other primary material. Try to notice what <em>you</em> see before letting the authors explain it for you.”</div>
    <div class="qr-demo">
     <div class="mini-paper"><div class="dim">ABSTRACT...</div><div class="dim">INTRO...</div><div class="hotsec"><b>RESULTS TABLE</b><br>Same enclosed room ≥30 min: 71% of cases / 18% of non-cases</div><div class="dim">DISCUSSION...</div></div>
     <div><h3 style="margin-top:0">Why inspect the evidence?</h3><p style="color:#b6c0bd">Because “what the data show” and “what the authors think explains the data” are not the same thing.</p>
     <button class="primary" data-qr-next>Continue →</button></div>
    </div>`;
  }
  if(quickReadStage===3){
   body.innerHTML=`${quickMap(3)}
    <div class="qr-coach">AMINA: “If the paper is relevant after that preview, <b>then</b> you slow down. Read it carefully. Take notes. Summarize difficult sections. Look up unfamiliar terms. Follow useful references. A quick read isn't a replacement for deep reading—it's how you decide where deep reading is worth the time.”</div>
    <div class="qr-choice">
     <button data-deep="right"><strong>Preview first, then deep-read selectively</strong>Use the quick pass to decide which article deserves sustained attention.</button>
     <button data-deep="wrong"><strong>Never read an article from start to finish</strong>Skipping around means deep reading is unnecessary.</button>
    </div><div id="qrFB"></div>`;
  }
  if(quickReadStage===4){
   body.innerHTML=`<div class="qr-coach">AMINA: “One way to remember the preview is the <b>reverse Oreo</b>: some of the easiest big-picture clues are toward the outside—the abstract, opening, and ending. The denser methods and results sit inside. But don't confuse ‘denser’ with ‘unimportant.’ Once a paper matters, that's often where the evidence lives.”</div>
    <div class="qr-demo">
     <div>
       <div class="oreo"><div class="cookie"></div><div class="cream"></div><div class="cookie"></div></div>
       <div class="oreo-labels"><div><b>OUTSIDE / QUICK ORIENTATION</b><br>Abstract, introduction, discussion/conclusion</div><div><b>INSIDE / EVIDENCE DETAIL</b><br>Methods, results, data</div></div>
     </div>
     <div><h3 style="margin-top:0">Field strategy acquired</h3>
       <p style="color:#b6c0bd"><span class="skilltag">ABSTRACT</span> <span class="skilltag">INTRO/ENDING</span> <span class="skilltag">DATA</span> <span class="skilltag">DEEP READ</span></p>
       <p style="color:#b6c0bd">Now use that strategy on three papers Amina pulled from Hale Library. You're not reading them—you are <b>triaging</b> them.</p>
       <button class="primary" id="qrFinish">Choose the life-saving paper →</button>
     </div>
    </div>`;
  }
  q("#quickRead").onclick=e=>{
    if(e.target.closest('[data-qr="right"]')){
      q("#qrFB").innerHTML=`<div style="margin-top:8px;color:#bfe0c8">Exactly. The abstract is your relevance preview.</div><button class="primary" data-qr-next>Continue →</button>`;
    }
    if(e.target.closest('[data-qr="wrong"]')){
      q("#qrFB").innerHTML=`<div style="margin-top:8px;color:#e4c3b7">Not yet. At this stage you're deciding whether the paper deserves more attention.</div>`;
    }
    if(e.target.closest('[data-deep="right"]')){
      q("#qrFB").innerHTML=`<div style="margin-top:8px;color:#bfe0c8">Right. Quick Reading helps you select a source; it doesn't tell you what that source ultimately proves.</div><button class="primary" data-qr-next>Continue →</button>`;
    }
    if(e.target.closest('[data-deep="wrong"]')){
      q("#qrFB").innerHTML=`<div style="margin-top:8px;color:#e4c3b7">No. Once a paper is relevant, careful start-to-finish reading may be exactly what you need.</div>`;
    }
    if(e.target.closest("[data-qr-next]")){
      if(quickReadStage<4)quickReadStage++;
      renderQuickRead();
    }
    if(e.target.closest("#qrFinish")){
      q("#quickRead").classList.add("hidden");
      addFieldTool("quickRead",true);
      openTriage(false);
    }
  };
 }
 const triagePapers=[
  {
   id:"review",
   title:"Neurological Outbreaks in Closed Institutional Settings: A Review",
   meta:"Kessler & Wu · Review Article · 2024",
   samples:{
    Abstract:`<h4>Abstract</h4>
    <p>Closed institutional settings present distinctive outbreak-control challenges because large numbers of people share circulation routes, food services, sanitation systems, sleeping spaces, and common facilities. We reviewed 38 published investigations of acute neurological and febrile outbreaks in dormitories, hospitals, residential schools, correctional facilities, and emergency shelters. Studies varied widely in design, reporting quality, and suspected transmission route.</p>
    <p>Across the literature, crowding, delayed isolation, and incomplete case identification were recurrent features of larger clusters. Some outbreaks were ultimately attributed to airborne or droplet transmission, others to contaminated food or water, and several remained etiologically unresolved. Because the underlying agents differed substantially, the review does not identify a single transmission pattern that can be generalized to all closed settings.</p>
    <p>The findings are most useful for anticipating logistical problems in outbreak response and for identifying common weaknesses in institutional control strategies.</p>`,
    Introduction:`<h4>Introduction</h4>
    <p>Universities, shelters, hospitals, and other residential institutions combine high population density with repeated close contact. During an emerging outbreak, these conditions can produce rapid transmission before investigators understand the causative agent. Early response decisions therefore often rely on analogy to previous outbreaks.</p>
    <p>That analogy can be useful, but it can also be misleading. Similar symptom clusters may arise from very different pathogens, and a control measure appropriate for one mechanism may be ineffective for another. For example, an outbreak associated with shared dining may initially resemble one spread by interpersonal contact until epidemiological links are reconstructed.</p>
    <p>This review asks what prior institutional outbreak investigations reveal about common response challenges, with particular attention to crowding, case detection, isolation practices, and uncertainty about transmission routes.</p>`,
    Methods:`<h4>Methods</h4>
    <p>We searched MEDLINE, Scopus, Web of Science, Global Health, and PsycINFO for English-language outbreak reports published between 1995 and 2024. Search terms combined neurological or febrile syndromes with institutional settings including dormitory, hospital, shelter, residential school, correctional facility, and campus.</p>
    <p>Eligible studies described at least ten linked cases and included enough contextual detail to characterize the setting, suspected exposure pathway, and major control measures. Two reviewers independently screened abstracts and full texts. Disagreements were resolved through discussion.</p>
    <p>Studies were grouped by setting, suspected transmission route, and control strategy. <mark>No new North Campus data were collected, and no study in the review concerns the current NVC-11 outbreak.</mark></p>`,
    Results:`<h4>Results / Synthesis</h4>
    <p>Thirty-eight reports met inclusion criteria. Thirteen involved residential schools or university housing, nine hospitals, seven emergency shelters, five correctional facilities, and four other institutional environments. The size of reported outbreaks ranged from 11 to more than 700 cases.</p>
    <p>Crowding and delayed recognition were common across large clusters, but the dominant transmission routes differed. Twelve outbreaks were ultimately classified as airborne or droplet-associated, nine involved contaminated food or water, seven were linked primarily to direct contact, and ten remained uncertain or mixed.</p>
    <p>Institutions that implemented earlier isolation, reduced density, or improved ventilation sometimes reported shorter outbreak duration, but intervention effects were difficult to separate from concurrent changes in testing and case detection.</p>`,
    Discussion:`<h4>Discussion</h4>
    <p>This review shows that closed settings repeatedly amplify outbreak-management problems, especially when the transmission mechanism is still uncertain. Historical evidence can therefore help planners anticipate operational vulnerabilities.</p>
    <p>However, prior outbreaks should not be treated as direct evidence about a newly emerging agent. Similar institutional patterns can arise through different mechanisms, and strategies supported in one outbreak may not transfer cleanly to another. Historical comparisons are most useful as context, not as a substitute for investigation of the current cluster.</p>`
   }
  },
  {
   id:"vale",
   title:"Enclosed Co-Presence and Illness Patterns Across Early Network Clusters",
   meta:"Okafor, Running Bear, Chen & Park · Empirical Study · Day 8",
   samples:{
    Abstract:`<h4>Abstract</h4>
    <p>Following a rapidly expanding cluster of acute neurological illness on North Campus, we reconstructed likely exposure patterns among 126 confirmed or probable cases and 304 comparison individuals. The analysis considered documented physical contact, prolonged co-presence in enclosed rooms, broad building-level overlap, and outdoor-only contact.</p>
    <p>Cases were substantially more likely than non-cases to have spent at least 30 minutes in the same enclosed room as a symptomatic or presymptomatic case. Physical contact without prolonged room overlap was less strongly associated with illness. Building-level overlap without room-level co-presence showed little difference between cases and non-cases.</p>
    <p>The observed pattern is consistent with short-range airborne or aerosol transmission, although the study cannot distinguish aerosol exposure from unrecorded close contact. These findings support interim efforts to reduce prolonged indoor co-presence while additional environmental evidence is collected.</p>`,
    Introduction:`<h4>Introduction</h4>
    <p>Emergency guidance issued during the first 48 hours of the North Campus outbreak emphasized hand hygiene, surface disinfection, and avoidance of direct physical contact. These recommendations reflected uncertainty about the causative agent and the possibility that transmission occurred through touch or contaminated objects.</p>
    <p>Several early cases, however, had no documented physical contact with a known case. Investigators also noted clustering among students who shared classrooms, rehearsal spaces, study rooms, and small residence-hall lounges. These observations raised the possibility that shared indoor space, rather than touch alone, might better explain transmission.</p>
    <p>We therefore compared several exposure patterns among cases and non-cases: documented physical contact, prolonged co-presence in the same enclosed room, presence in the same building without known room overlap, and outdoor-only contact. The analysis was designed to clarify which exposure pattern most strongly tracked with illness in the current cluster.</p>`,
    Methods:`<h4>Methods</h4>
    <p>We identified 126 confirmed or probable cases and 304 comparison individuals who were present on North Campus during the 72 hours preceding symptom onset in the index cluster. Case status was determined using the emergency clinical definition in effect on Day 7.</p>
    <p>Exposure histories were reconstructed from access-card records, course and room schedules, structured interviews, text-message timestamps when voluntarily provided, and Bluetooth proximity records where available. “Prolonged indoor co-presence” was defined as at least 30 minutes in the same enclosed room. “Physical contact” included documented touch, shared objects, or direct exchange of personal items.</p>
    <p>Models adjusted for residence hall, academic program, and time spent on campus. <mark>Airborne particles, ventilation rates, and pathogen concentration were not directly measured.</mark> Investigators therefore treated the analysis as evidence about exposure patterns rather than direct observation of a biological transmission mechanism.</p>`,
    Results:`<h4>Results</h4>
    <p>Seventy-one percent of cases had documented prolonged indoor co-presence with a symptomatic or presymptomatic case, compared with 18% of comparison individuals. By contrast, 19% of cases and 16% of non-cases had documented physical contact without prolonged room overlap.</p>
    <p>Twenty-one percent of cases and 19% of non-cases had been present in the same building as a known case without sharing a room, while outdoor-only contact was documented for 3% of cases and 4% of non-cases.</p>
    <p>After adjustment for residence hall, academic program, and time spent on campus, prolonged indoor co-presence remained the strongest exposure signal. Physical contact did not show a comparable independent association once shared indoor time was included in the model.</p>
    <p><mark>The most consistent difference between cases and non-cases was therefore extended time in the same enclosed room.</mark></p>`,
    Discussion:`<h4>Discussion</h4>
    <p>The North Campus cluster is more consistent with a transmission process associated with prolonged shared indoor space than with direct physical contact alone. This pattern would be compatible with short-range airborne or aerosol transmission.</p>
    <p>That interpretation should remain cautious. Exposure reconstruction is incomplete, and investigators did not directly measure airborne particles or pathogen concentration. Unrecorded close contact could also contribute to the observed pattern.</p>
    <p>Even with those limitations, the findings have immediate practical implications. Until more direct evidence is available, reducing prolonged indoor co-presence is a reasonable precaution because it targets the exposure pattern most strongly associated with illness in this cluster.</p>`
   }
  },
  {
   id:"network",
   title:"Reconstructing Exposure Networks from Access Logs and Proximity Records",
   meta:"Arden et al. · Methods Paper · 2023",
   samples:{
    Abstract:`<h4>Abstract</h4>
    <p>Direct observation of person-to-person contact is rarely feasible during fast-moving outbreaks. We developed and validated a procedure for reconstructing probable exposure networks using combinations of building access records, room schedules, Wi-Fi association logs, and Bluetooth proximity data.</p>
    <p>The method estimates overlapping presence within user-defined spatial and temporal windows and produces a weighted network representing likely contact opportunities. Validation against a benchmark dataset of known interactions showed improved reconstruction when multiple data streams were combined.</p>
    <p>The approach is intended as a methodological tool for outbreak investigators and does not itself identify the transmission route of any specific pathogen.</p>`,
    Introduction:`<h4>Introduction</h4>
    <p>Network reconstruction has become increasingly important in outbreak epidemiology because traditional interviews often miss brief or forgotten contacts. Universities and other institutional settings generate large amounts of administrative data that can help reconstruct co-presence retrospectively.</p>
    <p>Existing approaches commonly rely on a single data source, such as access-card swipes or Bluetooth records. Each source has limitations: access cards indicate entry but not duration, while Bluetooth records may be incomplete or unavailable for many individuals.</p>
    <p>This study develops a combined reconstruction procedure that integrates multiple data streams and allows investigators to specify spatial and temporal thresholds appropriate to a given setting.</p>`,
    Methods:`<h4>Methods</h4>
    <p>The reconstruction algorithm first identifies candidate overlaps between individuals based on room access and scheduled occupancy. It then refines those overlaps using device-level proximity records where available. Each potential link receives a confidence score based on the number and agreement of supporting data sources.</p>
    <p>Investigators can define thresholds for minimum overlap duration, maximum spatial distance, and acceptable uncertainty. Sensitivity analyses allow users to examine how changes in those thresholds alter the resulting network.</p>
    <p>The procedure was validated using a benchmark dataset in which actual close-contact events had been independently recorded by trained observers.</p>`,
    Results:`<h4>Validation Results</h4>
    <p>Using access-card records alone, the algorithm recovered 68% of known contacts. Adding room schedules increased recovery to 77%. The combined model using access-card, schedule, and Bluetooth data recovered 86% of known contacts while reducing false positive links relative to access-card data alone.</p>
    <p>Performance declined when Bluetooth coverage fell below 40% of participants. Short interactions of less than ten minutes were more likely to be missed than longer encounters.</p>
    <p>The method performed best for reconstructing repeated or prolonged co-presence and less well for brief incidental contact.</p>`,
    Discussion:`<h4>Discussion</h4>
    <p>Administrative and device records can provide a useful approximation of exposure networks when direct observation is impossible. Combining multiple data streams improves reconstruction accuracy and gives investigators a more transparent way to express uncertainty.</p>
    <p>The method is not designed to determine whether a pathogen spreads through air, touch, surfaces, or another mechanism. Its purpose is to reconstruct who was likely near whom, where, and for how long so that those patterns can be analyzed in a specific outbreak investigation.</p>`
   }
  }
 ];
 let triageState={inspected:new Set(),selected:null,tabs:{review:"Abstract",vale:"Abstract",network:"Abstract"}};
 function renderTriage(){
  const secOrder=["Abstract","Introduction","Methods","Results","Discussion"];
  q("#triageCards").innerHTML=triagePapers.map((p,idx)=>{
    const opened=triageState.inspected.has(p.id);
    const tab=triageState.tabs[p.id]||"Abstract";
    return `<article class="paper-card ${triageState.selected===p.id?"selected":""}">
     <div class="paper-card-header">
       <div><div class="type">PAPER ${idx+1} · ${p.meta}</div><h3>${p.title}</h3></div>
       <span class="selected-badge">CURRENT CHOICE</span>
     </div>
     <div class="triage-readcue"><b>Amina's quick-read routine:</b> Start with the Abstract. Then skim the Introduction and Discussion. If the paper still looks relevant, inspect Results and Methods. Some details will not answer our question—that is the point. Keep reading with the evacuation problem in mind.</div>
     <button data-inspect="${p.id}">${opened?"Collapse paper":"Open quick-read samples"}</button>
     ${opened?`<div class="paper-preview">
       <div class="preview-tabs">${secOrder.map(sec=>`<button data-tab="${p.id}:${sec}" class="${tab===sec?"active":""}">${sec}</button>`).join("")}</div>
       <div class="preview-pane">${p.samples[tab]}</div>
     </div>`:""}
     <div class="select-row">
       <div class="role-note">${opened?"Quick-read the sections above, then decide whether this paper answers the evacuation question.":"Open the samples before deciding."}</div>
       <button data-select="${p.id}">${triageState.selected===p.id?"Selected ✓":"Select this paper"}</button>
     </div>
    </article>`;
  }).join("");
  q("#triageFeedback").innerHTML=`<div class="triage-summary">
    <div class="sum"><b>1 · TRIAGE</b><span>${triageState.inspected.size}/3 papers opened</span></div>
    <div class="sum"><b>2 · COMPARE SCOPE</b><span>Which paper can answer our question?</span></div>
    <div class="sum"><b>3 · SELECT SOURCE</b><span>${triageState.selected?`Paper ${triagePapers.findIndex(p=>p.id===triageState.selected)+1} selected`:"No paper selected yet"}</span></div>
  </div><b>AMINA:</b> “We need the paper that directly studies the North Campus outbreak and the risk of prolonged indoor exposure.”`;
 }
 function openTriage(reset=true){
  if(reset)triageState={inspected:new Set(),selected:null,tabs:{review:"Abstract",vale:"Abstract",network:"Abstract"}};
  renderTriage();
  q("#beamTriage").classList.remove("hidden");
  next("Triage all three papers, then choose the source most likely to answer the mission question",null);
 }
 q("#backToQuickRead").onclick=()=>{
  q("#beamTriage").classList.add("hidden");
  quickReadStage=4;
  renderQuickRead();
  q("#quickRead").classList.remove("hidden");
  next("Review Amina's rapid-reading lesson or return to paper triage",null);
 };
 q("#beamTriage").onclick=e=>{
  const inspect=e.target.closest("[data-inspect]");
  if(inspect){
    const id=inspect.dataset.inspect;
    triageState.inspected.has(id)?triageState.inspected.delete(id):triageState.inspected.add(id);
    renderTriage(); return;
  }
  const tab=e.target.closest("[data-tab]");
  if(tab){
    const [id,sec]=tab.dataset.tab.split(":");
    triageState.tabs[id]=sec;
    triageState.inspected.add(id);
    renderTriage(); return;
  }
  const selectBtn=e.target.closest("[data-select]");
  if(selectBtn){
    e.preventDefault();
    e.stopPropagation();
    triageState.selected=selectBtn.getAttribute("data-select");
    renderTriage();
    const chosen=triagePapers.find(p=>p.id===triageState.selected);
    q("#triageFeedback").innerHTML=`<b>SELECTED:</b> <em>${chosen.title}</em><br><span style="color:#aeb9b5">If this is your choice, click <b>Choose the life-saving paper →</b> below. You can change your selection first if you want.</span>`;
    return;
  }
 };
 q("#continueChoosePaper").onclick=()=>{
  if(!triageState.selected){
    q("#triageFeedback").innerHTML=`<b>AMINA:</b> “Choose one first. Click the gold <em>Select this paper</em> button on the paper you think can answer the evacuation question.”`;
    return;
  }
  if(triageState.selected!=="vale"){
    q("#triageFeedback").innerHTML=`<b>AMINA:</b> “That one could help, but it doesn't most directly address prolonged enclosed co-presence, the specific risk Iona needs evaluated. Quick-read the other papers and try again.”`;
    return;
  }
  q("#beamTriage").classList.add("hidden");
  addIntel("Paper triage","The Okafor–Running Bear exposure-pattern study is the most relevant paper for Iona's underpass question.");
  talk("Amina",`That's it. Okafor and Running Bear's exposure paper. Open—`,[
    {label:"Wait. What's that alarm?",go:()=>talk("Amina",`That's the Annex containment alarm!`,[
      {label:"Is that bad?",go:()=>talk("Amina",`In a building studying the thing we're trying not to catch? Yes. Grab the paper. <b>Move. Now.</b>`,[
        {label:"MOVE — GET OUT OF THE ANNEX",go:beginAnnexEscape}
      ])}
    ])}
  ]);
 };
 
 /* === RESEARCH ANNEX CONTAINMENT ESCAPE === */
 function clearAnnexEscapeUI(){
  const nav=q("#firstPersonNav");
  if(nav)nav.classList.remove("escape-mode");
  q("#escapeAnnexBtn")?.remove();
  q("#world")?.classList.remove("annex-alert");
 }
 function renderAnnexEscape(){
  if(!S.annexEscapeActive)return;
  const world=q("#world"),nav=q("#firstPersonNav"),dest=q("#fpDestinations");
  if(!world||!nav||!dest)return;
  world.classList.add("annex-alert");
  nav.classList.add("escape-mode");
  if(q("#fpLocation"))q("#fpLocation").textContent="Research Annex";
  if(q("#fpHint"))q("#fpHint").textContent="CONTAINMENT ALARM — leave the building now.";
  let exit=q("#escapeAnnexBtn");
  if(!exit){
    exit=document.createElement("button");
    exit.id="escapeAnnexBtn";
    exit.type="button";
    exit.innerHTML=`<b>RUN — EXIT THE ANNEX</b><span>Get outside →</span>`;
    dest.appendChild(exit);
  }
  exit.onclick=escapeValeAnnex;
 }
 function beginAnnexEscape(){
  S.annexEscapeActive=true;
  S.annexEscaped=false;
  S.fpNode="annex";
  clearAnnexEscapeUI();
  renderFirstPerson();
  renderAnnexEscape();
  obj("GET OUT OF THE RESEARCH ANNEX. A containment alarm is active.");
  next("Run out of Research Annex",null);
  if(q("#nextLabel"))q("#nextLabel").textContent="RUN — EXIT THE ANNEX";
  if(typeof scheduleAutosave==="function")scheduleAutosave();
 }
 function escapeValeAnnex(){
  if(!S.annexEscapeActive)return;
  const world=q("#world");
  world?.classList.add("fp-travelling");
  setTimeout(()=>{
    S.fpNode="courtyard";
    S.annexEscapeActive=false;
    S.annexEscaped=true;
    clearAnnexEscapeUI();
    renderFirstPerson();
    world?.classList.remove("fp-travelling");
 
    addIntel("Recovered paper","Okafor and Running Bear's exposure study was recovered before the Annex was evacuated.");
    addBackpackSource("vale",true);
    obj("Regroup with Amina. Then extract the evidence the evacuation team needs.");
    next("Read Okafor's recovered paper with Amina",null);
    if(typeof scheduleAutosave==="function")scheduleAutosave();
 
    talk("Amina",`Okay. Stop here. We're clear of the Annex. For the moment.`,[
     {label:"Tell me we didn't just run through a contaminated building for a PDF.",go:()=>talk("Amina",`We ran through a <em>probably</em> contaminated building for a PDF.`,[
      {label:"Much better.",go:()=>talk("Amina",`You picked the right paper. That's what matters. We have it. Now we need to get the right information out of it before the evacuation team commits to the South Transit Underpass.`,[
       {label:"Then let's read it.",go:()=>miraReadingCoach(()=>openPaper("vale","Abstract"))}
      ])}
     ])}
    ]);
  },260);
 }
 
 function readerMission(){
  let p=S.paper;
  qa(".sec").forEach(x=>x.classList.remove("recommended"));
  let title,text,target,button;
 
  if(p==="chen"){
    title=S.stage>=3?"You have enough evidence to make a recommendation":"IONA'S QUESTION";
    text=S.stage>=3
      ? "You've read enough to make the call. Close the study when you're ready and recommend what the shelter should do."
      : `<b>Does this evidence justify treating recent close contacts as potentially infectious before symptoms appear?</b><br><br>No section is highlighted. Use the Article Map and Strategic Reading tools if you need them, but decide for yourself where the evidence lives.`;
    target=null;
    button=S.stage>=3?"NEXT: Close study & advise Iona →":"";
  }
  else if(p==="rios" && S.stage===0){
    title="1 · Identify what kind of article you're reading";
    text="Start with Methods. Is this article reporting a new experiment, or gathering evidence produced by other studies?";
    target="Methods";button="NEXT: Open Methods →";
  }
  else if(S.stage===0){
    title="1 · Find the strongest exposure pattern";
    text="Start with Results. Find the observation that matters to the outbreak question.";
    target="Results";button="NEXT: Open Results →";
  }
  else if(S.stage===1){
    if(p==="rios"){
      title="2 · Inventory the evidence underneath the claim";
      text="Now open Results. What kinds of studies does the review actually find? Look for the gap between laboratory evidence and patient outcomes.";
      target="Results";button="NEXT: Open Results →";
    }else{
      title="2 · Ask what the evidence can actually prove";
      text="Now inspect Methods. How was the evidence produced, and what wasn't directly measured?";
      target="Methods";button="NEXT: Open Methods →";
    }
  }
  else if(S.stage===2){
    title="3 · Compare with the authors' interpretation";
    text="Read Discussion. Separate the observed finding from the explanation the authors think is plausible.";
    target="Discussion";button="NEXT: Open Discussion →";
  }
  else{
    title="You have enough evidence to act";
    text="Close the article. The story will ask you to use what you learned.";
    target=null;button="NEXT: Close paper & continue story →";
  }
 
  if(target){let b=q(`[data-sec="${target}"]`);if(b)b.classList.add("recommended")}
  q("#mission").innerHTML=`<b>${p==="chen"?"INDEPENDENT READING":"YOUR READING MISSION"}</b><h4>${title}</h4><p>${text}</p>${button?`<button data-jump="${target||"close"}">${button}</button>`:""}`;
 }
 function openPaper(id,section="Abstract"){addBackpackSource(id,false);
  S.paper=id;S.stage=0;let p=papers[id];q("#rq").textContent=p.question;
  if(id==="chen")S.chenReading={results:false,methods:false,discussion:false};
  q("#working").textContent=id==="chen"?"Iona is waiting for your recommendation.":"Strategic Reading: no evidence extracted yet."; 
  q("#sections").innerHTML=Object.keys(p.sections).map(s=>`<button class="sec" data-sec="${s}">${s}<small>${purposes[s]}</small></button>`).join("");
  q("#reader").classList.remove("hidden");showSection(section);readerMission();
  next(id==="chen"?"Decide what Running Bear's evidence justifies":"Use Strategic Reading to extract the evidence that answers the mission question",null);pathStep(3)
 }
 function showSection(s){S.currentSection=s;
  let p=papers[S.paper];
 
  if(S.paper!=="chen"){
    qa(".sec").forEach(x=>x.classList.toggle("recommended",x.dataset.sec===s && ((S.paper==="rios"&&S.stage===0&&s==="Methods")||(S.paper==="rios"&&S.stage===1&&s==="Results")||(S.paper!=="rios"&&S.stage===0&&s==="Results")||(S.paper!=="rios"&&S.stage===1&&s==="Methods")||(S.stage===2&&s==="Discussion"))));
  }else{
    qa(".sec").forEach(x=>x.classList.remove("recommended"));
  }
 
  q("#paper").innerHTML=`<div class="title">${p.title}</div><div class="authors">${p.authors}</div><div class="paper">${p.sections[s]}</div>`;
 
  if(S.paper==="rios"){
    if(s==="Methods"&&S.stage===0){S.stage=1;q("#working").textContent="This is a review: it synthesizes other studies rather than testing VX-17 in new patients.";readerMission()}
    else if(s==="Results"&&S.stage===1){S.stage=2;q("#working").textContent="Evidence chain: cell culture + animal study + uncontrolled case series; no controlled patient trial.";readerMission()}
    else if(s==="Discussion"&&S.stage===2){S.stage=3;readerMission()}
  }
  else if(S.paper==="chen"){
    if(!S.chenReading)S.chenReading={results:false,methods:false,discussion:false};
    if(s==="Results")S.chenReading.results=true;
    if(s==="Methods")S.chenReading.methods=true;
    if(s==="Discussion")S.chenReading.discussion=true;
 
    S.stage=(S.chenReading.results?1:0)+(S.chenReading.methods?1:0)+(S.chenReading.discussion?1:0);
 
    q("#working").textContent=S.stage>=3
      ? "You have enough evidence to advise Iona."
      : "Keep Iona's question in view.";
    readerMission();
  }
  else{
    if(s==="Results"&&S.stage===0){S.stage=1;q("#working").textContent="Indoor co-presence has the strongest observed association.";readerMission()}
    else if(s==="Methods"&&S.stage===1){S.stage=2;q("#working").textContent="The pattern is reconstructed evidence, not direct observation of the mechanism.";readerMission()}
    else if(s==="Discussion"&&S.stage===2){S.stage=3;readerMission()}
  }
 }
 q("#sections").onclick=e=>{let b=e.target.closest("[data-sec]");if(b)showSection(b.dataset.sec)};
 q("#mission").onclick=e=>{let b=e.target.closest("[data-jump]");if(!b)return;b.dataset.jump==="close"?finishPaper():showSection(b.dataset.jump)};
 q("#closeReader").onclick=finishPaper;
 function finishPaper(){
  if(S.stage<3){
    if(S.paper==="chen"){
      q("#working").textContent="You don't have enough yet to make a defensible recommendation. Keep reading with Iona's question in view.";
      readerMission();
      return;
    }
    let target=S.stage===0?"Results":S.stage===1?"Methods":"Discussion";showSection(target);return;
  }
  q("#reader").classList.add("hidden");
  if(S.paper==="vale")interpretOkafor();else if(S.paper==="chen")interpretChen();else interpretRios();
 }
 function interpretOkafor(){
  talk("Amina","Before I tell the checkpoint to move hundreds of people, I need you to say this carefully. What does Okafor's study actually support?",[
   {label:"Prolonged indoor exposure appears risky; the exact mechanism is uncertain.",go:()=>talk("Amina",`Yes. Pattern first, mechanism second.`,[
    {label:pcVoice("finalTease","You thought I was going to say airborne, didn't you?"),go:()=>talk("Amina",`I was preparing the speech.`,[
     {label:pcVoice("finalLearn","I'm learning."),go:()=>talk("Amina",`You are. We reroute based on the risk the study actually identifies—not the mechanism we wish it had proved.`,[
      {label:"Then let's move them.",go:()=>{addIntel("Exposure","Prolonged indoor co-presence is strongly associated with illness; mechanism unresolved.");model("Indoor co-presence = elevated risk. Mechanism unresolved.");story("vale")}}
     ])}
    ])}
   ])},
   {label:"It proves the agent is airborne.",go:()=>talk("Amina",`Too strong. Okafor reconstructed proximity. The study didn't directly measure airborne particles. Try again.`,[
    {label:"Reconsider the evidence.",go:interpretOkafor}
   ])},
   {label:"Any indoor contact is unsafe, no matter how brief.",go:()=>talk("Amina",`That's broader than the evidence. the study found the strongest pattern with <b>prolonged indoor co-presence</b>, not every moment of indoor contact. Try again.`,[
    {label:"Reconsider the evidence.",go:interpretOkafor}
   ])},
   {label:"The safest route is whichever keeps people outdoors.",go:()=>talk("Amina",`That jumps from a study finding to a route recommendation too quickly. First tell me what the study's evidence supports. Then we can apply it to the evacuation routes.`,[
    {label:"Reconsider the evidence.",go:interpretOkafor}
   ])},
   {label:"We can't conclude anything until we know the exact transmission mechanism.",go:()=>talk("Amina",`Uncertainty about mechanism doesn't erase the pattern the study found. We can act on a well-supported risk signal without pretending we know more than we do. Try again.`,[
    {label:"Reconsider the evidence.",go:interpretOkafor}
   ])}
  ])
 }
 function story(kind){
  if(kind==="vale"){q("#story").innerHTML=`<div class="kicker">OUTBREAK MODEL UPDATED</div><h2>The evidence changes the underpass decision.</h2><div class="update"><b>SUPPORTED</b><p>Prolonged indoor co-presence is a major risk signal.</p><b>UNCERTAIN</b><p>The exact mechanism.</p></div><div class="question">Iona is approaching the South Transit Underpass with 43 Westbridge evacuees. Which route best responds to the risk the evidence actually identifies?</div><button class="primary" data-story="route">CONTINUE: choose evacuation route →</button>`}
  else{q("#story").innerHTML=`<div class="kicker">22:03 · RADIO TRAFFIC</div><h2>Then Iona calls.</h2><p style="font:1rem/1.55 Georgia">“Someone at the shelter just became symptomatic. Their only known contact with a case happened <em>before</em> that person showed symptoms.”</p><div class="question"><b>NEW RESEARCH QUESTION</b><br>Can people transmit the outbreak before symptoms appear?</div><button class="primary" data-story="library">CONTINUE: find the next paper →</button>`}
  q("#story").classList.remove("hidden")
 }
 q("#story").onclick=e=>{let b=e.target.closest("[data-story]");if(!b)return;q("#story").classList.add("hidden");if(b.dataset.story==="route")routeDecision();else{q("#library").classList.remove("locked");renderFirstPerson();q("#chapter").textContent="CHAPTER 01 · TWENTY MINUTES OUT";obj("Reach Hale Library. Iona has Dr. Jo Running Bear's symptom-timing study.");next("Go to Hale Library","library");pathStep(2,["Meet Iona","Read Running Bear’s study","Read for evidence","Update quarantine"])}};
 function routeDecision(){q("#decision").innerHTML=`<h2 style="font:1.5rem Georgia;margin-top:0">Choose Iona's route</h2><p>Use the study's evidence. You are deciding whether forty-three people should enter the South Transit Underpass—not declaring a transmission theory.</p><div class="routes"><div class="route"><b>EAST SERVICE ROAD</b><p>Longer and more exposed to weather, but avoids prolonged enclosed co-presence.</p><button class="primary" data-route="roof">Recommend east service road</button></div><div class="route"><b>SOUTH TRANSIT UNDERPASS</b><p>Fastest route to the campus clinic, but keeps the group enclosed together for 20–30 minutes.</p><button class="primary" data-route="tunnel">Recommend underpass</button></div></div>`;q("#decision").classList.remove("hidden")}
 q("#decision").onclick=e=>{
  const reconsider=e.target.closest("[data-route-reconsider]");
  if(reconsider){
    routeDecision();
    return;
  }

  const b=e.target.closest("[data-route]");
  if(!b)return;

  if(b.dataset.route==="tunnel"){
    S.routeDone=false;
    q("#decision").innerHTML=`
      <div class="route-reconsider">
        <div class="kicker">FIELD CHECK // HOLDING POSITION</div>
        <h2 style="font:1.5rem Georgia;margin:.35rem 0 .65rem">Reconsider the route.</h2>
        <p>The underpass is faster, but the study's strongest supported risk is <b>prolonged indoor co-presence</b>. Sending all forty-three evacuees into an enclosed space for 20–30 minutes would increase the very exposure pattern the evidence tells you to minimize.</p>
        <div class="question"><b>AMINA</b><br>“Don't turn urgency into a reason to ignore the evidence. Which route best responds to the risk we can actually support?”</div>
        <button class="primary" type="button" data-route-reconsider>RECONSIDER ROUTE →</button>
      </div>`;
    return;
  }

  q("#decision").classList.add("hidden");
  S.routeDone=true;
  addIntel("Evacuation decision","East service road chosen to minimize the strongest supported exposure risk.");
  story("afterRoute");
};
 function interpretChen(){
  talk("Iona",`All right. Shelter command wants an answer. What do you recommend?`,[
   {label:"Treat recent close contacts as potentially infectious before symptoms, but keep the exact timing uncertain.",go:()=>talk("Iona",`That's the recommendation I can defend. Running Bear's reconstruction supports presymptomatic risk without giving us a universal clock.`,[
    {label:"So we change the protocol without pretending we know the exact onset.",go:()=>talk("Iona",`Exactly. That's what acting under uncertainty is supposed to look like.`,[
     {label:"Send it.",go:()=>{addIntel("Shelter protocol","Recent close contacts are treated as potentially infectious before symptoms; exact onset of infectiousness remains uncertain.");model("Indoor co-presence risky · presymptomatic transmission plausible.");chenEnding()}}
    ])}
   ])},
   {label:"Keep symptom screening unchanged. Running Bear didn't directly observe transmission.",go:()=>talk("Iona",`That's too skeptical. Indirect evidence can still be strong enough to change a safety protocol. The reconstruction repeatedly places probable transmission before symptoms.`,[
    {label:"Then I need to weigh the evidence, not demand certainty.",go:interpretChen}
   ])},
   {label:"Assume everyone becomes infectious exactly 48 hours before symptoms and isolate on that schedule.",go:()=>talk("Iona",`That's too certain. Dr. Running Bear found probable windows in that period; they didn't identify a universal start time.`,[
    {label:"I turned a range into a rule.",go:interpretChen}
   ])},
   {label:"Stop symptom screening entirely because symptoms aren't useful.",go:()=>talk("Iona",`Too broad. The study shows symptoms aren't a safe <em>starting point</em> for isolation. It doesn't show symptoms are useless information.`,[
    {label:"Right. Change the protocol without discarding the signal.",go:interpretChen}
   ])}
  ])
 }
 function chenEnding(){
  const storyEl=q("#story");
  storyEl.innerHTML=`
    <div class="story-beat">
      <div class="kicker">22:11 · HALE LIBRARY</div>
      <h2>For thirty seconds, the radios go quiet.</h2>
      <p>Iona sends the revised intake guidance. Westbridge's forty-three evacuees are inside the campus hub. Two decisions have changed tonight because somebody stopped long enough to ask what the evidence could actually support.</p>
      <div class="story-status-line"><span>SOUTH TRANSIT UNDERPASS</span><b>AVOIDED</b></div>
      <div class="story-status-line"><span>SHELTER INTAKE RULE</span><b>UPDATED</b></div>
      <button class="primary" data-story-beat="radio">LISTEN TO COMMUNICATIONS →</button>
    </div>`;
  storyEl.classList.remove("hidden");

  const handleEndingClick=e=>{
    const btn=e.target.closest("[data-story-beat],[data-recovery-next],[data-recovery-go]");
    if(!btn)return;

    if(btn.dataset.storyBeat==="radio"){
      storyEl.classList.add("cinematic-story","recovery-cinematic-story");
      storyEl.innerHTML=`<div class="recovery-broadcast-scene">
        <div class="recovery-broadcast-frame">
          <img src="./assets/environments/recovery-bulletin.png" alt="Recovery Authority bulletin blaming the Westbridge exposure event on failure to follow containment protocols.">
          <button class="primary broadcast-next" type="button" data-recovery-next="iona">CONTINUE →</button>
        </div>
      </div>`;
      return;
    }

    if(btn.dataset.recoveryNext==="iona"){
      storyEl.innerHTML=`<div class="recovery-reaction">
        <div class="kicker">FIELD CHANNEL // WESTBRIDGE</div>
        <div class="reaction-portrait iona-reaction">
          <div class="reaction-image" role="img" aria-label="Iona"></div>
          <div class="reaction-copy"><b>IONA</b><p>“They've had the report for less than an hour.”</p></div>
        </div>
        <button class="primary recovery-reaction-next" type="button" data-recovery-next="rosie">KEEP LISTENING →</button>
      </div>`;
      return;
    }

    if(btn.dataset.recoveryNext==="rosie"){
      storyEl.innerHTML=`<div class="recovery-reaction">
        <div class="kicker">HALE LIBRARY // INCOMING: ROSIE</div>
        <div class="reaction-portrait rosie-reaction">
          <div class="reaction-image" role="img" aria-label="Rosie"></div>
          <div class="reaction-copy">
            <b>ROSIE</b>
            <p>“Amina? Send ${pcName()} to Communications.”</p>
            <p>“I have Westbridge's first call, Iona's field report, the regional analysis, and this bulletin.”</p>
            <p class="reaction-emphasis">“They do not say the same thing.”</p>
          </div>
        </div>
        <button class="primary recovery-reaction-next" type="button" data-recovery-go>GO TO COMMUNICATIONS →</button>
      </div>`;
      return;
    }

    if(btn.hasAttribute("data-recovery-go")){
      storyEl.removeEventListener("click",handleEndingClick);
      storyEl.classList.remove("cinematic-story","recovery-cinematic-story");
      storyEl.classList.add("hidden");
      startChapter2FollowingClaims();
    }
  };

  storyEl.onclick=null;
  storyEl.addEventListener("click",handleEndingClick);
 }
 function interpretRios(){
  talk("Rosie",`Put the paper next to the three versions we saved. Which sentence is closest to what the evidence can actually carry?`,[
   {label:"VX-17 is a plausible candidate that needs controlled clinical testing.",go:()=>talk("Rosie",`Yes. That's careful enough to survive the trip back to the evidence.`,[
    {label:"So 'proven effective' was added later.",go:()=>talk("Rosie",`Right. But I don't just want to know that it changed. I want to find <b>where</b> the confidence entered the chain. The review cites a five-patient case series. That's our next link.`,[
     {label:"Follow the citation.",go:()=>{addIntel("Treatment claim drift","Research review: warrants clinical evaluation → bulletin: promising effectiveness → shelter radio: proven effective.");model("VX-17 = plausible candidate, clinical benefit unestablished.");treatmentDecision()}}
    ])}
   ])},
   {label:"VX-17 is proven effective because several kinds of evidence point the same way.",go:()=>talk("Rosie",`Several kinds of preliminary evidence can make a treatment worth testing. They don't become a controlled patient trial when you stack them together.`,[
    {label:"So the evidence supports testing, not proof.",go:interpretRios}
   ])},
   {label:"We should ignore the claim because the paper is only a review.",go:()=>talk("Rosie",`No. A review can be extremely useful. The problem isn't the article type; it's what the claim asks that evidence to support.`,[
    {label:"Right. Compare the claim to the evidence.",go:interpretRios}
   ])}
  ])
 }
 function treatmentDecision(){
  q("#story").innerHTML=`
  <div class="claim-board">
    <div class="kicker">CHAPTER 02 · TRACE DEEPENS</div>
    <h2>The review isn't where the claim began.</h2>
    <p class="claim-board-lead">The public wording overstates the review. But the review itself points backward to the small patient study being used as the clinical evidence.</p>
    <div class="trace-evidence-card">
      <span>REFERENCE FLAGGED BY ROSIE</span>
      <b>Five patients receiving emergency VX-17 access</b>
      <p>No control group. No randomization. Outcomes described case by case.</p>
    </div>
    <div class="claim-question">
      <b>ROSIE</b>
      <p>“If this is the patient evidence underneath the review, I want to see what it actually claimed before everybody downstream started polishing the language.”</p>
    </div>
    <button class="primary" data-treatment="trace">FOLLOW THE CITATION →</button>
  </div>`;
  q("#story").classList.remove("hidden");
  q("#story").onclick=e=>{
    if(!e.target.closest("[data-treatment]"))return;
    q("#story").classList.add("hidden");
    setCampaignLesson(2);
    q("#chapter").textContent="CHAPTER 02 · THE OFFICIAL STORY";
    obj("Trace the claim one step further back: inspect the five-patient case series and compare its wording with the review and bulletin.");
    next("Follow the citation to the five-patient case series",null);
    pathStep(3,["See the claim","Find its citation","Compare versions","Rebuild the trail"]);
  };
 }
 function meetMira(){
  if(S.met){talk("Amina",`Still with me, ${pcName()}? Good. Iona's clock is moving. The library pulled three relevant papers, and the field copies are staged in the Research Annex with the monitoring records.`,[{label:"I'm with you.",go:()=>talk("Amina",`Then move. We can be careful without being slow.`,[{label:"Go to the Research Annex.",go:()=>{}}])}]);return}
  talk("Amina",npcVoice("miraArrival",`There you are. Iona's twenty minutes out, so introductions are going to be short.`),[
   {label:pcVoice("miraArrival","Good. What's happening?"),go:()=>talk("Amina",`Amina. Hale Library. I coordinate research for the Network. Tonight that means figuring out whether forty-three people can use an underpass before Iona reaches it.`,[
    {label:"What happened at Westbridge?",go:()=>talk("Amina",`Three people became ill inside a shelter the Recovery Authority still calls safe. Iona got everyone moving toward campus. The South Transit Underpass is the fastest route. The official map says green; a recent field monitor does not.`,[
     {label:"So what exactly do we need to know?",go:()=>talk("Amina",`Whether the evidence gives us reason to avoid prolonged enclosed exposure in that underpass. Not whether a colored map says “safe.” Not whether we can solve the whole outbreak tonight. One decision, one question.`,[
      {label:"Where do we start?",go:()=>talk("Amina",`Hale Library pulled three papers that could bear on the question. The field copies are staged in the Research Annex beside the monitoring records. We have enough time to be rigorous if we don't waste it.`,[
       {label:"Let's go.",go:()=>{S.met=true;obj("Reach the Research Annex field station. Identify which Hale Library source can answer the South Transit Underpass question.");next("Go to Research Annex","lab");pathStep(2)}}
      ])}
     ])}
    ])}
   ])}
  ])
 }
 function meetAtLab(){
  if(!S.met){talk("Amina","Talk to me first. You need to know what we're looking for.",[{label:"Okay.",go:()=>{}}]);return}
 
  talk("Amina",`Here they are. Hale Library found <b>three papers</b> that could matter. One of them is by <b>Dr. Mireille Okafor and Dr. Jo Running Bear</b>—two researchers who had already been studying exposure patterns that didn't fit neatly inside the official model.`,[
   {label:"Okafor and Running Bear?",go:()=>talk("Amina",`Research partners. Dr. Running Bear is still here. Dr. Okafor disappeared eight months ago after they identified another body of evidence they needed. That's a longer story, and right now Iona has forty-three people waiting on us.`,[
    {label:"So one of these papers might answer the underpass question.",go:()=>talk("Amina",`It can tell us what evidence bears on the decision. That is not the same thing as certifying a route safe. First you need a map of the article itself—scholarly articles have a structure, and that structure tells you where different kinds of information tend to live.`,[
     {label:pcVoice("mapAsk","Okay, so what's the structure?"),go:()=>talk("Amina",`I'm going to give you a map to make it easier. Hold onto it—we're going to use it again.`,[
      {label:pcVoice("showMap","Thanks. Show me the map."),go:()=>openArticleAnatomy(()=>talk("Amina",`Good. You have the map.`,[
       {label:pcVoice("mapTime","Yeah, but it will take forever to apply it to three different articles. We're running out of time!"),go:()=>talk("Amina",`Exactly. Knowing the structure is step one. Now I'll show you how to move through it quickly when every second counts.`,[
         {label:"Teach me the quick-reading strategy.",go:openQuickRead}
       ])}
      ]))}
     ])}
    ])}
   ])},
   {label:pcVoice("paperCount","Three papers. Minutes to spare. Great."),go:()=>talk("Amina",`Three papers is manageable if you don't confuse reading with starting at page one. First, learn the map. Then we'll use it to decide which paper deserves our time.`,[
    {label:pcVoice("mapAsk","Okay, so what's the structure?"),go:()=>talk("Amina",`I'm going to give you a map to make it easier. Hold onto it—we're going to use it again.`,[
     {label:pcVoice("showMap","Thanks. Show me the map."),go:()=>openArticleAnatomy(()=>talk("Amina",`Good. You have the map.`,[
      {label:pcVoice("mapTime","Yeah, but it will take forever to apply it to three different articles. We're running out of time!"),go:()=>talk("Amina",`Exactly. Now we turn the map into a quick-reading strategy.`,[
       {label:"Show me quick reading.",go:openQuickRead}
      ])}
     ]))}
    ])}
   ])}
  ])
 }
 function meetIona(){
  talk("Iona",npcVoice("ionaArrival",`You must be ${pcName()}. Amina said you were coming. Good. I owe you forty-three thank-yous and at least one argument.`),[
   {label:pcVoice("ionaProblem","What happened?"),go:()=>talk("Iona",`We got Westbridge around the underpass. Nobody enjoyed the weather, but everybody reached campus. Then one of the evacuees became symptomatic—and their only known contact with a case was <b>before that person showed symptoms</b>.`,[
    {label:pcVoice("ionaInference","So symptom screening might not be enough."),go:()=>talk("Iona",`That's my worry. I want to change intake before the next group arrives. Amina wants me to prove I know enough to justify it. Annoyingly, she's right.`,[
     {label:pcVoice("ionaTask","What am I looking for?"),go:()=>talk("Iona",`Dr. Running Bear and Dr. Okafor reconstructed transmission windows in early cases. You already know how to work a paper. I need the decision, not a lecture.`,[
      {label:pcVoice("ionaPractice","Fair enough. Give me the study."),go:()=>talk("Iona",`One question: <b>Does this evidence justify treating recent close contacts as potentially infectious before symptoms appear?</b> And yes—I'm asking because I want to change the protocol now.`,[
       {label:"Open Running Bear and Okafor's study.",go:()=>openPaper("chen","Abstract")}
      ])}
     ])}
    ])}
   ])}
  ])
 }
 let activeLifecycleBinder=null;

function openClaimBoard(){
  const storyEl=q("#story");
  const previousStoryHandler=storyEl.onclick;
  const stages=[
    {
      time:"21:03",short:"FIRST CALL",title:"Westbridge emergency call",kind:"LIVE / FIRSTHAND",
      line:"“Three people collapsed after the filtration alarm. We don't know why.”",
      purpose:"Get help and report what is happening now.",
      evidence:["eyewitness observations","symptoms","location","sequence of events"],
      notYet:["cause","regional comparison","validated exposure model"],
      meters:{speed:96,context:22,evidence:24},
      prompt:"What can the caller reasonably support at 21:03?",
      choices:[
        ["Three people collapsed after the filtration alarm.","right"],
        ["The filtration system caused the exposure.","wrong"],
        ["Containment procedures were violated.","wrong"]
      ],
      feedbackRight:"Yes. The caller can report what they directly observed and the sequence they experienced. Cause is still open.",
      feedbackWrong:"That goes beyond what exists at this point. The first call gives direct observation, not a settled causal explanation."
    },
    {
      time:"21:18",short:"FIELD REPORT",title:"Iona's field report",kind:"OPERATIONAL RECORD",
      line:"“Three symptomatic individuals reported following a filtration-system alarm.”",
      purpose:"Create a usable field record for people coordinating the response.",
      evidence:["first call","Iona's observations","symptom reports","site conditions","operational notes"],
      notYet:["full causal analysis","comparison across incidents","long-term follow-up"],
      meters:{speed:84,context:42,evidence:43},
      prompt:"What changed here?",
      choices:[
        ["The record adds field observations but still does not establish cause.","right"],
        ["Because Iona is on site, the cause is now confirmed.","wrong"],
        ["The first call is obsolete now that a field report exists.","wrong"]
      ],
      feedbackRight:"Exactly. More evidence is available, but 'more' is not the same as 'causal proof.'",
      feedbackWrong:"Not quite. A later record can add evidence without erasing the limits of what is known."
    },
    {
      time:"21:31",short:"ANALYSIS",title:"Regional incident analysis",kind:"INTERPRETATION",
      line:"“Exposure event associated with apparent containment-system failure.”",
      purpose:"Interpret the incident using existing models and comparison data.",
      evidence:["field reports","prior incidents","comparison data","existing exposure model","technical records"],
      notYet:["complete investigation","follow-up interviews","independent replication"],
      meters:{speed:62,context:68,evidence:67},
      prompt:"Which word should make you slow down?",
      choices:[
        ["Associated.","right"],
        ["Exposure.","wrong"],
        ["Regional.","wrong"]
      ],
      feedbackRight:"Right. 'Associated' describes a relationship. It does not, by itself, establish that one thing caused the other.",
      feedbackWrong:"Look for the word that tells you how strong the inferential move actually is."
    },
    {
      time:"21:49",short:"POLICY SUMMARY",title:"Policy summary",kind:"ADMINISTRATIVE USE",
      line:"“Westbridge incident likely resulted from containment protocol failure.”",
      purpose:"Turn analysis into a short statement that can guide action.",
      evidence:["regional analysis","selected technical findings","policy framework"],
      notYet:["completed investigation","all competing explanations","historical hindsight"],
      meters:{speed:48,context:64,evidence:67},
      prompt:"What has happened to the claim?",
      choices:[
        ["Association has been compressed into a likely causal explanation.","right"],
        ["Nothing; this says exactly the same thing as the analysis.","wrong"],
        ["The evidence has become firsthand because policy staff reviewed it.","wrong"]
      ],
      feedbackRight:"Yes. The evidence pool has barely changed, but the wording has become more causally confident.",
      feedbackWrong:"Compare the verbs. The evidence has not changed enough to justify treating the wording as equivalent."
    },
    {
      time:"22:12",short:"PUBLIC BULLETIN",title:"Recovery Authority bulletin",kind:"PUBLIC COMMUNICATION",
      line:"“Preliminary investigation confirms the Westbridge exposure event resulted from failure to follow established containment protocols.”",
      purpose:"Give the public a clear explanation and directive.",
      evidence:["policy summary","regional analysis","field report","official messaging priorities"],
      notYet:["completed investigation","later testing","retrospective analysis","archival record"],
      meters:{speed:35,context:58,evidence:68},
      prompt:"What is the lifecycle warning sign?",
      choices:[
        ["The certainty increased faster than the underlying evidence did.","right"],
        ["Public bulletins are always less trustworthy than eyewitnesses.","wrong"],
        ["Later sources are automatically worse because they are farther from the event.","wrong"]
      ],
      feedbackRight:"That's it. The lifecycle is not a ranking of source types. Here, the problem is a mismatch between certainty and support.",
      feedbackWrong:"Rosie's point is not 'official source bad' or 'later source bad.' Track what evidence exists and whether the claim outruns it."
    },
    {
      time:"LATER",short:"WHAT COMES NEXT?",title:"The record keeps changing",kind:"DAYS → YEARS",
      line:"Tonight is not the end of the information lifecycle. New sources will appear—and some questions will become easier while others become harder.",
      purpose:"Predict how the information environment changes after the immediate crisis.",
      evidence:["follow-up interviews","investigative reporting","government reports","research studies","archives","books & documentaries"],
      notYet:[],
      meters:{speed:16,context:95,evidence:96},
      future:true
    }
  ];

  let stage=0;
  const completed=new Set();
  let futureQuestion=0;

  function syncLifecycleStateFromDOM(){
    const active=storyEl.querySelector(".life-stage-dot.active");
    if(active && active.dataset.lifeStage!==undefined)stage=+active.dataset.lifeStage;

    const completeNodes=storyEl.querySelectorAll(".life-stage-dot.complete");
    if(completeNodes.length){
      completed.clear();
      completeNodes.forEach(node=>{
        if(node.dataset.lifeStage!==undefined)completed.add(+node.dataset.lifeStage);
      });
    }

    const complication=storyEl.querySelector(".life-future .kicker");
    if(complication){
      const m=complication.textContent.match(/(\d+)\s*\/\s*(\d+)/);
      if(m)futureQuestion=Math.max(0,+m[1]-1);
    }
  }

  function bindLifecycleControls(){
    syncLifecycleStateFromDOM();
    storyEl.querySelectorAll("[data-life-stage],[data-life-review],[data-life-answer],[data-future-answer],[data-future-next],#lifeAdvance")
      .forEach(btn=>{
        btn.onclick=e=>{
          e.preventDefault();
          e.stopPropagation();
          handleLifecycleClick(e);
        };
      });
  }

  function chips(items,cls=""){
    return items.map(x=>`<span class="life-chip ${cls}">${x}</span>`).join("");
  }
  function meter(label,val,low,high){
    return `<div class="life-meter"><div class="life-meter-head"><span>${label}</span><small>${low} ← → ${high}</small></div><div class="life-meter-track"><i style="width:${val}%"></i></div></div>`;
  }
  function renderTimeline(){
    return `<div class="life-visual-timeline" aria-label="Westbridge information lifecycle">
      ${stages.map((s,i)=>{
        const unlocked=i<=Math.max(...[...completed,-1])+1;
        return `<button type="button" class="life-stage-dot ${i===stage?"active":""} ${completed.has(i)?"complete":""}" data-life-stage="${i}" ${unlocked?"":"disabled"} aria-current="${i===stage?"step":"false"}">
          <span>${s.time}</span><b>${s.short}</b><i></i>
        </button>`;
      }).join("")}
    </div>`;
  }
  function renderFuture(){
    const qs=[
      {
        q:"You need to know exactly what people inside Westbridge saw before evacuation began.",
        choices:[
          ["FIRSTHAND / CONTEMPORANEOUS","right"],
          ["MONTHS-LATER GOVERNMENT REPORT","wrong"],
          ["FUTURE ENCYCLOPEDIA ENTRY","wrong"]
        ],
        why:"Contemporaneous eyewitness and field records preserve details that later sources may summarize, reinterpret, or lose."
      },
      {
        q:"You need to know whether Westbridge fits a broader pattern across multiple incidents.",
        choices:[
          ["THE FIRST EMERGENCY CALL","wrong"],
          ["LATER ANALYSIS / RESEARCH","right"],
          ["A SINGLE SOCIAL POST","wrong"]
        ],
        why:"That question needs comparison, accumulated evidence, and time to analyze multiple events. The first call cannot answer it."
      },
      {
        q:"You need to know how Westbridge was remembered five years later.",
        choices:[
          ["ONLY THE ORIGINAL 21:03 CALL","wrong"],
          ["ARCHIVES / RETROSPECTIVE SOURCES","right"],
          ["ONLY THE 22:12 BULLETIN","wrong"]
        ],
        why:"Now the question is about memory and historical framing. Later sources become evidence for how the event was preserved and interpreted."
      }
    ];
    const f=qs[futureQuestion];
    return `<div class="life-future">
      <div class="future-stream" aria-label="Sources that may emerge over time">
        <div><span>NOW</span><b>calls · photos · field notes</b></div>
        <i>→</i>
        <div><span>DAYS</span><b>news · interviews · corrections</b></div>
        <i>→</i>
        <div><span>WEEKS / MONTHS</span><b>investigations · reports · studies</b></div>
        <i>→</i>
        <div><span>YEARS</span><b>archives · books · documentaries</b></div>
      </div>
      <div class="future-tendencies">
        <div><b>AVAILABLE EVIDENCE</b><span class="tendency-arrow">generally increases →</span></div>
        <div><b>CONTEXT & COMPARISON</b><span class="tendency-arrow">generally increase →</span></div>
        <div><b>IMMEDIACY</b><span class="tendency-arrow">← generally decreases</span></div>
        <div><b>FIRSTHAND DETAIL</b><span class="tendency-arrow">can be lost or reconstructed</span></div>
      </div>
      <div class="life-test">
        <div class="kicker">ROSIE'S COMPLICATION · ${futureQuestion+1} / ${qs.length}</div>
        <h3>Later does not mean better.</h3>
        <p>${f.q}</p>
        <div class="life-answers">
          ${f.choices.map(c=>`<button type="button" class="life-answer future-answer" data-future-answer="${c[1]}">${c[0]}</button>`).join("")}
        </div>
        <div id="futureFeedback" class="life-feedback" aria-live="polite"></div>
      </div>
    </div>`;
  }
  function render(){
    const s=stages[stage];
    storyEl.innerHTML=`<div class="claim-board lifecycle-board lifecycle-v2">
      <div class="kicker">COMMUNICATIONS · WESTBRIDGE RECORD TRAIL</div>
      <div class="life-heading"><div><h2>Rebuild what could be known.</h2><p>Rosie isn't ranking sources. She's showing you how the <b>available evidence, purpose, and justified certainty</b> change as an event moves through time.</p></div><div class="life-counter">${stage+1} / ${stages.length}</div></div>
      ${renderTimeline()}
      <div class="life-workspace">
        <aside class="life-evidence-field">
          <div class="life-panel-label">EVIDENCE AVAILABLE BY ${s.time}</div>
          <div class="life-chip-field">${chips(s.evidence)}</div>
          ${s.notYet.length?`<div class="life-panel-label not-yet">NOT YET AVAILABLE</div><div class="life-chip-field">${chips(s.notYet,"ghost")}</div>`:""}
          ${meter("IMMEDIACY",s.meters.speed,"later","live")}
          ${meter("CONTEXT",s.meters.context,"thin","rich")}
          ${meter("EVIDENCE BASE",s.meters.evidence,"narrow","broad")}
        </aside>
        <section class="life-source-stage">
          <div class="life-source-meta"><span>${s.time}</span><b>${s.kind}</b></div>
          <h3>${s.title}</h3>
          <blockquote>${s.line}</blockquote>
          <div class="life-purpose"><b>WHAT THIS RECORD IS FOR</b><p>${s.purpose}</p></div>
          ${s.future?renderFuture():`<div class="life-test">
            <div class="kicker">WHAT CAN BE KNOWN HERE?</div>
            <h3>${s.prompt}</h3>
            <div class="life-answers">${s.choices.map((c,i)=>`<button type="button" class="life-answer" data-life-answer="${c[1]}" data-answer-index="${i}">${c[0]}</button>`).join("")}</div>
            <div id="lifeFeedback" class="life-feedback" aria-live="polite"></div>
          </div>`}
        </section>
      </div>
      <div class="life-footer">
        <div><b>ROSIE</b><span>${s.future?"“Information keeps accumulating. The question is what kind of source can answer the question you have.”":"“Don't ask which source is best. Ask what this source could know at this moment—and what it was made to do.”"}</span></div>
        <div class="life-footer-controls">
          <button type="button" class="life-review-btn" data-life-review="back" ${stage===0?"disabled":""}>← BACK</button>
          <button type="button" class="life-review-btn" data-life-review="forward" ${stage>=Math.min(stages.length-1,(completed.size?Math.max(...completed)+1:0))?"disabled":""}>FORWARD →</button>
          <button type="button" class="primary" id="lifeAdvance" ${completed.has(stage)?"":"disabled"}>${stage===stages.length-1?"COMPARE THE CHANGES →":"ADVANCE TIME →"}</button>
        </div>
      </div>
    </div>`;
    storyEl.classList.remove("hidden");
    bindLifecycleControls();
  }

  const handleLifecycleClick=e=>{
    const reviewBtn=e.target.closest("[data-life-review]");
    if(reviewBtn){
      const maxUnlocked=Math.min(stages.length-1,(completed.size?Math.max(...completed)+1:0));
      if(reviewBtn.dataset.lifeReview==="back" && stage>0){
        stage--;
        render();
        return;
      }
      if(reviewBtn.dataset.lifeReview==="forward" && stage<maxUnlocked){
        stage++;
        render();
        return;
      }
      return;
    }

    const stageBtn=e.target.closest("[data-life-stage]");
    if(stageBtn){
      const requested=+stageBtn.dataset.lifeStage;
      if(requested<=Math.max(...[...completed,-1])+1){
        stage=requested;
        render();
      }
      return;
    }

    const ans=e.target.closest("[data-life-answer]");
    if(ans){
      const s=stages[stage];
      const fb=q("#lifeFeedback");
      const right=ans.dataset.lifeAnswer==="right";
      storyEl.querySelectorAll(".life-answer").forEach(b=>b.classList.remove("correct","wrong"));
      ans.classList.add(right?"correct":"wrong");
      fb.classList.add("show");
      fb.innerHTML=right?`<b>ROSIE:</b> ${s.feedbackRight}`:`<b>ROSIE:</b> ${s.feedbackWrong}`;
      if(right){
        completed.add(stage);
        storyEl.querySelector("#lifeAdvance").disabled=false;
      }
      return;
    }

    const futureAns=e.target.closest("[data-future-answer]");
    if(futureAns){
      const fb=storyEl.querySelector("#futureFeedback");
      const right=futureAns.dataset.futureAnswer==="right";
      storyEl.querySelectorAll(".future-answer").forEach(b=>b.classList.remove("correct","wrong"));
      futureAns.classList.add(right?"correct":"wrong");
      fb.classList.add("show");
      if(!right){
        fb.innerHTML=`<b>ROSIE:</b> Match the source to the question, not to a rule that says earlier or later is automatically better.`;
        return;
      }

      const explanations=[
        "Contemporaneous eyewitness and field records preserve details that later sources may summarize, reinterpret, or lose.",
        "That question needs comparison, accumulated evidence, and time to analyze multiple events. The first call cannot answer it.",
        "Now the question is about memory and historical framing. Later sources become evidence for how the event was preserved and interpreted."
      ];
      fb.innerHTML=`<b>ROSIE:</b> ${explanations[futureQuestion]}`;

      const controls=document.createElement("div");
      controls.className="future-answer-next";
      controls.innerHTML=`<button type="button" class="life-small-next" data-future-next>${futureQuestion<2?"NEXT QUESTION →":"READY TO APPLY →"}</button>`;
      fb.appendChild(controls);
      storyEl.querySelectorAll(".future-answer").forEach(b=>b.disabled=true);
      return;
    }

    if(e.target.closest("[data-future-next]")){
      if(futureQuestion<2){
        futureQuestion++;
        render();
      }else{
        completed.add(stage);
        render();
      }
      return;
    }

    if(e.target.closest("#lifeAdvance")){
      if(!completed.has(stage))return;

      if(stage<stages.length-1){
        stage++;
        render();
        return;
      }

      /* Leave the lifecycle cleanly before Rosie's comparison dialogue opens. */
      activeLifecycleBinder=null;
      storyEl.onclick=null;
      storyEl.querySelectorAll("[data-life-stage],[data-life-review],[data-life-answer],[data-future-answer],[data-future-next],#lifeAdvance")
        .forEach(btn=>btn.onclick=null);
      storyEl.classList.add("hidden");
      storyEl.innerHTML="";
      lifecycleCompareQuestion();
      return;
    }
  };

  activeLifecycleBinder=bindLifecycleControls;
  render();
 }
 function lifecycleCompareQuestion(){
  talk("Rosie",`You've seen the chain. What changed in a way that the evidence itself didn't justify?`,[
   {label:"Uncertainty disappeared, association became causation, and a system problem became human noncompliance.",go:()=>talk("Rosie",`Exactly. And notice: that doesn't mean every person in the chain lied. Each document was doing a different job. But by the end, the public claim could carry more certainty than the original evidence.`,[
    {label:"So we need to know why each version was made.",go:()=>lifecyclePurposeQuestion()}
   ])},
   {label:"The later records are automatically worse because they're farther from the event.",go:()=>talk("Rosie",`Not automatically. A later analysis can have more evidence than an early call. Distance isn't the problem. We need provenance, purpose, and support.`,[
    {label:"Then compare what each version adds and changes.",go:lifecycleCompareQuestion}
   ])},
   {label:"The first call must be the most trustworthy because it came first.",go:()=>talk("Rosie",`First doesn't mean complete. The caller knew what they saw, not necessarily why it happened. An original record can still be partial.`,[
    {label:"Right. Original and accurate aren't synonyms.",go:lifecycleCompareQuestion}
   ])}
  ])
 }
 function lifecyclePurposeQuestion(){
  talk("Rosie",`Good. The regional analysis cites a study when it interprets the filtration alarm. You already know how to handle that part.`,[
   {label:"Trace the citation and see whether the study supports the causal claim.",go:()=>talk("Amina",`You don't need another lesson from me. Keep the Westbridge question in front of you, use the Article Map if you need it, and check what the evidence actually establishes.`,[
    {label:"Use the tools I already have.",go:()=>chapter2EvidenceCheck()}
   ])}
  ])
 }
 function chapter2EvidenceCheck(){
  q("#story").innerHTML=`
   <div class="claim-board">
    <div class="kicker">HALE LIBRARY · EVIDENCE CHECK</div>
    <h2>The citation supports a possibility—not the blame.</h2>
    <p class="claim-board-lead">Using the same strategic-reading moves from Chapter 1, you check the cited study's Results, Methods, and limitations.</p>
    <div class="trace-evidence-card"><span>WHAT THE STUDY SUPPORTS</span><b>Filtration failures can contribute to exposure under some enclosed conditions.</b><p>The study does not examine Westbridge, does not establish that its filtration system caused the event, and does not show that staff failed to follow protocols.</p></div>
    <div class="claim-question"><b>AMINA</b><p>“Same tool, different problem. A source can be relevant without proving the claim somebody attached to it.”</p></div>
    <button class="primary" data-evidence-check>RETURN TO ROSIE →</button>
   </div>`;
  q("#story").classList.remove("hidden");
  q("#story").onclick=e=>{if(!e.target.closest("[data-evidence-check]"))return;q("#story").classList.add("hidden");chapter2Reveal()};
 }
 function chapter2Reveal(){
  talk("Rosie",`There's one more thing. The regional analysis links Westbridge to an older anomaly review. Read the names.`,[
   {label:"Dr. Okafor and Jo.",go:()=>talk("Rosie",`Yeah. Dr. Okafor and Jo were studying cases like this months before Westbridge.`,[
    {label:"Dr. Okafor—your Dr. Okafor?",go:()=>talk("Rosie",`My partner. And Jo's research partner. They worked on this together. Dr. Okafor disappeared after they identified a raw early-Fall archive at Kestrel that might tell them why the official model wasn't fitting the cases.`,[
     {label:"And the government already had their anomaly review.",go:()=>talk("Rosie",`That's what bothers me. Westbridge isn't the first case that didn't fit. The public bulletin makes it sound like the model explained this in under an hour. The internal trail says they already knew the model had a problem.`,[
      {label:"So what did Dr. Okafor and Jo find?",go:finishChapter2Lifecycle}
     ])}
    ])}
   ])}
  ])
 }
 function finishChapter2Lifecycle(){
  addFieldTool("claimTrace",true);
  addIntel("Westbridge information lifecycle","Initial uncertainty narrowed as the event moved from call → field report → analysis → policy summary → public bulletin. Association became causation; system failure became human noncompliance.");
  addIntel("Okafor–Jo anomaly review","Dr. Okafor and Jo jointly documented earlier cases the official exposure model did not adequately explain.");
  q("#lesson2")?.classList.remove("active","locked");q("#lesson2")?.classList.add("complete");
  q("#story").innerHTML=`<div class="story-beat"><div class="kicker">CHAPTER 02 · COMPLETE</div><h2>The official story is too certain.</h2><p>Westbridge did not just expose a shelter problem. It reopened a scientific problem Dr. Okafor and Jo had already been investigating together.</p><div class="story-status-line"><span>NEW TOOL</span><b>CLAIM TRACE</b></div><div class="story-status-line"><span>NEXT QUESTION</span><b>ARE THE ANOMALIES INCREASING?</b></div><p class="question">Chapter 3 will begin with the data Dr. Okafor and Jo were using—and the processed dataset they no longer trusted.</p><button class="primary" data-ch2-close>CLOSE FIELD LOG →</button></div>`;
  q("#story").classList.remove("hidden");
  q("#story").onclick=e=>{if(!e.target.closest("[data-ch2-close]"))return;q("#story").classList.add("hidden");obj("Chapter 2 complete. Westbridge connects to the anomaly research Dr. Okafor and Jo were conducting together.");next("Review your Field Kit or Backpack",null)};
 }

function meetRosie(){
  setCampaignLesson(2);
  q("#chapter").textContent="CHAPTER 02 · THE OFFICIAL STORY";
  talk("Rosie",npcVoice("rosieArrival",`You made it. Good. Close the door—half the Network is already inventing a better story than the one we actually have.`),[
   {label:pcVoice("rosieOminous","That sounds ominous."),go:()=>talk("Rosie",`The Recovery Authority says Westbridge failed containment protocol. I have Westbridge's first call, Iona's field report, the regional analysis, the policy summary, and the public bulletin. Five records. Less than seventy minutes.`,[
    {label:pcVoice("rosieSame","Same evidence?"),go:()=>talk("Rosie",`Same event. Not the same information. That's what I need you to see. Information has a life after the thing it describes. People record it, interpret it, compress it, pass it on, and act on it.`,[
     {label:pcVoice("rosieCertainty","So where did the extra certainty come from?"),go:()=>talk("Rosie",`Exactly. We're going to rebuild the lifecycle before the government version becomes the only version anybody remembers.`,[
      {label:"Show me the trail.",go:openClaimBoard}
     ])}
    ])}
   ])},
   {label:pcVoice("rosieIntro","Rosie?"),go:()=>talk("Rosie",`Communications lead. Professional keeper of timestamps. Also, for the record, Mireille used to say I cared more about message headers than human beings.`,[
    {label:"Mireille?",go:()=>talk("Rosie",`Dr. Mireille Okafor. My partner. She's been missing eight months. That's not tonight's problem—unless this document trail says it is.`,[
     {label:pcVoice("rosieChanged","What changed?"),go:()=>talk("Rosie",`Start with Westbridge. If we're going to argue with an official conclusion, we do it by reconstructing how they got there.`,[
      {label:"Show me the trail.",go:openClaimBoard}
     ])}
    ])}
   ])}
  ])
 }
 q("#comms").onclick=()=>{if(q("#comms").classList.contains("locked"))return;meetRosie()};
 q("#mira").onclick=meetMira;
 q("#lab").onclick=meetAtLab;
 q("#library").onclick=()=>{if(q("#library").classList.contains("locked"))return;meetIona()};
 q("#intelBtn").onclick=()=>q("#intel").classList.toggle("hidden");
 
 
 /* === GLOBAL SCREEN HISTORY ===
    Records meaningful UI transitions without altering the game's existing event handlers.
    Restores state + visible screen contents and keeps Back/Forward available everywhere.
 */
 const screenBackStack=[];
 const screenForwardStack=[];
 let restoringScreenHistory=false;
 let resumedNavigationBoundary=false;
 let resumedAnchorSnapshot=null;
 
 const historyInnerIds=[
  "proDay","proTitle","proBody","progDots","proNext","backstoryPanel","playerName","playerPronouns",
  "chapter","objective","model","nextLabel","intelBtn","intelList",
  "path1","path2","path3","path4",
  "dialogue","story","decision",
  "qrBody","qrStep","qrNavCount",
  "triageCards","triageFeedback",
  "sections","mission","paper","rq","working",
  "anatomyPrompt","anatomyFeedback","anatomyProgress"
 ];
 const historyClassIds=[
  "prologue","characterSelect","dialogue","quickRead","beamTriage","reader","story","decision","intel","articleAnatomy",
  "mira","lab","library","comms","characterSelect"
 ];
 const historyButtonIds=[
  "proNext","confirmCharacter","qrBackFixed","qrNextFixed","backToQuickRead","continueChoosePaper","closeReader","anatomyContinue"
 ];
 const historyHandlerIds=[
  "proNext","confirmCharacter","characterSelect","playerName","playerPronouns","nextGo","dialogue","quickRead","qrBackFixed","qrNextFixed",
  "backToQuickRead","beamTriage","continueChoosePaper",
  "sections","mission","closeReader","story","decision",
  "mira","lab","library","comms","intelBtn"
 ];
 
 function cloneScreenState(){
  return {
    S:{
      ...S,
      intel:S.intel.map(x=>({...x})),
      choices:S.choices.slice(),
      keys:{...S.keys}
    },
    proIndex,
    nextTarget,
    quickReadStage,
    anatomyStep,
    anatomyMode,
    anatomyContinue,
    anatomySeen:new Set([...anatomySeen]),
    anatomyRevealed:new Set([...anatomyRevealed]),
    triageState:{
      inspected:new Set([...triageState.inspected]),
      selected:triageState.selected,
      tabs:{...triageState.tabs}
    }
  };
 }
 
 function captureScreen(){
  const inner={};
  historyInnerIds.forEach(id=>{
    const el=q("#"+id);
    if(el)inner[id]=el.innerHTML;
  });
  const classes={};
  historyClassIds.forEach(id=>{
    const el=q("#"+id);
    if(el)classes[id]=el.className;
  });
  const styles={};
  [...historyClassIds,"campaignProgress"].forEach(id=>{
    const el=q("#"+id);
    if(el)styles[id]=el.getAttribute("style")||"";
  });
  const buttons={};
  historyButtonIds.forEach(id=>{
    const el=q("#"+id);
    if(el)buttons[id]={disabled:!!el.disabled};
  });
  const lessons=qa("#campaign .lesson").map(el=>el.className);
  const handlers={};
  historyHandlerIds.forEach(id=>{
    const el=q("#"+id);
    if(el)handlers[id]=el.onclick;
  });
  return {state:cloneScreenState(),inner,classes,styles,buttons,lessons,handlers};
 }
 
 function screenSignature(){
  const visiblePanels=["prologue","characterSelect","dialogue","quickRead","beamTriage","reader","story","decision","intel","articleAnatomy"]
    .map(id=>{const el=q("#"+id);return el?id+":"+el.className:"";}).join("|");
  return [
    proIndex,quickReadStage,anatomyStep,anatomyMode,S.paper,S.stage,nextTarget,S.playerChar,S.playerName,S.playerPronouns,S.annexEscapeActive,S.annexEscaped,
    triageState.selected,[...triageState.inspected].sort().join(","),
    q("#chapter")?.textContent||"",
    q("#dialogue")?.innerHTML||"",
    q("#story")?.innerHTML||"",
    q("#decision")?.innerHTML||"",
    q("#paper")?.innerHTML||"",
    q("#mission")?.innerHTML||"",
    q("#qrBody")?.innerHTML||"",
    q("#triageFeedback")?.innerHTML||"",
    q("#anatomyPrompt")?.innerHTML||"",
    q("#anatomyFeedback")?.innerHTML||"",
    visiblePanels
  ].join("§");
 }
 
 function restoreScreen(snap){
  if(!snap)return;
  restoringScreenHistory=true;
 
  S={
    ...snap.state.S,
    intel:snap.state.S.intel.map(x=>({...x})),
    choices:snap.state.S.choices.slice(),
    keys:{...snap.state.S.keys}
  };
  proIndex=snap.state.proIndex;
  nextTarget=snap.state.nextTarget;
  quickReadStage=snap.state.quickReadStage;
  anatomyStep=snap.state.anatomyStep ?? anatomyStep;
  anatomyMode=snap.state.anatomyMode ?? anatomyMode;
  anatomyContinue=snap.state.anatomyContinue ?? anatomyContinue;
  anatomySeen=new Set([...(snap.state.anatomySeen||[])]);
  anatomyRevealed=new Set([...(snap.state.anatomyRevealed||[])]);
  triageState={
    inspected:new Set([...snap.state.triageState.inspected]),
    selected:snap.state.triageState.selected,
    tabs:{...snap.state.triageState.tabs}
  };
 
  Object.entries(snap.inner).forEach(([id,value])=>{
    const el=q("#"+id);if(el)el.innerHTML=value;
  });
  Object.entries(snap.classes).forEach(([id,value])=>{
    const el=q("#"+id);if(el)el.className=value;
  });
  Object.entries(snap.styles).forEach(([id,value])=>{
    const el=q("#"+id);
    if(el){
      if(value)el.setAttribute("style",value);
      else el.removeAttribute("style");
    }
  });
  if(q("#playerName"))q("#playerName").value=S.playerName||"";
  if(q("#playerPronouns")&&S.playerPronouns)q("#playerPronouns").value=S.playerPronouns;
  if(q("#player")&&S.playerChar)q("#player").className=`char-${S.playerChar}`;
  Object.entries(snap.buttons).forEach(([id,value])=>{
    const el=q("#"+id);if(el)el.disabled=value.disabled;
  });
  qa("#campaign .lesson").forEach((el,i)=>{
    if(snap.lessons[i]!==undefined)el.className=snap.lessons[i];
  });
  Object.entries(snap.handlers).forEach(([id,fn])=>{
    const el=q("#"+id);if(el)el.onclick=fn;
  });
 
  // Re-mark current hotspot from restored nextTarget.
  qa(".hot").forEach(x=>x.classList.remove("current"));
  if(nextTarget&&q("#"+nextTarget))q("#"+nextTarget).classList.add("current");
 
  renderFirstPerson();
  if(S.annexEscapeActive)renderAnnexEscape();else clearAnnexEscapeUI();
  if(q("#articleAnatomy") && !q("#articleAnatomy").classList.contains("hidden")){
    renderArticleAnatomy();
    anatomySeen.forEach(markAnatomySectionSeen);
    applyAnatomyAnswerReveals();
  }
  if(activeLifecycleBinder && q("#story") && !q("#story").classList.contains("hidden") && q("#story .lifecycle-v2")){
    activeLifecycleBinder();
  }
  restoringScreenHistory=false;
  updateHistoryControls();
 }
 
 
 function isStartupHistorySnapshot(snap){
  if(!snap)return false;
  const prologueClass=snap.classes?.prologue||"";
  const characterClass=snap.classes?.characterSelect||"";
  const playerChosen=!!snap.state?.S?.playerChar;
 
  /* A prologue / character-select snapshot cannot be a valid destination
     once a saved game with a selected character has been resumed. */
  return playerChosen && (
    !prologueClass.includes("hidden") ||
    !characterClass.includes("hidden")
  );
 }
 
 function pushGameplayHistorySnapshot(snap){
  if(!snap)return;
  if(resumedNavigationBoundary && isStartupHistorySnapshot(snap))return;
  screenBackStack.push(snap);
  if(screenBackStack.length>80)screenBackStack.shift();
 }
 
 function updateHistoryControls(){
  const back=q("#historyBack"),forward=q("#historyForward"),pos=q("#historyPos");
  if(back){
    back.disabled=screenBackStack.length===0;
    back.title=resumedNavigationBoundary && back.disabled
      ? "You resumed here. Back becomes available after you continue."
      : "Back";
  }
  if(forward){
    forward.disabled=screenForwardStack.length===0;
    forward.title="Forward";
  }
  if(pos)pos.textContent=`${screenBackStack.length} / ${screenForwardStack.length}`;
 }
 
 q("#historyBack").onclick=()=>{
  if(!screenBackStack.length)return;
 
  const current=captureScreen();
  let previous=screenBackStack.pop();
 
  /* Never return a resumed player to a stale startup/prologue snapshot. */
  while(previous && isStartupHistorySnapshot(previous) && screenBackStack.length){
    previous=screenBackStack.pop();
  }
  if(!previous || isStartupHistorySnapshot(previous)){
    updateHistoryControls();
    return;
  }
 
  screenForwardStack.push(current);
  restoreScreen(previous);
 };
 
 q("#historyForward").onclick=()=>{
  if(!screenForwardStack.length)return;
  const current=captureScreen();
  const future=screenForwardStack.pop();
  pushGameplayHistorySnapshot(current);
  restoreScreen(future);
 };
 
 // Capture before a user action, then only commit it to history if the screen actually changed.
 document.addEventListener("click",e=>{
  if(restoringScreenHistory)return;
  if(e.target.closest("#historyNav"))return;
  /* Resume/New Game/Erase are application controls, not story navigation.
     Never let their clicks enter the gameplay Back/Forward history. */
  if(e.target.closest("#resumePanel"))return;
  if(e.target.closest("#nextGo")||e.target.closest("#intelBtn"))return;
 
  const before=captureScreen();
  const sigBefore=screenSignature();
 
  setTimeout(()=>{
    if(restoringScreenHistory)return;
    const sigAfter=screenSignature();
    if(sigAfter!==sigBefore){
      if(resumedNavigationBoundary && resumedAnchorSnapshot){
        pushGameplayHistorySnapshot(resumedAnchorSnapshot);
        resumedAnchorSnapshot=null;
      }else{
        pushGameplayHistorySnapshot(before);
      }
      resumedNavigationBoundary=false;
      screenForwardStack.length=0;
      updateHistoryControls();
    }
  },0);
 },true);
 
 updateHistoryControls();
 
 /* === CINEMATIC HOTSPOT CLICK SAFETY === */
 q("#world").addEventListener("click", e=>{
   const hot=e.target.closest(".hot");
   if(!hot || hot.classList.contains("locked"))return;
   /* Existing .onclick handlers still own all story logic. */
 });
 
 
 renderFirstPerson();
 
 
 
 
 /* === SAVEABLE BACK/FORWARD HISTORY ===
    Runtime screen snapshots contain callback functions and cannot be written
    directly to localStorage. Save only stable, non-dialogue checkpoints;
    their screens use the game's persistent delegated controls when restored.
 */
 function historySnapshotIsSaveable(snap){
  if(!snap)return false;
  const dialogueClass=snap.classes?.dialogue||"";
  return dialogueClass.includes("hidden");
 }
 
 function serializeHistorySnapshot(snap){
  if(!historySnapshotIsSaveable(snap))return null;
  const st=snap.state||{};
  return {
    state:{
      S:{
        ...(st.S||{}),
        intel:(st.S?.intel||[]).map(x=>({...x})),
        choices:[],
        keys:{}
      },
      proIndex:st.proIndex,
      nextTarget:st.nextTarget,
      quickReadStage:st.quickReadStage,
      anatomyStep:st.anatomyStep,
      anatomyMode:st.anatomyMode,
      anatomySeen:[...(st.anatomySeen||[])],
      anatomyRevealed:[...(st.anatomyRevealed||[])],
      triageState:{
        inspected:[...(st.triageState?.inspected||[])],
        selected:st.triageState?.selected||null,
        tabs:{...(st.triageState?.tabs||{})}
      }
    },
    inner:{...(snap.inner||{})},
    classes:{...(snap.classes||{})},
    styles:{...(snap.styles||{})},
    buttons:{...(snap.buttons||{})},
    lessons:[...(snap.lessons||[])]
  };
 }
 
 function deserializeHistorySnapshot(raw){
  if(!raw)return null;
  const st=raw.state||{};
  return {
    state:{
      S:{
        ...(st.S||{}),
        intel:(st.S?.intel||[]).map(x=>({...x})),
        choices:[],
        keys:{}
      },
      proIndex:Number(st.proIndex||0),
      nextTarget:st.nextTarget||null,
      quickReadStage:Number(st.quickReadStage||0),
      anatomyStep:Number(st.anatomyStep||0),
      anatomyMode:st.anatomyMode||"learn",
      anatomyContinue:null,
      anatomySeen:new Set(st.anatomySeen||[]),
      anatomyRevealed:new Set(st.anatomyRevealed||[]),
      triageState:{
        inspected:new Set(st.triageState?.inspected||[]),
        selected:st.triageState?.selected||null,
        tabs:{review:"Abstract",vale:"Abstract",network:"Abstract",...(st.triageState?.tabs||{})}
      }
    },
    inner:{...(raw.inner||{})},
    classes:{...(raw.classes||{})},
    styles:{...(raw.styles||{})},
    buttons:{...(raw.buttons||{})},
    lessons:[...(raw.lessons||[])],
    handlers:{}
  };
 }
 
 function serializableHistory(){
  const clean=stack=>stack
    .filter(historySnapshotIsSaveable)
    .slice(-30)
    .map(serializeHistorySnapshot)
    .filter(Boolean);
  return {
    back:clean(screenBackStack),
    forward:clean(screenForwardStack)
  };
 }
 
 function restoreSavedHistory(history){
  screenBackStack.length=0;
  screenForwardStack.length=0;
 
  /* Older saves have no history. Leaving these stacks empty is safer than
     retaining the startup history from the freshly loaded page. */
  if(history){
    (history.back||[]).forEach(raw=>{
      const snap=deserializeHistorySnapshot(raw);
      if(snap)screenBackStack.push(snap);
    });
    (history.forward||[]).forEach(raw=>{
      const snap=deserializeHistorySnapshot(raw);
      if(snap)screenForwardStack.push(snap);
    });
  }
  updateHistoryControls();
 }
 
 /* =========================================================
    LOCAL SAVE / RESUME
    Progress is stored in this browser with localStorage.
    Dialogue itself is not serialized because its choices contain live
    callback functions; while talking, the previous stable checkpoint is kept.
    ========================================================= */
 const AFTERFALL_SAVE_KEY="afterfall-save-v1";
 let autosaveTimer=null;
 let lastStableSave=null;
 
 function serializableGameState(){
  return {
   version:1,
   savedAt:new Date().toISOString(),
   S:{
    met:!!S.met,inLab:!!S.inLab,paper:S.paper||"vale",stage:Number(S.stage||0),
    valeDone:!!S.valeDone,routeDone:!!S.routeDone,chenDone:!!S.chenDone,
    intel:(S.intel||[]).map(x=>({a:x.a,b:x.b})),px:Number(S.px||43),py:Number(S.py||72),
    playerChar:S.playerChar||null,playerName:S.playerName||"",playerPronouns:S.playerPronouns||"",
    fpNode:S.fpNode||"courtyard",currentSection:S.currentSection||"Abstract",playerBriefStep:S.playerBriefStep===null?null:Number(S.playerBriefStep||0),annexEscapeActive:!!S.annexEscapeActive,annexEscaped:!!S.annexEscaped,fieldKit:[...(S.fieldKit||[])],backpack:[...(S.backpack||[])],chenReading:S.chenReading?{...S.chenReading}:null
   },
   proIndex:Number(proIndex||0),nextTarget:nextTarget||null,quickReadStage:Number(quickReadStage||0),
   triageState:{inspected:[...triageState.inspected],selected:triageState.selected||null,tabs:{...triageState.tabs}},
   ui:{
    chapter:q("#chapter")?.textContent||"",objective:q("#objective")?.textContent||"",
    model:q("#model")?.textContent||"",nextLabel:q("#nextLabel")?.textContent||"",
    path:[1,2,3,4].map(i=>q("#path"+i)?.textContent||""),
    pathNow:[1,2,3,4].map(i=>q("#path"+i)?.classList.contains("now")||false),
    intelBtn:q("#intelBtn")?.textContent||"",intelList:q("#intelList")?.innerHTML||"",
    lessonClasses:qa("#campaign .lesson").map(el=>el.className),
    campaignProgress:q("#campaignProgress")?.getAttribute("style")||"",
    locked:{mira:q("#mira")?.classList.contains("locked")||false,lab:q("#lab")?.classList.contains("locked")||false,
            library:q("#library")?.classList.contains("locked")||false,comms:q("#comms")?.classList.contains("locked")||false}
   },
   screen:{
    prologue:!q("#prologue")?.classList.contains("hidden"),characterSelect:!q("#characterSelect")?.classList.contains("hidden"),
    quickRead:!q("#quickRead")?.classList.contains("hidden"),triage:!q("#beamTriage")?.classList.contains("hidden"),
    reader:!q("#reader")?.classList.contains("hidden"),
    anatomy:!q("#articleAnatomy")?.classList.contains("hidden"),anatomyStep:Number(anatomyStep||0),anatomyMode:anatomyMode||"learn",anatomySeen:[...anatomySeen],anatomyRevealed:[...anatomyRevealed],
    story:!q("#story")?.classList.contains("hidden"),
    decision:!q("#decision")?.classList.contains("hidden"),
    storyHTML:q("#story")?.innerHTML||"",decisionHTML:q("#decision")?.innerHTML||""
   }
  };
 }
 
 function isStableForSave(){return q("#dialogue")?.classList.contains("hidden")!==false}
 function hasSavedGame(){try{return !!localStorage.getItem(AFTERFALL_SAVE_KEY)}catch(e){return false}}
 function readSavedGame(){try{const x=localStorage.getItem(AFTERFALL_SAVE_KEY);return x?JSON.parse(x):null}catch(e){return null}}
 function writeSave(snap){try{localStorage.setItem(AFTERFALL_SAVE_KEY,JSON.stringify(snap));lastStableSave=snap;updateSaveUI();return true}catch(e){console.warn("AFTERFALL save failed",e);return false}}
 function saveProgress(manual=false){
  if(!isStableForSave()){
   if(lastStableSave)writeSave(lastStableSave);
   if(manual)showSaveToast("Saved to just before this conversation.");
   return;
  }
  writeSave(serializableGameState());
  if(manual)showSaveToast("Progress saved.");
 }
 function scheduleAutosave(){clearTimeout(autosaveTimer);autosaveTimer=setTimeout(()=>{if(isStableForSave())saveProgress(false)},150)}
 function clearSavedGame(){try{localStorage.removeItem(AFTERFALL_SAVE_KEY)}catch(e){} lastStableSave=null;updateSaveUI()}
 
 function restoreSavedGame(data){
  if(!data||data.version!==1)return false;
  try{
   const s=data.S||{};
   S={...S,...s,intel:(s.intel||[]).map(x=>({...x})),choices:[],keys:{}};
   proIndex=Number(data.proIndex||0);nextTarget=data.nextTarget||null;quickReadStage=Number(data.quickReadStage||0);
   triageState={inspected:new Set(data.triageState?.inspected||[]),selected:data.triageState?.selected||null,
                tabs:{review:"Abstract",vale:"Abstract",network:"Abstract",...(data.triageState?.tabs||{})}};
   const ui=data.ui||{};
   if(q("#chapter")&&ui.chapter)q("#chapter").textContent=ui.chapter;
   if(q("#objective")&&ui.objective)q("#objective").textContent=ui.objective;
   if(q("#model")&&ui.model)q("#model").textContent=ui.model;
   if(q("#nextLabel")&&ui.nextLabel)q("#nextLabel").textContent=ui.nextLabel;
   [1,2,3,4].forEach((i,j)=>{const el=q("#path"+i);if(!el)return;if(ui.path?.[j])el.textContent=ui.path[j];el.classList.toggle("now",!!ui.pathNow?.[j])});
   if(q("#intelBtn")&&ui.intelBtn)q("#intelBtn").textContent=ui.intelBtn;
   if(q("#intelList"))q("#intelList").innerHTML=ui.intelList||"";
   qa("#campaign .lesson").forEach((el,i)=>{if(ui.lessonClasses?.[i])el.className=ui.lessonClasses[i]});
   if(q("#campaignProgress")){if(ui.campaignProgress)q("#campaignProgress").setAttribute("style",ui.campaignProgress);else q("#campaignProgress").removeAttribute("style")}
   ["mira","lab","library","comms"].forEach(id=>{const el=q("#"+id);if(el)el.classList.toggle("locked",!!ui.locked?.[id])});
   ["prologue","characterSelect","quickRead","beamTriage","reader","story","decision","dialogue","intel"].forEach(id=>q("#"+id)?.classList.add("hidden"));
 
   const screen=data.screen||{};
   if(screen.prologue){renderPrologue();q("#prologue").classList.remove("hidden")}
   else if(screen.characterSelect){q("#characterSelect").classList.remove("hidden");if(S.playerChar)chooseCharacter(S.playerChar)}
   else if(screen.quickRead){renderQuickRead();q("#quickRead").classList.remove("hidden")}
   else if(screen.triage){renderTriage();q("#beamTriage").classList.remove("hidden")}
   else if(screen.anatomy){
    anatomyStep=Number(screen.anatomyStep||0);
    anatomyMode=screen.anatomyMode||"learn";
    anatomySeen=new Set(screen.anatomySeen||[]);
    anatomyRevealed=new Set(screen.anatomyRevealed||[]);
    q("#articleAnatomy").classList.remove("hidden");
    renderArticleAnatomy();
    anatomySeen.forEach(markAnatomySectionSeen);
    applyAnatomyAnswerReveals();
   }
   else if(screen.reader){
    const savedStage=S.stage,savedSection=S.currentSection||"Abstract",savedPaper=S.paper||"vale";
    openPaper(savedPaper,savedSection);S.stage=savedStage;S.currentSection=savedSection;
    q("#paper").innerHTML=`<div class="title">${papers[savedPaper].title}</div><div class="authors">${papers[savedPaper].authors}</div><div class="paper">${papers[savedPaper].sections[savedSection]}</div>`;
    readerMission();
   }
   else if(screen.story){if(S.playerBriefStep!==null&&S.playerBriefStep!==undefined)renderPlayerBriefing();else{q("#story").innerHTML=screen.storyHTML||"";q("#story").classList.remove("hidden")}}
   else if(screen.decision){q("#decision").innerHTML=screen.decisionHTML||"";q("#decision").classList.remove("hidden")}
   else renderFirstPerson();
 
   if(S.playerChar&&q("#player"))q("#player").className=`char-${S.playerChar}`;
   const restoredOverlay=screen.prologue||screen.characterSelect||screen.quickRead||screen.triage||screen.anatomy||screen.reader||screen.story||screen.decision;
   if(!restoredOverlay)renderFirstPerson();
   if(S.annexEscapeActive)renderAnnexEscape();else clearAnnexEscapeUI();
   qa(".hot").forEach(x=>x.classList.remove("current"));if(nextTarget&&q("#"+nextTarget))q("#"+nextTarget).classList.add("current");
   if(typeof syncWorldPrompts==="function")syncWorldPrompts();
   /* A browser reload cannot safely preserve callback-bearing story history.
      Treat the restored screen as a new navigation boundary. */
   screenBackStack.length=0;
   screenForwardStack.length=0;
   resumedNavigationBoundary=true;
 
   /* Capture only after the saved overlay/world state has been fully rebuilt.
      This is the canonical first Back destination for the resumed session. */
   resumedAnchorSnapshot=captureScreen();
   updateHistoryControls();
 
   lastStableSave=data;updateSaveUI();renderInventoryCounts();showSaveToast("Saved game resumed.");return true;
  }catch(e){console.error("AFTERFALL restore failed",e);return false}
 }
 
 function showSaveToast(message){
  let toast=q("#saveToast");if(!toast){toast=document.createElement("div");toast.id="saveToast";document.body.appendChild(toast)}
  toast.textContent=message;toast.classList.add("show");clearTimeout(toast._timer);toast._timer=setTimeout(()=>toast.classList.remove("show"),1800);
 }
 function updateSaveUI(){const r=q("#resumeGameBtn"),e=q("#eraseSaveBtn");if(r)r.disabled=!hasSavedGame();if(e)e.disabled=!hasSavedGame()}
 function installSaveUI(){
   const saveButton=q("#saveProgressBtn");
   if(saveButton)saveButton.onclick=()=>saveProgress(true);
 
   let resumePanel=q("#resumePanel");
   if(!resumePanel){
     resumePanel=document.createElement("div");
     resumePanel.id="resumePanel";
     resumePanel.innerHTML=`
       <div class="resume-card">
         <div class="resume-kicker">AFTERFALL</div>
         <h2>Continue your investigation?</h2>
         <p>Your progress is saved in this browser.</p>
         <button id="resumeGameBtn" class="resume-primary">Resume Game</button>
         <button id="newGameBtn">Start New Game</button>
         <button id="eraseSaveBtn">Erase Saved Progress</button>
       </div>`;
     document.body.appendChild(resumePanel);
   }
 
   q("#resumeGameBtn").onclick=()=>{
     const data=readSavedGame();
     if(data){
       restoringScreenHistory=true;
       q("#resumePanel").classList.add("hidden");
       const restored=restoreSavedGame(data);
       restoringScreenHistory=false;
       updateHistoryControls();
       if(!restored)showSaveToast("Saved game could not be resumed.");
     }
   };
   q("#newGameBtn").onclick=()=>{
     resumedAnchorSnapshot=null;
     resumedNavigationBoundary=false;
     screenBackStack.length=0;
     screenForwardStack.length=0;
     updateHistoryControls();
     q("#resumePanel").classList.add("hidden");
   };
   q("#eraseSaveBtn").onclick=()=>{
     if(confirm("Erase saved AFTERFALL progress on this browser?")){
       clearSavedGame();
       q("#resumePanel").classList.add("hidden");
       location.reload();
     }
   };
 
   if(!hasSavedGame())q("#resumePanel").classList.add("hidden");
   updateSaveUI();
 }
 document.addEventListener("click",()=>setTimeout(scheduleAutosave,0),true);
 document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden"&&isStableForSave())saveProgress(false)});
 window.addEventListener("pagehide",()=>{if(isStableForSave())saveProgress(false)});
 
 
 /* === OVERLAY / HOTSPOT VISIBILITY SYNC === */
 function syncWorldPrompts(){
   const overlayOpen =
     !q("#dialogue").classList.contains("hidden") ||
     !q("#reader").classList.contains("hidden") ||
     !q("#quickRead").classList.contains("hidden") ||
     !q("#beamTriage").classList.contains("hidden") ||
     !q("#story").classList.contains("hidden") ||
     !q("#decision").classList.contains("hidden") ||
     !q("#intel").classList.contains("hidden") ||
     !q("#characterSelect").classList.contains("hidden") ||
     !q("#prologue").classList.contains("hidden");
 
   q("#world").classList.toggle("overlay-open", overlayOpen);
 }
 
 /* Keep prompt visibility synchronized after every click-driven state change. */
 document.addEventListener("click", ()=>{
   setTimeout(syncWorldPrompts, 0);
 }, true);
 
 /* Also run after restoring Back/Forward history. */
 setTimeout(syncWorldPrompts, 0);
 
 
 installSaveUI();
 installInventoryUI();
 installArticleAnatomy();
 if(isStableForSave())lastStableSave=serializableGameState();
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 