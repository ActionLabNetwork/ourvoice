import { Test } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from './post.service';

describe('PostController', () => {
  let postController: PostController;
  let postService: PostService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PostController],
      providers: [PostService],
    }).compile();

    postService = moduleRef.get<PostService>(PostService);
    postController = moduleRef.get<PostController>(PostController);
  });

  describe('createPost', () => {
    it('should create a post', async () => {
      const postData = { title: 'Test post', body: 'This is a test post' };

      jest
        .spyOn(postService, 'createPost')
        .mockResolvedValueOnce(postData as any);

      const result = await postController.createPost(postData as any);

      expect(result).toEqual(postData);
    });
  });

  describe('getPostById', () => {
    it('should get a post by id', async () => {
      const postId = 1;
      const postData = {
        id: postId,
        title: 'Test post',
        body: 'This is a test post',
      };

      jest
        .spyOn(postService, 'getPostById')
        .mockResolvedValueOnce(postData as any);

      const result = await postController.getPostById(postId);

      expect(result).toEqual(postData);
    });
  });

  describe('getPostsByCategories', () => {
    it('should get posts by categories', async () => {
      const categoryNames = 'sports,news';
      const postData = [
        {
          id: 1,
          title: 'Sports post',
          body: 'This is a sports post',
          categories: ['sports'],
        },
        {
          id: 2,
          title: 'News post',
          body: 'This is a news post',
          categories: ['news'],
        },
      ];

      jest
        .spyOn(postService, 'getPostsByCategories')
        .mockResolvedValueOnce(postData as any);

      const result = await postController.getPostsByCategories(categoryNames);

      expect(result).toEqual(postData);
    });
  });

  describe('updatePost', () => {
    it('should update a post', async () => {
      const postId = 1;
      const updateData = {
        title: 'Updated post',
        body: 'This is an updated post',
      };
      const updatedPostData = { id: postId, ...updateData };

      jest
        .spyOn(postService, 'updatePost')
        .mockResolvedValueOnce(updatedPostData as any);

      const result = await postController.updatePost(postId, updateData as any);

      expect(result).toEqual(updatedPostData);
    });
  });

  describe('deletePost', () => {
    it('should delete a post', async () => {
      const postId = 1;
      const postData = {
        id: postId,
        title: 'Test post',
        body: 'This is a test post',
      };

      jest
        .spyOn(postService, 'deletePost')
        .mockResolvedValueOnce(postData as any);

      const result = await postController.deletePost(postId);

      expect(result).toEqual(postData);
    });
  });
});
