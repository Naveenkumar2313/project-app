/**
 * Generates a deterministic mock plagiarism score based on the project ID.
 * This simulates a real plagiarism check engine.
 * Returns a percentage (0-100) representing uniqueness (or plagiarism, depending on usage).
 */
export const generatePlagiarismScore = (projectId: string): number => {
  let hash = 0;
  for (let i = 0; i < projectId.length; i++) {
    hash = projectId.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Generate a score between 5 and 20 (simulating a generally safe/low plagiarism result)
  const baseScore = Math.abs(hash % 15) + 5; 
  return baseScore;
};

export const getStatusColor = (score: number) => {
  if (score < 10) return 'text-green-600 bg-green-50 border-green-200';
  if (score < 20) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  return 'text-red-600 bg-red-50 border-red-200';
};
