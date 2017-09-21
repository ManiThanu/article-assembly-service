/* eslint-disable  key-spacing */

import Wardenclyffe from 'wardenclyffe-client-node';

/**
 * Wardenclyffe Service/Helpers
 */

const WC = new Wardenclyffe({
  url:      process.env.WARDENCLYFFE_ENDPOINT,
  username: process.env.WARDENCLYFFE_USERNAME,
  password: process.env.WARDENCLYFFE_PASSWORD,
  timeout:  Number(process.env.WARDENCLYFFE_TIMEOUT || 5000),
});

/**
 * Handles Wardenclyffe Response
 * @param {object} resp - WC response JSON
 * @param {object} assetKey - WC response body key (options: ['stories', 'images'])
 * @returns {object} asset
 */
function responseHandler(resp, assetKey) {
  const { errors = [], data = {} } = resp;
  if (errors.length) {
    throw new Error(`Wardenclyffe Response Error: ${errors[0].message}`);
  }
  return data[assetKey][0];
}

/**
 * Applies Data To Given Asset That Wasn't Provided By Wardenclyffe
 * @todo: Remove once data points get added to Wardenclyffe
 * @param {string} type - asset type
 * @param {object} asset
 * @param {object} originalPayload - payload from content service
 */
function resolveMissingData(type, asset, originalPayload) {
  if (type === 'article' && originalPayload) {
    // Wardenclyffe is currently missing certain timestamps
    /* eslint-disable no-param-reassign */
    asset.groupUpdatedAt = originalPayload.updatedAt; // should be accurate
    asset.storyUpdatedAt = originalPayload.updatedAt; // probably inaccurate
    /* eslint-enable no-param-reassign */
  }
  return asset;
}

/**
 * Wardenclyffe Image Fields To Pull
 * @returns {string} fields - GraphQL image fields
 */
function imageFields() {
  return `
    id,
    type,
    title,
    description,
    origWidth,
    origHeight,
    width,
    height,
    url,
    credit,
    caption,
    treatment,
    size
  `;
}

/**
 * Fetches Story
 * @todo: Compare with document transformer fields
 * @param {string} id - Bloomberg Revision ID
 * @returns {Promise}
 */
async function fetchStory(id) {
  const resp = await WC.fetch(`
    query StoryByID {
      stories(id: "${id}") {
        id,
        revision,
        groupId: id,
        storyId: revision,
        groupPublishedAt: publishedAt,
        storyPublishedAt: updatedAt,
        type,
        site,
        slug,
        byline,
        body {
          html,
          text,
          raw
        },
        trashline {
          html,
          text,
          raw
        },
        tags {
          id,
          name,
          kind
        },
        wire {
          class,
          id,
          mnemonic
        },
        tickers {
          id,
          name,
          longName
        },
        niCodes: adTargeting {
          ni
        },
        headline {
          html
          text
          seo
        },
        summary {
          html
          text
          seo
        },
        images {
          ${imageFields()}
        }
      }
    }
  `);
  return responseHandler(resp, 'stories');
}

/**
 * Fetches Image
 * @param {integer} id - Bloomberg AVMM ID
 * @returns {Promise}
 */
async function fetchImage(id) {
  const resp = await WC.fetch(`
    query ImageByID {
      images(id: ${id}) {
        ${imageFields()}
      }
    }
  `);
  return responseHandler(resp, 'images');
}

/**
 * Fetches Asset
 * @param {string} type - asset type (options: ['story', 'image'])
 * @param {string|integer} id - Bloomberg Asset ID
 * @param {object} originalPayload - payload from content service
 * @returns {Promise<object>} - asset response payload
 */
async function fetchAsset(type, id, originalPayload) {
  switch (type) {
    case 'article':
      return resolveMissingData(type, await fetchStory(id), originalPayload);
    case 'image':
      return fetchImage(id);
    default:
      throw new Error(`Unsupported Asset Type: ${type}`);
  }
}

export default {
  fetchAsset,
};
