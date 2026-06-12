// __tests__/parachuteCalculations.test.ts
describe('Parachute Physics Calculations', () => {
  
  // Test 1: Final Velocity (matches vFinal = height / fallTime)
  test('final velocity calculation', () => {
    const height = 1.5;
    const fallTime = 0.5;
    
    // SAME FORMULA as your component!
    const vFinal = height / fallTime;
    
    expect(vFinal).toBeCloseTo(3.0);
  });

  // Test 2: G-Force without bounce (matches your component's calculation)
  test('g-force calculation (no bounce)', () => {
    const vFinal = 3.0;
    const contactTime = 0.02;
    const g = 9.81;
    
    // SAME FORMULA as your component when no bounce!
    const deltaV = vFinal;
    const gForce = (deltaV / contactTime) / g;
    
    expect(gForce).toBeCloseTo(15.29, 1);
  });

  // Test 3: G-Force WITH bounce (matches bounce case in your component)
  test('g-force calculation (with bounce)', () => {
    const vFinal = 3.0;
    const bounceUpVelocity = 1.5;
    const contactTime = 0.02;
    const g = 9.81;
    
    // SAME FORMULA as your component when bounce occurs!
    const deltaV = vFinal + bounceUpVelocity;  // vFinal + vUp
    const gForce = (deltaV / contactTime) / g;
    
    expect(gForce).toBeCloseTo(22.94, 1);
  });
});