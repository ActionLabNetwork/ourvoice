import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PostModerationRepository } from './post-moderation/post-moderation.repository';

@Injectable()
export class ScheduledModerationService {
  private readonly logger = new Logger(ScheduledModerationService.name);

  constructor(
    private readonly moderationPostRepository: PostModerationRepository,
  ) {}

  // Monday to Friday at 12 54am
  @Cron('0 54 12 * * 1-5')
  async handleCron() {
    await this.moderationPostRepository.approveOrRejectPosts();
    this.logger.debug('Ran scheduled moderation post approval/rejection');
  }
}
