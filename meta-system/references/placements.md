# Meta placement shapes and copy fields (perishable: check the header first)

last-verified: 2026-10-19 · ttl-days: 60 · refresh: re-read Meta's Ads Guide pages for Facebook Feed (image, video, carousel), Instagram Feed (image), Instagram Reels (video) and Instagram Stories (image, video); confirm each ratio, resolution, duration, file type and the visible text lengths; update the tables and bump last-verified.
changes: 2026-10-19, first written from Meta's Ads Guide pages read the same day. The two production defaults at the end are the course review's claims, marked as such.

Load during `ad-creative`, before making assets or writing to field lengths. Meta's
guide gives recommended values; text beyond the stated lengths may be truncated on some
screens rather than rejected.

## Image

| Placement | Ratio | Resolution | File | Primary text | Headline | Other |
| --- | --- | --- | --- | --- | --- | --- |
| Facebook Feed | 4:5 | 1440 x 1800 | JPG or PNG | 50 to 150 characters | 27 characters | minimum width 600 px |
| Instagram Feed | 4:5 | 1440 x 1800 | JPG or PNG | 125 characters | 40 characters | up to 30 hashtags |
| Instagram Stories | 9:16 | 1440 x 2560 | JPG or PNG | 125 characters | none shown | keep about 14% of the top, 35% of the bottom and 6% of each side free of text and logos |

## Video

| Placement | Ratio | Resolution | File | Duration | Size | Primary text | Headline | Other |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Facebook Feed | 4:5 | 1440 x 1800 | MP4, MOV or GIF | 1 second to 241 minutes | 4 GB | 50 to 150 characters | 27 characters | captions and sound optional, recommended |
| Instagram Reels | 9:16 | 1440 x 2560 | MP4 or MOV | up to 15 minutes | 4 GB | 44 characters | none shown | same safe zones as Stories |
| Instagram Stories | 9:16 | 1440 x 2560 | MP4, MOV or GIF | 1 second to 60 minutes | 4 GB | 125 characters | none shown | 16 seconds or longer may be split into cards; ratio tolerance 1% |

## Carousel

| Placement | Cards | Ratio | Resolution | Video per card | Size | Primary text | Headline | Description | Other |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Facebook Feed | 2 to 10 | 1:1 | at least 1080 x 1080 | 1 second to 240 minutes | image 30 MB, video 4 GB | 80 characters | 20 characters | 18 characters | landing page URL required |

## Production defaults from the course review (claims, not Meta facts)

- Make a square or 4:5 base for every ad and a dedicated vertical edit for Stories and
  Reels. Do not let the platform crop a horizontal video into a vertical one (14.1).
- Text-heavy images: upload purpose-made versions per shape rather than one auto-cropped
  file (14.1).
- Creative enhancements: the course recommends leaving most image and video
  enhancements off for a first ad and reviewing each one. Which enhancements exist, and
  whether the connector or command-line tool can set them, is not yet verified
  (`platform-tools.md`, "Not yet verified").

## Notes

- Captions burned into the video keep the ad readable with sound off; Meta's guide marks
  captions as recommended, not required.
- Reels and Stories share the safe zones; a Feed asset reused there must be re-edited,
  not cropped.
