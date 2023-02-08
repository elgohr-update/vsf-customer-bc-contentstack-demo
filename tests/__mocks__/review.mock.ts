import { ProductReviewCollectionResponse, ProductReviewResponse, ReviewStatus } from '@vsf-enterprise/bigcommerce-api';

export function mockGetProductReviewCollectionResponse(): ProductReviewCollectionResponse {
  return {
    data: [{
      product_id: 2,
      id: 2,
      email: '',
      name: 'Jane Doe',
      rating: 4,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vel metus ac est egestas porta sed quis erat. Integer id nulla massa. Proin vitae enim nisi. Praesent non dignissim nulla. Nulla mattis id massa ac pharetra. Mauris et nisi in dolor aliquam sodales. Aliquam dui nisl, dictum quis leo sit amet, rutrum volutpat metus. Curabitur libero nunc, interdum ac libero non, tristique porttitor metus. Ut non dignissim lorem, in vestibulum leo. Vivamus sodales quis turpis eget.',
      title: 'Terrariums are cool',
      status: ReviewStatus.approved,
      date_created: '2022-03-01T11:00:21+00:00',
      date_modified: '2022-03-01T11:00:21+00:00',
      date_reviewed: '2016-12-07T18:01:20+00:00'
    }],
    meta: {
      pagination: {
        total: 1,
        count: 1,
        per_page: 5,
        current_page: 1,
        total_pages: 1,
        links: {
          current: '?limit=5&status=1&page=1'
        }
      }
    }
  };
}

export function mockCreateProductReviewResponse(): ProductReviewResponse {
  return {
    data: {
      product_id: 2,
      id: 2,
      email: '',
      name: 'Jane Doe',
      rating: 4,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vel metus ac est egestas porta sed quis erat. Integer id nulla massa. Proin vitae enim nisi. Praesent non dignissim nulla. Nulla mattis id massa ac pharetra. Mauris et nisi in dolor aliquam sodales. Aliquam dui nisl, dictum quis leo sit amet, rutrum volutpat metus. Curabitur libero nunc, interdum ac libero non, tristique porttitor metus. Ut non dignissim lorem, in vestibulum leo. Vivamus sodales quis turpis eget.',
      title: 'Terrariums are cool',
      status: ReviewStatus.approved,
      date_created: '2022-03-01T11:00:21+00:00',
      date_modified: '2022-03-01T11:00:21+00:00',
      date_reviewed: '2016-12-07T18:01:20+00:00'
    },
    meta: {
    }
  };
}
