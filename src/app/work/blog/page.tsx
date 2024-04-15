'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import styles from '../styles/Home.module.css';

const IndexPage = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (canvasRef.current) canvasRef.current.appendChild(renderer.domElement);

    // Vertex shader code
    const vertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

    // Fragment shader code
    const fragmentShader = `
varying vec2 vUv;
uniform float time;

void main() {
    vec2 p = -1.0 + 2.0 * vUv;
    float a = time * 40.0;
    float d, e, f, g = 1.0 / 40.0 ,h ,i ,r ,q;
    e = 400.0 * ( p.x * 0.5 + 0.5 );
    f = 400.0 * ( p.y * 0.5 + 0.5 );
    i = 200.0 + sin( e * g + a / 150.0 ) * 20.0;
    d = 200.0 + cos( f * g / 2.0 ) * 18.0 + cos( e * g ) * 7.0;
    r = sqrt( pow( abs( i - e ), 2.0 ) + pow( abs( d - f ), 2.0 ) );
    q = f / r;
    e = ( r * cos( q ) ) - a / 2.0;
    f = ( r * sin( q ) ) - a / 2.0;
    d = sin( e * g ) * 176.0 + sin( e * g ) * 164.0 + r;
    h = ( ( f + d ) + a / 2.0 ) * g;
    i = cos( h + r * p.x / 1.3 ) * ( e + e + a ) + cos( q * g * 6.0 ) * ( r + h / 3.0 );
    h = sin( f * g ) * 144.0 - sin( e * g ) * 212.0 * p.x;
    h = ( h + ( f - e ) * q + sin( r - ( a + h ) / 7.0 ) * 10.0 + i / 4.0 ) * g;
    i += cos( h * 2.3 * sin( a / 350.0 - ( f + d + e ) * g ) * 10.0 + ( h + d ) * p.x / 1.3 ) * 8.0;
    r = mod( i / 4.0, 256.0 ) / 64.0;
    if ( r < 0.0 ) r += 4.0;
    if ( r >= 2.0 ) r = 4.0 - r;
    d = r - fract( i / 4.0 / 256.0 );
    d += cos( mod( h * ( 0.319 + sin( a / 120.0 ) * 0.1 ), 1.0 ) / sin( a / 1.3 ) * 0.15 ) * 0.05;
    gl_FragColor = vec4( vec3( r, d * 1.1, i / 512.0 ), 1.0 );
}
`;

    // Create a custom shader material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 1.0 },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });

    // Fluid-like substance (placeholder)
    const geometry = new THREE.PlaneGeometry(200, 200, 1, 1);
    // const material = new THREE.MeshBasicMaterial({
    //   color: 0x6a0dad,
    //   side: THREE.DoubleSide,
    // });
    const fluid = new THREE.Mesh(geometry, material);
    scene.add(fluid);

    camera.position.z = 5;

    // Scroll event listener
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const totalHeight = document.body.clientHeight;
      const scrollPercent = scrollTop / (totalHeight - windowHeight);

      // Update fluid position based on scroll
      fluid.position.y = -2 + scrollPercent * 4; // Adjust this based on your content layout
    };

    window.addEventListener('scroll', handleScroll);

    // Render loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div ref={canvasRef} className="fixed top-0 left-0 z-0" />
      <div className="relative z-10 text-center">
        <h1 className="text-4xl font-bold mb-4 animate-fade-in-up">
          Hi, I&apos;m John
        </h1>
        <p className="text-xl animate-fade-in-up-delayed">
          Welcome to my website.
        </p>
      </div>
    </div>
  );
};

export default IndexPage;
