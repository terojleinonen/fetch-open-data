import Image from 'next/image';
import PageTitle from '@/app/components/PageTitle';

const AboutStephenKing = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageTitle title="About Stephen King" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Image
            src="/stephen-king-2024.jpg"
            alt="Stephen King"
            width={250}
            height={375}
            className="rounded-lg shadow-lg"
          />
        </div>
        <div className="md:col-span-2">
          <p className="text-lg leading-relaxed mb-4">
            Stephen Edwin King (born September 21, 1947) is an American author. Dubbed the "King of Horror", he is widely known for his horror novels and has also explored other genres, among them suspense, crime, science-fiction, fantasy, and mystery. Though known primarily for his novels, he has written approximately 200 short stories, most of which have been published in collections.
          </p>
          <p className="text-lg leading-relaxed mb-4">
            His debut, Carrie (1974), established him in horror. Different Seasons (1982), a collection of four novellas, was his first major departure from the genre. Among the films adapted from King's fiction are Carrie (1976), The Shining (1980), The Dead Zone and Christine (both 1983), Stand by Me (1986), Misery (1990), The Shawshank Redemption (1994), Dolores Claiborne (1995), The Green Mile (1999), The Mist (2007), and It (2017). He has published under the pseudonym Richard Bachman and has co-written works with other authors, notably his friend Peter Straub and sons Joe Hill and Owen King. He has also written nonfiction, notably Danse Macabre (1981) and On Writing: A Memoir of the Craft (2000).
          </p>
          <p className="text-lg leading-relaxed">
            Among other awards, King has won the O. Henry Award for "The Man in the Black Suit" (1994) and the Los Angeles Times Book Prize for Mystery/Thriller for 11/22/63 (2011). He has also won honors for his overall contributions to literature, including the 2003 Medal for Distinguished Contribution to American Letters, the 2007 Grand Master Award from the Mystery Writers of America and the 2014 National Medal of Arts. Joyce Carol Oates called King "a brilliantly rooted, psychologically 'realistic' writer for whom the American scene has been a continuous source of inspiration, and American popular culture a vast cornucopia of possibilities."
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutStephenKing;
