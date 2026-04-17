import { Heading, Flex, Card, Text, Badge, Grid, Box } from "@radix-ui/themes";

const IssueDetails = ({ issue }: { issue: any }) => {
  return (
    <>
      <Heading as="h1" mb="3">
        {issue.title}
      </Heading>
      
      <Flex gap="3" my="2" align="center" wrap="wrap">
        <Badge color={issue.status === 'CLOSED' ? 'green' : 'blue'}>
          {issue.status}
        </Badge>
        <Badge color={
          issue.criticality === 'CRITICAL' ? 'red' : 
          issue.criticality === 'HIGH' ? 'orange' : 
          issue.criticality === 'MEDIUM' ? 'yellow' : 'gray'
        }>
          {issue.criticality}
        </Badge>
        <Text color="gray" size="2">
          Создано: {new Date(issue.createdAt).toLocaleDateString("ru-RU")}
        </Text>
      </Flex>

      <Grid columns="2" gap="4" mt="4" mb="4">
        <Card>
          <Text size="2" color="gray" mb="1">Система</Text>
          <Text as="div" weight="bold">{issue.system}</Text>
        </Card>
        <Card>
          <Text size="2" color="gray" mb="1">Категория</Text>
          <Text as="div" weight="bold">{issue.category}</Text>
        </Card>
        <Card>
          <Text size="2" color="gray" mb="1">Оценка риска</Text>
          <Text as="div" weight="bold">{issue.riskScore ? issue.riskScore : "Не рассчитано"}</Text>
        </Card>
        <Card>
          <Text size="2" color="gray" mb="1">Дедлайн устранения</Text>
          <Text as="div" weight="bold">
            {issue.deadline ? new Date(issue.deadline).toLocaleDateString("ru-RU") : "Не установлен"}
          </Text>
        </Card>
      </Grid>
      
      {/* Описание */}
      <Card className="prose max-w-full" mt="4">
        <Heading size="3" mb="2">Описание уязвимости</Heading>
        <Text as="p">{issue.description}</Text>
      </Card>
    </>
  );
};

export default IssueDetails;