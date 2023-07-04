import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService as MainPrismaService } from '../../database/main/prisma.service';
import { PrismaService as PremoderationPrismaService } from '../../database/premoderation/prisma.service';
import { PollCreateDto } from './dto/poll-create.dto';
import { PollModerationRepository } from './poll-moderation.repository';
import { PollRepository } from './poll.repository';
import { PollService } from './poll.service';

describe('PollService', () => {
  let pollService: PollService;

  let mainPrisma: MainPrismaService;
  let premoderationPrisma: PremoderationPrismaService;

  const testDateBeforeExpiry = new Date(2023, 5, 1, 0, 0, 0, 0);
  const testDateAfterExpiry = new Date(2023, 7, 1, 0, 0, 0, 0);
  const testDateExpiry = new Date(2023, 6, 1, 0, 0, 0, 0);
  const testPoll: PollCreateDto = {
    question: 'test question',
    published: true,
    active: true,
    weight: 1,
    expiresAt: testDateExpiry,
    options: [
      { option: 'option 1' },
      { option: 'option 2' },
      { option: 'option 3' },
    ],
  };
  const testNewOptions = [
    { option: 'new option 1' },
    { option: 'new option 2' },
  ];
  const testVotes = [
    { voterHash: 'a', optionIdx: 0 },
    { voterHash: 'b', optionIdx: 0 },
    { voterHash: 'c', optionIdx: 1 },
    { voterHash: 'd', optionIdx: 1 },
    { voterHash: 'e', optionIdx: 2 },
  ];

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        MainPrismaService,
        PremoderationPrismaService,
        PollRepository,
        PollModerationRepository,
        PollService,
      ],
    }).compile();
    pollService = moduleRef.get(PollService);
    mainPrisma = moduleRef.get(MainPrismaService);
    premoderationPrisma = moduleRef.get(PremoderationPrismaService);

    await mainPrisma.$connect();
    await premoderationPrisma.$connect();
  });

  afterAll(async () => {
    await mainPrisma.$disconnect();
    await premoderationPrisma.$disconnect();
  });

  beforeEach(async () => {
    await mainPrisma.poll.deleteMany({});
    await mainPrisma.pollOption.deleteMany({});
    await premoderationPrisma.pollVote.deleteMany({});
    await premoderationPrisma.pollVoterVoted.deleteMany({});
  });

  afterEach(async () => {
    jest.useRealTimers();
  });

  function setDate(date: Date) {
    // for "nextTick" see https://github.com/prisma/prisma/issues/7424
    jest.useFakeTimers({ now: date, doNotFake: ['nextTick'] });
  }

  async function expectOnlyOnePoll() {
    const retrievedPolls = await mainPrisma.poll.findMany({
      include: { options: true },
    });
    expect(retrievedPolls.length).toBe(1);
    return retrievedPolls[0];
  }

  it('should create a poll', async () => {
    await pollService.createPoll(testPoll);

    const poll = await expectOnlyOnePoll();
    expect(poll).toMatchObject(testPoll);
  });

  it('should update a poll', async () => {
    const createdPoll = await pollService.createPoll(testPoll);

    const updatedPoll = await pollService.updatePoll(createdPoll.id, {
      active: false,
    });
    const poll = await expectOnlyOnePoll();

    expect(poll.active).toBe(false);
  });

  it('should update expiring date to null', async () => {
    const createdPoll = await pollService.createPoll(testPoll);

    await pollService.updatePoll(createdPoll.id, { expiresAt: null });
    const poll = await expectOnlyOnePoll();
    expect(poll.expiresAt).toBe(null);
  });

  it('should not update expiring date with undefined', async () => {
    const createdPoll = await pollService.createPoll(testPoll);

    await pollService.updatePoll(createdPoll.id, { expiresAt: undefined });
    const poll = await expectOnlyOnePoll();
    expect(poll.expiresAt).toEqual(testPoll.expiresAt);
  });

  it('should update question', async () => {
    const createdPoll = await pollService.createPoll(testPoll);

    await pollService.updatePoll(createdPoll.id, { question: 'new question' });
    expect((await expectOnlyOnePoll()).question).toEqual('new question');
  });

  // when updating the options, all the old ones are deleted to prevent some race conditions
  it('should update options with new id', async () => {
    const createdPoll = await pollService.createPoll(testPoll);
    await pollService.updatePoll(createdPoll.id, { options: testNewOptions });
    const updatedPoll = await expectOnlyOnePoll();
    expect(updatedPoll.options.map((option) => option.option)).toEqual(
      testNewOptions.map((option) => option.option),
    );
    const oldOptionIds = createdPoll.options.map((option) => option.id);
    const newOptionIds = updatedPoll.options.map((option) => option.id);
    for (const id of oldOptionIds) {
      expect(newOptionIds).not.toContain(id);
    }
  });

  it('should fail to update question or options if there is a vote', async () => {
    const createdPoll = await pollService.createPoll(testPoll);
    await pollService.vote({
      pollId: createdPoll.id,
      optionId: createdPoll.options[0].id,
      voterHash: '',
    });

    await expect(async () => {
      await pollService.updatePoll(createdPoll.id, { options: testNewOptions });
    }).rejects.toThrow(BadRequestException);
    await expect(async () => {
      await pollService.updatePoll(createdPoll.id, {
        question: 'new question',
      });
    });
  });

  it('should delete a poll', async () => {
    const createdPoll1 = await pollService.createPoll(testPoll);
    const createdPoll2 = await pollService.createPoll(testPoll);

    await pollService.removePoll(createdPoll2.id);
    const retrievedPoll = await expectOnlyOnePoll();
    expect(retrievedPoll).toEqual(createdPoll1);
  });

  it('should fail to delete a poll if there are already votes', async () => {
    const createdPoll = await pollService.createPoll(testPoll);
    await pollService.vote({
      pollId: createdPoll.id,
      optionId: createdPoll.options[0].id,
      voterHash: '',
    });
    await expect(async () => {
      await pollService.removePoll(createdPoll.id);
    }).rejects.toThrow(BadRequestException);
  });

  it('should display correct results', async () => {
    const createdPoll = await pollService.createPoll(testPoll);

    for (const vote of testVotes) {
      await pollService.vote({
        pollId: createdPoll.id,
        optionId: createdPoll.options[vote.optionIdx].id,
        voterHash: vote.voterHash,
      });
    }

    const results = await pollService.getPollsWithResult('');
    expect(results.length).toBe(1);
    const result = results[0];
    expect(result.options.sort()).toEqual([
      // values depend on testVotes
      { ...createdPoll.options[0], numVotes: 2 },
      { ...createdPoll.options[1], numVotes: 2 },
      { ...createdPoll.options[2], numVotes: 1 },
    ]);
  });

  it('should not let the user to vote twice', async () => {
    const createdPoll = await pollService.createPoll(testPoll);
    await pollService.vote({
      pollId: createdPoll.id,
      optionId: createdPoll.options[0].id,
      voterHash: 'a',
    });

    await expect(async () => {
      await pollService.vote({
        pollId: createdPoll.id,
        optionId: createdPoll.options[0].id,
        voterHash: 'a',
      });
    }).rejects.toThrow(BadRequestException);
  });

  it('should display the stats or not depending the number of people voted', async () => {
    const createdPoll = await pollService.createPoll(testPoll);

    let voteResult = await pollService.vote({
      pollId: createdPoll.id,
      optionId: createdPoll.options[2].id,
      voterHash: 'A',
    });

    expect(voteResult.stats).toBe(null);

    for (const vote of testVotes) {
      await pollService.vote({
        pollId: createdPoll.id,
        optionId: createdPoll.options[vote.optionIdx].id,
        voterHash: vote.voterHash,
      });
    }

    voteResult = await pollService.vote({
      pollId: createdPoll.id,
      optionId: createdPoll.options[2].id,
      voterHash: 'B',
    });
    expect(voteResult.stats.sort()).toEqual(
      // result depends on testVotes and the votes above
      [
        { optionId: createdPoll.options[0].id, proportion: 2 / 7 },
        { optionId: createdPoll.options[1].id, proportion: 2 / 7 },
        { optionId: createdPoll.options[2].id, proportion: 3 / 7 },
      ].sort(),
    );
  });

  it('should not let user to vote if poll is inactive', async () => {
    const createdPoll = await pollService.createPoll({
      ...testPoll,
      active: false,
    });

    // setDate(testDateAfterExpiry)
    await expect(async () => {
      await pollService.vote({
        pollId: createdPoll.id,
        optionId: createdPoll.options[0].id,
        voterHash: 'a',
      });
    }).rejects.toThrow(BadRequestException);
  });

  it('should not let user to vote after expiry date', async () => {
    const createdPoll = await pollService.createPoll(testPoll);
    setDate(testDateAfterExpiry);
    await expect(async () => {
      await pollService.vote({
        pollId: createdPoll.id,
        optionId: createdPoll.options[0].id,
        voterHash: 'a',
      });
    }).rejects.toThrow(BadRequestException);
  });

  it.each`
    poll                                          | currentTime             | shouldDisplay | description
    ${{ ...testPoll, expiresAt: null }}           | ${testDateAfterExpiry}  | ${true}       | ${'has no expiry date'}
    ${{ ...testPoll, expiresAt: testDateExpiry }} | ${testDateBeforeExpiry} | ${true}       | ${'before expiry'}
    ${{ ...testPoll, expiresAt: testDateExpiry }} | ${testDateAfterExpiry}  | ${false}      | ${'after expiry'}
    ${{ ...testPoll, active: false }}             | ${testDateAfterExpiry}  | ${false}      | ${'is inactive'}
  `(
    'should display / not display to the user a poll that $description',
    async ({ poll, currentTime, shouldDisplay }) => {
      setDate(currentTime);
      const createdPoll = await pollService.createPoll(poll);
      const availablePolls = await pollService.getAvailablePolls('');

      if (shouldDisplay) {
        expect(availablePolls.length).toEqual(1);
        expect(availablePolls[0]).toEqual(createdPoll);
      } else {
        expect(availablePolls.length).toEqual(0);
      }
    },
  );

  it('should not display to the user a voted poll', async () => {
    setDate(testDateBeforeExpiry);
    const createdPoll = await pollService.createPoll({
      ...testPoll,
      expiresAt: testDateExpiry,
    });

    await pollService.vote({
      pollId: createdPoll.id,
      optionId: createdPoll.options[0].id,
      voterHash: 'user',
    });

    const availablePolls = await pollService.getAvailablePolls('user');
    expect(availablePolls.length).toEqual(0);
  });
});
