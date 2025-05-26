export function getSimulatedVitals(currentHour = new Date().getHours()) {
  const pi = Math.PI;
  const hr = 70 + 10 * Math.sin((pi / 12) * currentHour - pi / 2) + (Math.random() * 6 - 3);
  const rr = 14 + 2 * Math.sin((pi / 12) * currentHour - pi / 2) + (Math.random() * 2 - 1);
  
  return {
    heart_rate: Math.round(hr),
    respiratory_rate: Math.round(rr)
  };
}
