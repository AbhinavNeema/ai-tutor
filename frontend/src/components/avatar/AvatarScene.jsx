import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense } from "react";

function Avatar() {

 const { scene } = useGLTF(
  "https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb"
 );

 return (
  <primitive
   object={scene}
   scale={1.8}
   position={[0,-1.4,0]}
  />
 );

}

export default function AvatarScene() {

 return (

  <Canvas camera={{ position: [0,1.4,2.2], fov: 35 }}>

   <ambientLight intensity={1.2}/>
   <directionalLight position={[3,5,2]} intensity={1}/>

   <Suspense fallback={null}>
    <Avatar/>
   </Suspense>

   <OrbitControls enableZoom={false}/>

  </Canvas>

 );

}