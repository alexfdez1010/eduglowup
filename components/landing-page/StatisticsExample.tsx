import { RadarChartStatistics } from '@/components/statistics/TodayStatistics';

export default function StatisticsExample() {
  const generalStatistics = {
    userId: 'user1',
    date: '2023-10-10',
    totalConceptQuestions: 10,
    correctConceptQuestions: 5,
    totalFlashcards: 20,
    correctFlashcards: 15,
    totalQuizQuestions: 20,
    correctQuizQuestions: 15,
    totalMultipleChoiceQuestions: 30,
    correctMultipleChoiceQuestions: 25,
    totalShortQuestions: 40,
    correctShortQuestions: 35,
    totalTrueFalseQuestions: 50,
    correctTrueFalseQuestions: 45,
  };

  return (
    <div className="flex flex-col justify-start items-center h-48 sm:h-64 md:h-48">
      <RadarChartStatistics generalStatistics={generalStatistics} />
    </div>
  );
}
