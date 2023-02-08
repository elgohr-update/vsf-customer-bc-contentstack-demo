import { StoreMeta, ChannelType, ChannelStatus, GetChannelResponseData, GetChannelNotFoundError } from '@vsf-enterprise/bigcommerce-api';
export function createChannelMock (): GetChannelResponseData {
  return {
    id: 1,
    icon_url: '',
    is_listable_from_ui: false,
    is_visible: false,
    date_created: '',
    external_id: '',
    config_meta: undefined,
    type: ChannelType.Pos,
    platform: '',
    is_enabled: false,
    date_modified: '',
    name: '',
    status: ChannelStatus.Active,
    currencies: {
      channel_id: 1,
      enabled_currencies: ['USD'],
      default_currency: 'USD'
    }
  };
}

export function createChannelApiErrorMock(): GetChannelNotFoundError {
  return {
    status: 404,
    title: 'Not found',
    type: '/api-docs/getting-started/api-status-codes',
    errors: {}
  };
}

export function createSeoDetailsMock(): StoreMeta {
  return {
    meta_description: 'Your BigCommerce Store',
    meta_keywords: '',
    page_title: 'BigCommerce Store',
    www_redirect: 'no-www'
  };
}
