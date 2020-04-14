import { TestBed } from '@angular/core/testing';

import { PostsService } from './post-service.service';

describe('PostServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PostsService = TestBed.get(PostsService);
    expect(service).toBeTruthy();
  });
});
