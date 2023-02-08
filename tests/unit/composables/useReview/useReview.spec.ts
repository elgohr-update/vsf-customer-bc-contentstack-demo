import { expect } from '@jest/globals';
import { CreateProductReviewProps } from '@vsf-enterprise/bigcommerce-api';
import { useReview } from '~/composables/useReview';

const mockSearchReviews = jest.fn();
const mockAddReview = jest.fn();

jest.mock('@nuxtjs/composition-api', () => {
  const originalModule = jest.requireActual('@nuxtjs/composition-api');
  return {
    __esModule: true,
    ...originalModule,
    useContext: () => ({
      $bigcommerce: {
        api: {
          getProductReviewCollection: mockSearchReviews,
          createProductReview: mockAddReview
        }
      }
    })
  };
});

describe('[bigcommerce-theme] useReview composable', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('search function', () => {
    /**
     * Called on api-client or '@vsf-enterprise/bigcommerce-api'
     * function is $bigcommerce.api.getProductReviewCollection
     */
    it('should pass the params to the api-client function call', async () => {
      const queryParams = {
        limit: 5
      };

      const params = {
        productId: 80,
        query: queryParams
      };

      const { search } = useReview();
      await search(params);

      expect(mockSearchReviews).toBeCalledWith({ productId: 80 }, queryParams);
    });

    it('should fill the error.value.search prop on catching an error', async () => {
      const errorResponse = new Error('error message');

      mockSearchReviews.mockRejectedValue(errorResponse);

      const { search, error } = useReview();
      await search({ productId: 80 });

      expect(error.value.search).toBe(errorResponse);
    });
  });

  describe('add function', () => {
    /**
     * Called on api-client or '@vsf-enterprise/bigcommerce-api'
     * function is $bigcommerce.api.createProductReview
     */
    it('should pass the params to the api-client function call', async () => {
      const params: CreateProductReviewProps = {
        productId: 80,
        title: '',
        text: '',
        rating: 5
      };

      const { add } = useReview();
      await add(params);

      expect(mockAddReview).toBeCalledWith(params);
    });

    it('should fill the error.value.add prop on catching an error', async () => {
      const params: CreateProductReviewProps = {
        productId: 80,
        title: ''
      };

      const errorResponse = new Error('error message');

      mockAddReview.mockRejectedValue(errorResponse);

      const { add, error } = useReview();
      await add(params);

      expect(error.value.add).toBe(errorResponse);
    });
  });
});
