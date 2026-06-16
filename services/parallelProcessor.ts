// services/parallelProcessor.ts
export interface SoundAnalysisResult {
  averageDB: number;
  peakDB: number;
  samplesProcessed: number;
}

export const processSoundDataInBackground = (soundLevels: number[]): Promise<SoundAnalysisResult> => {
  return new Promise((resolve) => {
    // Use setTimeout with 0 delay to make it non-blocking
    // This runs after the current call stack, keeping UI responsive
    setTimeout(() => {
      let sum = 0;
      let peak = 0;
      
      for (let i = 0; i < soundLevels.length; i++) {
        sum += soundLevels[i];
        if (soundLevels[i] > peak) peak = soundLevels[i];
      }
      
      const result: SoundAnalysisResult = {
        averageDB: sum / soundLevels.length,
        peakDB: peak,
        samplesProcessed: soundLevels.length
      };

      console.log('✅ [PARALLEL] Processing complete');
      resolve(result);
    }, 0);
  });
};