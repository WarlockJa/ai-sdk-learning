import { ReactNode, unstable_ViewTransition as ViewTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Link from "next/link";

export default function NavCard({
  children,
  description,
  title,
  href,
}: NavCard & { children?: ReactNode }) {
  return (
    <Link href={href} className="rounded-2xl transition-shadow hover:shadow">
      <Card>
        <CardHeader>
          <ViewTransition name={`navcard-title-${href}`}>
            <CardTitle>{title}</CardTitle>
          </ViewTransition>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </Link>
  );
}
