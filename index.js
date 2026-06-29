
(function(){
  const canvas = document.getElementById('bg3d');
  const renderer = new THREE.WebGLRenderer({canvas, alpha: true, antialias: true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
 
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.z = 30;
 
  // Particles
  const COUNT = 1800;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(COUNT * 3);
  const sizes = new Float32Array(COUNT);
  for(let i = 0; i < COUNT; i++){
    pos[i*3]   = (Math.random()-0.5) * 120;
    pos[i*3+1] = (Math.random()-0.5) * 80;
    pos[i*3+2] = (Math.random()-0.5) * 60;
    sizes[i] = Math.random() * 1.5 + 0.3;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
  geo.setAttribute('size', new THREE.BufferAttribute(sizes,1));
 
  const mat = new THREE.PointsMaterial({
    color: 0x00ffc8,
    size: 0.18,
    transparent: true,
    opacity: 0.55,
    sizeAttenuation: true,
  });
 
  const particles = new THREE.Points(geo, mat);
  scene.add(particles);
 
  // Floating torus wireframe
  const tGeo = new THREE.TorusGeometry(8, 0.08, 8, 60);
  const tMat = new THREE.MeshBasicMaterial({color: 0x00ffc8, wireframe:false, transparent:true, opacity:0.12});
  const torus = new THREE.Mesh(tGeo, tMat);
  torus.position.set(-20, 5, -10);
  scene.add(torus);
 
  const tGeo2 = new THREE.TorusGeometry(5, 0.06, 8, 48);
  const tMat2 = new THREE.MeshBasicMaterial({color: 0x7b2fff, wireframe:false, transparent:true, opacity:0.1});
  const torus2 = new THREE.Mesh(tGeo2, tMat2);
  torus2.position.set(22, -8, -5);
  scene.add(torus2);
 
  // Octahedron wireframe
  const oGeo = new THREE.OctahedronGeometry(4, 0);
  const oMat = new THREE.MeshBasicMaterial({color:0x00ffc8, wireframe:true, transparent:true, opacity:0.08});
  const octa = new THREE.Mesh(oGeo, oMat);
  octa.position.set(18, 10, -8);
  scene.add(octa);
 
  // Mouse parallax
  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  });
 
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
 
  let t = 0;
  function animate(){
    requestAnimationFrame(animate);
    t += 0.004;
 
    particles.rotation.y = t * 0.04 + mx * 0.05;
    particles.rotation.x = my * 0.03;
 
    torus.rotation.x = t * 0.3;
    torus.rotation.y = t * 0.2;
 
    torus2.rotation.x = t * 0.2;
    torus2.rotation.z = t * 0.25;
 
    octa.rotation.x = t * 0.4;
    octa.rotation.y = t * 0.35;
 
    // gentle camera drift
    camera.position.x += (mx * 1.5 - camera.position.x) * 0.02;
    camera.position.y += (-my * 1 - camera.position.y) * 0.02;
 
    renderer.render(scene, camera);
  }
  animate();
})();
 
const cur = document.getElementById('cur');
const curR = document.getElementById('cur-r');
let cx=0,cy=0,rx=0,ry=0;
document.addEventListener('mousemove', e=>{
  cx=e.clientX; cy=e.clientY;
  cur.style.left=cx+'px'; cur.style.top=cy+'px';
});
(function loop(){
  rx+=(cx-rx)*0.1; ry+=(cy-ry)*0.1;
  curR.style.left=rx+'px'; curR.style.top=ry+'px';
  requestAnimationFrame(loop);
})();
document.querySelectorAll('a,button').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cur.style.transform='translate(-50%,-50%) scale(2.5)';curR.style.width='60px';curR.style.height='60px';curR.style.opacity='.2';});
  el.addEventListener('mouseleave',()=>{cur.style.transform='translate(-50%,-50%) scale(1)';curR.style.width='38px';curR.style.height='38px';curR.style.opacity='1';});
});
 
// ─── SCROLL REVEAL ─────────────────────────────────────────────
const obs = new IntersectionObserver(entries=>{
  entries.forEach((e,i)=>{
    if(e.isIntersecting){
      setTimeout(()=>e.target.classList.add('on'), i*90);
      obs.unobserve(e.target);
    }
  });
},{threshold:0.08});
document.querySelectorAll('.rev').forEach(el=>obs.observe(el));
 
// ─── SMOOTH NAV ─────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    e.preventDefault();
    const t=document.querySelector(a.getAttribute('href'));
    if(t) t.scrollIntoView({behavior:'smooth'});
  });
});
