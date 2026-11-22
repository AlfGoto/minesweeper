# Button

The one action control of the site: shadcn `ui/button`.

- **default** (primary, near-black): the main action of a view. Restart, Back to game, Play now, Login, Confirm purchase.
- **outline**: secondary actions and prices on Collection cards ("250 AlfCoins").
- **secondary / ghost**: low-emphasis actions, icon buttons.
- **link**: inline text actions.
- **destructive**: only for something that removes or breaks.

Sizes: `sm` 32px, `default` 36px, `lg` 40px (PlayCta), `icon` 36px square. The game menu uses `className="text-lg w-[180px] px-8 py-6"` on default buttons.

Rules: one default button per view. Icons from lucide at 16px. Use `asChild` with `Link` for navigation.
