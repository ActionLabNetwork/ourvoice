import { ModerationPublishFrequency } from './../../types/general';
import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { PostModerationRepository } from './post-moderation/post-moderation.repository';
import getDeploymentConfig from '../../config/deployment';
import { CronJob } from 'cron';
import { CommentModerationRepository } from './comment-moderation/comment-moderation.repository';

function convertFrequencyToCron(frequency: {
  unit: string;
  value: number;
}): string {
  const { unit, value } = frequency;

  switch (unit) {
    case 'minutes':
      if (value < 0 || value > 59) {
        throw new Error(`Invalid minutes value: ${value}`);
      }
      return `*/${value} * * * *`;
    case 'hours':
      if (value < 0 || value > 23) {
        throw new Error(`Invalid hours value: ${value}`);
      }
      return `0 */${value} * * *`;
    case 'days':
      if (value < 0 || value > 31) {
        throw new Error(`Invalid days value: ${value}`);
      }
      return `0 0 */${value} * *`;
    case 'exact-minutes':
      if (value < 0 || value > 59) {
        throw new Error(`Invalid minutes value: ${value}`);
      }
      return `*/${value} * * * *`;
    case 'exact-hours':
      if (value < 0 || value > 23) {
        throw new Error(`Invalid hours value: ${value}`);
      }
      return `0 ${value} * * *`;
    default:
      throw new Error(`Unsupported frequency unit: ${unit}`);
  }
}

@Injectable()
export class ScheduledModerationService {
  private readonly logger = new Logger(ScheduledModerationService.name);
  private readonly config = getDeploymentConfig();

  constructor(
    private readonly moderationPostRepository: PostModerationRepository,
    private readonly moderationCommentRepository: CommentModerationRepository,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  async handleCron() {
    const promises = [
      this.moderationPostRepository.publishOrArchivePosts(),
      this.moderationCommentRepository.publishOrArchiveComments(),
    ];

    await Promise.all(promises);
    this.logger.debug(
      'Ran scheduled moderation post and comment approval/rejection',
    );
  }

  onModuleInit() {
    const postFrequency: ModerationPublishFrequency = this.config[
      'postFrequency'
    ] satisfies ModerationPublishFrequency;
    const cronTime = convertFrequencyToCron(postFrequency);
    const job = new CronJob(cronTime, () => this.handleCron());

    this.logger.log(
      `Adding a cron job for publishing post and comment every ${postFrequency.value} ${postFrequency.unit} `,
    );
    this.schedulerRegistry.addCronJob('publishPostAndComment', job);
    job.start();
  }
}
