import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import { Image } from "@shopify/hydrogen-ui-alpha";
import type { FormattedExecutionResult } from "graphql";
import type {
  Shop,
  ProductConnection,
} from "@shopify/hydrogen-ui-alpha/storefront-api-types";

export default function Home({ data, errors }: StorefrontApiResponse) {
  if (errors) {
    console.log(errors.map((err) => err.message));
    return null;
  }

  console.log("data", data);
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

export async function getServerSideProps() {
  const req = await fetch(
    `https://hydrogen-preview.myshopify.com/api/2022-07/graphql.json`,
    {
      method: "POST",
      body: query,
      headers: {
        "X-Shopify-Storefront-Access-Token": "3b580e70970c4528da70c98e097c2fa0",
        "content-type": "application/graphql",
      },
    }
  );

  const reqJson = (await req.json()) as StorefrontApiResponse;
  // console.log("reqjson", reqJson);

  return { props: reqJson };
}

type StorefrontApiResponse = FormattedExecutionResult<{
  shop: Pick<Shop, "name">;
  products: ProductConnection;
}>;

const query = `
  {
    shop {
      name
    }
    products(first: 1) {
      nodes {
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
