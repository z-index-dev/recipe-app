import {
  createClient,
  createPreviewSubscriptionHook,
  createImageUrlBuilder,
  createPortableTextComponent,
} from 'next-sanity';
import { useNextSanityImage } from 'next-sanity-image';

const config = {
  projectId: "6mrklyk2",
  dataset: "production",
  apiVersion: "2021-03-25",
  useCdn: true
}

export const sanityClient = createClient(config);

export const usePreviewSubscription = createPreviewSubscriptionHook(config);

export const urlFor = (source) => createImageUrlBuilder(config).image(source);

export const PortableText = createPortableTextComponent({
  ...config,
  serializers: {},
});