export const faqsFromText = (text: string) => {
  return text
    .split('\n')
    .map((faq) => {
      const [question, answer] = faq.split(':');
      return {
        question,
        answer,
      };
    })
    .filter((faq) => faq.question && faq.answer);
};
