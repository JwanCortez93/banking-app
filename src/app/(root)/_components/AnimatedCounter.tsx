"use client";

import CountUp from "react-countup";

const AnimatedCounter = ({ amount }: { amount: number }) => {
  return (
    <div className="w-full">
      <CountUp duration={1} end={amount} decimals={2} prefix="$" />
    </div>
  );
};

export default AnimatedCounter;
