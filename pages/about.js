import Layout from '../components/Layout';
import Image from 'next/image'; // Optional: if you want to add a generic author image

const AboutPage = () => {
  return (
    <Layout title="About Stephen King - Stephen King Fan Hub">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-classic-red mb-8 text-center">
          About Stephen King
        </h1>

        {/* Optional: Placeholder for an author image - ensure it's royalty-free or self-created */}
        {/* <div className="mb-8 flex justify-center">
          <Image
            src="/placeholder-author.jpg" // Replace with your image path in /public
            alt="Stephen King (Illustrative)"
            width={200}
            height={250}
            className="rounded-lg shadow-lg object-cover"
          />
        </div> */}

        <article className="prose prose-lg lg:prose-xl max-w-none text-dark-gray
                          prose-headings:text-classic-red prose-a:text-classic-red hover:prose-a:underline
                          prose-strong:text-dark-gray">
          <p>
            Stephen Edwin King (born September 21, 1947) is an American author renowned globally
            for his prolific contributions to horror, supernatural fiction, suspense, crime,
            science-fiction, and fantasy genres. His masterful storytelling has captivated
            readers for decades, resulting in book sales exceeding 350 million copies worldwide.
          </p>
          <p>
            Many of King&apos;s works have been adapted into critically acclaimed and commercially
            successful films, television series, miniseries, and comic books, further cementing
            his status as a cultural icon. To date, King has published 65 novels, including
            seven under the pen name Richard Bachman, and five non-fiction books. His literary
            output also includes approximately 200 short stories, the majority of which have
            been compiled into popular book collections.
          </p>

          <h2>Early Life and Influences</h2>
          <p>
            Born in Portland, Maine, a state that would later feature prominently in many of his
            stories, King&apos;s early life was marked by unique experiences that shaped his creative
            voice. He attended grammar school in Durham and later Lisbon Falls High School.
            An early fascination with horror and the macabre was evident from a young age,
            reportedly sparked by discovering a collection of H.P. Lovecraft stories.
          </p>
          <p>
            He began writing for pleasure while still in school, contributing articles to
            Dave&apos;s Rag, the newspaper his brother published with a mimeograph machine, and later
            selling stories to his friends based on movies he had seen. His first independently
            published story appeared in a fanzine in 1965.
          </p>

          <h2>The Breakthrough: &ldquo;Carrie&rdquo;</h2>
          <p>
            After graduating from the University of Maine at Orono in 1970 with a B.A. in English,
            King worked as a teacher while continuing to write in his spare time. His breakthrough
            came when his first novel, &ldquo;Carrie,&rdquo; was accepted for publication by Doubleday in 1973
            and published in 1974. The novel, a chilling tale of a telekinetic teenager, became a
            significant success and launched his career as a full-time writer.
          </p>

          <h2>Major Works and Themes</h2>
          <p>
            King&apos;s bibliography is vast and varied, including iconic titles such as &ldquo;Salem&apos;s Lot,&rdquo;
            &ldquo;The Shining,&rdquo; &ldquo;The Stand,&rdquo; &ldquo;It,&rdquo; &ldquo;Misery,&rdquo; &ldquo;Pet Sematary,&rdquo; &ldquo;The Green Mile,&rdquo; and the
            epic &ldquo;Dark Tower&rdquo; series.
          </p>
          <p>
            Common themes in his work include the nature of good versus evil, the complexities of
            the human condition, the loss of innocence, the pervasiveness of ordinary horrors in
            everyday life, and the power of hope and redemption even in the darkest of circumstances.
            His settings are often small-town Maine, creating a familiar yet unsettling backdrop for
            his supernatural tales.
          </p>

          <h2>Legacy and Impact</h2>
          <p>
            Stephen King&apos;s impact on contemporary literature and popular culture is undeniable.
            He has received numerous accolades for his work, including the National Book Foundation
            Medal for Distinguished Contribution to American Letters in 2003 and the National Medal
            of Arts in 2014.
          </p>
          <p>
            Beyond the scares, King&apos;s writing is celebrated for its rich character development,
            intricate plotting, and keen observations of American society. He continues to be a
            prolific and influential voice, eagerly read by millions around the globe.
          </p>
          <p className="text-sm italic mt-8">
            Note: This content is a general overview for a fan page and should be further researched and expanded for accuracy and completeness if desired.
          </p>
        </article>
      </div>
    </Layout>
  );
};

export default AboutPage;
