import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const palette = ['#5d8ee8','#ed7b6d','#6ac7a1','#e2ad57','#9b7add','#46b7c8']

function labelSprite(text, color='#19253b') {
  const canvas=document.createElement('canvas'); canvas.width=512; canvas.height=96
  const ctx=canvas.getContext('2d'); ctx.fillStyle=color; ctx.roundRect(4,12,504,70,14); ctx.fill()
  ctx.fillStyle='#ffffff'; ctx.font='bold 34px system-ui'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(text,256,48)
  const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(canvas),transparent:true,depthTest:false})); sprite.scale.set(1.7,.32,1); return sprite
}

function box(scene, size, pos, color, opts={}) { const m=new THREE.Mesh(new THREE.BoxGeometry(...size),new THREE.MeshStandardMaterial({color,roughness:.72,metalness:opts.metalness||0})); m.position.set(...pos); if(opts.rotation)m.rotation.set(...opts.rotation); m.castShadow=true;m.receiveShadow=true;scene.add(m); return m }

function desk(scene,x,z,color='#c68d60'){ box(scene,[1.25,.12,.62],[x,.72,z],color); box(scene,[.08,.7,.08],[x-.48,.35,z-.2],'#8e6b56'); box(scene,[.08,.7,.08],[x+.48,.35,z-.2],'#8e6b56'); box(scene,[.08,.7,.08],[x-.48,.35,z+.2],'#8e6b56'); box(scene,[.08,.7,.08],[x+.48,.35,z+.2],'#8e6b56'); box(scene,[.62,.42,.06],[x,.98,z-.2],'#344d7a',{metalness:.25}); box(scene,[.52,.3,.02],[x,.98,z-.16],'#5bd0ce') }

function plant(scene,x,z){ const pot=box(scene,[.25,.22,.25],[x,.22,z],'#e7a56c'); const stem=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,.5,8),new THREE.MeshStandardMaterial({color:'#5c9e6d'})); stem.position.set(x,.55,z);scene.add(stem); for(let i=0;i<4;i++){const leaf=new THREE.Mesh(new THREE.SphereGeometry(.13,8,6),new THREE.MeshStandardMaterial({color:i%2?'#65b978':'#4e9968'}));leaf.scale.set(.7,.35,1);leaf.position.set(x+(i-1.5)*.09,.78,z+(i%2-.5)*.08);scene.add(leaf)} }

export default function ThreeOffice({agents, chosen, selected, setSelected, paused, setPaused, speed, setSpeed, progress, officeTime, setReportOpen, reportOpen, reportsCount, reports, filter, setFilter, activeReport, setActiveReport}) {
  const mount=useRef(null), groups=useRef(new Map())
  useEffect(()=>{
    const el=mount.current; const scene=new THREE.Scene(); scene.background=new THREE.Color('#15233b')
    const camera=new THREE.OrthographicCamera(-12,12,8,-8,.1,100); camera.position.set(15,16,15); camera.lookAt(0,0,0)
    const renderer=new THREE.WebGLRenderer({antialias:true}); renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap; el.appendChild(renderer.domElement)
    const controls=new OrbitControls(camera,renderer.domElement); controls.enableDamping=true; controls.enablePan=false; controls.minZoom=1; controls.maxZoom=2.4; controls.zoomSpeed=.6
    scene.add(new THREE.HemisphereLight('#ffffff','#5c6f8d',2)); const key=new THREE.DirectionalLight('#fff5dc',3.2); key.position.set(5,15,8); key.castShadow=true; key.shadow.mapSize.set(2048,2048); scene.add(key)
    box(scene,[20,.35,13],[0,-.2,0],'#d9d7cf'); box(scene,[19.5,.08,12.5],[0,.02,0],'#ecebe2')
    // perimeter walls and glass dividers
    box(scene,[20,2,.25],[0,1,-6.15],'#d7d8d2'); box(scene,[.25,2,12],[9.9,1,0],'#d7d8d2'); box(scene,[.25,1.6,5],[-9.9,.8,3.6],'#c7ccd0'); box(scene,[.25,1.6,4],[-9.9,.8,-3.8],'#c7ccd0')
    box(scene,[.05,1.35,8],[2.2,.7,-2.1],'#c5d5de',{metalness:.1}); box(scene,[.05,1.35,8],[2.2,.7,2.1],'#c5d5de',{metalness:.1})
    // team workstations
    const spots=[[-6,-3],[-3,-3],[0,-3],[5,-3],[-6,1],[-3,1],[0,1],[5,1],[-5,4],[-1,4],[3,4]]
    agents.forEach((a,i)=>{const [x,z]=spots[i%spots.length];desk(scene,x,z,a.color);const g=new THREE.Group();const body=new THREE.Mesh(new THREE.CapsuleGeometry(.18,.42,4,8),new THREE.MeshStandardMaterial({color:a.color}));body.position.y=.85;body.castShadow=true;g.add(body);const head=new THREE.Mesh(new THREE.SphereGeometry(.2,12,8),new THREE.MeshStandardMaterial({color:'#efb58d'}));head.position.y=1.28;head.castShadow=true;g.add(head);const hair=new THREE.Mesh(new THREE.SphereGeometry(.21,10,6),new THREE.MeshStandardMaterial({color:'#3b3044'}));hair.scale.y=.45;hair.position.set(0,1.43,0);g.add(hair);g.position.set(x,.05,z+.62);g.userData={agentId:a.id,home:[x,z]};scene.add(g);const tag=labelSprite(a.name,a.id===selected?'#ed7665':'#1d2b43');tag.position.set(x,1.85,z+.62);scene.add(tag);g.userData.tag=tag;groups.current.set(a.id,g)})
    // meeting table, pantry and studio objects
    const table=new THREE.Mesh(new THREE.CylinderGeometry(1.45,1.45,.18,32),new THREE.MeshStandardMaterial({color:'#c78f60'}));table.position.set(6, .66,2.8);table.castShadow=true;scene.add(table); for(let i=0;i<5;i++){const a=i*Math.PI*2/5;box(scene,[.42,.48,.42],[6+Math.cos(a)*1.9,.32,2.8+Math.sin(a)*1.9],'#687da8')}
    box(scene,[2.5,.35,1.4],[-6,.17,4.5],'#d6a06e'); box(scene,[2.1,.12,1.1],[-6,.38,4.5],'#e7be8a'); plant(scene,-7.6,4.7); plant(scene,7.8,-4.8); plant(scene,8.2,4.2)
    box(scene,[2.4,1.2,.12],[-5.8,1.1,-5.9],'#25385c'); box(scene,[2.1,.75,.04],[-5.8,1.1,-5.82],'#60d7c8'); const sign=labelSprite('HWASEONG AI OFFICE','#25385c'); sign.position.set(0,1.65,-5.95);sign.scale.set(3,.5,1);scene.add(sign)
    const resize=()=>{const w=el.clientWidth,h=el.clientHeight;camera.left=-12*w/h;camera.right=12*w/h;camera.top=8;camera.bottom=-8;camera.updateProjectionMatrix();renderer.setSize(w,h)}; resize(); window.addEventListener('resize',resize)
    let raf; const animate=()=>{raf=requestAnimationFrame(animate);controls.update();groups.current.forEach(g=>{const a=agents.find(x=>x.id===g.userData.agentId);if(!a)return;const tx=(a.x-50)/5.3,tz=(a.y-50)/5.3;g.position.x+=(tx-g.position.x)*.08;g.position.z+=(tz-g.position.z)*.08;g.userData.tag.position.x=g.position.x;g.userData.tag.position.z=g.position.z;g.userData.tag.material.opacity=a.id===selected?1:.82});renderer.render(scene,camera)}; animate()
    return()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize);controls.dispose();renderer.dispose();el.removeChild(renderer.domElement);groups.current.clear()}
  },[])
  useEffect(()=>{groups.current.forEach(g=>{const a=agents.find(x=>x.id===g.userData.agentId);if(a)g.userData.tag.material.map.needsUpdate=true})},[agents,selected])
  const filtered=filter==='전체'?reports:reports.filter(r=>r.type===filter)
  return <main className="three-office"><header className="three-header"><div className="three-brand"><b>HWASEONG AI OFFICE</b><small>CREATIVE OPERATIONS / LIVE SIMULATION</small></div><div className="three-agents">{agents.slice(0,7).map(a=><button key={a.id} onClick={()=>setSelected(a.id)} className={selected===a.id?'active':''}><i style={{background:a.color}}/>{a.name}</button>)}</div><div className="three-live"><i/>{officeTime}</div></header><section className="three-stage"><div ref={mount} className="three-canvas"/><aside className="three-inspector"><small>SELECTED AGENT</small><h2>{chosen.name}</h2><p>{chosen.role}</p><strong>{chosen.task}</strong><span>● 작업 중</span><button onClick={()=>setReportOpen(true)}>업무보고 {reportsCount}</button></aside><div className="three-toast">{chosen.bubble||'에이전트들이 각자의 책상에서 작업하고 있습니다.'}</div></section><footer className="three-footer"><button onClick={()=>setPaused(!paused)}>{paused?'재생':'일시정지'}</button>{[1,2,4].map(n=><button key={n} className={speed===n?'active':''} onClick={()=>setSpeed(n)}>{n}×</button>)}<div><small>PROJECT PROGRESS</small><b>{progress}%</b><i><em style={{width:`${progress}%`}}/></i></div><span>🎧 여기서 행복해 · Melody Sketch 01</span></footer>{reportOpen&&<div className="three-modal" onMouseDown={e=>e.target===e.currentTarget&&setReportOpen(false)}><section><header><b>업무보고 아카이브</b><button onClick={()=>setReportOpen(false)}>×</button></header><nav>{['전체','전략','브리프','가사','평가','유사성','기술','음원'].map(x=><button key={x} className={filter===x?'active':''} onClick={()=>setFilter(x)}>{x}</button>)}</nav><div className="three-reports"><div>{filtered.map(r=><button key={r.id} className={activeReport?.id===r.id?'active':''} onClick={()=>setActiveReport(r)}><b>{r.type}</b><strong>{r.title}</strong><small>{r.owner} · {r.status}</small></button>)}</div><article>{activeReport?<><b>{activeReport.team}</b><h2>{activeReport.title}</h2><p>{activeReport.summary}</p><ul>{activeReport.details.map(d=><li key={d}>{d}</li>)}</ul></>:<p>보고서를 선택하세요.</p>}</article></div></section></div>}</main>
}
