export default function AppFooter() {
  return (
    <footer className="bg-muted/20 border-t border-border py-4 text-center w-full" data-testid="footer-main">
      <p className="text-sm text-muted-foreground" data-testid="text-version">
        إصدار 1.0 - عدن لايف
      </p>
      <p className="text-xs text-muted-foreground mt-1" data-testid="text-subtitle">
        خدمة محلية لأهل عدن
      </p>
    </footer>
  );
}
