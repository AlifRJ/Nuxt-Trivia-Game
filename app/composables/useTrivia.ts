// fetch questions from Open Trivia DB
export const useGetQuestions = (amount: number, category: number, difficulty: String) => {
  const questions = useFetch("/api/trivia", {
    query: { amount: amount, category: category, difficulty: difficulty },
  });
  return questions;
};

// Shuffle Question options
export const useShuffleQuestion = (array: any[]) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};
