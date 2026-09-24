import { useEffect, useMemo, useState } from 'react'
import { Archive, BarChart3, Coffee, FileText, Headphones, Music2, Pause, Play, Radio, Users, Volume2, X } from 'lucide-react'

const rooms = [
  { id:'strategy', label:'STRATEGY LAB', sub:'브랜드 전략 · 리서치', x:2, y:4, w:29, h:29, tone:'teal', shape:'cut' },
  { id:'meeting', label:'MEETING ROOM', sub:'의사결정 · 리뷰', x:35, y:4, w:30, h:29, tone:'amber', shape:'oval' },
  { id:'archive', label:'ORIGINALITY ARCHIVE', sub:'유사성 조사 · 업무보고', x:69, y:4, w:29, h:29, tone:'violet', shape:'arch' },
  { id:'music', label:'MUSIC STUDIO', sub:'작사 · 프로듀싱', x:2, y:37, w:38, h:38, tone:'purple', shape:'studio' },
  { id:'lounge', label:'VINYL LOUNGE', sub:'커피 · 자유 대화', x:44, y:37, w:22, h:38, tone:'orange', shape:'round' },
  { id:'review', label:'A&R LISTENING', sub:'청음 · 독립 평가', x:70, y:37, w:28, h:38, tone:'blue', shape:'cut' },
  { id:'booth', label:'VOCAL BOOTH', sub:'발음 · 가창', x:2, y:79, w:28, h:18, tone:'red', shape:'pill' },
  { id:'mix', label:'MIX DESK', sub:'후반 · 재생 검수', x:34, y:79, w:31, h:18, tone:'green', shape:'notch' },
  { id:'arcade', label:'BREAK ZONE', sub:'게임 · 휴식', x:69, y:79, w:29, h:18, tone:'pink', shape:'round' },
]

const agentsSeed = [
  { id:'lead', name:'제부장', role:'총괄 프로듀서', team:'제작본부', color:'#ff735c', x:34, y:15, home:[34,15], icon:'◆', task:'브리프와 의사결정 통합', hair:'wave', face:'smile', look:'jacket' },
  { id:'brand', name:'동탄온', role:'브랜드 전략가', team:'전략기획팀', color:'#26bdb8', x:48, y:15, home:[48,15], icon:'▤', task:'화성만의 핵심 메시지 정의', hair:'bob', face:'bright', look:'vest' },
  { id:'research', name:'우음표', role:'지역·청중 리서처', team:'전략기획팀', color:'#5bc58c', x:61, y:15, home:[61,15], icon:'⌕', task:'지역 근거와 청취 상황 조사', hair:'short', face:'calm', look:'cardigan' },
  { id:'producer', name:'전곡믹스', role:'뮤직 프로듀서', team:'음악개발팀', color:'#8c6be8', x:34, y:37, home:[34,37], icon:'♫', task:'세 가지 음악 방향 설계', hair:'spike', face:'focus', look:'hoodie' },
  { id:'writer', name:'송산송', role:'작사·탑라이너', team:'음악개발팀', color:'#f5b83d', x:48, y:37, home:[48,37], icon:'✎', task:'첫 5초 후렴 후보 작성', hair:'long', face:'smile', look:'knit' },
  { id:'vocal', name:'햇살도레미', role:'가창·발음 디렉터', team:'음악품질팀', color:'#f15f7a', x:61, y:37, home:[61,37], icon:'●', task:'화성특례시 발음과 호흡 검토', hair:'ponytail', face:'sing', look:'scarf' },
  { id:'ar', name:'궁평가', role:'A&R 디렉터', team:'독립평가팀', color:'#4d98ef', x:34, y:59, home:[34,59], icon:'A', task:'발전시킬 데모 후보 선별', hair:'part', face:'calm', look:'suit' },
  { id:'critic', name:'융건평', role:'대중음악 평론가', team:'독립평가팀', color:'#8994a8', x:48, y:59, home:[48,59], icon:'★', task:'개성과 장르 완성도 비평', hair:'curl', face:'focus', look:'coat' },
  { id:'originality', name:'고정음', role:'독창성·유사성 리서처', team:'권리검증팀', color:'#ec6a45', x:61, y:59, home:[61,59], icon:'◎', task:'가사·제목·콘셉트 선행작 조사', hair:'cap', face:'focus', look:'utility' },
  { id:'audio', name:'누에비트', role:'믹싱·QA 엔지니어', team:'후반제작팀', color:'#55bd73', x:40, y:82, home:[40,82], icon:'≋', task:'길이·음량·재생환경 검수', hair:'buzz', face:'bright', look:'tee' },
  { id:'visual', name:'루나픽', role:'아트·납품 디렉터', team:'후반제작팀', color:'#ee70b0', x:56, y:82, home:[56,82], icon:'▣', task:'앨범아트와 제출 패키지 설계', hair:'bun', face:'smile', look:'blazer' },
]

const reports = [
  { id:1, type:'전략', team:'전략기획팀', title:'CM송 제작 운영안 v2', status:'승인', owner:'제부장 · 동탄온', date:'09.22', summary:'음반사의 A&R 체계와 광고음악 제작사의 브랜드 전략을 결합한 운영안입니다.', details:['브랜드 전략과 A&R의 판단권을 분리','3개 콘셉트 → 6개 데모 → 상위 2안 개선','Suno 생성은 단일 운영자가 담당','실제 청취 결과와 AI 의견을 구분'] },
  { id:2, type:'브리프', team:'전략기획팀', title:'수상 목표 크리에이티브 브리프', status:'검토 중', owner:'동탄온 · 우음표', date:'09.22', summary:'한 번 듣고 화성을 기억하며 후렴을 따라 부를 수 있는 1분 이하 브랜드 음악.', details:['핵심 주제: 모두의 행복, 더 큰 화성','도시명과 후렴의 결합 기억','생활 공감 / 풍경 연결 / 주고받는 후렴 탐색','화성해 표현 제외'] },
  { id:3, type:'가사', team:'음악개발팀', title:'후렴 후보 비교 메모', status:'초안', owner:'송산송 · 전곡믹스', date:'09.22', summary:'기존 ‘여기서 행복해’는 확정안이 아니라 친숙함 비교용 기준안으로 재검토합니다.', details:['후렴은 첫 5초 안에 등장','화성 앞에 짧은 쉼을 두어 도시명 강조','읽기 좋은 문장과 부르기 좋은 음절을 함께 검토','각 콘셉트별 후렴 2개 개발 예정'] },
  { id:4, type:'평가', team:'독립평가팀', title:'독립 데모 평가 규칙', status:'승인', owner:'궁평가 · 융건평', date:'09.22', summary:'후보를 익명화하고 A&R·평론·광고효과를 서로 다른 질문으로 평가합니다.', details:['제작자 추천순위 비공개','문제 구간 → 근거 → 수정 제안 → 손실 가능성','청취 불가 시 음악 평가는 보류','8~12명 실제 청취 테스트 제안'] },
  { id:5, type:'기술', team:'제작운영팀', title:'Suno·브라우저 준비 상태', status:'대기', owner:'제부장', date:'09.22', summary:'Chrome DevTools 연결은 설치·기본 실행을 확인했으며 Suno 로그인과 생성은 아직 검증 전입니다.', details:['로그인·생성·다운로드 경로 확인 필요','생성 전 크레딧 한도 확정','가사·스타일·모델·결과 URL 기록','중복 클릭 방지'] },
  { id:6, type:'음원', team:'음악개발팀', title:'여기서 행복해 — 멜로디 스케치', status:'비교용', owner:'전곡믹스', date:'09.22', summary:'112 BPM, C Major, 53초 길이의 기초 합성 시안. 최종 출품용 음원이 아닙니다.', details:['리드 악기가 가창 선율을 연주','끝에 공식 슬로건 내레이션','Suno 보컬 데모와 비교 예정','파일: here_happy_hwaseong_demo.mp3'], audio:true },
  { id:7, type:'유사성', team:'권리검증팀', title:'독창성·선행작 조사 계획', status:'조사 전', owner:'고정음', date:'09.22', summary:'선정 전 후보마다 제목·핵심 가사·후렴 문구·멜로디·광고 콘셉트의 유사성을 단계별로 조사합니다.', details:['가사 핵심구절과 제목을 정확검색·변형검색','음원 인식·멜로디 유사성 도구로 후보 확인','국내외 도시·관광 CM 및 상업음악 사례 조사','AI 생성 이력과 참고자료·검색일·URL 기록','검색 결과만으로 비표절을 보증하지 않으며 위험 후보는 전문가 확인'], caution:true },
]

const conversations = [
  { from:'writer', to:'producer', text:'후렴의 “화성” 앞을 한 박자 비워볼게요.', reply:'좋아요, 그 빈칸에 박수를 넣어볼게요.', target:[22,58] },
  { from:'critic', to:'ar', text:'친근함과 도시 고유성을 따로 평가하죠.', reply:'점수표에 기억성과 독창성을 나눠 적겠습니다.', target:[84,59] },
  { from:'brand', to:'research', text:'명소 나열보다 시민의 장면을 찾아주세요.', reply:'동탄호수공원 산책 장면부터 확인할게요.', target:[18,22] },
  { from:'vocal', to:'writer', text:'받침이 몰리지 않게 음절을 다시 볼게요.', reply:'부르기 쉬운 모음으로 정리해둘게요.', target:[23,72] },
  { from:'audio', to:'producer', text:'휴대폰에서도 도시명이 들려야 해요.', reply:'저역을 비우고 보컬을 앞으로 세울게요.', target:[37,72] },
  { from:'visual', to:'brand', text:'화성의 색을 앨범아트 언어로 옮길게요.', reply:'주황빛 노을과 민트 포인트를 연결해요.', target:[59,49] },
  { from:'originality', to:'writer', text:'핵심 후렴을 선행 가사와 교차검색할게요.', reply:'검색어 변형까지 기록해서 공유하겠습니다.', target:[58,29] },
  { from:'lead', to:'brand', text:'이번 안의 한 문장 목표를 말해볼까요?', reply:'한 번 듣고 화성을 떠올리게 하겠습니다.', target:[43,22] },
  { from:'research', to:'brand', text:'시민 인터뷰에서 “주말마다 만나요”가 반복돼요.', reply:'그 말을 후렴의 생활 언어로 써볼게요.', target:[48,22] },
  { from:'producer', to:'writer', text:'템포는 112 BPM이면 라디오에 잘 붙어요.', reply:'그 박자에 맞춰 다섯 음절 훅을 만들게요.', target:[50,49] },
  { from:'ar', to:'critic', text:'데모 A와 B를 익명으로 바꿔 들려드릴게요.', reply:'첫인상과 재청취 의향을 따로 적겠습니다.', target:[52,59] },
  { from:'writer', to:'vocal', text:'“여기”에서 살짝 올라가면 기억에 남아요.', reply:'호흡 위치를 표시해서 녹음해볼게요.', target:[61,49] },
  { from:'brand', to:'originality', text:'슬로건 후보 세 개의 충돌 가능성을 봐주세요.', reply:'상표·광고 문구까지 함께 확인하겠습니다.', target:[63,59] },
  { from:'audio', to:'visual', text:'최종 영상은 53초 기준으로 맞춰주세요.', reply:'파형과 자막 타이밍을 같은 길이로 잡을게요.', target:[56,87] },
  { from:'visual', to:'lead', text:'출품 썸네일은 노을과 사람 실루엣으로 갑니다.', reply:'노래의 따뜻함이 먼저 보이면 좋겠어요.', target:[50,27] },
  { from:'critic', to:'writer', text:'도시 이름을 반복해도 과하지 않은지 들어볼게요.', reply:'두 번째 반복은 화음으로만 남겨볼게요.', target:[48,49] },
  { from:'vocal', to:'producer', text:'“행복”의 ㅎ 발음이 약간 묻혀요.', reply:'반주를 한 박자 줄여서 공간을 만들죠.', target:[42,47] },
  { from:'originality', to:'ar', text:'유사 후보 두 건은 위험도를 표시해두었습니다.', reply:'안전한 후보부터 청취 테스트에 올리죠.', target:[84,59] },
  { from:'research', to:'lead', text:'가족 단위 청취자도 따라 부를 수 있어야 해요.', reply:'세대가 함께 부르는 콜앤리스폰스로 가겠습니다.', target:[50,27] },
  { from:'producer', to:'audio', text:'후렴 끝에 짧은 효과음을 넣어볼까요?', reply:'재생 환경별로 튀지 않는지 먼저 검수할게요.', target:[45,87] },
  { from:'lead', to:'all', text:'좋아요. 다음 라운드는 이 훅으로 출발합니다.', reply:'각자 결과물을 보고서에 연결해둘게요.', target:[50,27] },
]

const meetingLines = [
  '안건: 세 가지 콘셉트를 같은 조건으로 비교해요.',
  '결론: “여기서 행복해”도 기준안으로 다시 경쟁합니다.',
  '다음: 첫 5초 후렴 여섯 개를 먼저 검토해요.',
  '브랜드: 화성의 일상 장면을 한 컷으로 잡아주세요.',
  '작사: 입에 붙는 다섯 음절 훅부터 고를게요.',
  '프로듀서: 라디오에서 첫 박자가 바로 들려야 합니다.',
  'A&R: 익명 청취 결과를 다음 회의에 가져오겠습니다.',
  '품질: 휴대폰 스피커에서도 도시명이 선명해야 해요.',
  '결정: 오늘은 후렴 두 안을 녹음실로 넘깁니다.',
]

function PixelPerson({ agent, selected, onClick }) {
  return <button className={`person ${selected?'selected':''} ${agent.bubble?'talking':'working'}`} style={{left:`${agent.x}%`,top:`${agent.y}%`,'--c':agent.color}} onClick={onClick} aria-label={`${agent.name} ${agent.role}`}>
    {agent.bubble && <span className="bubble">{agent.bubble}</span>}
    <span className="shadow"/><span className={`body ${agent.hair} ${agent.face} ${agent.look}`}><i className="hair"/><i className="ear"/><i className="face"><b/><em/><strong/></i><i className="shirt">{agent.icon}</i><i className="arms"/><i className="legs"/></span>
    <span className="nameplate">{agent.name}</span>
  </button>
}

function Furniture({room}) {
  if(room.id==='meeting') return <><div className="meeting-table"><span/><span/><span/><span/></div><div className="screen">AGENDA<br/><b>HOOK REVIEW</b></div></>
  if(room.id==='music') return <><div className="piano"><i/><i/><i/><i/><i/><i/><i/><i/></div><div className="desk daw">▮▮▰▰<small>WAVE 01</small></div><div className="guitar">♪</div></>
  if(room.id==='review') return <><div className="speaker">●<br/>◉</div><div className="listen-desk"><Headphones size={18}/><b>A / B / C</b></div></>
  if(room.id==='archive') return <><div className="shelf">{[1,2,3,4,5,6,7,8,9,10].map(n=><i key={n}/>)}</div><Archive className="room-icon"/></>
  if(room.id==='strategy') return <><div className="map-board"><b>HWASEONG</b><span>SEA · CITY · PEOPLE</span></div><div className="desk papers">▤　▥</div></>
  if(room.id==='lounge') return <><div className="vinyl">●</div><div className="sofa">▰</div><div className="coffee"><Coffee size={16}/></div></>
  if(room.id==='booth') return <><div className="mic">●<br/>│</div><div className="soundproof">/// /// ///</div></>
  if(room.id==='mix') return <><div className="console">≋≋≋≋<br/>▪▪▪▪▪▪</div><div className="tiny-speakers">●　　●</div></>
  return <><div className="arcade-machine">HI<br/>SCORE</div><div className="plant">♣</div></>
}

function Workstation({agent}) {
  return <div className="workstation" style={{left:`${agent.home[0]}%`,top:`${agent.home[1]}%`}} aria-label={`${agent.name} 개인 작업대`}>
    <div className="monitor"><i/><b>{agent.icon}</b></div><div className="desk-top" style={{background:agent.color}}><span/><em/></div><div className="chair"/><small>{agent.name}</small>
  </div>
}

function RoomFeatures({room}) {
  return <>
    <div className="room-door"><span>OPEN</span></div><div className="room-window"><i/><i/><i/></div>
    {room.id==='meeting'&&<><div className="whiteboard"><b>HOOK REVIEW</b><span>① 기억성　② 발음　③ 온도</span></div><div className="slide-screen"><small>PROJECT 01</small><b>화성의 한 박자</b><i/><i/><i/></div></>}
    {room.id==='music'&&<><div className="on-air">● ON AIR</div><div className="acoustic-panels"><i/><i/><i/><i/></div></>}
    {room.id==='lounge'&&<div className="pantry-board"><b>PANTRY MENU</b><span>COFFEE　TEA　IDEA</span></div>}
    {room.id==='booth'&&<div className="booth-window"><b>REC</b><span>TAKE 03</span></div>}
    {room.id==='review'&&<div className="score-board"><b>A / B LISTENING</b><span>VOICE　HOOK　CITY</span></div>}
  </>
}

function JourneyView({agents, chosen, selected, setSelected, paused, setPaused, speed, setSpeed, progress, officeTime, setReportOpen, reportOpen, reports, filter, setFilter, activeReport, setActiveReport}) {
  const spots=[['제부도','브랜드 전략','brand','9%','24%'],['전곡항','음악 프로듀싱','producer','30%','57%'],['송산포도','후렴·가사','writer','50%','73%'],['궁평항','A&R 청음','ar','73%','53%'],['융건릉','대중 평가','critic','86%','27%'],['누에섬','믹싱·QA','audio','72%','78%'],['동탄','청중 리서치','research','28%','22%']]
  const steps=[['01','브리프','전략'],['02','가사','후렴'],['03','작곡','Suno'],['04','청음','A&R'],['05','검증','출품']]
  const filtered=filter==='전체'?reports:reports.filter(r=>r.type===filter)
  return <main className="journey-app"><header className="journey-header"><div className="journey-brand"><span>♫</span><div><b>HWASEONG / SOUND JOURNEY</b><small>AI CM SONG PRODUCTION MAP</small></div></div><div className="journey-clock"><i/> LIVE CREATIVE SESSION <strong>{officeTime}</strong></div></header><section className="journey-main"><aside className="journey-team"><div className="journey-kicker">CREATIVE CREW / {agents.length}</div>{agents.map(a=><button key={a.id} className={selected===a.id?'active':''} onClick={()=>setSelected(a.id)}><i style={{background:a.color}}>{a.icon}</i><span><b>{a.name}</b><small>{a.role}</small></span><em>{a.bubble?'대화':'작업'}</em></button>)}</aside><section className="journey-stage"><div className="journey-title"><span>HWASEONG CREATIVE MAP</span><h1>도시에서 시작해, 노래로 완성되는 여정</h1><p>화성의 장소와 사람을 연결해 하나의 CM송을 만듭니다.</p></div><div className="map-canvas"><div className="map-sun">☼</div><div className="map-moon">☾</div><div className="city-silhouette"/><svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M9 24 C24 18 24 49 30 57 S43 67 50 73 S64 55 73 53 S82 33 86 27"/><path d="M30 57 C42 43 61 40 73 53"/><path d="M50 73 C56 81 65 82 72 78"/></svg>{spots.map(([name,role,id,left,top])=>{const a=agents.find(x=>x.id===id);return <button key={id} className={`map-node ${selected===id?'active':''}`} style={{left,top}} onClick={()=>setSelected(id)}><span className="node-orbit"><i style={{background:a?.color}}>{a?.icon}</i></span><b>{name}</b><small>{role}</small></button>})}<div className="song-core"><span>♫</span><b>HERE, HAPPY<br/><em>HWASEONG CM SONG</em></b><i/><i/><i/><i/><i/><small>MASTER WAVEFORM</small></div><div className="map-legend"><span><i/>아이디어</span><span><i/>제작</span><span><i/>검증</span></div></div><div className="journey-timeline"><div className="timeline-head"><b>SONG PRODUCTION TIMELINE</b><span>PROJECT {progress}%</span></div><div className="timeline-track">{steps.map(([num,title,sub],i)=><button key={num} className={i<3?'done':''}><i>{num}</i><b>{title}</b><small>{sub}</small></button>)}</div></div><div className="journey-controls"><button onClick={()=>setPaused(!paused)}>{paused?'재생':'일시정지'}</button>{[1,2,4].map(n=><button key={n} className={speed===n?'active':''} onClick={()=>setSpeed(n)}>{n}×</button>)}<button className="report-open" onClick={()=>setReportOpen(true)}>업무보고 {reports.length}</button><audio controls src={`${import.meta.env.BASE_URL}here_happy_hwaseong_demo.mp3`}/></div></section><aside className="journey-detail"><div className="detail-kicker">NOW IN THE JOURNEY</div><div className="detail-agent"><i style={{background:chosen.color}}>{chosen.icon}</i><div><small>{chosen.team}</small><h2>{chosen.name}</h2><p>{chosen.role}</p></div></div><div className="detail-focus"><span>CURRENT SCENE</span><b>{chosen.task}</b><p>{chosen.bubble||'다음 제작 결정을 위해 근거와 아이디어를 정리하고 있어요.'}</p></div><div className="detail-card"><span>NEXT HANDOFF</span><b>독립 평가팀으로 데모 전달</b><i>진행 중</i></div><div className="detail-card"><span>SONG SIGNAL</span><div className="mini-wave">{[1,3,2,5,4,7,3,6,2,5,4,7].map((h,i)=><i key={i} style={{height:`${h*4}px`}}/>)}</div><small>112 BPM · C MAJOR · 00:53</small></div></aside></section>{reportOpen&&<div className="journey-modal" onMouseDown={e=>e.target===e.currentTarget&&setReportOpen(false)}><section><header><div><small>PROJECT KNOWLEDGE BASE</small><h2>업무보고 아카이브</h2></div><button onClick={()=>setReportOpen(false)}>×</button></header><nav>{['전체','전략','브리프','가사','평가','유사성','기술','음원'].map(x=><button key={x} className={filter===x?'active':''} onClick={()=>setFilter(x)}>{x}</button>)}</nav><div className="journey-reports"><div>{filtered.map(r=><button key={r.id} className={activeReport?.id===r.id?'active':''} onClick={()=>setActiveReport(r)}><b>{r.type}</b><strong>{r.title}</strong><small>{r.owner} · {r.status}</small></button>)}</div><article>{activeReport?<><small>{activeReport.team}</small><h2>{activeReport.title}</h2><p>{activeReport.summary}</p><ul>{activeReport.details.map(d=><li key={d}>{d}</li>)}</ul></>:<p>보고서를 선택하세요.</p>}</article></div></section></div>}</main>
}

function OfficeV2({agents, chosen, selected, setSelected, paused, setPaused, speed, setSpeed, progress, officeTime, setReportOpen, reportOpen, activeReport, setActiveReport, filter, setFilter}) {
  const filtered = filter==='전체' ? reports : reports.filter(r=>r.type===filter)
  return <main className="office-v2">
    <header className="v2-header"><div className="v2-logo"><span>H</span><div><b>HWASEONG</b><small>CREATIVE OPERATIONS</small></div></div><nav><button className="active">Studio floor</button><button>Projects <em>01</em></button><button>Knowledge base</button></nav><div className="v2-status"><i/>LIVE SESSION <strong>{officeTime}</strong></div></header>
    <div className="v2-body">
      <aside className="v2-rail"><div className="rail-label">TEAM / {agents.length}</div>{agents.map(a=><button key={a.id} className={selected===a.id?'active':''} onClick={()=>setSelected(a.id)}><span style={{background:a.color}}>{a.icon}</span><div><b>{a.name}</b><small>{a.role}</small></div><i className={a.bubble?'talking':''}/></button>)}<div className="rail-foot">AI CM SONG<br/><b>PRODUCTION 01</b></div></aside>
      <section className="v2-stage"><div className="stage-head"><div><span>AI AGENT OFFICE</span><h1>화성 AI CM송 크리에이티브 캠퍼스</h1><p>전략·작사·녹음·검수 에이전트가 한눈에 보이는 업무 디오라마</p></div><div className="stage-actions"><button onClick={()=>setPaused(!paused)}>{paused?'재생':'일시정지'}</button>{[1,2,4].map(n=><button key={n} className={speed===n?'active':''} onClick={()=>setSpeed(n)}>{n}×</button>)}</div></div><div className="v2-canvas"><div className="ceiling-line"/><div className="hq-building"><span>✦</span><b>화성<br/>AI AGENT<br/><em>OFFICE</em></b><i>OPEN STUDIO</i></div><div className="facility-label meeting-label">MEETING ROOM</div><div className="facility-label pantry-label">PANTRY LOUNGE</div><div className="screen-wall"><span>LIVE MIX</span><b>HWASEONG / CONTROL</b><i/><i/><i/></div><div className="mix-console"><small>MASTER CONSOLE</small><div>{[1,2,3,4,5,6,7,8].map(n=><i key={n}/>)}</div></div>{rooms.map(r=><section key={r.id} className={`v2-room ${r.tone}`} style={{left:`${r.x}%`,top:`${r.y}%`,width:`${r.w}%`,height:`${r.h}%`}}><h2>{r.label}<small>{r.sub}</small></h2><RoomFeatures room={r}/></section>)}<div className="creative-table"><b>COLLAB TABLE</b><span>IDEAS / HOOK / CITY</span></div>{agents.map(a=><Workstation key={`v2-desk-${a.id}`} agent={a}/>)}{agents.map(a=><PixelPerson key={`v2-person-${a.id}`} agent={a} selected={selected===a.id} onClick={()=>setSelected(a.id)}/>)}</div><div className="stage-footer"><div><span>PROJECT PROGRESS</span><b>{progress}%</b><i><em style={{width:`${progress}%`}}/></i></div><button onClick={()=>setReportOpen(true)}><Archive size={15}/> 업무보고 아카이브 <b>{reports.length}</b></button><div className="now-playing"><Radio size={15}/> <span>NOW PLAYING</span> 여기서 행복해 · Melody Sketch 01 <audio controls src={`${import.meta.env.BASE_URL}here_happy_hwaseong_demo.mp3`}/></div></div></section>
      <aside className="v2-inspector"><div className="inspector-title"><span>SELECTED AGENT</span><i>● WORKING</i></div><div className="agent-card"><div className={`portrait ${chosen.hair} ${chosen.face} ${chosen.look}`} style={{'--c':chosen.color}}><i className="portrait-hair"/><i className="portrait-face"><b/><em/><strong/></i><i className="portrait-shirt">{chosen.icon}</i></div><div><small>{chosen.team}</small><h2>{chosen.name}</h2><p>{chosen.role}</p></div></div><div className="insight"><span>CURRENT FOCUS</span><b>{chosen.task}</b><div><i/> 집중 작업 중</div></div><div className="insight"><span>RECENT MESSAGE</span><p>“{conversations.find(c=>c.from===chosen.id)?.text || '팀의 다음 결정을 위해 근거를 정리하고 있어요.'}”</p></div><div className="deliverables"><span>DELIVERABLES</span><b>오늘의 워크플로</b><div className="done">기획 자료 확인 <i>완료</i></div><div className="active">담당 산출물 작성 <i>진행 중</i></div><div>독립 검토 요청</div><div>업무보고 보관</div></div></aside>
    </div>
    {reportOpen&&<div className="v2-modal" onMouseDown={e=>e.target===e.currentTarget&&setReportOpen(false)}><section><header><div><small>PROJECT KNOWLEDGE BASE</small><h2>업무보고 아카이브</h2></div><button onClick={()=>setReportOpen(false)}><X/></button></header><div className="v2-filters">{['전체','전략','브리프','가사','평가','유사성','기술','음원'].map(x=><button className={filter===x?'active':''} onClick={()=>setFilter(x)} key={x}>{x}</button>)}</div><div className="v2-reports">{filtered.map(r=><button key={r.id} className={activeReport?.id===r.id?'active':''} onClick={()=>setActiveReport(r)}><span>{r.type}</span><em>{r.status}</em><h3>{r.title}</h3><p>{r.summary}</p><small>{r.owner} · {r.date}</small></button>)}<aside>{activeReport?<><b>{activeReport.team}</b><h2>{activeReport.title}</h2><p>{activeReport.summary}</p><h4>핵심 기록</h4><ul>{activeReport.details.map(d=><li key={d}>{d}</li>)}</ul></>:<p>보고서를 선택하면 상세 기록이 표시됩니다.</p>}</aside></div></section></div>}
  </main>
}

export default function App(){
  const [agents,setAgents]=useState(agentsSeed)
  const [selected,setSelected]=useState('lead')
  const [paused,setPaused]=useState(false)
  const [speed]=useState(4)
  const [tick,setTick]=useState(0)
  const [reportOpen,setReportOpen]=useState(false)
  const [activeReport,setActiveReport]=useState(null)
  const [filter,setFilter]=useState('전체')

  useEffect(()=>{
    if(paused) return
    const timer=setInterval(()=>setTick(t=>t+1),1000/speed)
    return()=>clearInterval(timer)
  },[paused,speed])

  useEffect(()=>{
    const phase=tick%48
    const convo=conversations[Math.floor(tick/8)%conversations.length]
    setAgents(prev=>prev.map(a=>{
      let tx=a.home[0], ty=a.home[1], bubble=''
      if(phase>=32 && phase<40 && ['lead','brand','producer','ar'].includes(a.id)){
        const seats={lead:[49,17],brand:[43,22],producer:[56,22],ar:[50,27]}; [tx,ty]=seats[a.id]
        const speaker=['lead','brand','producer','ar'].indexOf(a.id)
        bubble=meetingLines[(Math.floor((phase-32)/2)+speaker)%meetingLines.length]
      } else if(phase<32 && (a.id===convo.from || a.id===convo.to || (convo.to==='all' && ['lead','brand','producer','ar'].includes(a.id)))) {
        ;[tx,ty]=a.id===convo.from?[convo.target[0]-2,convo.target[1]]:[convo.target[0]+2,convo.target[1]]
        if(phase%8>1) bubble=a.id===convo.from?convo.text:(convo.reply||'확인했어요. 바로 반영할게요.')
      } else if(phase>=40){
        const breaks={lead:[84,18],brand:[78,49],research:[64,28],producer:[42,47],writer:[78,49],vocal:[64,47],ar:[42,68],critic:[84,52],originality:[64,68],audio:[45,87],visual:[58,87]}; [tx,ty]=breaks[a.id]
        if(a.id==='brand'&&phase<45) bubble='탕비실에서 차 한 잔 마시고 다시 합류할게요.'
        if(a.id==='lead'&&phase>=44) bubble='회의실로 모여 다음 후렴을 결정해요.'
      }
      // Route visitors through door-side gaps and the shared hall instead of
      // cutting diagonally across a room. The office has three horizontal
      // bands and vertical door gaps at roughly x=33 / x=67.
      const band=y=>y<35?0:y<78?1:2, currentBand=band(a.y), targetBand=band(ty)
      const gapFor=(from,to)=>{
        const gaps=targetBand===currentBand?(currentBand===1?[42,68]:[33,67]):[33,67]
        const between=gaps.filter(g=>g>Math.min(from,to)+2&&g<Math.max(from,to)-2)
        return (between.length?between:gaps).reduce((best,g)=>Math.abs(g-from)<Math.abs(best-from)?g:best,gaps[0])
      }
      let next=[tx,ty]
      const trip=Math.hypot(tx-a.home[0],ty-a.home[1])
      if(trip>8){
        const gap=gapFor(a.x,tx)
        const exitY=currentBand===0?35:currentBand===1?77:77
        const entryY=targetBand===0?35:targetBand===1?37:77
        const waypoints=currentBand===targetBand?[[gap,ty]]:[[gap,exitY],[gap,entryY],[tx,ty]]
        for(const waypoint of waypoints){if(Math.hypot(waypoint[0]-a.x,waypoint[1]-a.y)>4){next=waypoint;break}}
      }
      const dx=next[0]-a.x,dy=next[1]-a.y,dist=Math.hypot(dx,dy)
      return {...a,x:dist>.5?a.x+dx*.16:a.x,y:dist>.5?a.y+dy*.16:a.y,bubble}
    }))
  },[tick])

  const chosen=agents.find(a=>a.id===selected)
  const progress=Math.min(34+Math.floor(tick/20),48)
  const officeTime=useMemo(()=>{const m=(9*60+tick*3)%1440; return `${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`},[tick])
  const filtered=filter==='전체'?reports:reports.filter(r=>r.type===filter)

  return <main>
    <header className="topbar">
      <div className="brand"><div className="brand-mark"><Music2 size={20}/></div><div><p>HWASEONG</p><h1>SOUND LAB</h1></div></div>
      <div className="project-status"><span className="live-dot"/> PROJECT 01 <b>화성특례시 AI CM송</b><em>기획·탐색</em></div>
      <div className="clock"><span>DAY 01</span><b>{officeTime}</b></div>
    </header>

    <section className="workspace">
      <aside className="left-panel panel">
        <div className="panel-title"><Users size={15}/> TEAM <span>{agents.length}</span></div>
        <div className="team-list">{agents.map(a=><button key={a.id} className={selected===a.id?'active':''} onClick={()=>setSelected(a.id)}><i style={{background:a.color}}>{a.icon}</i><span><b>{a.name}</b><small>{a.role}</small></span><em>{a.bubble?'대화':'업무'}</em></button>)}</div>
      </aside>

      <div className="world-wrap">
        <div className="world">
          <div className="sunbeam"/><div className="grid"/>
          <div className="corridor-path" aria-hidden="true"/>
          {rooms.map(r=><section key={r.id} className={`room ${r.tone} shape-${r.shape}`} style={{left:`${r.x}%`,top:`${r.y}%`,width:`${r.w}%`,height:`${r.h}%`}}>
            <h2>{r.label}<small>{r.sub}</small></h2><Furniture room={r}/>
          </section>)}
          <div className="hall-sign">♪　CREATIVE FLOOR　♪</div>
          {agents.map(a=><PixelPerson key={a.id} agent={a} selected={selected===a.id} onClick={()=>setSelected(a.id)}/>)}
        </div>
        <div className="controls">
          <button onClick={()=>setPaused(!paused)}>{paused?<Play size={16}/>:<Pause size={16}/>} {paused?'계속':'일시정지'}</button>
          <button className="active" disabled>4× 고정</button>
          <span><i style={{width:`${progress}%`}}/>프로젝트 진행 {progress}%</span>
          <button className="report-btn" onClick={()=>setReportOpen(true)}><Archive size={16}/> 업무보고 {reports.length}</button>
        </div>
      </div>

      <aside className="right-panel panel">
        <div className="profile-head"><div className={`portrait ${chosen.hair} ${chosen.face} ${chosen.look}`} style={{'--c':chosen.color}}><i className="portrait-hair"/><i className="portrait-face"><b/><em/><strong/></i><i className="portrait-shirt">{chosen.icon}</i></div><div><small>{chosen.team}</small><h2>{chosen.name}</h2><p>{chosen.role}</p></div><span>WORKING</span></div>
        <div className="now-card"><small>CURRENT TASK</small><b>{chosen.task}</b><div><i/><span>집중 작업 중</span></div></div>
        <div className="mini-section"><h3>오늘의 워크플로</h3><ol><li className="done">기획 자료 확인</li><li className="active">담당 산출물 작성</li><li>독립 검토 요청</li><li>업무보고 보관</li></ol></div>
        <div className="mini-section"><h3>최근 대화</h3><p className="quote">“{conversations.find(c=>c.from===chosen.id)?.text || '팀의 다음 결정을 위해 근거를 정리하고 있어요.'}”</p></div>
        <button className="open-reports" onClick={()=>setReportOpen(true)}><FileText size={15}/> 관련 업무보고 열기</button>
      </aside>
    </section>

    <footer><div><Radio size={15}/><span>NOW PLAYING</span><b>여기서 행복해 · Melody Sketch 01</b></div><audio controls src={`${import.meta.env.BASE_URL}here_happy_hwaseong_demo.mp3`}/><p>규칙 기반 오피스 시뮬레이션 · 실제 업무 결과는 보고서에서 구분됩니다.</p></footer>

    {reportOpen&&<div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&setReportOpen(false)}><section className="archive-modal">
      <header><div><small>PROJECT KNOWLEDGE BASE</small><h2><Archive/> 업무보고 아카이브</h2><p>전략부터 데모, 평가와 납품까지 모든 판단 근거를 보관합니다.</p></div><button onClick={()=>setReportOpen(false)}><X/></button></header>
      <div className="report-toolbar">{['전체','전략','브리프','가사','평가','유사성','기술','음원'].map(x=><button className={filter===x?'active':''} onClick={()=>setFilter(x)} key={x}>{x}</button>)}</div>
      <div className="archive-body"><div className="report-grid">{filtered.map(r=><button key={r.id} className={`report-card ${activeReport?.id===r.id?'active':''}`} onClick={()=>setActiveReport(r)}><span>{r.type}</span><em>{r.status}</em><h3>{r.title}</h3><p>{r.summary}</p><footer><b>{r.owner}</b><small>{r.date}</small></footer></button>)}</div>
      <aside className="report-detail">{activeReport?<><div className="doc-icon"><FileText/></div><small>{activeReport.team} · {activeReport.date}</small><h2>{activeReport.title}</h2><p>{activeReport.summary}</p><h4>핵심 기록</h4><ul>{activeReport.details.map(d=><li key={d}>{d}</li>)}</ul>{activeReport.audio&&<audio controls src={`${import.meta.env.BASE_URL}here_happy_hwaseong_demo.mp3`}/>}<div className="notice">이 아카이브는 확정 사실, 제안, 미검증 항목을 상태로 구분합니다.</div></>:<div className="empty"><BarChart3/><h3>보고서를 선택하세요</h3><p>작성자, 판단 근거와 다음 작업을 확인할 수 있습니다.</p></div>}</aside></div>
    </section></div>}
  </main>
}
