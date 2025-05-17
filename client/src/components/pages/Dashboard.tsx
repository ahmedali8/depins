'use client';

import client from '@/config/axios';
import { useWithdrawService } from '@/services';
import { useEffect, useRef, useState } from 'react';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { io } from 'socket.io-client';

import { CheckCircle, Loader2 } from 'lucide-react';
import Lottie from 'lottie-react';
// import animation which is in public folder
import WaitingBot from '../../assets/waiting-bot.json';

const finalSteps = [
  {
    stepNumber: 0,
    stepText: 'Optimisation of funds started',
    stepUrl: '',
  },
  {
    stepNumber: 1,
    stepText: 'Validating bandwidth availability',
    stepUrl: 'https://example.com/validate',
  },
  {
    stepNumber: 2,
    stepText: 'Registering on Grass protocol',
    stepUrl: 'https://example.com/register',
  },
  {
    stepNumber: 3,
    stepText: 'Deploying staking adapter',
    stepUrl: 'https://example.com/deploy',
  },
  {
    stepNumber: 4,
    stepText: 'Connecting to dPINs orchestrator',
    stepUrl: 'https://example.com/connect',
  },
  {
    stepNumber: 5,
    stepText: 'Syncing performance metrics',
    stepUrl: 'https://example.com/sync',
  },
];
const chartData = Array.from({ length: 20 }, (_, i) => ({
  name: `T${i + 1}`,
  value: 500 + Math.sin(i / 2) * 200 + Math.random() * 50,
}));

export default function Dashboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [publicKey, setPublicKey] = useState<string | null>(null);
  console.log('🚀 ~ Dashboard ~ publicKey:', publicKey);
  const [completedSteps, setCompletedSteps] = useState(0);

  const [showViewTx, setShowViewTx] = useState(false);

  const [steps, setSteps] = useState([
    // {
    //   stepNumber: 0,
    //   stepText: finalSteps[0].stepText,
    //   stepUrl: "",
    // },
  ] as {
    stepNumber: number;
    stepText: string;
    stepUrl: string;
  }[]);
  const [stats, setStats] = useState({
    totalGrassEarned: 0,
    totalValue: 0,
    marinadeDeposit: 0,
  });

  const { withdraw, data, isWithdrawing, isSuccess } = useWithdrawService();
  console.log('🚀 ~ Dashboard ~ data:', data);
  // useEffect(() => {
  //   finalSteps.slice(1).forEach((step, index) => {
  //     const showTextDelay = (index + 1) * 5000; // 5s each
  //     const showUrlDelay = showTextDelay + 3000; // 3s after text

  //     // Add step without URL
  //     setTimeout(() => {
  //       setSteps((prev) => {
  //         // Avoid adding duplicates
  //         if (prev.find((s) => s.stepNumber === step.stepNumber)) return prev;
  //         return [
  //           ...prev,
  //           {
  //             stepNumber: step.stepNumber,
  //             stepText: step.stepText,
  //             stepUrl: "",
  //           },
  //         ];
  //       });
  //     }, showTextDelay);

  //     // Add URL to existing step
  //     setTimeout(() => {
  //       setSteps((prev) =>
  //         prev.map((s) =>
  //           s.stepNumber === step.stepNumber
  //             ? { ...s, stepUrl: step.stepUrl }
  //             : s
  //         )
  //       );
  //     }, showUrlDelay);
  //   });
  // }, []);

  useEffect(() => {
    if (data) {
      setShowViewTx(true);
    }
  }, [data]);

  useEffect(() => {
    if (completedSteps >= steps.length) return;

    const timer = setTimeout(() => {
      setCompletedSteps(prev => Math.min(prev + 1, steps.length));
    }, 3000); // simulate 1-minute steps with 3s for demo

    return () => clearTimeout(timer);
  }, [completedSteps]);

  useEffect(() => {
    const walletPublicKey = localStorage.getItem('walletPublicKey');
    if (!walletPublicKey) return;

    const SERVER_URL = 'http://3.13.157.111:3000';
    // const SERVER_URL = 'http://localhost:3000';

    const socket = io(SERVER_URL, {
      auth: {
        userId: walletPublicKey,
      },
    });

    socket.on('connect', () => {
      console.log('Connected to server with ID:', socket.id);
    });

    socket.on('ping', msg => console.log('pinging to user -->', msg));

    socket.on('message', data => {
      console.log('Received message:', data);

      const incomingStep = data; // { stepNumber, stepText, stepUrl }

      setSteps(prevSteps => {
        // 👇 If 3 or more steps already exist, and a new "step 0" arrives, reset
        if (
          prevSteps.length >= 3 &&
          incomingStep.stepNumber === 0 &&
          !prevSteps.some(s => s.stepNumber === 0)
        ) {
          return [incomingStep];
        }

        const index = prevSteps.findIndex(
          s => s.stepNumber === incomingStep.stepNumber,
        );

        if (index === -1) {
          return [...prevSteps, incomingStep];
        } else {
          const updated = [...prevSteps];
          updated[index] = { ...updated[index], ...incomingStep };
          return updated;
        }
      });
    });

    // Cleanup
    return () => {
      socket.off('message');
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const walletPublicKey = localStorage.getItem('walletPublicKey');
    if (!walletPublicKey) return;

    setPublicKey(walletPublicKey);

    client
      .get(`user/details/${walletPublicKey}`)
      .then(res =>
        setStats({
          totalGrassEarned: res.data.totalGrassEarned,
          totalValue: res.data.totalValue,
          marinadeDeposit: res.data.marinadeDeposit,
        }),
      )
      .catch(console.error);

    const interval = setInterval(() => {
      client
        .get(`user/details/${walletPublicKey}`)
        .then(res =>
          setStats({
            totalGrassEarned: res.data.totalGrassEarned,
            totalValue: res.data.totalValue,
            marinadeDeposit: res.data.marinadeDeposit,
          }),
        )
        .catch(console.error);
    }, 30000);

    return () => clearInterval(interval);
  }, [setStats]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId: number;

    const coins = Array.from(
      { length: Math.max(5, Math.min(15, Math.floor(dimensions.width / 50))) },
      () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 6 + Math.random() * (dimensions.width < 640 ? 6 : 10),
        dx: (Math.random() - 0.5) * 2,
        dy: (Math.random() - 0.5) * 2,
        color: '#FFD166', // Warning color
      }),
    );

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      coins.forEach(coin => {
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
        ctx.fillStyle = coin.color;
        ctx.fill();
        ctx.strokeStyle = '#FFC94D';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#0B0F1C';
        ctx.font = `${coin.radius}px var(--font-display), sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('$', coin.x, coin.y);

        coin.x += coin.dx;
        coin.y += coin.dy;

        if (coin.x + coin.radius > canvas.width || coin.x - coin.radius < 0)
          coin.dx = -coin.dx;
        if (coin.y + coin.radius > canvas.height || coin.y - coin.radius < 0)
          coin.dy = -coin.dy;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [dimensions]);

  return (
    <div className="min-h-screen bg-[#0B0F1C] px-4 py-8 flex items-center justify-center">
      <div className="flex gap-8 items-stretch justify-center w-full max-w-7xl">
        {/* Dashboard content component  */}
        <div className="bg-[#0B0F1C] text-[#F2F5F9] rounded-2xl p-8 w-1/2 border border-[#5ED3F3]/40 shadow-xl flex flex-col justify-between space-y-6">
          <h2 className="text-2xl font-bold text-[#F2F5F9]">
            DePINs Earnings Dashboard
          </h2>

          <div>
            <p className="text-base text-[#A3B1C6] mb-2">Rewards Accumulated</p>
            <div className="flex items-center justify-between mb-4">
              <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient
                        id="graphGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1">
                        <stop
                          offset="5%"
                          stopColor="#00FFAA"
                          stopOpacity={0.6}
                        />
                        <stop
                          offset="95%"
                          stopColor="#00FFAA"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis hide />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        background: '#0B0F1C',
                        border: 'none',
                        color: '#F2F5F9',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#00FFAA"
                      fill="url(#graphGradient)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-[#0e1729] rounded-lg p-6 border border-[#5ED3F3] ml-8 w-50">
                <p className="text-sm text-[#A3B1C6] text-center">
                  Total Rewards
                </p>
                <p className="text-3xl font-bold text-center">
                  ${stats.totalValue.toLocaleString('en')}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-[#0e1729] rounded-lg p-6 border border-[#5ED3F3]">
              <p className="text-sm text-[#A3B1C6]">
                Total Earning from DePINs
              </p>
              <p className="text-2xl font-semibold text-[#00FFAA]">
                {stats.totalGrassEarned.toLocaleString('en')} GRASS
              </p>
            </div>

            <div className="bg-[#0e1729] rounded-lg p-6 border border-[#5ED3F3]">
              <p className="text-sm text-[#A3B1C6]">
                Currently Deposited in Staking
              </p>
              <p className="text-2xl font-semibold text-[#5ED3F3]">
                {stats.marinadeDeposit.toLocaleString('en')} mSOL
              </p>
            </div>

            <div className="bg-[#0e1729] rounded-lg p-6 border border-[#5ED3F3]">
              <p className="text-sm text-[#A3B1C6] mb-1">Active DEPINs</p>
              <p className="text-base font-medium text-[#F2F5F9]">Grass</p>
            </div>

            <div className="bg-[#0e1729] rounded-lg p-6 border border-[#5ED3F3]">
              <p className="text-sm text-[#A3B1C6] mb-1">Active Stakings</p>
              <p className="text-base font-medium text-[#F2F5F9]">Marinade</p>
            </div>
          </div>

          <p className="text-sm text-[#A3B1C6] mt-6 italic">
            "Watch as your assets generate real-time rewards, automatically
            converted and reinvested to compound your earnings."
          </p>

          <div className="pt-4">
            <button
              onClick={() => {
                if (showViewTx && typeof data === 'string') {
                  window.open(data, '_blank');

                  // Revert to "Claim Rewards" after 5 seconds
                  setTimeout(() => setShowViewTx(false), 5000);
                } else {
                  withdraw({
                    url: `withdraw/${publicKey}`,
                    method: 'POST',
                  });
                }
              }}
              disabled={isWithdrawing || (!stats.totalValue && !showViewTx)}
              className="w-full px-5 py-2.5 rounded-md border border-[#A3B1C6] text-[#F2F5F9]
      text-sm sm:text-base font-medium text-center transition-all duration-300 
      hover:bg-[#1a2235] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isWithdrawing ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" />
                  Withdrawing...
                </>
              ) : showViewTx ? (
                'View Transaction'
              ) : (
                'Claim Rewards'
              )}
            </button>
          </div>
        </div>

        {/* StepSidebar component  */}
        <div className="bg-[#0E1729] border border-[#5ED3F3]/40 rounded-xl shadow-md w-1/2 flex flex-col justify-between">
          <div className="p-8 flex flex-col h-full">
            <h3 className="text-2xl font-bold text-[#F2F5F9] mb-6">
              Yield and Transaction Reports
            </h3>

            {steps.length === 0 && (
              <div className="mt-2 text-sm text-[#A3B1C6]/80 space-y-1 ">
                <p>
                  AI Optimizer optimizes your yield by restaking your rewards
                  earned using DePINs.
                </p>
                <p>AI Optimizer will run once your DePINs earning increases.</p>
              </div>
            )}

            {steps.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center text-[#A3B1C6] text-base italic space-y-4">
                <Lottie
                  animationData={WaitingBot}
                  loop
                  autoplay
                  className="w-64 h-64"
                />
              </div>
            ) : (
              <ul className="space-y-6 overflow-y-auto flex-1 pr-1 custom-scrollbar">
                {steps.map(step => {
                  // Always show step 0 as announcement
                  if (step.stepNumber === 0) {
                    return (
                      <li
                        key={step.stepNumber}
                        className="text-base text-[#FFD166] font-medium italic">
                        {step.stepText}
                      </li>
                    );
                  }

                  // Only show steps with stepText defined
                  if (!step.stepText) return null;

                  return (
                    <li
                      key={step.stepNumber}
                      className="flex flex-col gap-2 text-lg text-[#F2F5F9] font-semibold">
                      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
                        {/* Step number */}
                        <div className="w-8 h-8 rounded-full bg-[#5ED3F3] text-[#0B0F1C] text-sm font-bold flex items-center justify-center">
                          {step.stepNumber}
                        </div>

                        {/* Step text */}
                        <div>{step.stepText}</div>

                        {/* Status */}
                        <div>
                          {step.stepUrl ? (
                            <CheckCircle className="text-[#00FFAA] w-6 h-6" />
                          ) : (
                            <Loader2 className="animate-spin text-[#5ED3F3] w-6 h-6" />
                          )}
                        </div>
                      </div>

                      {/* Step URL shown once it arrives */}
                      {step.stepUrl && (
                        <a
                          href={step.stepUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[#5ED3F3] underline pl-12 break-all">
                          {step.stepUrl}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
