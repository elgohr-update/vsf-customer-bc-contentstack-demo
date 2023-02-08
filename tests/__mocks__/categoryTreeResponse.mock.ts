import { mockCategoryTreeList } from './categoryTreeList.mock';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const mockCategoryTreeResponse = () => ({
  data: mockCategoryTreeList(),
  meta: {}
});
