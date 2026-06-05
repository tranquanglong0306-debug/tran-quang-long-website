import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { GraduationCap, Brain, ShieldCheck } from "lucide-react";

export default function Interactive3DSpace() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [rotationSpeed, setRotationSpeed] = useState(0.005);
  const mouseRef = useRef({ x: 0, y: 0, isDown: false, lastX: 0, lastY: 0 });

  // Floating panels state
  const glassConcepts = [
    { text: "Ngôn ngữ học Ứng dụng", icon: Brain, color: "text-indigo-400" },
    { text: "Kỷ luật Tích cực", icon: ShieldCheck, color: "text-blue-400" },
    { text: "Sư phạm Toàn cầu", icon: GraduationCap, color: "text-slate-350" },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width = canvas.parentElement?.clientWidth || 600;
    let height = canvas.height = canvas.parentElement?.clientHeight || 600;

    // Handle container resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 600;
      height = canvas.height = canvas.parentElement?.clientHeight || 600;
    };
    window.addEventListener("resize", handleResize);

    // Math definition for 3D stars & globe
    interface Point3D {
      x: number;
      y: number;
      z: number;
      color?: string;
      size?: number;
    }

    const globeRadius = Math.min(width, height) * 0.32;
    const points: Point3D[] = [];
    const numPoints = 160;

    // Distribute points evenly on sphere using Fibonacci Lattice
    for (let i = 0; i < numPoints; i++) {
      const phi = Math.acos(1 - (2 * i) / numPoints);
      const theta = Math.PI * (1 + 5 ** 0.5) * i;

      points.push({
        x: globeRadius * Math.sin(phi) * Math.cos(theta),
        y: globeRadius * Math.sin(phi) * Math.sin(theta),
        z: globeRadius * Math.cos(phi),
        size: Math.random() * 2 + 1,
        color: i % 3 === 0 ? "rgba(37, 99, 235, 0.7)" : i % 3 === 1 ? "rgba(148, 163, 184, 0.7)" : "rgba(30, 41, 59, 1)",
      });
    }

    // AI Data streams (floating curves)
    interface Stream {
      points: Point3D[];
      speed: number;
      offset: number;
      color: string;
    }

    const streams: Stream[] = Array.from({ length: 6 }).map((_, sIdx) => {
      const streamPoints: Point3D[] = [];
      const numStreamNodes = 8;
      const r = globeRadius * (1.1 + Math.random() * 0.2);
      const randAxisX = Math.random() - 0.5;
      const randAxisY = Math.random() - 0.5;
      const randAxisZ = Math.random() - 0.5;

      for (let i = 0; i < numStreamNodes; i++) {
        const phi = (i / numStreamNodes) * Math.PI;
        const theta = (i / numStreamNodes) * Math.PI * 2 + sIdx * 5;
        streamPoints.push({
          x: r * Math.sin(phi) * Math.cos(theta) + randAxisX * 20,
          y: r * Math.sin(phi) * Math.sin(theta) + randAxisY * 20,
          z: r * Math.cos(phi) + randAxisZ * 20,
        });
      }

      return {
        points: streamPoints,
        speed: 0.02 + Math.random() * 0.02,
        offset: Math.random() * 100,
        color: sIdx % 2 === 0 ? "rgba(37, 99, 235, 0.4)" : "rgba(148, 163, 184, 0.4)",
      };
    });

    let angleX = 0.002;
    let angleY = rotationSpeed;

    // Mouse drag controls for interactive feel
    const onMouseDown = (e: MouseEvent) => {
      mouseRef.current.isDown = true;
      mouseRef.current.lastX = e.clientX;
      mouseRef.current.lastY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (mouseRef.current.isDown) {
        const dx = e.clientX - mouseRef.current.lastX;
        const dy = e.clientY - mouseRef.current.lastY;
        angleY += dx * 0.005;
        angleX += dy * 0.005;
        mouseRef.current.lastX = e.clientX;
        mouseRef.current.lastY = e.clientY;
      }
    };

    const onMouseUp = () => {
      mouseRef.current.isDown = false;
    };

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // Animation Loop
    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Project particles in the background
      ctx.save();
      ctx.translate(centerX, centerY);

      // Rotate angle softly over time
      if (!mouseRef.current.isDown) {
        angleY += rotationSpeed;
        angleX *= 0.98; // decelerate tilt slowly
      }

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      // Sort points by distance (Z) for natural rendering depth
      const rotatedPoints = points.map((p) => {
        // Rotate around Y axis
        let x1 = p.x * cosY - p.z * sinY;
        let z1 = p.z * cosY + p.x * sinY;

        // Rotate around X axis
        let y2 = p.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + p.y * sinX;

        return { x: x1, y: y2, z: z2, orig: p };
      });

      rotatedPoints.sort((a, b) => b.z - a.z);

      // Draw globe lattice lines between adjacent nodes to form education grid structure
      ctx.lineWidth = 0.5;
      for (let i = 0; i < rotatedPoints.length; i++) {
        const p1 = rotatedPoints[i];
        if (p1.z < -20) continue; // Skip back face lines for realistic glass sphere look

        let connections = 0;
        for (let j = i + 1; j < rotatedPoints.length; j++) {
          if (connections >= 2) break;
          const p2 = rotatedPoints[j];
          if (p2.z < -20) continue;

          // Check direct Euclidean distance in 3D
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dz = p1.z - p2.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < globeRadius * 0.45) {
            const alpha = (1 - dist / (globeRadius * 0.45)) * 0.18;
            ctx.strokeStyle = `rgba(37, 99, 235, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            connections++;
          }
        }
      }

      // Draw the rotating nodes on the sphere surface
      rotatedPoints.forEach((p) => {
        // Perspective multiplier based on Z coordinate (depth map)
        const scale = (p.z + globeRadius * 2) / (globeRadius * 2);
        const radius = (p.orig.size || 2) * scale;
        const opacity = Math.max(0.1, Math.min(1, (p.z + globeRadius) / (globeRadius * 2)));

        ctx.fillStyle = p.orig.color || "rgba(37, 99, 235, 1)";
        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Hover glowing focus node rendering
        if (hoveredNode && Math.abs(p.x) < 50 && Math.abs(p.y) < 50 && scale > 1.1) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = "#2563eb";
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius * 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        }
      });

      // Render flowing AI Data streams
      streams.forEach((stream, sIdx) => {
        stream.offset += stream.speed;
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = stream.color;

        const streamRotated = stream.points.map((p) => {
          let x1 = p.x * cosY - p.z * sinY;
          let z1 = p.z * cosY + p.x * sinY;
          let y2 = p.y * cosX - z1 * sinX;
          let z2 = z1 * cosX + p.y * sinX;
          return { x: x1, y: y2, z: z2 };
        });

        // Draw curved lines using quadrant curves
        ctx.moveTo(streamRotated[0].x, streamRotated[0].y);
        for (let i = 1; i < streamRotated.length - 1; i++) {
          const xc = (streamRotated[i].x + streamRotated[i + 1].x) / 2;
          const yc = (streamRotated[i].y + streamRotated[i + 1].y) / 2;
          ctx.quadraticCurveTo(streamRotated[i].x, streamRotated[i].y, xc, yc);
        }
        ctx.stroke();

        // Draw active glowing data packet floating down the orbit path
        const packetIndex = Math.floor(stream.offset) % (streamRotated.length - 1);
        const t = (stream.offset % 1);
        const startP = streamRotated[packetIndex];
        const endP = streamRotated[packetIndex + 1];

        if (startP && endP) {
          const packetX = startP.x + (endP.x - startP.x) * t;
          const packetY = startP.y + (endP.y - startP.y) * t;

          ctx.fillStyle = sIdx % 2 === 0 ? "#2563eb" : "#64748b";
          ctx.shadowBlur = 10;
          ctx.shadowColor = sIdx % 2 === 0 ? "#2563eb" : "#64748b";
          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.arc(packetX, packetY, 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      ctx.restore();
      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [rotationSpeed, hoveredNode]);

  return (
    <div className="relative w-full h-full flex items-center justify-center min-h-[500px]">
      {/* Background Neon Glow rings */}
      <div className="absolute w-[450px] h-[450px] rounded-full border border-dashed border-blue-500/10 pointer-events-none animate-slow-spin" />
      <div className="absolute w-[520px] h-[520px] rounded-full border border-dashed border-slate-500/10 pointer-events-none animate-slow-spin-reverse" />

      {/* Floating Campus structural abstract shapes - to render floating campus in sky */}
      <div className="absolute pointer-events-none w-full h-full flex items-center justify-center">
        <motion.div
          animate={{
            y: [-15, 15, -15],
            rotate: [1, -2, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute max-w-[320px] w-11/12 aspect-[4/3] glass-card rounded-2xl p-4 z-10 flex flex-col justify-between backdrop-blur-md border border-white/10"
          style={{ transform: "rotateX(15deg) rotateY(-10deg)" }}
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <p className="font-mono text-xs text-slate-300 tracking-widest uppercase">BẢN ĐỒ KHUÔN VIÊN TRỰC QUAN</p>
            </div>
            <GraduationCap className="w-5 h-5 text-blue-500" />
          </div>

          {/* Interactive diagram preview inside tag */}
          <div className="my-3 flex flex-col gap-2">
            <div className="h-2 w-full bg-white/5 rounded overflow-hidden">
              <motion.div
                animate={{ width: ["10%", "90%", "45%", "80%"] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 mt-1">
              <div className="bg-white/5 p-2 rounded text-center">
                <span className="block font-mono text-[9px] text-slate-400">TỶ LỆ SLA</span>
                <span className="font-display font-medium text-xs text-white">92.4%</span>
              </div>
              <div className="bg-white/5 p-2 rounded text-center">
                <span className="block font-mono text-[9px] text-slate-400">HÒA GIẢI</span>
                <span className="font-display font-medium text-xs text-blue-400">100%</span>
              </div>
              <div className="bg-white/5 p-2 rounded text-center">
                <span className="block font-mono text-[9px] text-slate-400">GẮN KẾT</span>
                <span className="font-display font-medium text-xs text-slate-300">9.8/10</span>
              </div>
            </div>
          </div>
          <div className="text-[11px] font-sans text-slate-300 font-light leading-relaxed">
            Bảng liên thông của Trần Quang Long đồng bộ các chỉ tiêu chất lượng xã hội học đường thời gian thực.
          </div>
        </motion.div>
      </div>

      {/* Primary HTML5 Canvas for Interactive 3D sphere */}
      <canvas
        ref={canvasRef}
        className="w-full h-full max-w-[650px] max-h-[650px] cursor-grab active:cursor-grabbing z-20"
        onMouseEnter={() => setRotationSpeed(0.0015)}
        onMouseLeave={() => setRotationSpeed(0.005)}
      />

      {/* Floating Glass Labels displaying Core Themes */}
      {glassConcepts.map((item, index) => {
        const IconComponent = item.icon;
        const coordinates = [
          { top: "15%", left: "10%" },
          { bottom: "20%", right: "8%" },
          { top: "25%", right: "12%" },
        ][index];

        return (
          <motion.div
            key={item.text}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 * index, duration: 0.6 }}
            className="absolute z-30 pointer-events-none md:pointer-events-auto cursor-pointer"
            style={coordinates}
            whileHover={{ scale: 1.1, translateY: -5 }}
            onHoverStart={() => setHoveredNode(item.text)}
            onHoverEnd={() => setHoveredNode(null)}
          >
            <div className="glass-card px-4 py-2.5 rounded-full flex items-center gap-2.5 border border-white/8 backdrop-blur-xl">
              <IconComponent className={`w-4 h-4 ${item.color}`} />
              <span className="text-xs font-sans text-white font-medium tracking-wide">{item.text}</span>
            </div>
          </motion.div>
        );
      })}

      {/* Glow highlight spot behind the canvas */}
      <div className="absolute w-[350px] h-[350px] ambient-glow-navy blur-3xl pointer-events-none rounded-full z-0" />
      <div className="absolute w-[250px] h-[250px] ambient-glow-slate blur-3xl pointer-events-none rounded-full z-0 translate-x-20" />
    </div>
  );
}
