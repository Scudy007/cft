import { AuditLog, User } from "@prisma/client";
import { Box, Card, Flex, Text, Avatar } from "@radix-ui/themes";

interface Props {
  history: (AuditLog & { user: User })[];
}

const IssueHistory = ({ history }: Props) => {
  if (history.length === 0) 
    return <Text size="2" color="gray">Событий пока нет.</Text>;

  return (
    <Flex direction="column" gap="3">
      {history.map((log) => (
        <Card key={log.id} variant="surface">
          <Flex gap="3" align="center">
            <Avatar 
              size="1" 
              fallback={log.user.name?.[0] || "U"} 
              radius="full" 
              color="blue"
            />
            <Box>
              <Flex gap="2" align="center">
                <Text size="2" weight="bold">{log.user.name || log.user.email}</Text>
                <Text size="1" color="gray">
                  {new Date(log.createdAt).toLocaleString()}
                </Text>
              </Flex>
              
              <Box mt="1">
                <Text size="2">
                    {log.action === "ASSIGNMENT_CHANGED" && (
                    <>
                        Передано: <Text weight="bold" color="blue">{log.oldValue} → {log.newValue}</Text>
                    </>
                    )}
                </Text>
                {log.comment && (
                    <Box mt="1" p="2" className="bg-gray-100 rounded border-l-4 border-blue-400">
                    <Text size="2" italic color="gray">"{log.comment}"</Text>
                    </Box>
                )}
                </Box>
            </Box>
          </Flex>
        </Card>
      ))}
    </Flex>
  );
};

export default IssueHistory;