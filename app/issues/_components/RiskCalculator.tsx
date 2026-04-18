"use client";

import { AttackVector, AttackComplexity, PrivilegesRequired, UserInteraction, Scope, CIA } from "@prisma/client";
import { Card, Flex, Text, Select, Slider, Badge, Box, Grid, Heading } from "@radix-ui/themes";
import { calculateCVSS, calculateDread } from "@/app/lib/riskCalc";

export interface RiskData {
  cvssAV: AttackVector;
  cvssAC: AttackComplexity;
  cvssPR: PrivilegesRequired;
  cvssUI: UserInteraction;
  cvssS: Scope;
  cvssC: CIA;
  cvssI: CIA;
  cvssA: CIA;
  dreadDamage: number;
  dreadRepro: number;
  dreadExploit: number;
  dreadAffected: number;
  dreadDiscover: number;
}

interface Props {
  data: RiskData;
  onChange: (newData: RiskData) => void;
  readonly?: boolean;
}

const RiskCalculator = ({ data, onChange, readonly = false }: Props) => {
  const cvssScore = calculateCVSS(data);
  const dreadScore = calculateDread(data);

  const updateField = (field: keyof RiskData, value: any) => {
    if (readonly) return;
    onChange({ ...data, [field]: value });
  };

  const getBadgeColor = (score: number) => {
    if (score >= 9) return "red";
    if (score >= 7) return "orange";
    if (score >= 4) return "yellow";
    return "green";
  };

  const cvssFields = [
    { label: "Attack Vector (AV)", name: "cvssAV", options: Object.values(AttackVector) },
    { label: "Attack Complexity (AC)", name: "cvssAC", options: Object.values(AttackComplexity) },
    { label: "Privileges Required (PR)", name: "cvssPR", options: Object.values(PrivilegesRequired) },
    { label: "User Interaction (UI)", name: "cvssUI", options: Object.values(UserInteraction) },
    { label: "Scope (S)", name: "cvssS", options: Object.values(Scope) },
    { label: "Confidentiality (C)", name: "cvssC", options: Object.values(CIA) },
    { label: "Integrity (I)", name: "cvssI", options: Object.values(CIA) },
    { label: "Availability (A)", name: "cvssA", options: Object.values(CIA) },
  ];

  return (
    <Flex direction="column" gap="5">
      
      <Card size="2" variant="surface">
        <Heading size="3" mb="3" color="blue">
          По CVSS
        </Heading>
        <Grid columns={{ initial: "1", sm: "2" }} gap="3">
          {cvssFields.map((field) => (
            <Box key={field.name}>
              <Text as="div" size="1" mb="1" weight="bold">
                {field.label}
              </Text>
              <Select.Root 
                disabled={readonly}
                value={data[field.name as keyof RiskData] as string}
                onValueChange={(v) => updateField(field.name as keyof RiskData, v)}
              >
                <Select.Trigger className="w-full" />
                <Select.Content>
                  {field.options.map((opt) => (
                    <Select.Item key={opt} value={opt}>
                      {opt}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Box>
          ))}
        </Grid>
        
        <Flex mt="4" p="3" justify="between" align="center" className="bg-blue-50 rounded-lg border border-blue-100">
          <Text size="2" weight="bold" color="blue">CVSS Base Score:</Text>
          <Badge size="2" variant="solid" color={getBadgeColor(cvssScore)}>
            {cvssScore.toFixed(1)}
          </Badge>
        </Flex>
      </Card>

      <Card size="2" variant="surface">
        <Heading size="3" mb="3" color="indigo">
          По DREAD 
        </Heading>
        <Flex direction="column" gap="4">
          {[
            { label: "Damage (Ущерб)", field: "dreadDamage" },
            { label: "Reproducibility (Воспроизводимость)", field: "dreadRepro" },
            { label: "Exploitability (Сложность эксплуатации)", field: "dreadExploit" },
            { label: "Affected Users (Охват пользователей)", field: "dreadAffected" },
            { label: "Discoverability (Обнаруживаемость)", field: "dreadDiscover" },
          ].map((item) => (
            <Box key={item.field}>
              <Flex justify="between" mb="1">
                <Text size="1" weight="bold">{item.label}</Text>
                <Badge variant="soft" color="indigo">
                  {data[item.field as keyof RiskData]} / 10
                </Badge>
              </Flex>
              <Slider 
                disabled={readonly}
                value={[data[item.field as keyof RiskData] as number]} 
                max={10} 
                min={1} 
                step={1}
                onValueChange={([val]) => updateField(item.field as keyof RiskData, val)} 
              />
            </Box>
          ))}
          
          <Flex mt="2" p="3" justify="between" align="center" className="bg-indigo-50 rounded-lg border border-indigo-100">
            <Text size="2" weight="bold" color="indigo">Итоговый DREAD Score:</Text>
            <Badge size="2" variant="solid" color={getBadgeColor(dreadScore)}>
              {dreadScore.toFixed(1)}
            </Badge>
          </Flex>
        </Flex>
      </Card>

    </Flex>
  );
};

export default RiskCalculator;