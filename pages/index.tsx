import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import { Image, type StorefrontApiResponseOk } from "@shopify/hydrogen-react";
import type {
  Shop,
  ProductConnection,
} from "@shopify/hydrogen-react/storefront-api-types";
import { shopClient } from "../shopify-client";
import { gql } from "graphql-request";
import type { GetServerSideProps } from "next";

export default function Home({
  data,
  errors,
}: StorefrontApiResponseOk<StorefrontResponseShape>) {
  if (errors) {
    console.log(errors.map((err) => err.message));
    return null;
  }

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>{data.shop.name}</p>
        <Image
          data={data.products.nodes[0].variants.nodes[0].image}
          width={500}
        />
      </section>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  // const buyerIp =
  //   req.headers["x-real-ip"] ??
  //   req.headers["x-forwarded-for"] ??
  //   req.socket.remoteAddress;

  const response = await fetch(shopClient.getStorefrontApiUrl(), {
    method: "POST",
    body: query,
    // TODO: convert to 'getPrivateTokenHeaders({buyerIp})'
    headers: shopClient.getPublicTokenHeaders(),
  });

  if (!response.ok) {
    const errors = await response.text();
    throw new Error(errors);
  }

  const responseJson =
    (await response.json()) as StorefrontApiResponseOk<StorefrontResponseShape>;

  return { props: responseJson };
};

type StorefrontResponseShape = {
  shop: Shop;
  products: ProductConnection;
};

const query = gql`
  {
    shop {
      name
    }
    products(first: 1) {
      nodes {
        # if you uncomment 'blah', it should have a GraphQL validation error in your IDE if you have a GraphQL plugin
        # blah
        id
        title
        publishedAt
        handle
        variants(first: 1) {
          nodes {
            id
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
`;
