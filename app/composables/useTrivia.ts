export const useGetQuestions = (amount: number, category: number, difficulty: String) => {
  const questions = useFetch("/api/trivia", {
    query: { amount: amount, category: category, difficulty: difficulty },
  });
  return questions;
};
