import { AttackVector, AttackComplexity, PrivilegesRequired, UserInteraction, Scope, CIA } from "@prisma/client";

const AV_WEIGHT = { NETWORK: 0.85, ADJACENT: 0.62, LOCAL: 0.55, PHYSICAL: 0.2 };
const AC_WEIGHT = { LOW: 0.77, HIGH: 0.44 };
const PR_WEIGHT = { NONE: 0.85, LOW: 0.62, HIGH: 0.27 
};
const UI_WEIGHT = { NONE: 0.85, REQUIRED: 0.62 };
const CIA_WEIGHT = { NONE: 0, LOW: 0.22, HIGH: 0.56 };

export function calculateCVSS(data: any) {
  const ISS = 1 - ((1 - CIA_WEIGHT[data.cvssC as CIA]) * (1 - CIA_WEIGHT[data.cvssI as CIA]) * (1 - CIA_WEIGHT[data.cvssA as CIA]));
  const Impact = data.cvssS === 'UNCHANGED' ? 6.42 * ISS : 7.52 * (ISS - 0.029) - 3.25 * Math.pow(ISS - 0.02, 15);
  const Exploitability = 8.22 * AV_WEIGHT[data.cvssAV as AttackVector] * AC_WEIGHT[data.cvssAC as AttackComplexity] * PR_WEIGHT[data.cvssPR as PrivilegesRequired] * UI_WEIGHT[data.cvssUI as UserInteraction];
  if (Impact <= 0) return 0;
  const score = data.cvssS === 'UNCHANGED' ? Math.min(1.1 * (Impact + Exploitability), 10) : Math.min(1.08 * (Impact + Exploitability), 10);
    
  return Math.ceil(score * 10) / 10; 
}

export function calculateDread(d: any) {
  return (d.dreadDamage + d.dreadRepro + d.dreadExploit + d.dreadAffected + d.dreadDiscover) / 5;
}