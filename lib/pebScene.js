// Procedural PEB construction scene (three.js r128). Called from components/ScrollBuild.jsx.
// createPebScene(canvas, getProgress, { onStage, onProgress }) -> dispose() | null
// getProgress() must return scroll progress 0..1. Stage timings (the 0.xx numbers) live in update().
import * as THREE from 'three';

const B = [0, .08, .16, .24, .35, .46, .56, .68, .78, .90, 1.001]; // stage boundaries

export function createPebScene(canvas, getP, cb = {}) {
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const seg=(p,a,b)=>clamp((p-a)/(b-a));
const ss=t=>t*t*(3-2*t);
const lerp=(a,b,t)=>a+(b-a)*t;
const mx=t=>Math.max(t,.001);

/* ---------- renderer ---------- */
let renderer;
try{renderer=new THREE.WebGLRenderer({canvas,antialias:true})}
catch(e){return null}
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputEncoding=THREE.sRGBEncoding;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;
const AN=renderer.capabilities.getMaxAnisotropy();
const L=c=>new THREE.Color(c).convertSRGBToLinear();
const scene=new THREE.Scene();
const bgC=L(0x0b2a5b);
scene.fog=new THREE.Fog(bgC.clone(),170,340);
const mkDome=(top,bot)=>{const d=new THREE.Mesh(new THREE.SphereGeometry(450,32,16),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,fog:false,uniforms:{top:{value:top},bot:{value:bot}},vertexShader:'varying float h;void main(){h=normalize(position).y;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'uniform vec3 top;uniform vec3 bot;varying float h;void main(){gl_FragColor=vec4(mix(bot,top,smoothstep(0.,.75,h)),1.);\n#include <tonemapping_fragment>\n#include <encodings_fragment>\n}'}));d.frustumCulled=false;return d};
const dome=mkDome(bgC.clone(),bgC.clone());scene.add(dome);
const envScene=new THREE.Scene();envScene.add(mkDome(L(0x5b95d6),L(0xc5ccd0)));
scene.environment=new THREE.PMREMGenerator(renderer).fromScene(envScene,.02).texture;
const cam=new THREE.PerspectiveCamera(40,1,.1,600);
const hemi=new THREE.HemisphereLight(0xcfe3ff,0x1a2230,.6);
const sun=new THREE.DirectionalLight(0xffffff,1);
sun.position.set(50,80,40);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
Object.assign(sun.shadow.camera,{left:-80,right:80,top:80,bottom:-80,far:300});
sun.shadow.bias=-.0003;sun.shadow.normalBias=.03;sun.shadow.radius=3;
scene.add(hemi,sun);

const V=(x,y,z)=>new THREE.Vector3(x,y,z);
const mats=[];
const M=(c,o={})=>{const m=new THREE.MeshStandardMaterial(Object.assign({color:L(c),roughness:.6,metalness:.2},o));mats.push(m);return m};
function tex(w,draw,rx,ry){const c=document.createElement('canvas');c.width=c.height=w;draw(c.getContext('2d'),w);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rx,ry);t.anisotropy=AN;t.encoding=THREE.sRGBEncoding;return t}
function ribs(h,rx,ry){return tex(64,(g,w)=>{for(let i=0;i<w;i++){const v=Math.round(215+40*Math.sin(i/w*Math.PI*2));g.fillStyle='rgb('+v+','+v+','+v+')';h?g.fillRect(0,i,w,1):g.fillRect(i,0,1,w)}},rx,ry)}
function grain(base,v,rx,ry){return tex(256,(g,w)=>{g.fillStyle=base;g.fillRect(0,0,w,w);for(let i=0;i<9000;i++){g.fillStyle='rgba('+(Math.random()<.5?'0,0,0,':'255,255,255,')+Math.random()*v+')';g.fillRect(Math.random()*w,Math.random()*w,1+Math.random()*2,1+Math.random()*2)}},rx,ry)}
const mFrame=M(0xa3412a,{roughness:.72,metalness:.15,map:grain('#fff',.18,2,2)});
const mGalv=M(0xa4adb5,{metalness:.75,roughness:.38,map:grain('#fff',.12,2,2)});
const mConc=M(0x8d8d88,{roughness:1,metalness:0,map:grain('#fff',.35,1,1)});
const rb=ribs(true,1,12),rw=ribs(false,12,1),rs=ribs(true,1,25);
const mRoof=M(0x4d6783,{map:rb,bumpMap:rb,bumpScale:2.5,roughness:.38,metalness:.65});
const mWall=M(0xa8a8a8,{map:rw,bumpMap:rw,bumpScale:2.5,roughness:.5,metalness:.45});
const mGable=M(0xa8a8a8,{roughness:.5,metalness:.45,side:THREE.DoubleSide});
const mSky=M(0xbfe0f0,{transparent:true,opacity:.65,roughness:.1,metalness:.1,emissive:L(0x5a8fb0),emissiveIntensity:.25});
const mShut=M(0xc9ced3,{map:rs,bumpMap:rs,bumpScale:2,metalness:.6,roughness:.45});
const mAcc=M(0x2f3a46,{roughness:.6}),mOr=M(0xc8441a,{roughness:.5});
const world=new THREE.Group();scene.add(world);
const A=Math.atan(.1);

/* ---------- ground ---------- */
const gm=new THREE.MeshStandardMaterial({color:L(0x0b2a5b),transparent:true,opacity:0,roughness:1,metalness:0,map:grain('#fff',.3,70,70)});
const ground=new THREE.Mesh(new THREE.PlaneGeometry(700,700),gm);
ground.rotation.x=-Math.PI/2;ground.position.y=-.02;ground.receiveShadow=true;scene.add(ground);

/* ---------- stage 1 and 2: blueprint lines ---------- */
function lines(pts,color,op){const l=new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color,transparent:true,opacity:op}));l.userData.n=pts.length;return l}
const gp=[];for(let i=-60;i<=60;i+=5){gp.push(V(i,.03,-60),V(i,.03,60),V(-60,.03,i),V(60,.03,i))}
const grid=lines(gp,0xffffff,.22);scene.add(grid);
const P=[];const Sg=(a,b,c,d)=>P.push(V(a,.04,b),V(c,.04,d));
Sg(-15,-30,15,-30);Sg(15,-30,15,30);Sg(15,30,-15,30);Sg(-15,30,-15,-30);
for(let k=1;k<5;k++)Sg(-15,-30+12*k,15,-30+12*k);
for(let k=0;k<6;k++)[-15,15].forEach(x=>{const z=-30+12*k,h=.5;Sg(x-h,z-h,x+h,z-h);Sg(x+h,z-h,x+h,z+h);Sg(x+h,z+h,x-h,z+h);Sg(x-h,z+h,x-h,z-h)});
Sg(-15,32,-15,38);Sg(15,32,15,38);Sg(-15,36,15,36);Sg(-15,35,-15,37);Sg(15,35,15,37);
Sg(-17,-30,-23,-30);Sg(-17,30,-23,30);Sg(-21,-30,-21,30);Sg(-22,-30,-20,-30);Sg(-22,30,-20,30);
const plan=lines(P,0xffffff,1);scene.add(plan);
function label(t,x,z){const c=document.createElement('canvas');c.width=512;c.height=96;const g=c.getContext('2d');g.fillStyle='#fff';g.font='600 52px "Barlow Condensed",Arial,sans-serif';g.textAlign='center';g.fillText(t,256,62);const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true,opacity:0,depthTest:false}));sp.scale.set(15,2.8,1);sp.position.set(x,.5,z);scene.add(sp);return sp}
const labels=[label('30 m width',0,40),label('60 m length',-28,0),label('5 bays at 12 m',0,-34),label('Eave 6 m, ridge 7.5 m',0,-38)];
const wp=[];
FZ=[...Array(6)].map((_,i)=>-30+12*i);
var FZ;
FZ.forEach(z=>{wp.push(V(-15,0,z),V(-15,6,z),V(-15,6,z),V(0,7.5,z),V(0,7.5,z),V(15,6,z),V(15,6,z),V(15,0,z))});
[[-15,0],[15,0],[-15,6],[15,6],[0,7.5]].forEach(([x,y])=>wp.push(V(x,y,-30),V(x,y,30)));
const wire=lines(wp,0x9fd0ff,0);world.add(wire);

/* ---------- stages 3, 4, 5: foundation, columns, rafters ---------- */
function colBeam(L){const g=new THREE.Group();const fg=new THREE.BoxGeometry(.06,L,.26);
[[-.22,fg],[.22,fg],[0,new THREE.BoxGeometry(.44,L,.05)]].forEach(([x,geo])=>{const m=new THREE.Mesh(geo,mFrame);m.position.set(x,L/2,0);m.castShadow=true;g.add(m)});return g}
function rafBeam(L,d){const g=new THREE.Group();
[[.44,.05,0],[.06,.26,.22],[.06,.26,-.22]].forEach(([h,dz,oy],i)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(L,i?h:h,dz),mFrame);m.position.set(d*L/2,oy,0);m.castShadow=true;g.add(m)});return g}
const boltHead=new THREE.CylinderGeometry(.045,.045,.04,6),footGeo=new THREE.BoxGeometry(1.5,.8,1.5).translate(0,.4,0),plateGeo=new THREE.BoxGeometry(.7,.04,.7),boltGeo=new THREE.CylinderGeometry(.03,.03,.4,8);
const cols=[],raf=[];
FZ.forEach((z,f)=>{[0,1].forEach(s=>{const x=s?15:-15,sg=s?-1:1;
 const ft=new THREE.Mesh(footGeo,mConc);ft.position.set(x,-.8,z);ft.receiveShadow=ft.castShadow=true;
 const pl=new THREE.Mesh(plateGeo,mGalv);pl.position.set(x,.02,z);
 const bg=new THREE.Group();bg.position.set(x,0,z);
 [[-.24,-.24],[.24,-.24],[-.24,.24],[.24,.24]].forEach(([a,b])=>{const m=new THREE.Mesh(boltGeo,mGalv);m.position.set(a,.2,b);bg.add(m)});
 const col=colBeam(6);col.position.set(x,.04,z);
 const pv=new THREE.Group();pv.position.set(x,6.04,z);pv.add(rafBeam(15.075,s?-1:1));
 const kn=new THREE.Mesh(new THREE.BoxGeometry(.55,1.1,.34),mFrame);kn.position.y=-.35;kn.castShadow=true;pv.add(kn);
 [[-.15,-.6],[.15,-.6],[-.15,-.1],[.15,-.1]].forEach(([a,b])=>[-1,1].forEach(d=>{const h=new THREE.Mesh(boltHead,mGalv);h.rotation.x=Math.PI/2;h.position.set(a,b,d*.19);pv.add(h)}));
 [ft,pl,bg,col,pv].forEach(o=>{o.visible=false;world.add(o)});
 cols.push({ft,pl,bg,col});raf.push({pv,f,sg});
})});

/* ---------- stage 6: secondary framing ---------- */
const sec=[];
function addSec(geo,x,y,z,ax,rx,rz){const m=new THREE.Mesh(geo,mGalv);m.position.set(x,y,z);if(rx)m.rotation.x=rx;if(rz)m.rotation.z=rz;m.castShadow=true;m.visible=false;world.add(m);sec.push({m,ax})}
[.1,.28,.46,.64,.82,1].forEach(t=>[-1,1].forEach(sg=>addSec(new THREE.BoxGeometry(.1,.18,60.4),sg*15*(1-t),6+1.5*t+.34,0,'z',0,-sg*A)));
[-1,1].forEach(sg=>{addSec(new THREE.BoxGeometry(.12,.25,60.4),sg*15.1,6.05,0,'z');
 [1.5,3,4.5].forEach(y=>{addSec(new THREE.BoxGeometry(.06,.2,60.4),sg*15.3,y,0,'z');addSec(new THREE.BoxGeometry(30.4,.2,.06),0,y,sg*30.2,'x')});
 [-24,24].forEach(zc=>[-1,1].forEach(d=>addSec(new THREE.BoxGeometry(.05,.05,13.4),sg*15.2,3,zc,'z',d*Math.atan(.5))))});

/* ---------- stage 7: roof sheets ---------- */
const roof=[];
for(let i=0;i<20;i++)[-1,1].forEach(sg=>{const m=new THREE.Mesh(new THREE.BoxGeometry(15.4,.04,2.98),mRoof);
 m.position.set(sg*7.6,7.2,-28.5+3*i);m.rotation.z=-sg*A;m.castShadow=m.receiveShadow=true;m.visible=false;world.add(m);roof.push({m,i,y:7.2})});

/* ---------- stage 8: wall cladding ---------- */
const walls=[];
function panel(w,h,d,x,y,z,o){const g=new THREE.BoxGeometry(w,h,d);g.translate(0,h/2,0);const m=new THREE.Mesh(g,mWall);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;m.visible=false;world.add(m);walls.push({m,o})}
for(let i=0;i<20;i++)[-1,1].forEach(sg=>panel(.05,6.3,2.98,sg*15.37,0,-28.5+3*i,i/20));
for(let j=0;j<10;j++){const x=-13.5+3*j;panel(2.98,6.3,.05,x,0,-30.28,j/10);
 if(j==4||j==5)panel(2.98,1.3,.05,x,5,30.28,j/10);else panel(2.98,6.3,.05,x,0,30.28,j/10)}
const gShape=new THREE.Shape();gShape.moveTo(-15.4,0);gShape.lineTo(15.4,0);gShape.lineTo(0,1.6);
const gabGeo=new THREE.ShapeGeometry(gShape);const gables=[-1,1].map(sg=>{const m=new THREE.Mesh(gabGeo,mGable);m.position.set(0,6.3,sg*30.3);m.visible=false;world.add(m);return m});

/* ---------- stage 9: accessories ---------- */
const acc=[];
function addAcc(m,ax,a,b){m.visible=false;m.traverse(o=>{if(o.isMesh)o.castShadow=true});world.add(m);acc.push({m,ax,a,b});return m}
const vent=new THREE.Group();vent.position.set(0,7.9,0);
const vb=new THREE.Mesh(new THREE.BoxGeometry(1.2,.5,50).translate(0,.25,0),mGalv),vc=new THREE.Mesh(new THREE.BoxGeometry(2.2,.06,50),mRoof);vc.position.y=.55;vent.add(vb,vc);addAcc(vent,'y',.78,.82);
[-1,1].forEach(sg=>{[-18,0,18].forEach(z=>{const m=new THREE.Mesh(new THREE.BoxGeometry(3,.05,6),mSky);m.position.set(sg*7.6,7.27,z);m.rotation.z=-sg*A;addAcc(m,'all',.80,.84)});
 addAcc(new THREE.Mesh(new THREE.BoxGeometry(.35,.25,60.6),mGalv),'z',.82,.86).position.set(sg*15.55,6.2,0);
 [-29,29].forEach(z=>addAcc(new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,6,10).translate(0,-3,0),mGalv),'y',.84,.88).position.set(sg*15.62,6.1,z));
 addAcc(new THREE.Mesh(new THREE.BoxGeometry(.25,5.3,.3).translate(0,2.65,0),mGalv),'y',.86,.89).position.set(sg*3.12,0,30.3);
 [-1,1].forEach(zz=>addAcc(new THREE.Mesh(new THREE.BoxGeometry(.2,6.5,.2).translate(0,3.25,0),mAcc),'y',.88,.905).position.set(sg*15.5,0,zz*30.4))});
addAcc(new THREE.Mesh(new THREE.BoxGeometry(6,5,.12).translate(0,-2.5,0),mShut),'y',.86,.9).position.set(0,5,30.3);
const md=addAcc(new THREE.Mesh(new THREE.BoxGeometry(1.1,2.2,.1).translate(0,1.1,0),mAcc),'y',.85,.88);md.position.set(15.45,0,-10);md.rotation.y=Math.PI/2;

/* ---------- stage 10: yard ---------- */
const road=new THREE.Mesh(new THREE.PlaneGeometry(14,170),new THREE.MeshStandardMaterial({color:L(0x3a3f47),roughness:1,transparent:true,opacity:0,map:grain('#fff',.4,4,40)}));
road.rotation.x=-Math.PI/2;road.position.set(4,-.005,115);road.receiveShadow=true;scene.add(road);
const trees=[[-30,8],[-34,-14],[-26,-44],[30,-8],[36,-30],[28,26],[-28,36],[-42,52],[22,72],[-16,92]].map(([x,z])=>{
 const g=new THREE.Group();const t=new THREE.Mesh(new THREE.CylinderGeometry(.22,.34,3.2,8),M(0x4a3524,{roughness:1}));t.position.y=1.6;t.castShadow=true;g.add(t);
 for(let b=0;b<5;b++){const geo=new THREE.IcosahedronGeometry(1.5+Math.random()*.9,2),pa=geo.attributes.position;
  for(let v=0;v<pa.count;v++){const X=pa.getX(v),Y=pa.getY(v),Z=pa.getZ(v),k=1+.14*Math.sin(X*2.3+Y*1.7+b)*Math.cos(Z*2.9+X);pa.setXYZ(v,X*k,Y*.85*k,Z*k)}
  geo.computeVertexNormals();const m=new THREE.Mesh(geo,M(0x2f5a2c+Math.floor(Math.random()*3)*0x0a0a00,{roughness:.95,metalness:0}));
  m.position.set((Math.random()-.5)*2,3.6+b*.55+Math.random(),(Math.random()-.5)*2);m.castShadow=true;g.add(m)}
 g.position.set(x,0,z);g.rotation.y=Math.random()*6;g.visible=false;scene.add(g);return g});
const truck=new THREE.Group();
const cab=new THREE.Mesh(new THREE.BoxGeometry(2.6,2.6,2.4),mOr);cab.position.set(0,1.9,0);
const trl=new THREE.Mesh(new THREE.BoxGeometry(2.6,2.9,9),M(0xf2f4f6));trl.position.set(0,2.05,6.2);
const chs=new THREE.Mesh(new THREE.BoxGeometry(2.2,.4,12),M(0x222222));chs.position.set(0,.7,4.6);
const gl=new THREE.Mesh(new THREE.BoxGeometry(2.4,1,.05),M(0x0d141b,{roughness:.1,metalness:.8}));gl.position.set(0,2.4,-1.21);truck.add(cab,trl,chs,gl);[[-1.3,0],[1.3,0],[-1.3,5],[1.3,5],[-1.3,8],[1.3,8]].forEach(([x,z])=>{const w=new THREE.Mesh(new THREE.CylinderGeometry(.55,.55,.4,14),M(0x111111));w.rotation.z=Math.PI/2;w.position.set(x,.55,z);truck.add(w)});
truck.traverse(o=>{if(o.isMesh)o.castShadow=true});truck.visible=false;scene.add(truck);

/* ---------- colour and camera keyframes ---------- */
const BG=[[0,0x0b2a5b],[.16,0x0b2a5b],[.24,0x131b27],[.5,0x1c2633],[.6,0x8ec5e8],[.9,0x9ccfee],[1,0xf0b673]];
const GR=[[0,0x0b2a5b],[.14,0x0b2a5b],[.24,0x232d3b],[.5,0x2c3745],[.6,0x9aa09a],[.9,0x8e957f],[1,0x8a8f6e]];
const TOP=[[0,0x0b2a5b],[.16,0x0b2a5b],[.24,0x0a0f16],[.5,0x10161f],[.6,0x3f7fc6],[.9,0x4a8cd0],[1,0x7391c4]];
const SUN=[[0,0xffffff],[.88,0xffffff],[1,0xffc98a]];
const tc=new THREE.Color();
function ramp(k,p,out){let i=0;while(i<k.length-2&&p>k[i+1][0])i++;const a=k[i],b=k[i+1];return out.set(a[1]).convertSRGBToLinear().lerp(tc.set(b[1]).convertSRGBToLinear(),clamp((p-a[0])/(b[0]-a[0])))}
const K=[[0,[0,120,8],[0,0,0]],[.08,[0,120,8],[0,0,0]],[.16,[48,42,48],[0,3,0]],[.20,[28,22,44],[0,0,0]],
[.24,[-24,1.5,26],[0,5,0]],[.35,[22,1.5,22],[0,5,-6]],[.40,[-12,6,68],[0,5,0]],[.46,[14,7,68],[0,5,0]],
[.51,[-46,15,40],[0,4,0]],[.56,[-50,26,-20],[0,4,0]],[.60,[-30,55,0],[0,5,0]],[.66,[0,105,6],[0,6,0]],
[.69,[80,10,-30],[0,4,-30]],[.78,[80,10,30],[0,4,30]],[.82,[34,2,52],[0,5,24]],[.90,[9,3,42],[0,3.5,30]],
[.93,[-36,5,78],[0,4,10]],[.97,[14,22,100],[0,4,8]],[1,[64,48,80],[0,3,5]]].map(([p,a,b])=>[p,V(...a),V(...b)]);
const cp=V(0,0,0),ct=V(0,0,0);
function camAt(p){let i=0;while(i<K.length-2&&p>K[i+1][0])i++;const a=K[i],b=K[i+1];const t=ss(clamp((p-a[0])/(b[0]-a[0])));
 cp.copy(a[1]).lerp(b[1],t);ct.copy(a[2]).lerp(b[2],t);
 if(cam.aspect<1){const k=1+(1-cam.aspect)*.8;cp.sub(ct).multiplyScalar(k).add(ct)}
 cam.position.copy(cp);cam.lookAt(ct)}

/* ---------- master update ---------- */
const c1=L(0xa8a8a8),c2=L(0xe9ecef);
let last=-1;
function update(p){
 grid.geometry.setDrawRange(0,Math.floor(grid.userData.n*seg(p,0,.03)/2)*2);
 plan.geometry.setDrawRange(0,Math.floor(plan.userData.n*seg(p,.01,.065)/2)*2);
 grid.material.opacity=.22*(1-seg(p,.12,.2));plan.material.opacity=1-seg(p,.15,.22);
 grid.visible=plan.visible=p<.225;
 labels.forEach(l=>{l.material.opacity=seg(p,.055,.075)*(1-seg(p,.1,.15));l.visible=l.material.opacity>.01});
 const wo=ss(seg(p,.08,.12))*(1-seg(p,.22,.3))*.95;wire.material.opacity=wo;wire.visible=wo>.01;wire.scale.y=mx(ss(seg(p,.08,.15)));
 gm.opacity=seg(p,.13,.2);ramp(GR,p,gm.color);
 cols.forEach((c,k)=>{const a=.16+k/12*.05,t=ss(seg(p,a,a+.035));c.ft.visible=t>0;c.ft.scale.y=mx(t);
  const u=ss(seg(p,a+.02,a+.05));c.pl.visible=c.bg.visible=u>0;c.bg.scale.setScalar(mx(u));c.pl.scale.setScalar(mx(u));
  const a2=.24+k/12*.07,w=ss(seg(p,a2,a2+.04));c.col.visible=w>0;c.col.scale.y=mx(w)});
 raf.forEach(r=>{const a=.35+r.f/6*.07,e=ss(seg(p,a,a+.045));r.pv.visible=e>0;r.pv.rotation.z=r.sg*lerp(1.45,A,e)});
 sec.forEach((s,i)=>{const a=.46+i/sec.length*.07,t=ss(seg(p,a,a+.03));s.m.visible=t>0;s.m.scale[s.ax]=mx(t)});
 roof.forEach(r=>{const a=.56+r.i/20*.08,t=ss(seg(p,a,a+.04));r.m.visible=t>0;r.m.position.y=r.y+(1-t)*10});
 walls.forEach(w=>{const a=.68+w.o*.07,t=ss(seg(p,a,a+.035));w.m.visible=t>0;w.m.scale.y=mx(t)});
 const gt=ss(seg(p,.745,.78));gables.forEach(g=>{g.visible=gt>0;g.scale.y=mx(gt)});
 const pt=seg(p,.8,.88);mWall.color.lerpColors(c1,c2,pt);mGable.color.copy(mWall.color);
 acc.forEach(o=>{const t=ss(seg(p,o.a,o.b));o.m.visible=t>.001;if(o.ax=='all')o.m.scale.setScalar(mx(t));else o.m.scale[o.ax]=mx(t)});
 trees.forEach((t,i)=>{const s=ss(seg(p,.9+i*.006,.94+i*.006));t.visible=s>0;t.scale.setScalar(mx(s))});
 road.material.opacity=seg(p,.9,.93);road.visible=road.material.opacity>.01;
 const tr=ss(seg(p,.9,.99));truck.visible=p>.9;truck.position.set(4,0,lerp(150,50,tr));
 ramp(BG,p,bgC);scene.fog.color.copy(bgC);dome.material.uniforms.bot.value.copy(bgC);ramp(TOP,p,dome.material.uniforms.top.value);
 const day=seg(p,.5,.62);hemi.intensity=.35+.45*day;sun.intensity=.6+2*day;ramp(SUN,p,sun.color);
 const ei=.18+.9*day;mats.forEach(m=>m.envMapIntensity=ei);
 const g=seg(p,.9,1);sun.position.set(lerp(50,95,g),lerp(80,30,g),lerp(40,60,g));
 camAt(p);
 let idx=0;while(idx<9&&p>=B[idx+1])idx++;
 if(idx!==last){last=idx;cb.onStage&&cb.onStage(idx)}
 cb.onProgress&&cb.onProgress(p);
}


const parent=canvas.parentElement||canvas;
function resize(){const w=parent.clientWidth||innerWidth,h=parent.clientHeight||innerHeight;renderer.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}
window.addEventListener('resize',resize);resize();
let rafId=0,alive=true;
(function loop(){if(!alive)return;update(getP());renderer.render(scene,cam);rafId=requestAnimationFrame(loop)})();
return function dispose(){alive=false;cancelAnimationFrame(rafId);window.removeEventListener('resize',resize);
 scene.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material)[].concat(o.material).forEach(m=>{if(m.map)m.map.dispose();m.dispose()})});renderer.dispose()};
}
