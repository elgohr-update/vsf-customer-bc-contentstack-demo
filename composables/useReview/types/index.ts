import { Ref } from '@nuxtjs/composition-api';
import {
  CreateProductReviewProps,
  GetProductReviewCollectionQuery,
  Product,
  ProductReviewCollectionResponse,
  ProductReviewResponse
} from '@vsf-enterprise/bigcommerce-api';

/**
 * Parameters required and optional for loading product reviews
 */
export interface UseReviewSearchParameters {
  /**
   * Product Id as required parameter to fetch product reviews
   */
  productId: Product['id'];
  /**
   * (Optional) An object which contains necessary properties for creating a product review.
   */
  query?: GetProductReviewCollectionQuery;
}

/**
 * `useReview` composable errors.
 */
export interface UseReviewErrors {
  /**
   * Errors occurred during `search` action.
   */
  search: Error;

  /**
   * Errors occurred during `add` action.
   */
  add: Error;
}

/**
 * Data and methods returned from the {@link useReview|useReview()} composable
 */
export interface UseReviewInterface {
  /**
   * Contains errors from the composable methods.
   */
  error: Ref<UseReviewErrors>;

  /**
   * Indicates whether any of the methods is in progress.
   */
  loading: Ref<boolean>;

  /**
   * Searches for reviews for a product.
   */
  search: (
    params: UseReviewSearchParameters
  ) => Promise<ProductReviewCollectionResponse>;

  /**
   * Adds a review to a product.
   */
  add: (params: CreateProductReviewProps) => Promise<ProductReviewResponse>;
}
