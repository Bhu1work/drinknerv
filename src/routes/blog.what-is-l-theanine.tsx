import { createFileRoute } from '@tanstack/react-router'
import { ArticleShell, AH2, AP, AList } from '~/components/ArticleShell'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/blog/what-is-l-theanine')({
  head: () => ({
    meta: seo({
      title: 'What Is L-Theanine? A Plain-English Guide | NERV FOCUS',
      description: 'What L-theanine is, where it comes from, how it works in the brain, and whether it is safe.',
    }),
  }),
  component: Post,
})

function Post() {
  return (
    <ArticleShell
      tag="Explainer"
      meta="June 2026 · 5 min read"
      title="What Is"
      accent="L-Theanine?"
    >
      <AP>
        If you have read the label on a NERV can, you have seen L-Theanine listed right
        next to caffeine. Here is the plain-English version of what it is and why it is
        there.
      </AP>

      <AH2>Where it comes from</AH2>
      <AP>
        L-Theanine is an amino acid found almost entirely in the tea plant, Camellia
        sinensis — the same plant that gives us green, black, and white tea. It is a big
        part of why a cup of tea feels calmer and more focused than an equivalent dose of
        caffeine from other sources. It is also found in small amounts in certain
        mushrooms.
      </AP>

      <AH2>How it works in the brain</AH2>
      <AP>
        L-Theanine is able to cross the blood-brain barrier, which means it can act
        directly in the brain rather than just the body. Once there, it is associated
        with increased alpha-wave activity — the brain-wave pattern linked to a state of
        relaxed alertness, the kind you feel when you are calm but switched on rather than
        sleepy.
      </AP>
      <AP>
        It is also thought to influence levels of certain neurotransmitters involved in
        mood and stress regulation. The net subjective effect people describe is
        &ldquo;calm, but clear-headed.&rdquo;
      </AP>

      <AH2>What people use it for</AH2>
      <AList>
        <li>Calm, sustained focus — especially when paired with caffeine.</li>
        <li>Taking the edge off stimulants without causing drowsiness.</li>
        <li>Supporting a sense of relaxation during demanding work.</li>
      </AList>

      <AH2>Is it safe?</AH2>
      <AP>
        L-Theanine has a long history of consumption simply because people have been
        drinking tea for centuries. It is generally well tolerated. That said, this
        article is educational rather than medical advice — if you are pregnant, nursing,
        sensitive to caffeine, or managing a health condition, it is worth checking with a
        doctor before adding any new supplement or functional drink.
      </AP>
      <AP>
        In NERV FOCUS, L-Theanine is paired 1:1 with caffeine at 20&nbsp;mg each — the
        combination we dig into in our companion post on why the two work better together.
      </AP>
    </ArticleShell>
  )
}
