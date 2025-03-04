import cron from 'node-cron';
import { competitionService } from '@/lib/services/competition-service';

export class CronProvider {
  public addCronJob(configuration: string, callback: () => void) {
    cron.schedule(configuration, callback);
  }
}

const cronProvider = new CronProvider();

// Here add the cron jobs (try to avoid scheduling in other places)
cronProvider.addCronJob('59 23 * * 0', () => {
  competitionService.finishCompetition().then(() => {
    console.log('Finished the competition');
  });
});
