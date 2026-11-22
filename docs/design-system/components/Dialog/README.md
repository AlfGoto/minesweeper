# Dialog

Modal box on a black/50 backdrop: shadcn `ui/dialog` (Radix).

Used today by the win dialog and lose dialog (`features/homepage/components/win-dialog.tsx`, `lose-dialog.tsx`), opened 2 s after the end of a game. White surface, `border`, `radius-lg`, `shadow-lg`, 24px padding, close X top-right, fade + zoom-95 in 200ms. Max width 512px on sm+, full width minus 32px on mobile.

The consumer supplies: `DialogTitle` (required for accessibility), optional `DialogDescription`, and the actions.
