import { prisma } from "@/prisma/client";
import { Box, Flex, Grid, Text, Card, Heading } from "@radix-ui/themes";
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
    <Box className="max-w-7xl mx-auto py-4">
      
      <Grid columns={{ initial: "1", lg: "3" }} gap="6">
      
        <Box className="lg:col-span-2 space-y-6">
          
          <Card size="4" className="shadow-sm rounded-2xl border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F172A] backdrop-blur-none">
            <IssueDetails issue={issue} />
          </Card>
          
          <Card size="4" className="shadow-sm rounded-2xl border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F172A] backdrop-blur-none">
            <Heading size="5" color="gray" mb="5">
              История и комментарии
            </Heading>
            <IssueHistory history={issue.history} />
          </Card>

        </Box>

        <Box>
          <Flex direction="column" gap="5" className="sticky top-24">
            
            <Card size="3" className="shadow-md rounded-2xl border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F172A] backdrop-blur-none">
              <Heading size="4" mb="5" color="gray" className="border-b border-slate-100 dark:border-white/10 pb-3">
                Управление задачей
              </Heading>

              <Flex direction="column" gap="6">
                <Box>
                  <Text size="1" color="gray" weight="bold" mb="2" display="block" className="uppercase tracking-wider">
                    Ответственный аналитик
                  </Text>
                  <IssueSelect issue={issue} />
                </Box>

                <Box>
                  <Text size="1" color="gray" weight="bold" mb="3" display="block" className="uppercase tracking-wider">
                    Действия
                  </Text>
                  <Flex direction="column" gap="3">
                    <EditIssueButton issueId={issue.id} />
                    <DeleteIssueButton issueId={issue.id} />
                  </Flex>
                </Box>
              </Flex>
            </Card>

            <Card size="2" className="shadow-sm rounded-xl border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/50 backdrop-blur-none">
              <Text size="2" color="gray" className="flex justify-between mb-2">
                <span>ID инцидента:</span>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">SEC-{issue.id}</span>
              </Text>
              <Text size="2" color="gray" className="flex justify-between">
                <span>Создано:</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {new Date(issue.createdAt).toLocaleDateString("ru-RU")}
                </span>
              </Text>
            </Card>

          </Flex>
        </Box>

      </Grid>
    </Box>
  );
};

export default IssueDetailPage;