import { prisma } from "@/prisma/client";
import { Box, Flex, Grid, Text } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import IssueDetails from "./IssueDetails"; 
import IssueSelect from "./IssueSelect";
import IssueHistory from "./IssueHistory";
import EditIssueButton from "./EditIssueButton";
import DeleteIssueButton from "./DeleteIssueButton";

interface Props {
  params: { id: string };
}

const IssueDetailPage = async ({ params }: Props) => {
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      assignedToUser: true,
      history: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!issue) notFound();

  return (
    <Grid columns={{ initial: "1", md: "5" }} gap="5">
      <Box className="md:col-span-4">
        <IssueDetails issue={issue} />
        
        <Box mt="8">
          <IssueHistory history={issue.history} />
        </Box>
      </Box>

      <Box>
        <Flex direction="column" gap="4">
          <Box>
            <Text size="1" color="gray" weight="bold" mb="2" as="div">
              ОТВЕТСТВЕННЫЙ
            </Text>
            <IssueSelect issue={issue} />
          </Box>
          
          <EditIssueButton issueId={issue.id} />
          <DeleteIssueButton issueId={issue.id} />
        </Flex>
      </Box>
    </Grid>
  );
};

export default IssueDetailPage;