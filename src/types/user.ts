export interface User {
  id: string;
  name: string;
  gender: 'male' | 'female';
  birthDate: Date;
  birthPlace: string;
  currentCity: string;
  education: Education;
  carAndHouse: CarAndHouse;
  industry: string;
  occupation: string;
  annualIncome: IncomeRange;
  height: number;
  weight: number;
  personality: string;
  hobbies: string[];
  mbti?: string;
  photos: string[];
}

export type Education = 
  | '高中及以下'
  | '大专'
  | '本科'
  | '硕士'
  | '博士';

export type IncomeRange = 
  | '5W以下'
  | '5W-10W'
  | '10W-20W'
  | '20W-30W'
  | '30W以上';

export type CarAndHouse = {
  hasCar: boolean;
  hasHouse: boolean;
  carPlan?: '1年内有购车计划';
  housePlan?: '1年内有购房计划';
};

export interface PartnerPreference {
  ageRange: {
    min: number;
    max: number;
  };
  heightRange: {
    min: number;
    max?: number;
  };
  weightRequirement: string;
  personalityRequirement: string;
  educationRequirement: Education;
  incomeRequirement: string;
  otherRequirements?: string;
} 