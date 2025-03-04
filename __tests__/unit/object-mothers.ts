import { ConfigurationDto } from '@/lib/dto/configuration.dto';
import { StudySessionDto } from '@/lib/dto/study-session.dto';
import { UserDto } from '@/lib/dto/user.dto';
import {
  fakeArray,
  fakeArrayString,
  fakeBoolean,
  fakeDateString,
  fakeEmail,
  fakeFromArray,
  fakeInt,
  fakeLanguage,
  fakeName,
  fakeStringWithSpaces,
  fakeUrl,
  fakeUuid,
} from './fake';
import {
  ContentType,
  DocumentDto,
  DocumentWithOwnerDto,
} from '@/lib/dto/document.dto';
import { PartDto } from '@/lib/dto/part.dto';
import { SectionDto } from '@/lib/dto/section.dto';
import { QuizDto, QuizQuestionDto } from '@/lib/dto/quiz.dto';
import {
  ShortQuestionDto,
  ShortQuestionsDto,
} from '@/lib/dto/short-questions.dto';
import {
  TrueFalseQuestionDto,
  TrueFalseQuestionsDto,
} from '@/lib/dto/true-false.dto';
import {
  AnswerConceptoDto,
  ConceptDto,
  ConceptQuestionsDto,
} from '@/lib/dto/concept.dto';
import { BlockDto, BlockTypeDto } from '@/lib/dto/block.dto';
import {
  GeneralStatisticsDto,
  PartStatisticsDto,
} from '@/lib/dto/statistics.dto';
import { InvitationDto } from '@/lib/dto/invitation.dto';
import { SummaryDto } from '@/lib/dto/summary.dto';
import {
  DocumentCorrectReward,
  DocumentTotalReward,
} from '@/lib/reward/reward-document';
import {
  FirstExerciseReward,
  FirstQuizReward,
  FirstTrueFalseReward,
  AllCorrectQuizReward,
  AllCorrectConceptsReward,
} from '@/lib/reward/reward-exercise';
import { UserCorrectReward, UserTotalReward } from '@/lib/reward/reward-user';
import { ExerciseType, ReportReward } from '@/lib/reward/report';
import { Reward } from '@/lib/reward/reward';
import { CompleteCourseDto, CourseDto } from '@/lib/dto/course.dto';

export class UserMother {
  static create(overrides: Partial<UserDto> = {}): UserDto {
    return {
      id: fakeUuid(),
      money: fakeInt(0, 1000),
      isVerified: fakeBoolean(),
      name: fakeName(),
      email: fakeEmail(),
      ...overrides,
    };
  }
}

export class ConfigurationMother {
  static create(overrides: Partial<ConfigurationDto> = {}): ConfigurationDto {
    return {
      userId: fakeUuid(),
      usesPomodoro: fakeBoolean(),
      minutesWork: fakeInt(1, 10),
      minutesRest: fakeInt(1, 10),
      ...overrides,
    };
  }
}

export class SummaryMother {
  static create(overrides: Partial<SummaryDto> = {}): SummaryDto {
    return {
      title: fakeName(),
      partId: fakeUuid(),
      markdown: fakeStringWithSpaces(100, 8000),
      contentId: fakeUuid(),
      order: fakeInt(0, 10),
      ...overrides,
    };
  }
}

export class StudySessionMother {
  static create(overrides: Partial<StudySessionDto> = {}): StudySessionDto {
    return {
      id: fakeUuid(),
      userId: fakeUuid(),
      startTime: new Date(),
      exercises: fakeArrayString(1, 3),
      language: fakeLanguage(),
      activeExercise: fakeBoolean(),
      documentId: fakeUuid(),
      ...overrides,
    };
  }
}

export class DocumentMother {
  static create(overrides: Partial<DocumentDto> = {}): DocumentDto {
    return {
      id: fakeUuid(),
      filename: fakeName(),
      language: fakeLanguage(),
      isPublic: false,
      url: fakeUrl(),
      type: fakeFromArray([
        ContentType.FILE,
        ContentType.TEXT,
        ContentType.URL,
        ContentType.VIDEO,
      ]),
      ...overrides,
    };
  }
}

export class CourseMother {
  static create(overrides: Partial<CourseDto> = {}): CourseDto {
    return {
      id: fakeUuid(),
      title: fakeName(),
      language: fakeLanguage(),
      ownerId: fakeUuid(),
      ...overrides,
    };
  }
}

export class CompleteCourseMother {
  static create(overrides: Partial<CompleteCourseDto> = {}): CompleteCourseDto {
    return {
      id: fakeUuid(),
      title: fakeName(),
      language: fakeLanguage(),
      ownerId: fakeUuid(),
      description: fakeStringWithSpaces(100, 8000),
      slug: fakeName(),
      price: fakeInt(0, 1000),
      imageUrl: fakeUrl(),
      useSmartPricing: fakeBoolean(),
      keywords: fakeArrayString(1, 20),
      threshold: fakeInt(0, 100),
      ...overrides,
    };
  }
}

export class DocumentWithOwnerMother {
  static create(
    overrides: Partial<DocumentWithOwnerDto> = {},
  ): DocumentWithOwnerDto {
    return {
      id: fakeUuid(),
      filename: fakeName(),
      language: fakeLanguage(),
      ownerId: fakeUuid(),
      isPublic: false,
      url: fakeUrl(),
      type: fakeFromArray([
        ContentType.FILE,
        ContentType.TEXT,
        ContentType.URL,
        ContentType.VIDEO,
      ]),
      ...overrides,
    };
  }
}

export class PartMother {
  static create(overrides: Partial<PartDto> = {}): PartDto {
    return {
      id: fakeUuid(),
      name: fakeName(),
      order: fakeInt(0, 10),
      ...overrides,
    };
  }
}

export class SectionMother {
  static create(overrides: Partial<SectionDto> = {}): SectionDto {
    return {
      id: fakeUuid(),
      text: fakeName(),
      partId: fakeUuid(),
      documentId: fakeUuid(),
      ...overrides,
    };
  }
}

export class QuizQuestionMother {
  static create(overrides: Partial<QuizQuestionDto> = {}): QuizQuestionDto {
    return {
      id: fakeUuid(),
      question: fakeName(),
      partId: fakeUuid(),
      answers: fakeArrayString(4, 4),
      correctAnswer: fakeInt(0, 3),
      answer: fakeInt(0, 3),
      ...overrides,
    };
  }
}

export class QuizMother {
  static create(overrides: Partial<QuizDto> = {}): QuizDto {
    return {
      questions: fakeArray(QuizQuestionMother.create, 1, 10),
      documentId: fakeUuid(),
      partOrder: fakeInt(1, 30),
      ...overrides,
    };
  }
}

export class ShortQuestionMother {
  static create(overrides: Partial<ShortQuestionDto> = {}): ShortQuestionDto {
    return {
      id: fakeUuid(),
      question: fakeName(),
      rubric: fakeName(),
      partId: fakeUuid(),
      answer: fakeName(),
      ...overrides,
    };
  }
}

export class ShortQuestionsMother {
  static create(overrides: Partial<ShortQuestionsDto> = {}): ShortQuestionsDto {
    return {
      questions: fakeArray(ShortQuestionMother.create, 1, 3),
      documentId: fakeUuid(),
      partOrder: fakeInt(1, 30),
      ...overrides,
    };
  }
}

export class TrueFalseQuestionMother {
  static create(
    overrides: Partial<TrueFalseQuestionDto> = {},
  ): TrueFalseQuestionDto {
    return {
      id: fakeUuid(),
      question: fakeName(),
      isTrue: fakeBoolean(),
      partId: fakeUuid(),
      answer: fakeFromArray(['true', 'false']),
      ...overrides,
    };
  }
}

export class TrueFalseQuestionsMother {
  static create(
    overrides: Partial<TrueFalseQuestionsDto> = {},
  ): TrueFalseQuestionsDto {
    return {
      questions: fakeArray(TrueFalseQuestionMother.create, 1, 10),
      documentId: fakeUuid(),
      partOrder: fakeInt(1, 30),
      ...overrides,
    };
  }
}

export class ConceptMother {
  static create(overrides: Partial<ConceptDto> = {}): ConceptDto {
    return {
      id: fakeUuid(),
      partId: fakeUuid(),
      concept: fakeName(),
      definition: fakeName(),
      ...overrides,
    };
  }
}

export class ConceptQuestionMother {
  static create(overrides: Partial<AnswerConceptoDto> = {}): AnswerConceptoDto {
    return {
      ...ConceptMother.create(),
      answer: fakeName(),
      ...overrides,
    };
  }
}

export class ConceptQuestionsMother {
  static create(
    overrides: Partial<ConceptQuestionsDto> = {},
  ): ConceptQuestionsDto {
    return {
      concepts: fakeArrayString(1, 3),
      questions: fakeArray(ConceptQuestionMother.create, 1, 3),
      documentId: fakeUuid(),
      partOrder: fakeInt(1, 30),
      ...overrides,
    };
  }
}

export class BlockMother {
  static create(overrides: Partial<BlockDto> = {}): BlockDto {
    if (!overrides.type) {
      overrides.type = fakeFromArray([
        BlockTypeDto.QUIZ,
        BlockTypeDto.SHORT,
        BlockTypeDto.TRUE_FALSE,
        BlockTypeDto.CONCEPT,
      ]);
    }

    if (!overrides.content) {
      switch (overrides.type) {
        case BlockTypeDto.QUIZ:
          overrides.content = QuizMother.create();
          break;
        case BlockTypeDto.SHORT:
          overrides.content = ShortQuestionsMother.create();
          break;
        case BlockTypeDto.TRUE_FALSE:
          overrides.content = TrueFalseQuestionsMother.create();
          break;
        case BlockTypeDto.CONCEPT:
          overrides.content = ConceptQuestionsMother.create();
          break;
      }
    }

    return {
      id: overrides.id || fakeUuid(),
      type: overrides.type,
      order: overrides.order || fakeInt(0, 100),
      content: overrides.content,
    };
  }
}

export class PartStatisticsMother {
  static create(overrides: Partial<PartStatisticsDto> = {}): PartStatisticsDto {
    return {
      userId: fakeUuid(),
      partId: fakeUuid(),
      totalConceptQuestions: fakeInt(0, 100),
      correctConceptQuestions: fakeInt(0, 100),
      totalFlashcards: fakeInt(0, 100),
      correctFlashcards: fakeInt(0, 100),
      totalQuizQuestions: fakeInt(0, 100),
      correctQuizQuestions: fakeInt(0, 100),
      totalShortQuestions: fakeInt(0, 100),
      correctShortQuestions: fakeInt(0, 100),
      totalTrueFalseQuestions: fakeInt(0, 100),
      correctTrueFalseQuestions: fakeInt(0, 100),
      ...overrides,
    };
  }
}

export class InvitationMother {
  static create(overrides: Partial<InvitationDto> = {}): InvitationDto {
    return {
      userId: fakeUuid(),
      invitationToken: fakeUuid(),
      invitationCount: fakeInt(0, 5),
      validUntil: new Date(),
      ...overrides,
    };
  }
}

type PropertiesConstructorReward = {
  id: string;
  money: number;
  goal: number;
  documentId: string;
  progress: number;
};

export class UserCorrectRewardMother {
  static create(
    overrides: Partial<PropertiesConstructorReward> = {},
  ): UserCorrectReward {
    return new UserCorrectReward(
      overrides.id ?? fakeUuid(),
      overrides.money ?? fakeInt(0, 100),
      overrides.goal ?? fakeInt(1, 100),
      overrides.documentId ?? fakeUuid(),
      overrides.progress ?? fakeInt(0, 100),
    );
  }
}

export class UserTotalRewardMother {
  static create(
    overrides: Partial<PropertiesConstructorReward> = {},
  ): UserTotalReward {
    return new UserTotalReward(
      overrides.id ?? fakeUuid(),
      overrides.money ?? fakeInt(0, 100),
      overrides.goal ?? fakeInt(1, 100),
      overrides.documentId ?? fakeUuid(),
      overrides.progress ?? fakeInt(0, 100),
    );
  }
}

export class DocumentCorrectRewardMother {
  static create(
    overrides: Partial<PropertiesConstructorReward> = {},
  ): DocumentCorrectReward {
    return new DocumentCorrectReward(
      overrides.id ?? fakeUuid(),
      overrides.money ?? fakeInt(0, 100),
      overrides.goal ?? fakeInt(1, 100),
      overrides.documentId ?? fakeUuid(),
      overrides.progress ?? fakeInt(0, 100),
    );
  }
}

export class DocumentTotalRewardMother {
  static create(
    overrides: Partial<PropertiesConstructorReward> = {},
  ): DocumentTotalReward {
    return new DocumentTotalReward(
      overrides.id ?? fakeUuid(),
      overrides.money ?? fakeInt(0, 100),
      overrides.goal ?? fakeInt(1, 100),
      overrides.documentId ?? fakeUuid(),
      overrides.progress ?? fakeInt(0, 100),
    );
  }
}

export class FirstExerciseRewardMother {
  static create(
    overrides: Partial<PropertiesConstructorReward> = {},
  ): FirstExerciseReward {
    return new FirstExerciseReward(
      overrides.id ?? fakeUuid(),
      overrides.money ?? fakeInt(0, 100),
      overrides.goal ?? fakeInt(1, 100),
      overrides.documentId ?? fakeUuid(),
      overrides.progress ?? fakeInt(0, 100),
    );
  }
}

export class FirstQuizRewardMother {
  static create(
    overrides: Partial<PropertiesConstructorReward> = {},
  ): FirstQuizReward {
    return new FirstQuizReward(
      overrides.id ?? fakeUuid(),
      overrides.money ?? fakeInt(0, 100),
      overrides.goal ?? fakeInt(1, 100),
      overrides.documentId ?? fakeUuid(),
      overrides.progress ?? fakeInt(0, 100),
    );
  }
}

export class FirstTrueFalseRewardMother {
  static create(
    overrides: Partial<PropertiesConstructorReward> = {},
  ): FirstTrueFalseReward {
    return new FirstTrueFalseReward(
      overrides.id ?? fakeUuid(),
      overrides.money ?? fakeInt(0, 100),
      overrides.goal ?? fakeInt(1, 100),
      overrides.documentId ?? fakeUuid(),
      overrides.progress ?? fakeInt(0, 100),
    );
  }
}

export class AllCorrectQuizRewardMother {
  static create(
    overrides: Partial<PropertiesConstructorReward> = {},
  ): AllCorrectQuizReward {
    return new AllCorrectQuizReward(
      overrides.id ?? fakeUuid(),
      overrides.money ?? fakeInt(0, 100),
      overrides.goal ?? fakeInt(1, 100),
      overrides.documentId ?? fakeUuid(),
      overrides.progress ?? fakeInt(0, 100),
    );
  }
}

export class AllCorrectConceptsRewardMother {
  static create(
    overrides: Partial<PropertiesConstructorReward> = {},
  ): AllCorrectConceptsReward {
    return new AllCorrectConceptsReward(
      overrides.id ?? fakeUuid(),
      overrides.money ?? fakeInt(0, 100),
      overrides.goal ?? fakeInt(1, 100),
      overrides.documentId ?? fakeUuid(),
      overrides.progress ?? fakeInt(0, 100),
    );
  }
}

export class RewardMother {
  static create(overrides: Partial<PropertiesConstructorReward> = {}): Reward {
    const MotherClass = fakeFromArray([
      UserCorrectReward,
      UserTotalReward,
      FirstExerciseReward,
      FirstQuizReward,
      FirstTrueFalseReward,
      AllCorrectQuizReward,
      AllCorrectConceptsReward,
      DocumentCorrectReward,
      DocumentTotalReward,
    ]);

    return new MotherClass(
      overrides.id ?? fakeUuid(),
      overrides.money ?? fakeInt(0, 100),
      overrides.goal ?? fakeInt(1, 100),
      overrides.documentId ?? fakeUuid(),
      overrides.progress ?? fakeInt(0, 100),
    );
  }
}

export class ReportRewardMother {
  static create(overrides: Partial<ReportReward> = {}): ReportReward {
    return {
      documentId: fakeUuid(),
      totalQuestions: fakeInt(0, 100),
      correctQuestions: fakeInt(0, 100),
      exerciseType: fakeFromArray(Object.values(ExerciseType)),
      ...overrides,
    };
  }
}

export class GeneralStatisticsDtoMother {
  static create(
    overrides: Partial<GeneralStatisticsDto> = {},
  ): GeneralStatisticsDto {
    return {
      userId: fakeUuid(),
      date: fakeDateString(),
      totalConceptQuestions: fakeInt(0, 100),
      correctConceptQuestions: fakeInt(0, 100),
      totalFlashcards: fakeInt(0, 100),
      correctFlashcards: fakeInt(0, 100),
      totalQuizQuestions: fakeInt(0, 100),
      correctQuizQuestions: fakeInt(0, 100),
      totalShortQuestions: fakeInt(0, 100),
      correctShortQuestions: fakeInt(0, 100),
      totalTrueFalseQuestions: fakeInt(0, 100),
      correctTrueFalseQuestions: fakeInt(0, 100),
      ...overrides,
    };
  }
}

export class UserCompetitionDtoMother {
  public static create(
    overrides: Partial<UserCompetitionDto> = {},
  ): UserCompetitionDto {
    return {
      userId: fakeUuid(),
      name: fakeName(),
      score: fakeInt(0, 100),
      ...overrides,
    };
  }
}
