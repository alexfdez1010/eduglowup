import { defineConfig } from 'cypress';

import { repositories } from '@/lib/repositories/repositories';
import { UserWithPasswordDto } from '@/lib/dto/user.dto';
import { dictionaries } from '@/app/[locale]/dictionaries';
import { getRandomLanguage } from '@/cypress/support/utils';
import { UUID } from '@/lib/uuid';
import { Graph } from '@/lib/graph';
import { QuizDto, QuizQuestionDto } from '@/lib/dto/quiz.dto';
import { BlockDto, BlockTypeDto } from '@/lib/dto/block.dto';
import { invitationService } from '@/lib/services/invitation-service';
import { userService } from '@/lib/services/user-service';
import { competitionService } from '@/lib/services/competition-service';
import { ContentType } from './lib/dto/document.dto';
import { CourseDto } from '@/lib/dto/course.dto';
import { courseId } from '@/cypress/support/constants';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    video: true,
    defaultCommandTimeout: 30000,
    viewportWidth: 1600,
    viewportHeight: 900,
    setupNodeEvents(on, config) {
      on('task', {
        /**
         * Adds a user to the database.
         * Adds the user to the database and also hashes the password.
         *
         * @param user : UserWithPasswordDto - The user to be added
         * @returns UserWithPasswordDto - The user that was added (Different object but same data as the one passed as parameter).
         * */
        async addToDatabaseUser(
          user: UserWithPasswordDto,
        ): Promise<UserWithPasswordDto> {
          user.id = await userService.registerUser(
            user.email,
            user.name,
            user.password,
            user.isVerified,
          );

          return user;
        },
      });

      on('task', {
        /**
         * Set null as password for a user (to convert a user logged with email to one logged with Google)
         *
         * @param email : string - The email of the user
         * */
        async nullablePassword(email: string) {
          const userId = (await repositories.user.getUserByEmail(email)).id;
          await repositories.user.updatePassword(userId, null);
          return true;
        },
      });

      on('task', {
        /**
         * Remove a user from the database.
         *
         * @param email : string - The email of the user to be deleted
         * @returns boolean - True if the user was deleted, false otherwise
         * */
        async removeUser(email: string) {
          const user = await repositories.user.getUserByEmail(email);
          await repositories.user.deleteUser(user.id);
          return true;
        },
      });

      on('task', {
        /**
         * Cypress logger method.
         * Prints in Node.js console the output that should otherwise, be displayed on cypress.
         * */
        async logger(message) {
          console.log(message);
          return null;
        },
      });

      on('task', {
        /**
         * Get the OTP code of the user wth the given email
         * @param email - The email of the user
         * @returns The OTP code of the user
         * */
        async getCodeOTP(email: string) {
          const user = await repositories.user.getUserByEmail(email);
          return (await repositories.user.getCodeOTP(user.id)).code;
        },
      });

      on('task', {
        /**
         * Get a user using the given email
         * @param email - The email of the user
         * @returns The user with the given email
         * */
        async getUserByEmail(email: string) {
          return await repositories.user.getUserByEmail(email);
        },
      });

      on('task', {
        /**
         * Get the dictionary of a language
         * @param locale - The locale of the dictionary
         * @param key - The key of the dictionary
         * @returns The dictionary of the language
         */
        async getDictionaryOnCypress({
          locale,
          key,
        }: {
          locale: string;
          key: string;
        }) {
          return dictionaries[locale][key];
        },
      });

      on('task', {
        async addCourseToDatabase(course: CourseDto) {
          await repositories.course.createCourse(course);

          return await repositories.course.getCourse(course.id);
        },
      });

      on('task', {
        /**
         * Create a test study session
         * @param userId - The id of the user who will own the document
         * @param documentId - The id of the document
         * @returns The id of the session
         * */
        async insertTestStudySession({
          userId,
          documentId,
        }: {
          userId: string;
          documentId: string;
        }) {
          const sessionId = UUID.generate();

          await repositories.studySession.createSession({
            id: sessionId,
            userId: userId,
            startTime: new Date(),
            documentId: documentId,
            language: getRandomLanguage(),
            exercises: ['quiz'],
            activeExercise: false,
          });

          const parts =
            await repositories.document.getPartsByDocument(documentId);
          const part = parts[0];

          const questions: QuizQuestionDto[] = [
            {
              id: UUID.generate(),
              question: 'What is the capital of France?',
              partId: part.id,
              correctAnswer: 1,
              answers: ['London', 'Paris', 'Berlin', 'Madrid'],
              answer: 1,
              isCorrect: false,
            },
            {
              id: UUID.generate(),
              question: 'What is the capital of Spain?',
              partId: part.id,
              correctAnswer: 0,
              answers: ['Madrid', 'Barcelona', 'Valencia', 'Sevilla'],
              answer: 1,
              isCorrect: false,
            },
          ];

          const quiz: QuizDto = {
            documentId: documentId,
            partOrder: 3,
            questions: questions,
          };

          const block: BlockDto = {
            type: BlockTypeDto.QUIZ,
            order: 0,
            content: quiz,
          };

          const newQuiz = {
            documentId: documentId,
            partOrder: 3,
            questions: questions.map((question) => {
              return {
                id: question.id,
                question: question.question,
                partId: question.partId,
                answers: question.answers,
                answer: -1,
              };
            }),
          };

          const newBlock: BlockDto = {
            type: BlockTypeDto.QUIZ,
            order: 1,
            content: newQuiz,
          };

          await Promise.all([
            repositories.studySession.addBlock(sessionId, block),
            repositories.quizQuestions.storeQuestions(questions),
            repositories.studySession.setNextExercise(sessionId, newBlock),
          ]);

          return sessionId;
        },
      });

      on('task', {
        /**
         * Get the time spent by a user
         * @param email - The email of the user
         * @returns The time spent by the user
         * */
        async getTimeSpent(email: string): Promise<number> {
          const user = await repositories.user.getUserByEmail(email);
          const statistic = await prismaGlobal.userStatistics.findFirst({
            where: {
              userId: user.id,
            },
          });

          return statistic?.minutesOnApp || 0;
        },
      });

      on('task', {
        /**
         * Get the invitation code of a user
         * @param email - The email of the user
         * @returns The invitation link of the user
         * */
        async getInvitation(email: string) {
          const user = await repositories.user.getUserByEmail(email);
          return await invitationService.getInvitationOfUser(user.id);
        },
      });

      on('task', {
        /**
         * Finish the competition
         */
        async finishCompetition() {
          await competitionService.finishCompetition();
          return true;
        },
      });

      on('task', {
        /**
         * Increments the score of a user in a week
         * @param email The email of the user
         * @param score The score to increment
         */
        async incrementScore({
          email,
          score,
        }: {
          email: string;
          score: number;
        }) {
          const userId = await repositories.user
            .getUserByEmail(email)
            .then((user) => user.id);
          const week = competitionService.getCurrentWeek();
          await repositories.competition.increaseScore(userId, week, score);
          return true;
        },
      });

      on('task', {
        /**
         * Make two users friends
         */
        async makeFriends({
          email1,
          email2,
        }: {
          email1: string;
          email2: string;
        }) {
          const user1 = await repositories.user.getUserByEmail(email1);
          const user2 = await repositories.user.getUserByEmail(email2);

          await repositories.competition.addUserToFriends(user1.id, user2.id);

          return true;
        },
      });

      on('task', {
        /**
         * Get the money of a user
         *
         * @param email : String - The email of the user
         * @returns The money of the user
         * */
        async getMoney(email: string) {
          const user = await repositories.user.getUserByEmail(email);
          return user.money;
        },
      });

      on('task', {
        /**
         * Insert test document to the database
         * @param userId - The id of the user who will own the document
         */
        async insertTestDocument(userId: string) {
          const course = {
            id: courseId,
            title: 'Test course',
            language: getRandomLanguage(),
            ownerId: userId,
          };

          const document = {
            id: UUID.generate(),
            filename: 'test.pdf',
            language: getRandomLanguage(),
            ownerId: userId,
            isPublic: false,
            url: 'https://example.com/test.pdf',
            type: ContentType.FILE,
          };

          const parts = [
            {
              id: UUID.generate(),
              name: 'Introduction',
              order: 1,
              documentId: document.id,
            },
            {
              id: UUID.generate(),
              name: 'Part 1',
              order: 2,
              documentId: document.id,
            },
            {
              id: UUID.generate(),
              name: 'Part 2',
              order: 3,
              documentId: document.id,
            },
          ];

          const sections = [
            {
              id: UUID.generate(),
              text: 'Friedrich Nietzsche, a 19th-century philosopher, is known for his radical ideas that challenged traditional values and beliefs. He critiqued religion, morality, and the philosophical foundations of Western thought. One of his key concepts is the "death of God," which refers not to the literal demise of a deity but to the collapse of belief in the traditional Christian God. Nietzsche argued that this cultural shift would have profound implications, as it would leave society without a moral compass or higher purpose, leading to nihilism, the belief that life lacks inherent meaning or value. He believed that people must create their own values to overcome nihilism.',
              partId: parts[0].id,
              documentId: document.id,
            },
            {
              id: UUID.generate(),
              text: 'In response to the nihilism he foresaw, Nietzsche introduced the idea of the "Übermensch" or "Overman." This concept represents an individual who transcends conventional morality and societal norms to create new values and meaning for themselves. The Übermensch embraces life’s struggles, asserting their own will and shaping their own destiny. For Nietzsche, this was the antidote to nihilism: a new kind of human who could live authentically and joyfully despite the absence of a universal moral order. This vision was deeply personal and existential, aiming to inspire individuals to take responsibility for their own lives in a world devoid of predetermined meaning.',
              partId: parts[1].id,
              documentId: document.id,
            },
            {
              id: UUID.generate(),
              text: 'Nietzsche’s philosophy is also marked by the concept of "eternal recurrence," the idea that all events in life are endlessly repeated in an infinite loop. Nietzsche proposed this as a thought experiment: if you had to live your life over and over again, would you be willing to embrace it? This idea challenges individuals to live as though every action and decision would recur eternally, encouraging a deep sense of responsibility for one’s choices. Nietzsche’s overall philosophy, then, is one of empowerment, urging individuals to overcome societal constraints, face life’s difficulties, and affirm their existence with creativity and strength.',
              partId: parts[2].id,
              documentId: document.id,
            },
          ];

          const edges = [
            {
              from: parts[0],
              to: parts[1],
            },
            {
              from: parts[1],
              to: parts[2],
            },
          ];

          const graph = new Graph(parts, edges);

          await repositories.course.createCourse(course);

          await repositories.document.createDocument(document);
          await repositories.document.createParts(document.id, parts);
          await Promise.all([
            repositories.document.createSections(sections),
            repositories.document.createGraphOfParts(document.id, graph),
          ]);

          await repositories.document.addContentToCourse(
            document.id,
            course.id,
          );

          const summary = `# Testimonios-Principios Guía-Contenidos-Sección I: Cómo Llegamos Aquí

## Introducción

  - El libro "ACQUISITION.COM VOLUME I: $100M OFFERS" de Alex Hormozi
  - Se centra en la creación de ofertas irresistibles para atraer clientes
  - La importancia de la habilidad para hacer ofertas en el éxito empresarial
  - El objetivo del libro es enseñar a crear ofertas que hagan que los clientes se sientan estúpidos por decir que no

## Cómo Llegamos Aquí

  - La historia personal de Alex Hormozi y su lucha por encontrar el éxito empresarial
  - La importancia de aprender de los errores y fracasos
  - La creación de la empresa "Gym Launch" y el éxito que logró
  - La importancia de la confianza y el apoyo en el camino hacia el éxito

## Principios Guía

  - No hay reglas fijas en el negocio
  - La importancia de ser audaz y tomar riesgos calculados
  - La habilidad para crear ofertas irresistibles es clave para el éxito empresarial
  - La importancia de la práctica y la perseverancia en el desarrollo de habilidades

## La Oferta Perfecta

  - La creación de una oferta que haga que los clientes se sientan estúpidos por decir que no
  - La importancia de entender las necesidades y deseos de los clientes
  - La creación de un valor agregado que justifique el precio de la oferta
  - La importancia de la presentación y la comunicación de la oferta

## Aprendizaje Rápido

  - La importancia de leer y escuchar al mismo tiempo para aumentar la velocidad de lectura y la retención de información
  - La utilización de la tecnología para mejorar la eficiencia y la productividad

## La Historia de Éxito de Alex Hormozi

  - La creación de una empresa que genera $1,600,000 por semana
  - La importancia de la creación de un valor agregado y la habilidad para comunicarlo
  - La importancia de la confianza y el apoyo en el camino hacia el éxito

## Conclusión

  - La habilidad para crear ofertas irresistibles es clave para el éxito empresarial
  - La importancia de la práctica y la perseverancia en el desarrollo de habilidades
  - La creación de un valor agregado que justifique el precio de la oferta
  - La importancia de la presentación y la comunicación de la oferta
`;

          await repositories.document.setPartSummary(parts[0].id, summary);

          return document;
        },
      });
    },
  },
});
