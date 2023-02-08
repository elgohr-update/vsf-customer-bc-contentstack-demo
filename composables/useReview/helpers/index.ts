import { useContext } from '@nuxtjs/composition-api';
import { ProductReview } from '@vsf-enterprise/bigcommerce-api';

export const getReviewTitle = (review: ProductReview): string => {
  const { i18n } = useContext();
  return review.name
    ? i18n.t('Review Title', { title: review.title, name: review.name }).toString()
    : review.title;
};
