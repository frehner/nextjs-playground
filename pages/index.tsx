import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import {
  Image,
  type StorefrontApiResponseOk,
} from "@shopify/storefront-kit-react";
import { shopClient } from "../shopify-client";
import type { GetServerSideProps } from "next";
import { graphql } from "../gql/gql";
import { request } from "graphql-request";
import type { IndexQueryQuery } from "../gql/graphql";

export default function Home({
  data,
  errors,
}: StorefrontApiResponseOk<IndexQueryQuery>) {
  if (errors) {
    console.log(errors.map((err) => err.message));
    return <div>There was an error. Please try again</div>;
  }
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>{data.shop.name}</p>
        {/* @TODO Using storefront-kit's <Image/> is nice, but we should also provide our 'loader' so you can used NextJS' Image component as well */}
        <Image
          data={data.products.nodes[0].variants.nodes[0].image}
          width={500}
        />
      </section>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  // @TODO figure out how to get the client's IP address correctly and accurately.
  // const buyerIp =
  //   req.headers["x-real-ip"] ??
  //   req.headers["x-forwarded-for"] ??
  //   req.socket.remoteAddress;

  try {
    const response = await request({
      url: shopClient.getStorefrontApiUrl(),
      document: query,
      // @TODO: convert to 'getPrivateTokenHeaders({buyerIp})'
      requestHeaders: shopClient.getPublicTokenHeaders(),
    });

    // @TODO I don't love how we do this with 'errors' and 'data'
    return { props: { data: response, errors: null } };
  } catch (err) {
    console.error(err);
    return { props: { data: null, errors: [err.toString()] } };
  }
};

const query = graphql(`
  query IndexQuery {
    shop {
      name
    }
    products(first: 1) {
      nodes {
        # if you uncomment 'blah', it should have a GraphQL validation error in your IDE if you have a GraphQL plugin. It should also give an error during 'npm run dev'
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
`);
