// components/NeuralNetwork.jsx
import { motion } from "framer-motion";

const NeuralNetwork = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute h-px bg-gradient-to-r from-blue-400 to-emerald-400"
        initial={{ width: 0, opacity: 0 }}
        animate={{ 
          width: "100%", 
          opacity: [0, 1, 0],
          x: [0, typeof window !== 'undefined' ? window.innerWidth : 1200]
        }}
        transition={{
          duration: 3,
          delay: i * 0.5,
          repeat: Infinity,
          repeatType: "loop"
        }}
        style={{
          top: `${20 + i * 15}%`,
          transformOrigin: "left"
        }}
      />
    ))}
  </div>
);

export default NeuralNetwork;
