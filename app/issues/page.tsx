import { Button } from "@radix-ui/themes";
import Link from "next/link";
export const dynamic = 'force-dynamic';

const IssuesPage = () => {
  return (
    <div>
      <Button variant="solid">
        <Link href="/issues/new">New Issue</Link>
      </Button>
    </div>
  );
};

export default IssuesPage;
