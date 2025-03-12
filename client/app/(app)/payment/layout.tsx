export default function PaymentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="items-center min-h-screen sm:p-20">
      {children}
    </div>
  );
}
