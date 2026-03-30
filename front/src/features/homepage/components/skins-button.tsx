import { AuthRouteButton } from "./auth-route-button";

export function SkinsButton({
  className = "",
  loggedIn = true,
}: {
  className?: string;
  loggedIn?: boolean;
}) {
  return (
    <AuthRouteButton
      className={className}
      loggedIn={loggedIn}
      href="/skins"
      label="Skins"
      tooltipText="Login to open the skins shop"
    />
  );
}
