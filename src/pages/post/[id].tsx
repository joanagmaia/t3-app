import Head from "next/head";
import { api } from "~/utils/api";
import { type GetStaticProps } from "next";
import { PageLayout } from "~/components/layout";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { PostView } from "~/components/postview";

export default function SingePostPage({ id }: { id: string }) {
  const { data, isLoading } = api.post.getById.useQuery({
    id,
  });

  if (isLoading) return <div>Loading</div>;

  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{`${data.post.content} - ${data.author.username}`}</title>
      </Head>
      <PageLayout>
        <PostView {...data} />
      </PageLayout>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = context.params?.id;

  if (typeof id !== "string") {
    throw new Error("no id");
  }

  await ssg.post.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};
