# Reading an ad, and counting what a library shows

Load before pulling an advertiser's ads. Everything here is a default. The hard rules
are in the skill: Observed carries a link and a date, inferences are labelled, no
competitor ad is called profitable, a video not watched is marked not seen.

## The signals, and what they do not mean

| What the library shows | What it tells you | What it does not tell you |
| --- | --- | --- |
| Start date, still active | How long the advertiser has kept paying for it | Whether it pays back |
| Number of active versions | How much they iterate on it | Which version works |
| Ads started in the last 90 days | Their creative pace | Their hit rate |
| Platforms and placements | Where they choose to show | What each placement returns |
| Reach or spend range, where shown | Scale, roughly, for the ads that carry it | Profit, results, cost per result |

Which fields exist, and for which ads, is a platform fact: see the platform layer.

## The measures (claude-workflows review)

Count these per advertiser from the library's fields, and write how each was counted:

- **Launch pace.** Ads with a start date in the last 90 days.
- **Lifespan.** Days from start date to today for active ads; note the oldest.
- **New concepts against variations.** How many of the recent ads are a new idea rather
  than a new version of an old one. This is a judgment: label it Inferred.
- **Format mix.** Image, video, carousel counts.
- **Core messages.** The three or four things the ads keep saying, in your words.
- **Repeated phrases.** Their exact words that recur, quoted and attributed.
- **Customer types by share of ads.** Who the ads address, using the names in
  `research/audience.md` where they fit. Inferred.
- **Reliance on offers.** How many ads lead with a discount, a free thing or a bundle.
- **What is missing.** Customer types, awareness levels, formats, objections and proof
  that none of the ads touch. Inferred, and the most useful line in the file.

## Breaking down one ad

In this order, writing only what is on the screen or the page:

1. **Hook.** The first on-screen text, the first frame, and the first spoken line when
   the video was watched. Quote the text.
2. **Style.** Creator or customer on camera, founder, demonstration, testimonial,
   animated, static with text, catalogue, meme, montage.
3. **Message and proof.** What it claims and what it shows to back it: a number, a
   review, a demonstration, a credential, nothing.
4. **Offer and ask.** What they are selling in this ad, any discount or free element,
   and the one thing the ad asks the viewer to do.
5. **Call-out.** Who it names or addresses, if anyone, and how.
6. **Format and shapes.** Image, video or carousel; square, vertical, both.
7. **Partnership.** Whether it runs from a creator's handle as well as the brand's.
8. **Landing page.** Headline, proof, offer, ask, friction, and whether it matches the
   ad.

A long-running ad that packs every option, use and objection into one piece and a
focused ad that does one job for one customer type are both worth keeping; the hub's
breadth tag exists because sources disagree on which to make (`source-notes/conflicts.md`).

## Model from the right advertisers (course review, module 13)

Businesses a couple of steps ahead teach more than giants: a giant's ad works partly
because of the name on it. Adjacent industries with the same buying moment often run
more sophisticated ads than the category itself. Adapt the structure, the proof type
and the ask; never the words, the images or the claims.

## What counts as seen

- An ad opened in the library, with its link recorded, counts as seen for its copy,
  image and metadata. Its video counts as watched only if it was played or its captions
  or transcript were read; otherwise `not seen: copy and thumbnail only`.
- A landing page opened and read, with its link.
- A search result or a third-party roundup is a pointer, not an observation.
- A screenshot taken by the platform is kept beside the swipe entry. A description of a
  screenshot that was not taken is not written.
