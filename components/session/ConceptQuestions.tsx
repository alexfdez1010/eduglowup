import { BlockDto } from '@/lib/dto/block.dto';
import { AnswerConceptoDto, ConceptQuestionsDto } from '@/lib/dto/concept.dto';
import { ExerciseBottom } from '@/components/session/ExerciseBottom';
import { Dropdown, DropdownItem, DropdownMenu } from '@nextui-org/react';
import { useSubmit } from '@/components/session/hooks';
import { useEffect, useState } from 'react';
import { DropdownTrigger } from '@nextui-org/dropdown';
import { Button } from '@nextui-org/button';
import WrapperExercise from './WrapperExercise';
import { useDictionary } from '@/components/hooks';

interface ConceptQuestionsProps {
  conceptQuestions: ConceptQuestionsDto;
  sessionId: string;
  isActive: boolean;
  finishExam: (block: BlockDto) => void;
  hasFinishedExercise: boolean;
}

export default function ConceptQuestions({
  conceptQuestions,
  sessionId,
  isActive,
  finishExam,
  hasFinishedExercise,
}: ConceptQuestionsProps) {
  const [conceptQuestionsState, setConceptQuestionsState] =
    useState<ConceptQuestionsDto>(conceptQuestions);

  const allConcepts = conceptQuestions.concepts;

  useEffect(() => {
    setConceptQuestionsState(conceptQuestions);
  }, [conceptQuestions]);

  const { loading, handleSubmit } = useSubmit(
    '/api/answer/concepts',
    finishExam,
  );

  const dictionary = useDictionary('concepts');

  const allAnswered = () => {
    return conceptQuestionsState.questions.every(
      (question) => question.answer !== '',
    );
  };

  const getColor = (index: number) => {
    if (conceptQuestionsState.questions[index].answer === '') {
      return 'default';
    }

    if (!conceptQuestionsState.questions[index].concept) {
      return 'primary';
    }

    if (
      conceptQuestionsState.questions[index].answer ===
      conceptQuestionsState.questions[index].concept
    ) {
      return 'success';
    }

    return 'danger';
  };

  return (
    <>
      {conceptQuestionsState.questions.map((question, index) => (
        <WrapperExercise
          exercise="concepts"
          documentId={conceptQuestions.documentId}
          partOrder={conceptQuestions.partOrder}
          key={index}
          hasFinishedExercise={hasFinishedExercise}
          questionId={question.id}
        >
          <p className="text-center">{dictionary['description']}</p>
          <p className="text-foreground-500">
            {`${index + 1}. ${question.definition}`}
          </p>
          <div className="flex flex-col justify-center items-center w-full">
            <Dropdown className="w-full flex flex-col justify-center items-center">
              <DropdownTrigger>
                <Button
                  color={getColor(index)}
                  isDisabled={!isActive}
                  data-cy={`concept-question-button-${index}`}
                >
                  {question.answer
                    ? question.answer
                    : dictionary['select-option']}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label={dictionary['description']}
                color="primary"
                variant="bordered"
                disallowEmptySelection
                selectionMode="single"
                onSelectionChange={(value) => {
                  const newConceptQuestionsDto = {
                    ...conceptQuestionsState,
                  };
                  newConceptQuestionsDto.questions[index].answer = Array.from(
                    value as Set<string>,
                  )[0];
                  setConceptQuestionsState(newConceptQuestionsDto);
                }}
              >
                {allConcepts.map((concept, index) => (
                  <DropdownItem
                    key={concept}
                    data-cy={`concept-answer-${index}`}
                  >
                    {concept}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </WrapperExercise>
      ))}
      {isActive && (
        <ExerciseBottom
          canSubmit={allAnswered() && isActive}
          loading={loading}
          submit={async () => {
            const formData = new FormData();
            formData.append('sessionId', sessionId);
            formData.append('answer', JSON.stringify(conceptQuestionsState));
            await handleSubmit(formData);
          }}
          descriptionSubmit={dictionary['submit']}
        />
      )}
    </>
  );
}
